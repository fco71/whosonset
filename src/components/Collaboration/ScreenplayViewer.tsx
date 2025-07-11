import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove, limit, getDoc } from 'firebase/firestore';
import { Document, Page, pdfjs } from 'react-pdf';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import './ScreenplayViewer.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ScreenplayViewerProps {
  screenplay: {
    id: string;
    name: string;
    url: string;
    type: string;
  };
  projectId: string;
  onClose: () => void;
  onGenerateReport?: () => void;
}

interface Annotation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  annotation: string;
  timestamp: Date | { seconds: number };
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  selection?: string;
  replies?: Reply[];
  resolved?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date | { seconds: number };
}

interface Tag {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  tagType: 'character' | 'character_arc' | 'character_development' | 'location' | 'set_design' | 'location_detail' | 'prop' | 'costume' | 'makeup' | 'scene' | 'scene_transition' | 'scene_beat' | 'camera' | 'lighting' | 'sound' | 'plot_point' | 'subplot' | 'theme' | 'budget' | 'schedule' | 'logistics' | 'note' | 'revision' | 'research';
  content: string;
  timestamp: Date;
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  selection?: string;
  color: string;
  resolved?: boolean;
}

interface ScreenplaySession {
  id: string;
  screenplayId: string;
  projectId: string;
  participants: string[];
  activeUsers: {
    userId: string;
    userName: string;
    userAvatar?: string;
    lastSeen: Date;
    currentPage: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper to convert Firestore timestamp or Date to JS Date
const toDate = (ts: any) => {
  if (!ts) return new Date();
  if (ts instanceof Date) return ts;
  if (typeof ts === 'object' && ts.seconds) return new Date(ts.seconds * 1000);
  return new Date(ts);
};

// Helper to get mouse position relative to PDF page
function getRelativePosition(e: React.MouseEvent, pageDiv: HTMLDivElement, scale: number) {
  const rect = pageDiv.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}

const ScreenplayViewer: React.FC<ScreenplayViewerProps> = ({ screenplay, projectId, onClose, onGenerateReport }) => {
  const { currentUser } = useAuth();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTagType, setSelectedTagType] = useState<Tag['tagType']>('character');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.2);
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [session, setSession] = useState<ScreenplaySession | null>(null);
  const [activeUsers, setActiveUsers] = useState<ScreenplaySession['activeUsers']>([]);
  const [viewMode, setViewMode] = useState<'single' | 'split' | 'fullscreen'>('single');
  const [filterType, setFilterType] = useState<'all' | 'annotations' | 'tags' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'page' | 'type' | 'user'>('time');
  const [showUserCursors, setShowUserCursors] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [annotationInput, setAnnotationInput] = useState('');
  const [activeThread, setActiveThread] = useState<Annotation | null>(null);
  const [showAnnotationSidebar, setShowAnnotationSidebar] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
  const [newReply, setNewReply] = useState('');
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [panelX, setPanelX] = useState(0);
  const [panelY, setPanelY] = useState(0);
  const [drawingPage, setDrawingPage] = useState<number | null>(null);
  const [selectionRect, setSelectionRect] = useState<(DOMRect & { relativeX?: number; relativeY?: number; relativeWidth?: number; relativeHeight?: number; pageNumber?: number }) | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPage, setSelectionPage] = useState<number | null>(null);
  const [showSelectionPopup, setShowSelectionPopup] = useState(false);
  const [popupType, setPopupType] = useState<'annotation' | 'tag' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isNavigating, setIsNavigating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [userPresence, setUserPresence] = useState<{[key: string]: {isOnline: boolean, lastSeen: Date, currentPage: number}}>({});
  const [previousActiveUsers, setPreviousActiveUsers] = useState<ScreenplaySession['activeUsers']>([]);
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);
  const [collaboratorSearch, setCollaboratorSearch] = useState('');
  const [collaboratorResults, setCollaboratorResults] = useState<Array<{id: string; name?: string; email?: string; avatar?: string; role?: string; isFollowing: boolean; connectionStatus: string}>>([]);
  const [addingCollaborator, setAddingCollaborator] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [userFollows, setUserFollows] = useState<string[]>([]);
  const [approvedContacts, setApprovedContacts] = useState<string[]>([]);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const pdfScrollRef = useRef<HTMLDivElement>(null);

  // Add state for virtualization
  const [visiblePageRange, setVisiblePageRange] = useState<[number, number]>([1, 10]);

  // Focus trap for modal
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [searchLoading, setSearchLoading] = useState(false);

  if (!screenplay || !screenplay.id) return null;

  // Prevent body scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Reply functionality
  const handleAddReply = async (annotationId: string, replyContent: string) => {
    if (!currentUser || !replyContent.trim()) return;

    try {
      const reply: Reply = {
        id: Date.now().toString(),
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userAvatar: currentUser?.photoURL || undefined,
        content: replyContent.trim(),
        timestamp: new Date()
      };

      // Update local state immediately for instant feedback
      setAnnotations(prev => {
        const updatedAnnotations = prev.map(a =>
          a.id === annotationId
            ? { ...a, replies: [...(a.replies || []), reply] }
            : a
        );
        
        // Update Firestore with the updated annotation data
        const updatedAnnotation = updatedAnnotations.find(a => a.id === annotationId);
        if (updatedAnnotation) {
          const annotationRef = doc(db, 'screenplayAnnotations', annotationId);
          // Deep sanitize replies
          const safeReplies = Array.isArray(updatedAnnotation.replies)
            ? updatedAnnotation.replies
                .filter(r => r && typeof r === 'object' && r.id && r.userId && r.userName && r.content && r.timestamp)
                .map(r => {
                  // Remove undefined properties and set userAvatar to null if missing
                  const { id, userId, userName, content, timestamp } = r;
                  return {
                    id,
                    userId,
                    userName,
                    content,
                    timestamp,
                    userAvatar: r.userAvatar || null
                  };
                })
            : [];
          updateDoc(annotationRef, { replies: safeReplies })
            .then(() => {
              console.log('[DEBUG] Reply saved to Firestore successfully');
            })
            .catch((error) => {
              console.error('[DEBUG] Error saving reply to Firestore:', error);
              toast.error('Failed to save reply to server');
            });
        }
        
        return updatedAnnotations;
      });

      toast.success('Reply added successfully!');
      setNewReply(''); // Clear input after successful reply
      setReplyInput('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    }
  };

  const handleRemoveTag = async (annotationId: string, replyId: string) => {
    try {
      const annotation = annotations.find(a => a.id === annotationId);
      if (annotation) {
        const updatedReplies = annotation.replies?.filter(r => r.id !== replyId) || [];
        const annotationRef = doc(db, 'screenplayAnnotations', annotationId);
        await updateDoc(annotationRef, { replies: updatedReplies });
        
        // Update local state
        setAnnotations(prev => prev.map(a => 
          a.id === annotationId 
            ? { ...a, replies: updatedReplies }
            : a
        ));
        
        toast.success('Reply removed successfully!');
      }
    } catch (error) {
      console.error('Error removing reply:', error);
      toast.error('Failed to remove reply');
    }
  };

  const tagColors = {
    // Character related
    character: '#FF6B6B',
    character_arc: '#FF8E8E',
    character_development: '#FFB3B3',
    
    // Location related
    location: '#4ECDC4',
    set_design: '#6ED7D0',
    location_detail: '#8EE1DB',
    
    // Props and objects
    prop: '#45B7D1',
    costume: '#5FC1D8',
    makeup: '#79CBDF',
    
    // Scene related
    scene: '#96CEB4',
    scene_transition: '#A8D8C0',
    scene_beat: '#BAE2CC',
    
    // Technical
    camera: '#FFD93D',
    lighting: '#FFE066',
    sound: '#FFE680',
    
    // Story elements
    plot_point: '#A8E6CF',
    subplot: '#B8EBD9',
    theme: '#C8F0E3',
    
    // Production
    budget: '#FF9F43',
    schedule: '#FFB366',
    logistics: '#FFC789',
    
    // Notes and general
    note: '#FFEAA7',
    revision: '#FDCB6E',
    research: '#F39C12'
  };

  const priorityColors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    critical: '#7C3AED'
  };

  // Smart popup positioning function
  const calculatePopupPosition = useCallback((rect: DOMRect, popupWidth: number = 280, popupHeight: number = 120) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Start with the selection position
    let x = rect.left;
    let y = rect.bottom + 8;
    
    // Ensure popup doesn't go off-screen horizontally
    if (x + popupWidth > viewportWidth - 16) {
      x = Math.max(16, viewportWidth - popupWidth - 16);
    }
    
    // Ensure popup doesn't go off-screen vertically
    if (y + popupHeight > viewportHeight - 16) {
      y = Math.max(16, rect.top - popupHeight - 8);
    }
    
    // Ensure popup doesn't go off the left edge
    if (x < 16) {
      x = 16;
    }
    
    return { x, y };
  }, []);

  // Navigate to specific annotation/tag location
  const navigateToElement = (element: Annotation | Tag) => {
    setIsNavigating(true);
    setCurrentPage(element.pageNumber);
    setSelectedElement(element.id);
    
    // Scroll to the element's position
    setTimeout(() => {
      const elementOverlay = document.querySelector(`[data-element-id="${element.id}"]`) as HTMLElement;
      if (elementOverlay) {
        elementOverlay.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
        
        // Highlight the element briefly
        elementOverlay.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
          elementOverlay.style.animation = '';
          setIsNavigating(false);
        }, 1000);
      } else {
        setIsNavigating(false);
      }
    }, 100);
  };

  // Handle popup dragging
  const handlePopupMouseDown = (e: React.MouseEvent) => {
    if (!popupRef.current) return;
    
    const rect = popupRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handlePopupMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep popup within viewport bounds
    const maxX = window.innerWidth - (popupRef.current?.offsetWidth || 320);
    const maxY = window.innerHeight - (popupRef.current?.offsetHeight || 200);
    
    setPopupPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handlePopupMouseUp = () => {
    setIsDragging(false);
  };

  // Handle PDF scroll events to prevent background scrolling
  const handlePdfScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Allow the scroll to work normally, just prevent it from bubbling up
    e.stopPropagation();
  };

  // Handle PDF wheel events to prevent background scrolling
  const handlePdfWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Allow the wheel scroll to work normally, just prevent it from bubbling up
    e.stopPropagation();
  };

  // Initialize collaboration session
  useEffect(() => {
    console.log('[DEBUG] ScreenplayViewer mounted with screenplay:', screenplay);
    if (!screenplay.url || typeof screenplay.url !== 'string' || screenplay.url.trim() === '') {
      setError('No PDF URL found for this screenplay.');
      setLoading(false);
    }
    initializeSession();
    loadAnnotations();
    loadTags();
    startRealTimeSync();
  }, [screenplay.id]);

  const initializeSession = async () => {
    try {
      const sessionData = {
        screenplayId: screenplay.id,
        projectId: projectId,
        participants: [currentUser?.uid || ''],
        activeUsers: [{
          userId: currentUser?.uid || '',
          userName: currentUser?.displayName || 'Anonymous',
          userAvatar: currentUser?.photoURL || '',
          lastSeen: new Date(),
          currentPage: 1
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const sessionRef = await addDoc(collection(db, 'screenplaySessions'), sessionData);
      setSession({ id: sessionRef.id, ...sessionData });
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const updateUserPresence = async () => {
    if (!session || !currentUser) return;
    
    try {
      const userPresenceData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userAvatar: currentUser.photoURL || '',
        lastSeen: new Date(),
        currentPage: 1, // This would be updated based on actual page
        isOnline: true
      };

      // Update session with current user's presence
      const sessionRef = doc(db, 'screenplaySessions', session.id);
      await updateDoc(sessionRef, {
        activeUsers: arrayUnion(userPresenceData),
        updatedAt: new Date()
      });

      // Update local state
      setActiveUsers(prev => {
        const existingUser = prev.find(u => u.userId === currentUser.uid);
        if (existingUser) {
          return prev.map(u => u.userId === currentUser.uid ? userPresenceData : u);
        } else {
          return [...prev, userPresenceData];
        }
      });
    } catch (error) {
      console.error('Error updating user presence:', error);
    }
  };

  const removeUserPresence = async () => {
    if (!session || !currentUser) return;
    
    try {
      const sessionRef = doc(db, 'screenplaySessions', session.id);
      await updateDoc(sessionRef, {
        activeUsers: arrayRemove({
          userId: currentUser.uid,
          userName: currentUser.displayName || 'Anonymous',
          userAvatar: currentUser.photoURL || '',
          lastSeen: new Date(),
          currentPage: 1,
          isOnline: false
        }),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error removing user presence:', error);
    }
  };

  const startRealTimeSync = () => {
    // Real-time annotations sync
    const annotationsQuery = query(
      collection(db, 'screenplayAnnotations'),
      where('screenplayId', '==', screenplay.id),
      orderBy('timestamp', 'desc')
    );

    const annotationsUnsubscribe = onSnapshot(annotationsQuery, (snapshot) => {
      const annotationsData = snapshot.docs.map(doc => {
        const data = doc.data();
        const processedReplies = Array.isArray(data.replies)
          ? data.replies.map((reply: any) => ({
              ...reply,
              timestamp: toDate(reply.timestamp)
            }))
          : [];
        
        console.log(`[DEBUG] Annotation ${doc.id} has ${processedReplies.length} replies:`, processedReplies);
        
        return {
          id: doc.id,
          ...data,
          timestamp: toDate(data.timestamp),
          replies: processedReplies
        };
      }) as Annotation[];
      setAnnotations(annotationsData);
    });

    // Real-time tags sync
    const tagsQuery = query(
      collection(db, 'screenplayTags'),
      where('screenplayId', '==', screenplay.id),
      orderBy('timestamp', 'desc')
    );

    const tagsUnsubscribe = onSnapshot(tagsQuery, (snapshot) => {
      const tagsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: toDate(doc.data().timestamp)
      })) as Tag[];
      setTags(tagsData);
    });

    // Enhanced real-time session sync with presence
    if (session) {
      const sessionUnsubscribe = onSnapshot(doc(db, 'screenplaySessions', session.id), (doc) => {
        if (doc.exists()) {
          const sessionData = doc.data() as ScreenplaySession;
          setSession(sessionData);
          
          // Process active users and remove stale entries
          const now = new Date();
          const activeUsersData = sessionData.activeUsers.filter(user => {
            const lastSeen = new Date(user.lastSeen);
            const timeDiff = now.getTime() - lastSeen.getTime();
            return timeDiff < 60000; // Remove users inactive for more than 1 minute
          });
          
          setActiveUsers(activeUsersData);
          
          // Update presence state
          const presenceData: {[key: string]: {isOnline: boolean, lastSeen: Date, currentPage: number}} = {};
          activeUsersData.forEach(user => {
            presenceData[user.userId] = {
              isOnline: true,
              lastSeen: new Date(user.lastSeen),
              currentPage: user.currentPage
            };
          });
          setUserPresence(presenceData);
        }
      });

      return () => {
        annotationsUnsubscribe();
        tagsUnsubscribe();
        sessionUnsubscribe();
      };
    }

    return () => {
      annotationsUnsubscribe();
      tagsUnsubscribe();
    };
  };

  const loadAnnotations = async () => {
    try {
      console.log('[DEBUG] Querying screenplayAnnotations with screenplayId:', screenplay.id);
      const q = query(
        collection(db, 'screenplayAnnotations'),
        where('screenplayId', '==', screenplay.id),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const annotationsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const processedReplies = Array.isArray(data.replies)
          ? data.replies.map((reply: any) => ({
              ...reply,
              timestamp: toDate(reply.timestamp)
            }))
          : [];
        
        console.log(`[DEBUG] Loaded annotation ${doc.id} with ${processedReplies.length} replies:`, processedReplies);
        
        return {
          id: doc.id,
          ...data,
          timestamp: toDate(data.timestamp),
          replies: processedReplies
        };
      }) as Annotation[];
      setAnnotations(annotationsData);
      console.log('[DEBUG] Total annotations loaded:', annotationsData.length);
    } catch (error) {
      console.error('[DEBUG] Error loading annotations:', error);
    }
  };

  const loadTags = async () => {
    try {
      console.log('[DEBUG] Querying screenplayTags with screenplayId:', screenplay.id);
      const q = query(
        collection(db, 'screenplayTags'),
        where('screenplayId', '==', screenplay.id),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const tagsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: toDate(doc.data().timestamp)
      })) as Tag[];
      setTags(tagsData);
      console.log('[DEBUG] Loaded tags:', tagsData);
    } catch (error) {
      console.error('[DEBUG] Error loading tags:', error);
    }
  };

  const addAnnotation = async (position: { x: number; y: number; width: number; height: number }, pageNumber: number, annotation: string) => {
    if (!annotation.trim()) return;

    try {
      const annotationData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        userAvatar: currentUser?.photoURL || '',
        annotation: annotation.trim(),
        timestamp: new Date(),
        projectId: projectId,
        pageNumber,
        position,
        replies: [],
        resolved: false,
        priority: 'medium' as const
      };

      await addDoc(collection(db, 'screenplayAnnotations'), annotationData);
      setNewAnnotation('');
      toast.success('Annotation added successfully!');
    } catch (error) {
      console.error('Error adding annotation:', error);
      toast.error('Failed to add annotation');
    }
  };

  const addTag = async (position: { x: number; y: number; width: number; height: number }, pageNumber: number, tag: string) => {
    if (!tag.trim()) return;

    try {
      const tagData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        userAvatar: currentUser?.photoURL || '',
        tagType: selectedTagType,
        content: tag.trim(),
        timestamp: new Date(),
        projectId: projectId,
        pageNumber,
        position,
        color: tagColors[selectedTagType],
        resolved: false
      };

      await addDoc(collection(db, 'screenplayTags'), tagData);
      setNewTag('');
      toast.success('Tag added successfully!');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const attachSelectionHandlers = useCallback(() => {
    // Debounce the handler attachment to prevent multiple listeners
    const timeoutId = setTimeout(() => {
      const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
      textLayers.forEach((layer) => {
        // Remove existing listeners to prevent duplicates
        layer.removeEventListener('mouseup', handleTextSelection);
        layer.removeEventListener('touchend', handleTextSelection);
        
        // Add optimized listeners
        layer.addEventListener('mouseup', handleTextSelection, { passive: true });
        layer.addEventListener('touchend', handleTextSelection, { passive: true });
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleTextSelection = useCallback((e: Event) => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim() === '') {
        setShowSelectionPopup(false);
        setSelectionRect(null);
        setSelectedText('');
        setSelectionPage(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Get the page number from the closest page container
      const pageContainer = (e.target as Element).closest('.react-pdf__Page');
      const pageNumber = pageContainer ? 
        parseInt(pageContainer.getAttribute('data-page-number') || '1') : 1;
      
      if (rect.width > 0 && rect.height > 0) {
        // Calculate position relative to the page for accurate marker placement
        const pageRect = pageContainer?.getBoundingClientRect();
        if (pageRect) {
          const relativeX = (rect.left - pageRect.left) / pageRect.width;
          const relativeY = (rect.top - pageRect.top) / pageRect.height;
          const relativeWidth = rect.width / pageRect.width;
          const relativeHeight = rect.height / pageRect.height;
          
          // Store the relative position for accurate marker placement
          setSelectionRect({
            ...rect,
            relativeX,
            relativeY,
            relativeWidth,
            relativeHeight,
            pageNumber
          });
        } else {
          setSelectionRect(rect);
        }
        
        setSelectedText(selection.toString().trim());
        setSelectionPage(pageNumber);
        setShowSelectionPopup(true);
        
        // Calculate popup position immediately
        const position = calculatePopupPosition(rect);
        setPopupPosition(position);
      }
    });
  }, []);

  const formatTimeAgo = (date: Date | { seconds: number }) => {
    const now = new Date();
    const d = toDate(date);
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const toggleElementResolved = async (elementId: string, type: 'annotation' | 'tag') => {
    try {
      const collectionName = type === 'annotation' ? 'screenplayAnnotations' : 'screenplayTags';
      const elementRef = doc(db, collectionName, elementId);
      const element = type === 'annotation' 
        ? annotations.find(c => c.id === elementId)
        : tags.find(t => t.id === elementId);
      if (element) {
        await updateDoc(elementRef, { resolved: !element.resolved });
        toast.success(`${type === 'annotation' ? 'Annotation' : 'Tag'} ${element.resolved ? 'reopened' : 'resolved'}!`);
      }
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
      toast.error(`Failed to update ${type}`);
    }
  };

  const deleteElement = async (elementId: string, type: 'annotation' | 'tag') => {
    try {
      const collectionName = type === 'annotation' ? 'screenplayAnnotations' : 'screenplayTags';
      await deleteDoc(doc(db, collectionName, elementId));
      toast.success(`${type === 'annotation' ? 'Annotation' : 'Tag'} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handlePopupMouseMove as any);
      document.addEventListener('mouseup', handlePopupMouseUp);
      return () => {
        document.removeEventListener('mousemove', handlePopupMouseMove as any);
        document.removeEventListener('mouseup', handlePopupMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Simplified and faster annotation/tag creation
  const createAnnotation = useCallback(async (type: 'annotation' | 'tag') => {
    if (!selectionRect || !selectionPage || !currentUser) return;
    
    const content = type === 'annotation' ? annotationInput.trim() : newTag.trim();
    if (!content) return;
    
    try {
      const position = {
        x: (selectionRect as any).relativeX || selectionRect.left / window.innerWidth,
        y: (selectionRect as any).relativeY || selectionRect.top / window.innerHeight,
        width: (selectionRect as any).relativeWidth || selectionRect.width / window.innerWidth,
        height: (selectionRect as any).relativeHeight || selectionRect.height / window.innerHeight,
      };
      
      if (type === 'annotation') {
        await addAnnotation(position, selectionPage, content);
      } else {
        await addTag(position, selectionPage, content);
      }
      
      // Clear the selection popup immediately
      setShowSelectionPopup(false);
      setSelectionRect(null);
      setSelectedText('');
      setSelectionPage(null);
      setAnnotationInput('');
      setNewTag('');
      setPopupType(null);
      
      // Clear the text selection
      window.getSelection()?.removeAllRanges();
      
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      toast.error(`Failed to create ${type}`);
    }
  }, [selectionRect, selectionPage, currentUser, annotationInput, newTag, addAnnotation, addTag]);

  // Helper to calculate visible pages based on scroll
  const handleVirtualizedScroll = useCallback(() => {
    if (!pdfScrollRef.current || !numPages) return;
    const scrollTop = pdfScrollRef.current.scrollTop;
    const containerHeight = pdfScrollRef.current.clientHeight;
    
    // Calculate which pages should be visible with a larger buffer
    const pageHeight = 900; // Approximate page height
    const buffer = 2; // Show 2 pages before and after
    
    const firstVisible = Math.max(1, Math.floor(scrollTop / pageHeight) - buffer);
    const lastVisible = Math.min(numPages, Math.ceil((scrollTop + containerHeight) / pageHeight) + buffer);
    
    setVisiblePageRange([firstVisible, lastVisible]);
  }, [numPages]);

  // Attach scroll handler
  useEffect(() => {
    const ref = pdfScrollRef.current;
    if (!ref) return;
    ref.addEventListener('scroll', handleVirtualizedScroll);
    handleVirtualizedScroll();
    return () => ref.removeEventListener('scroll', handleVirtualizedScroll);
  }, [handleVirtualizedScroll]);

  // Debug replies when annotations change
  useEffect(() => {
    console.log('[DEBUG] Annotations updated:', annotations.length);
    annotations.forEach(annotation => {
      console.log(`[DEBUG] Annotation ${annotation.id}:`, {
        content: annotation.annotation,
        repliesCount: annotation.replies?.length || 0,
        replies: annotation.replies,
        hasRepliesArray: Array.isArray(annotation.replies),
        repliesType: typeof annotation.replies
      });
    });
  }, [annotations]);

  // Initialize user presence and session
  useEffect(() => {
    if (!currentUser) return;

    const initializePresence = async () => {
      try {
        // Initialize session first
        await initializeSession();
        
        // Set up presence update interval
        const presenceInterval = setInterval(updateUserPresence, 30000); // Update every 30 seconds
        
        // Initial presence update
        await updateUserPresence();
        
        // Set up page visibility change handler
        const handleVisibilityChange = () => {
          if (document.hidden) {
            // User switched tabs or minimized window
            removeUserPresence();
          } else {
            // User returned to the tab
            updateUserPresence();
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Cleanup function
        return () => {
          clearInterval(presenceInterval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          removeUserPresence();
        };
      } catch (error) {
        console.error('Error initializing presence:', error);
      }
    };

    const cleanup = initializePresence();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [currentUser, session?.id]);

  useEffect(() => {
    // Check for user presence changes and show notifications
    if (activeUsers.length > 0 && previousActiveUsers.length > 0) {
      const newUsers = activeUsers.filter(user => 
        !previousActiveUsers.find(prevUser => prevUser.userId === user.userId)
      );
      
      const leftUsers = previousActiveUsers.filter(user => 
        !activeUsers.find(currentUser => currentUser.userId === user.userId)
      );
      
      newUsers.forEach(user => {
        if (user.userId !== currentUser?.uid) {
          toast.success(`${user.userName} joined the session`, {
            icon: '👋',
            duration: 3000
          });
        }
      });
      
      leftUsers.forEach(user => {
        if (user.userId !== currentUser?.uid) {
          toast(`${user.userName} left the session`, {
            icon: '👋',
            duration: 2000
          });
        }
      });
    }
    
    setPreviousActiveUsers(activeUsers);
  }, [activeUsers, currentUser]);

  // Real-time collaborators listener
  useEffect(() => {
    if (!screenplay.id) return;

    console.log('Setting up real-time collaborators listener for screenplay:', screenplay.id);

    const collaboratorsUnsubscribe = onSnapshot(
      doc(db, 'screenplays', screenplay.id),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const teamMembers = data.teamMembers || [];
          console.log('Real-time collaborators update received:', teamMembers);
          setCollaborators(teamMembers);
        } else {
          console.log('Screenplay document does not exist');
          setCollaborators([]);
        }
      },
      (error) => {
        console.error('Error listening to collaborators:', error);
        setCollaborators([]);
      }
    );

    return () => {
      console.log('Cleaning up collaborators listener');
      collaboratorsUnsubscribe();
    };
  }, [screenplay.id]);

  // Fetch current user's followers and following on mount
  useEffect(() => {
    const fetchFollows = async () => {
      if (!currentUser) return;
      try {
        // Get user's followers and following from social data
        const userSnap = await getDocs(query(collection(db, 'users'), where('id', '==', currentUser.uid)));
        if (!userSnap.empty) {
          const data = userSnap.docs[0].data();
          const followers = Array.isArray(data.followers) ? data.followers : [];
          const following = Array.isArray(data.following) ? data.following : [];
          setUserFollows(Array.from(new Set([...followers, ...following])));
        }
      } catch (error) {
        console.error('Error fetching follows:', error);
        // If we can't get follows, we'll still allow searching all users
        setUserFollows([]);
      }
    };
    fetchFollows();
  }, [currentUser]);

  // Fetch approved contacts (mutual connections)
  useEffect(() => {
    if (!currentUser) return;
    const fetchApprovedContacts = async () => {
      const connectionsQuery = query(
        collection(db, 'connections'),
        where('status', '==', 'accepted'),
        where('userId', '==', currentUser.uid)
      );
      const reverseConnectionsQuery = query(
        collection(db, 'connections'),
        where('status', '==', 'accepted'),
        where('connectedUserId', '==', currentUser.uid)
      );
      const [directSnap, reverseSnap] = await Promise.all([
        getDocs(connectionsQuery),
        getDocs(reverseConnectionsQuery)
      ]);
      const directContacts = directSnap.docs.map(doc => doc.data().connectedUserId);
      const reverseContacts = reverseSnap.docs.map(doc => doc.data().userId);
      setApprovedContacts([...new Set([...directContacts, ...reverseContacts])]);
    };
    fetchApprovedContacts();
  }, [currentUser]);

  const handleCollaboratorSearch = async (queryStr: string) => {
    setCollaboratorSearch(queryStr);
    setSearchLoading(true);
    if (!queryStr.trim()) {
      setCollaboratorResults([]);
      setSearchLoading(false);
      return;
    }
    try {
      let allResults: Array<{ id: string; [key: string]: any }> = [];
      if (approvedContacts.length > 0) {
        // Fetch all approved contacts' user docs in chunks of 10
        const usersRef = collection(db, 'users');
        const approvedChunks = [];
        for (let i = 0; i < approvedContacts.length; i += 10) {
          approvedChunks.push(approvedContacts.slice(i, i + 10));
        }
        for (const chunk of approvedChunks) {
          const q = query(usersRef, where('id', 'in', chunk));
          const snap = await getDocs(q);
          allResults = allResults.concat(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } else {
        // Fallback: search all users
        const usersRef = collection(db, 'users');
        const snap = await getDocs(usersRef);
        console.log('[ScreenplayCollabModal] Fallback: found', snap.docs.length, 'users in Firestore');
        allResults = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (allResults.length === 0) {
          console.warn('[ScreenplayCollabModal] No users found in Firestore users collection.');
        }
      }
      // Filter by search query
      const filtered = allResults
        .filter(user =>
          user.id !== currentUser?.uid &&
          ((user.displayName || user.name || '').toLowerCase().includes(queryStr.toLowerCase()) ||
           (user.email || '').toLowerCase().includes(queryStr.toLowerCase()))
        )
        .map(user => ({
          id: user.id,
          name: user.displayName || user.name || `User ${user.id.slice(-4)}`,
          email: user.email || '',
          avatar: user.avatarUrl || user.avatar || '',
          role: user.role || 'User',
          isFollowing: userFollows.includes(user.id),
          connectionStatus: 'connected',
        }));
      console.log('[ScreenplayCollabModal] Filtered users after search:', filtered.length, filtered.map(u => u.name));
      setCollaboratorResults(filtered);
      setSearchLoading(false);
    } catch (error) {
      console.error('[ScreenplayCollabModal] Error searching users:', error);
      setCollaboratorResults([]);
      setSearchLoading(false);
    }
  };

  const handleAddCollaborator = async (user: any) => {
    if (collaborators.some(c => c.id === user.id)) {
      toast.error(`${user.name} is already a collaborator.`);
      return;
    }
    setAddingCollaborator(true);
    try {
      console.log('Adding collaborator:', user);
      console.log('Screenplay ID:', screenplay.id);
      
      // First check if the screenplay document exists
      const screenplayRef = doc(db, 'screenplays', screenplay.id);
      const screenplayDoc = await getDoc(screenplayRef);
      
      if (!screenplayDoc.exists()) {
        throw new Error('Screenplay document not found');
      }
      
      const screenplayData = screenplayDoc.data();
      console.log('Current screenplay data:', screenplayData);
      
      const newCollaborator = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        role: user.role || 'collaborator',
        addedAt: new Date(),
        addedBy: currentUser?.uid
      };

      console.log('New collaborator object:', newCollaborator);

      // Update the database
      await updateDoc(screenplayRef, {
        teamMembers: arrayUnion(newCollaborator)
      });

      console.log('Database updated successfully');

      // Update local state immediately
      setCollaborators(prev => {
        const updated = [...prev, newCollaborator];
        console.log('Updated collaborators list:', updated);
        return updated;
      });

      // Show success message
      toast.success(`${user.name} added as collaborator!`);
      
      // Close modal and reset search
      setShowAddCollaboratorModal(false);
      setCollaboratorSearch('');
      setCollaboratorResults([]);
      
    } catch (err) {
      console.error('Error adding collaborator:', err);
      toast.error(`Failed to add collaborator: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setAddingCollaborator(false);
    }
  };

  // Focus trap for modal
  useEffect(() => {
    if (showAddCollaboratorModal && modalRef.current) {
      // Focus the search input when modal opens
      const searchInput = modalRef.current.querySelector('.collaborator-search-input') as HTMLInputElement;
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
      
      // Handle focus trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };
      
      modalRef.current.addEventListener('keydown', handleKeyDown);
      
      return () => {
        modalRef.current?.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showAddCollaboratorModal]);

  // Add remove collaborator handler
  const handleRemoveCollaborator = async (userId: string) => {
    try {
      const toRemove = collaborators.find(c => c.id === userId);
      if (!toRemove) return;
      const screenplayRef = doc(db, 'screenplays', screenplay.id);
      await updateDoc(screenplayRef, {
        teamMembers: arrayRemove(toRemove)
      });
      setCollaborators(collaborators.filter(c => c.id !== userId));
      toast.success('Collaborator removed.');
    } catch (err) {
      toast.error('Failed to remove collaborator.');
    }
  };

  // When rendering collaborators, ensure uniqueness by ID
  const uniqueCollaborators = Array.from(new Map(collaborators.map(c => [c.id, c])).values());

  return (
    <div className="screenplay-viewer-overlay">
      <div className="screenplay-viewer" ref={viewerRef}>
        {/* Absolutely positioned close button, no header */}
        <button onClick={onClose} className="btn-close-absolute" aria-label="Close">×</button>
        <div 
          className="viewer-content"
        >
          {/* PDF Viewer Panel */}
          <div 
            className={`pdf-panel ${viewMode} ${sidebarCollapsed ? 'expanded' : ''}`}
          >
            <div className="pdf-floating-zoom-controls">
              <button onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}>-</button>
              <span>{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(prev => Math.min(3, prev + 0.2))}>+</button>
            </div>
            <div 
              className="pdf-container"
              ref={pdfContainerRef}
              style={{ position: 'relative' }}
            >
              {error ? (
                <div className="error-message">{error}</div>
              ) : screenplay.url ? (
                <>
                  <Document
                    file={screenplay.url}
                    onLoadSuccess={({ numPages }: { numPages: number }) => {
                      console.log('PDF loaded successfully, numPages:', numPages);
                      setNumPages(numPages);
                      setLoading(false);
                      setCurrentPage(1);
                    }}
                    onLoadError={(error: Error) => {
                      console.error('Error loading PDF:', error);
                      setError('Failed to load PDF document');
                      setLoading(false);
                    }}
                    loading={
                      <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading PDF...</p>
                      </div>
                    }
                    error={<div>Failed to load PDF document.</div>}
                  >
                    {typeof numPages === 'number' && numPages > 0 ? (
                      <div className="pdf-scrollable-container" ref={pdfScrollRef} onScroll={handlePdfScroll} onWheel={handlePdfWheel}>
                        {Array.from(new Array(numPages), (el, index) => {
                          const pageNumber = index + 1;
                          const [first, last] = visiblePageRange;
                          const isVisible = pageNumber >= first && pageNumber <= last;
                          return (
                            <div key={`page_${pageNumber}`} className="page-container" style={{ position: 'relative', marginBottom: '20px', minHeight: 900 }}>
                              {isVisible ? (
                                <>
                                  <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    onLoadSuccess={() => {
                                      console.log(`Page ${pageNumber} loaded successfully`);
                                      attachSelectionHandlers();
                                    }}
                                    onRenderSuccess={() => {
                                      console.log(`Page ${pageNumber} rendered successfully`);
                                      attachSelectionHandlers();
                                    }}
                                    onLoadError={(error: Error) => console.error(`Error loading page ${pageNumber}:`, error)}
                                    error={(error: Error) => (
                                      <div className="page-error">
                                        <p>Error loading page {pageNumber}</p>
                                        <small>{error.message}</small>
                                      </div>
                                    )}
                                    loading={() => (
                                      <div className="page-loading">
                                        <p>Loading page {pageNumber}...</p>
                                      </div>
                                    )}
                                  />
                                  {/* Annotation Overlays for this page */}
                                  {showOverlays && annotations.filter(annotation => annotation.pageNumber === pageNumber).map(annotation => {
                                    const overlayHeight = `${annotation.position.height * 100}%`;
                                    const pagePixelHeight = 900;
                                    const heightPx = annotation.position.height * pagePixelHeight;
                                    const isSingleLine = heightPx < 32;
                                    const verticalPad = isSingleLine ? 4 : 0;
                                    const markerOffset = isSingleLine ? -18 : -20;
                                    return (
                                      <React.Fragment key={`annotation-${annotation.id}`}>
                                        <div
                                          className={`annotation-overlay ${selectedElement === annotation.id ? 'selected' : ''} ${annotation.resolved ? 'resolved' : ''}`}
                                          style={{
                                            position: 'absolute',
                                            left: `${annotation.position.x * 100}%`,
                                            top: `calc(${annotation.position.y * 100}% - ${verticalPad}px)`,
                                            width: `${annotation.position.width * 100}%`,
                                            height: `calc(${overlayHeight} + ${verticalPad * 2}px)`,
                                            border: isSingleLine ? '1px solid rgba(239, 68, 68, 0.45)' : '2px solid rgba(239, 68, 68, 0.7)',
                                            borderRadius: isSingleLine ? 3 : 8,
                                            cursor: 'pointer',
                                            zIndex: 5,
                                            transition: 'all 0.15s ease',
                                            pointerEvents: 'auto',
                                            background: 'none',
                                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
                                          }}
                                          data-element-id={annotation.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAnnotation(annotation);
                                            setShowAnnotationPanel(true);
                                            setPanelX(e.clientX);
                                            setPanelY(e.clientY);
                                            setSelectedElement(annotation.id);
                                            setActiveThread(null);
                                          }}
                                          title={`Annotation by ${annotation.userName}: ${annotation.annotation}`}
                                        />
                                        <div
                                          className="annotation-marker"
                                          style={{
                                            position: 'absolute',
                                            left: `calc(${annotation.position.x * 100}% + ${annotation.position.width * 100}% - 10px)`,
                                            top: `calc(${annotation.position.y * 100}% - ${verticalPad}px + ${markerOffset}px)`,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: '#EF4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 10,
                                            color: 'white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            border: '1px solid white',
                                            zIndex: 10
                                          }}
                                        >
                                          💬
                                        </div>
                                      </React.Fragment>
                                    );
                                  })}
                                  {/* Tag Overlays for this page */}
                                  {showOverlays && tags.filter(tag => tag.pageNumber === pageNumber).map(tag => {
                                    const overlayHeight = `${tag.position.height * 100}%`;
                                    const pagePixelHeight = 900;
                                    const heightPx = tag.position.height * pagePixelHeight;
                                    const isSingleLine = heightPx < 32;
                                    const verticalPad = isSingleLine ? 4 : 0;
                                    const markerOffset = isSingleLine ? -18 : -20;
                                    return (
                                      <React.Fragment key={`tag-${tag.id}`}>
                                        <div
                                          className={`tag-overlay ${selectedElement === tag.id ? 'selected' : ''} ${tag.resolved ? 'resolved' : ''}`}
                                          style={{
                                            position: 'absolute',
                                            left: `${tag.position.x * 100}%`,
                                            top: `calc(${tag.position.y * 100}% - ${verticalPad}px)`,
                                            width: `${tag.position.width * 100}%`,
                                            height: `calc(${overlayHeight} + ${verticalPad * 2}px)`,
                                            border: isSingleLine ? '1px solid rgba(245, 158, 11, 0.45)' : '2px solid rgba(245, 158, 11, 0.7)',
                                            borderRadius: isSingleLine ? 3 : 8,
                                            cursor: 'pointer',
                                            zIndex: 5,
                                            transition: 'all 0.15s ease',
                                            pointerEvents: 'auto',
                                            background: 'none',
                                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)'
                                          }}
                                          data-element-id={tag.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAnnotation(null);
                                            setShowAnnotationPanel(true);
                                            setPanelX(e.clientX);
                                            setPanelY(e.clientY);
                                            setSelectedElement(tag.id);
                                            setActiveThread(null);
                                          }}
                                          title={`Tag by ${tag.userName}: ${tag.content}`}
                                        />
                                        <div
                                          className="tag-marker"
                                          style={{
                                            position: 'absolute',
                                            left: `calc(${tag.position.x * 100}% + ${tag.position.width * 100}% - 10px)`,
                                            top: `calc(${tag.position.y * 100}% - ${verticalPad}px + ${markerOffset}px)`,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: '#f59e0b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 10,
                                            color: 'white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            border: '1px solid white',
                                            zIndex: 10
                                          }}
                                        >
                                          🏷️
                                        </div>
                                      </React.Fragment>
                                    );
                                  })}
                                </>
                              ) : (
                                <div className="page-loading" style={{ minHeight: 900 }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading PDF pages...</p>
                      </div>
                    )}
                  </Document>

                  {/* Drawing Canvas Overlay */}
                  <canvas
                    ref={drawingCanvasRef}
                    className="drawing-canvas"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  />

                  {/* Visual Overlays */}
                  {showOverlays && (
                    <>
                      {/* User Cursors */}
                      {false && showUserCursors && activeUsers.map(user => (
                        <div
                          key={user.userId}
                          className="user-cursor"
                          style={{
                            position: 'absolute',
                            left: 50, // This would be calculated from user's actual position
                            top: 50,
                            zIndex: 15
                          }}
                        >
                          <div className="cursor-pointer" style={{ color: '#FF6B6B' }}>👆</div>
                          <div className="cursor-label">{user.userName}</div>
                        </div>
                      ))}
                      
                      {/* Floating Collaboration Indicator */}
                      {activeUsers.length > 1 && (
                        <div className="floating-collaboration-indicator">
                          <div className="indicator-content">
                            <div className="active-users-count">
                              <span className="count">{activeUsers.length}</span>
                              <span className="label">collaborating</span>
                            </div>
                            <div className="users-avatars">
                              {activeUsers.slice(0, 3).map(user => (
                                <div key={user.userId} className="mini-avatar" title={user.userName}>
                                  {user.userAvatar ? (
                                    <img src={user.userAvatar} alt={user.userName} />
                                  ) : (
                                    <div className="mini-avatar-placeholder">
                                      {user.userName.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              ))}
                              {activeUsers.length > 3 && (
                                <div className="more-users">+{activeUsers.length - 3}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div>No PDF URL provided.</div>
              )}
            </div>
          </div>

          {/* Collapsible Collaboration Panel */}
          <div className={`collaboration-panel${sidebarCollapsed ? ' collapsed' : ''}`}>
            <button
              className="sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? '⮜' : '⮞'}
            </button>
            {!sidebarCollapsed && (
              <>
                <div className="panel-header">
                  <h3>💬 Collaboration</h3>
                  <div className="panel-controls">
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                      <option value="all">All</option>
                      <option value="annotations">Annotations</option>
                      <option value="tags">Tags</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                      <option value="time">Time</option>
                      <option value="page">Page</option>
                      <option value="type">Type</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>

                <div className="panel-content">
                  {/* Active Users */}
                  <div className="active-users">
                    <h4>👥 Active Users ({activeUsers.length})</h4>
                    <div className="users-list">
                      {activeUsers.map(user => {
                        const isCurrentUser = user.userId === currentUser?.uid;
                        const isOnline = userPresence[user.userId]?.isOnline || isCurrentUser;
                        const lastSeen = userPresence[user.userId]?.lastSeen;
                        
                        return (
                          <div key={user.userId} className="user-item">
                            <div className="user-avatar">
                              {user.userAvatar ? (
                                <img src={user.userAvatar} alt={user.userName} />
                              ) : (
                                <div className="avatar-placeholder">{user.userName.charAt(0).toUpperCase()}</div>
                              )}
                              <div className={`online-indicator ${isOnline ? 'online' : 'offline'}`}></div>
                            </div>
                            <div className="user-info">
                              <span className="user-name">
                                {isCurrentUser ? `${user.userName} (You)` : user.userName}
                              </span>
                              <span className="user-status">
                                {isOnline ? '🟢 Online' : '🔴 Offline'}
                                {!isOnline && lastSeen && (
                                  <span className="last-seen">
                                    {' '}• {formatTimeAgo(lastSeen)}
                                  </span>
                                )}
                              </span>
                              <span className="user-page">
                                Page {userPresence[user.userId]?.currentPage || 1}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {activeUsers.length === 0 && (
                        <div className="no-users">
                          <span>No other users currently viewing</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Collaborators */}
                  <div className="collaborators-section">
                    <h4>🤝 Collaborators ({collaborators.filter(user => user && user.id && user.name).length})</h4>
                    <div className="collaborators-list">
                      {uniqueCollaborators.length === 0 && <div className="no-collaborators">No collaborators yet.</div>}
                      {uniqueCollaborators.map(user => (
                        <div key={user.id} className="collaborator-item">
                          <div className="collaborator-avatar">
                            {user.avatar ? <img src={user.avatar} alt={user.name} /> : <div className="avatar-placeholder">{user.name?.charAt(0).toUpperCase() || '?'}</div>}
                          </div>
                          <div className="collaborator-info">
                            <span className="collaborator-name">{user.name || 'Unknown'}</span>
                            <span className="collaborator-role">{user.role || 'Collaborator'}</span>
                          </div>
                          {user.id !== currentUser?.uid && (
                            <button
                              className="remove-btn"
                              onClick={() => handleRemoveCollaborator(user.id)}
                              title="Remove collaborator"
                              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="add-collaborator-btn" onClick={() => setShowAddCollaboratorModal(true)}>+ Add Collaborator</button>
                  </div>

                  {/* Annotations List */}
                  <div className="annotations-section">
                    <h4>💬 Annotations ({annotations.length})</h4>
                    <div className="annotations-list">
                      {annotations.map(annotation => (
                        <div key={annotation.id} className={`annotation-item ${annotation.resolved ? 'resolved' : ''}`}>
                          <div className="annotation-header">
                            <div className="annotation-author">
                              {annotation.userAvatar ? (
                                <img src={annotation.userAvatar} alt={annotation.userName} />
                              ) : (
                                <div className="avatar-placeholder">{annotation.userName.charAt(0)}</div>
                              )}
                              <span>{annotation.userName}</span>
                            </div>
                            <div className="annotation-meta">
                              <span className="annotation-time">{formatTimeAgo(toDate(annotation.timestamp))}</span>
                            </div>
                          </div>
                          <div className="annotation-content">{annotation.annotation}</div>
                          {/* Reply Button below annotation text */}
                          {!annotation.resolved && (
                            <button
                              onClick={() => setReplyingTo(annotation.id)}
                              className="reply-btn compact"
                            >
                              <span style={{fontSize: '1.1em', marginRight: 2}}>↩</span> Reply
                            </button>
                          )}
                          {/* Replies Section */}
                          {annotation.replies && annotation.replies.length > 0 && (
                            <div className="replies-section compact">
                              {annotation.replies.map(reply => (
                                <div key={reply.id} className="reply-item compact">
                                  <div className="reply-header compact">
                                    {reply.userAvatar ? (
                                      <img src={reply.userAvatar} alt={reply.userName} className="reply-avatar compact" />
                                    ) : (
                                      <div className="avatar-placeholder compact">{reply.userName.charAt(0)}</div>
                                    )}
                                    <span className="reply-author compact">{reply.userName}</span>
                                    <span className="reply-time compact">{formatTimeAgo(toDate(reply.timestamp))}</span>
                                  </div>
                                  <div className="reply-content compact">{reply.content}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Reply Input */}
                          {replyingTo === annotation.id && !annotation.resolved && (
                            <div className="reply-input-section compact">
                              <textarea
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                placeholder="Write a reply..."
                                className="reply-textarea compact"
                                rows={2}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (replyInput.trim()) {
                                      handleAddReply(annotation.id, replyInput.trim());
                                      setReplyInput('');
                                      setReplyingTo(null);
                                    }
                                  } else if (e.key === 'Escape') {
                                    setReplyingTo(null);
                                    setReplyInput('');
                                  }
                                }}
                              />
                              <div className="reply-actions compact">
                                <button
                                  onClick={() => {
                                    if (replyInput.trim()) {
                                      handleAddReply(annotation.id, replyInput.trim());
                                      setReplyInput('');
                                      setReplyingTo(null);
                                    }
                                  }}
                                  className="reply-submit-btn compact"
                                  disabled={!replyInput.trim()}
                                >
                                  Reply
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyInput('');
                                  }}
                                  className="reply-cancel-btn compact"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="annotation-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigateToElement(annotation); }}
                              className="action-btn"
                            >
                              📍 Go to
                            </button>
                            {!annotation.resolved ? (
                              <button
                                onClick={() => toggleElementResolved(annotation.id, 'annotation')}
                                className="action-btn"
                              >
                                ✅ Resolve
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleElementResolved(annotation.id, 'annotation')}
                                className="action-btn"
                              >
                                🔄 Reopen
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteElement(annotation.id, 'annotation'); }}
                              className="action-btn delete"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags List */}
                  <div className="tags-section">
                    <h4>🏷️ Tags ({tags.length})</h4>
                    <div className="tags-list">
                      {tags.map(tag => (
                        <div key={tag.id} className={`tag-item ${tag.resolved ? 'resolved' : ''}`}>
                          <div className="tag-header">
                            <div className="tag-author">
                              {tag.userAvatar ? (
                                <img src={tag.userAvatar} alt={tag.userName} />
                              ) : (
                                <div className="avatar-placeholder">{tag.userName.charAt(0)}</div>
                              )}
                              <span>{tag.userName}</span>
                            </div>
                            <div className="tag-meta">
                              <span className="tag-time">{formatTimeAgo(toDate(tag.timestamp))}</span>
                            </div>
                          </div>
                          <div className="tag-content">
                            <span 
                              className="tag-type"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.tagType}
                            </span>
                            <span className="tag-text">{tag.content}</span>
                          </div>
                          <div className="tag-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigateToElement(tag); }}
                              className="action-btn"
                            >
                              📍 Go to
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleElementResolved(tag.id, 'tag'); }}
                              className={`action-btn ${tag.resolved ? 'resolved' : ''}`}
                            >
                              {tag.resolved ? '🔄 Reopen' : '✅ Resolve'}
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteElement(tag.id, 'tag'); }}
                              className="action-btn delete"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation loading indicator */}
        {isNavigating && (
          <div className="navigation-loading">
            <div className="spinner"></div>
            <span>Navigating to annotation...</span>
          </div>
        )}

        {/* Selection popup */}
        {(showSelectionPopup || popupType) && (
          <div
            className="selection-popup"
            ref={popupRef}
            style={{
              left: popupPosition.x || 100,
              top: popupPosition.y || 100,
              position: 'fixed',
              zIndex: 3000,
              minWidth: 260,
              maxWidth: 340,
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onMouseDown={handlePopupMouseDown}
          >
            <div className="popup-header" style={{ fontWeight: 600, color: '#374151', marginBottom: 8, cursor: 'grab' }}>
              {popupType === 'annotation' ? 'Add Annotation' : popupType === 'tag' ? 'Add Tag' : 'Add to selection:'}
            </div>
            {popupType === 'annotation' && (
              <textarea
                placeholder="Enter your annotation..."
                value={annotationInput}
                onChange={e => setAnnotationInput(e.target.value)}
                rows={3}
                style={{ width: '100%', marginBottom: 8, border: '1px solid #d1d5db', borderRadius: 6, padding: 8, fontSize: 13, resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    createAnnotation('annotation');
                  } else if (e.key === 'Escape') {
                    setPopupType(null);
                    setAnnotationInput('');
                  }
                }}
              />
            )}
            {popupType === 'tag' && (
              <>
                <select
                  value={selectedTagType}
                  onChange={e => setSelectedTagType(e.target.value as Tag['tagType'])}
                  style={{ width: '100%', marginBottom: 8, border: '1px solid #d1d5db', borderRadius: 6, padding: 8, fontSize: 13, fontFamily: 'inherit' }}
                >
                  <option value="character">Character</option>
                  <option value="location">Location</option>
                  <option value="prop">Prop</option>
                  <option value="scene">Scene</option>
                  <option value="camera">Camera</option>
                  <option value="lighting">Lighting</option>
                  <option value="sound">Sound</option>
                  <option value="note">Note</option>
                </select>
                <input
                  type="text"
                  placeholder="Enter tag content..."
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  style={{ 
                    width: '100%', 
                    marginBottom: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createAnnotation('tag');
                    } else if (e.key === 'Escape') {
                      setPopupType(null);
                      setNewTag('');
                    }
                  }}
                />
              </>
            )}
            {!popupType && (
              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <button
                  onClick={() => {
                    setPopupType('annotation');
                    setAnnotationInput('');
                  }}
                  style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '8px 12px', fontSize: 13, cursor: 'pointer', transition: 'background 0.2s ease' }}
                >
                  💬 Add Annotation
                </button>
                <button
                  onClick={() => {
                    setPopupType('tag');
                    setNewTag('');
                  }}
                  style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: 6, padding: '8px 12px', fontSize: 13, cursor: 'pointer', transition: 'background 0.2s ease' }}
                >
                  🏷️ Add Tag
                </button>
                <button
                  onClick={() => {
                    setShowSelectionPopup(false);
                    setSelectionRect(null);
                    setSelectedText('');
                    setSelectionPage(null);
                    window.getSelection()?.removeAllRanges();
                  }}
                  style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', transition: 'background 0.2s ease' }}
                >
                  Cancel
                </button>
              </div>
            )}
            {(popupType === 'annotation' || popupType === 'tag') && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setPopupType(null);
                    setAnnotationInput('');
                    setNewTag('');
                  }}
                  style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => createAnnotation(popupType as 'annotation' | 'tag')}
                  disabled={popupType === 'annotation' ? !annotationInput.trim() : !newTag.trim()}
                  style={{ background: (popupType === 'annotation' ? annotationInput.trim() : newTag.trim()) ? (popupType === 'annotation' ? '#3b82f6' : '#f59e0b') : '#9ca3af', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: (popupType === 'annotation' ? annotationInput.trim() : newTag.trim()) ? 'pointer' : 'not-allowed' }}
                >
                  Save {popupType === 'annotation' ? '(Ctrl+Enter)' : '(Enter)'}
                </button>
              </div>
            )}
          </div>
        )}

        {showAddCollaboratorModal && (
          <div 
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddCollaboratorModal(false);
                setCollaboratorSearch('');
                setCollaboratorResults([]);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowAddCollaboratorModal(false);
                setCollaboratorSearch('');
                setCollaboratorResults([]);
              }
            }}
            tabIndex={-1}
          >
            <div className="modal-content" ref={modalRef} style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowAddCollaboratorModal(false);
                  setCollaboratorSearch('');
                  setCollaboratorResults([]);
                }}
                className="close-btn"
                aria-label="Close modal"
                style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ×
              </button>
              <div className="modal-header">
                <h3>Add Collaborator</h3>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={collaboratorSearch}
                  onChange={e => handleCollaboratorSearch(e.target.value)}
                  className="collaborator-search-input"
                  autoFocus
                />
                <div className="collaborator-search-results">
                  {searchLoading && (
                    <div className="no-results">Searching...</div>
                  )}
                  {!searchLoading && collaboratorResults.length === 0 && collaboratorSearch.trim() && (
                    <div className="no-results">No friends found.</div>
                  )}
                  {!searchLoading && collaboratorResults.length === 0 && !collaboratorSearch.trim() && (
                    <div className="no-results">Start typing to search for users</div>
                  )}
                  {collaboratorResults.map(user => (
                    <div key={user.id || user.email || Math.random()} className="user-result">
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{user.name || 'Unknown'}</span>
                          <span className="user-email">{user.email}</span>
                          {user.role && <span className="user-role">{user.role}</span>}
                          <span className="connection-badge" style={{ color: '#10b981', fontWeight: 500, fontSize: '0.85em', marginLeft: 6 }}>
                            Connected
                          </span>
                        </div>
                      </div>
                      <button
                        disabled={addingCollaborator || collaborators.some(c => c.id === user.id)}
                        onClick={() => handleAddCollaborator(user)}
                        className="add-btn"
                      >
                        {addingCollaborator ? 'Adding...' : collaborators.some(c => c.id === user.id) ? 'Already Added' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenplayViewer; 