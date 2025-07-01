import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
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

// Helper to normalize Date or { seconds: number } to Date
function toDate(val: Date | { seconds: number }): Date {
  return val instanceof Date ? val : new Date(val.seconds * 1000);
}

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
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const pdfScrollRef = useRef<HTMLDivElement>(null);

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

      // Update the annotation with the new reply
      const annotationRef = doc(db, 'screenplayAnnotations', annotationId);
      const annotation = annotations.find(a => a.id === annotationId);
      
      if (annotation) {
        const updatedReplies = [...(annotation.replies || []), reply];
        await updateDoc(annotationRef, { replies: updatedReplies });
        
        // Update local state
        setAnnotations(prev => prev.map(a => 
          a.id === annotationId 
            ? { ...a, replies: updatedReplies }
            : a
        ));
        
        toast.success('Reply added successfully!');
        setNewReply(''); // Clear input after successful reply
      }
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

  const startRealTimeSync = () => {
    // Real-time annotations sync
    const annotationsQuery = query(
      collection(db, 'screenplayAnnotations'),
      where('screenplayId', '==', screenplay.id),
      orderBy('timestamp', 'desc')
    );

    const annotationsUnsubscribe = onSnapshot(annotationsQuery, (snapshot) => {
      const annotationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: toDate(doc.data().timestamp)
      })) as Annotation[];
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

    // Real-time session sync
    if (session) {
      const sessionUnsubscribe = onSnapshot(doc(db, 'screenplaySessions', session.id), (doc) => {
        if (doc.exists()) {
          const sessionData = doc.data() as ScreenplaySession;
          setSession(sessionData);
          setActiveUsers(sessionData.activeUsers);
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
      const annotationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: toDate(doc.data().timestamp)
      })) as Annotation[];
      setAnnotations(annotationsData);
      console.log('[DEBUG] Loaded annotations:', annotationsData);
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

  return (
    <div className="screenplay-viewer" ref={viewerRef}>
      {/* Enhanced Header */}
      <div className="viewer-header">
        <div className="header-left">
          <h2>{screenplay.name}</h2>
          <div className="file-info">
            <span className="file-type">{screenplay.type}</span>
          </div>
        </div>
        
        <div className="header-center">
          <div className="view-controls">
            <button
              onClick={() => setViewMode('single')}
              className={`view-btn ${viewMode === 'single' ? 'active' : ''}`}
            >
              📄 Single
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`view-btn ${viewMode === 'split' ? 'active' : ''}`}
            >
              📊 Split
            </button>
            <button
              onClick={() => setViewMode('fullscreen')}
              className={`view-btn ${viewMode === 'fullscreen' ? 'active' : ''}`}
            >
              🖥️ Fullscreen
            </button>
          </div>
        </div>

        <div className="header-actions">
          <div className="overlay-controls">
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              className={`overlay-btn ${showOverlays ? 'active' : ''}`}
            >
              {showOverlays ? '👁️' : '👁️‍🗨️'} Overlays
            </button>
            <button
              onClick={() => setShowUserCursors(!showUserCursors)}
              className={`cursor-btn ${showUserCursors ? 'active' : ''}`}
            >
              👥 Cursors
            </button>
          </div>
          
          {onGenerateReport && (
            <button onClick={onGenerateReport} className="btn-report">
              📊 Generate Report
            </button>
          )}
          
          <button onClick={onClose} className="btn-close">×</button>
        </div>
      </div>

      <div className="viewer-content">
        {/* PDF Viewer Panel */}
        <div className={`pdf-panel ${viewMode} ${sidebarCollapsed ? 'expanded' : ''}`}>
          <div className="pdf-controls">
            <div className="zoom-controls">
              <button onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}>🔍-</button>
              <span className="zoom-level">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(prev => Math.min(3, prev + 0.2))}>🔍+</button>
            </div>
          </div>

          <div 
            className="pdf-container"
            ref={pdfContainerRef}
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
                    <div className="pdf-scrollable-container" style={{ maxHeight: '70vh', overflowY: 'auto', position: 'relative' }}>
                      {Array.from(new Array(numPages), (el, index) => {
                        const pageNumber = index + 1;
                        return (
                          <div key={`page_${pageNumber}`} className="page-container" style={{ position: 'relative' }}>
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
                            {showOverlays && annotations.filter(annotation => annotation.pageNumber === pageNumber).map(annotation => (
                              <div
                                key={`annotation-${annotation.id}`}
                                className={`annotation-overlay ${selectedElement === annotation.id ? 'selected' : ''} ${annotation.resolved ? 'resolved' : ''}`}
                                style={{
                                  position: 'absolute',
                                  left: `${annotation.position.x * 100}%`,
                                  top: `${annotation.position.y * 100}%`,
                                  width: `${annotation.position.width * 100}%`,
                                  height: `${annotation.position.height * 100}%`,
                                  border: '2px solid #EF4444',
                                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                  borderRadius: 2,
                                  cursor: 'pointer',
                                  zIndex: 5,
                                  transition: 'all 0.15s ease',
                                  pointerEvents: 'auto'
                                }}
                                data-element-id={annotation.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveAnnotation(annotation);
                                  setShowAnnotationSidebar(true);
                                  setPanelX(e.clientX);
                                  setPanelY(e.clientY);
                                  setSelectedElement(annotation.id);
                                  setActiveThread(null);
                                }}
                                title={`Annotation by ${annotation.userName}: ${annotation.annotation}`}
                              >
                                <div 
                                  className="annotation-marker"
                                  style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-6px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: '#EF4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    color: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    border: '1px solid white'
                                  }}
                                >
                                  💬
                                </div>
                              </div>
                            ))}
                            
                            {/* Tag Overlays for this page */}
                            {showOverlays && tags.filter(tag => tag.pageNumber === pageNumber).map(tag => (
                              <div
                                key={`tag-${tag.id}`}
                                className={`tag-overlay ${selectedElement === tag.id ? 'selected' : ''} ${tag.resolved ? 'resolved' : ''}`}
                                style={{
                                  position: 'absolute',
                                  left: `${tag.position.x * 100}%`,
                                  top: `${tag.position.y * 100}%`,
                                  width: `${tag.position.width * 100}%`,
                                  height: `${tag.position.height * 100}%`,
                                  border: `2px solid ${tag.color}`,
                                  backgroundColor: `${tag.color}15`,
                                  borderRadius: 2,
                                  cursor: 'pointer',
                                  zIndex: 5,
                                  transition: 'all 0.15s ease',
                                  pointerEvents: 'auto'
                                }}
                                data-element-id={tag.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedElement(tag.id);
                                  setActiveAnnotation(null);
                                  setActiveThread(null);
                                }}
                                title={`${tag.tagType}: ${tag.content} by ${tag.userName}`}
                              >
                                <div 
                                  className="tag-marker"
                                  style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-6px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: tag.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    color: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    border: '1px solid white'
                                  }}
                                >
                                  🏷️
                                </div>
                              </div>
                            ))}
                            
                            {/* Selection Popup for this page */}
                            {showSelectionPopup && selectionRect && selectionPage === pageNumber && (
                              <div
                                className="selection-popup"
                                style={{
                                  position: 'absolute',
                                  top: selectionRect.bottom + 8,
                                  left: selectionRect.left + selectionRect.width / 2 - 90,
                                  zIndex: 2000,
                                  background: 'rgba(255,255,255,0.98)',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: 10,
                                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                                  padding: '0.75rem 1.5rem',
                                  minWidth: 180,
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: 15,
                                  color: '#222',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  transition: 'all 0.2s ease',
                                  backdropFilter: 'blur(10px)'
                                }}
                              >
                                <div style={{ 
                                  position: 'absolute', 
                                  top: -8, 
                                  left: '50%', 
                                  transform: 'translateX(-50%)', 
                                  width: 0, 
                                  height: 0, 
                                  borderLeft: '8px solid transparent', 
                                  borderRight: '8px solid transparent', 
                                  borderBottom: '8px solid #e5e7eb' 
                                }} />
                                <div style={{ 
                                  position: 'absolute', 
                                  top: -7, 
                                  left: '50%', 
                                  transform: 'translateX(-50%)', 
                                  width: 0, 
                                  height: 0, 
                                  borderLeft: '7px solid transparent', 
                                  borderRight: '7px solid transparent', 
                                  borderBottom: '7px solid rgba(255,255,255,0.98)' 
                                }} />
                                <span style={{ marginBottom: 8, fontWeight: 600, color: '#374151' }}>Add to selection:</span>
                                <div style={{ display: 'flex', gap: 12 }}>
                                  <button
                                    style={{
                                      background: '#3B82F6', 
                                      color: 'white', 
                                      border: 'none', 
                                      borderRadius: 6, 
                                      padding: '0.4rem 1.1rem', 
                                      fontWeight: 500, 
                                      fontSize: 15, 
                                      cursor: 'pointer', 
                                      boxShadow: '0 1px 4px rgba(59,130,246,0.08)',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    onClick={() => setPopupType('annotation')}
                                  >
                                    💬 Annotation
                                  </button>
                                  <button
                                    style={{
                                      background: '#F59E42', 
                                      color: 'white', 
                                      border: 'none', 
                                      borderRadius: 6, 
                                      padding: '0.4rem 1.1rem', 
                                      fontWeight: 500, 
                                      fontSize: 15, 
                                      cursor: 'pointer', 
                                      boxShadow: '0 1px 4px rgba(245,158,66,0.08)',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    onClick={() => setPopupType('tag')}
                                  >
                                    🏷️ Tag
                                  </button>
                                </div>
                              </div>
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
                    {showUserCursors && activeUsers.map(user => (
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
                  </>
                )}
              </>
            ) : (
              <div>No PDF URL provided.</div>
            )}
          </div>
        </div>

        {/* Collapsible Collaboration Panel */}
        <div className={`collaboration-panel${sidebarCollapsed ? ' collapsed' : ''}`}
          style={{ boxShadow: sidebarCollapsed ? '0 0 12px 2px #3b82f6' : undefined }}
        >
          <button
            className={`sidebar-toggle-btn${sidebarCollapsed ? ' bounce' : ''}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? 'Show Annotations Sidebar' : 'Hide Annotations Sidebar'}
            title={sidebarCollapsed ? 'Show Annotations Sidebar' : 'Hide Annotations Sidebar'}
            style={{
              left: sidebarCollapsed ? '-24px' : '-24px',
              background: sidebarCollapsed ? '#3b82f6' : '#f3f4f6',
              color: sidebarCollapsed ? 'white' : '#6b7280',
              border: sidebarCollapsed ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              zIndex: 102,
              fontWeight: 700,
              fontSize: 24,
              width: 44,
              height: 44,
              boxShadow: sidebarCollapsed ? '0 0 12px 2px #3b82f6' : '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            {sidebarCollapsed ? '⮜' : '⮞'}
            {!sidebarCollapsed && <span style={{marginLeft:8,fontSize:15,fontWeight:500}}>Hide</span>}
            {sidebarCollapsed && <span style={{marginLeft:8,fontSize:15,fontWeight:500}}>Show</span>}
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
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="panel-content">
                {/* Active Users */}
                <div className="active-users">
                  <h4>👥 Active Users ({activeUsers.length})</h4>
                  <div className="users-list">
                    {activeUsers.map(user => (
                      <div key={user.userId} className="user-item">
                        <div className="user-avatar">
                          {user.userAvatar ? (
                            <img src={user.userAvatar} alt={user.userName} />
                          ) : (
                            <div className="avatar-placeholder">{user.userName.charAt(0)}</div>
                          )}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{user.userName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                        <div className="annotation-actions">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigateToElement(annotation); }}
                            className="action-btn"
                          >
                            📍 Go to
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleElementResolved(annotation.id, 'annotation'); }}
                            className={`action-btn ${annotation.resolved ? 'resolved' : ''}`}
                          >
                            {annotation.resolved ? '🔄 Reopen' : '✅ Resolve'}
                          </button>
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

      {/* Fast inline selection popup */}
      {showSelectionPopup && selectionRect && (
        <div
          className="fast-selection-popup"
          style={{
            position: 'fixed',
            left: popupPosition.x,
            top: popupPosition.y,
            zIndex: 2000,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '12px',
            minWidth: '200px',
            maxWidth: '300px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px'
          }}
        >
          <div style={{ marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>
            "{selectedText.substring(0, 30)}{selectedText.length > 30 ? '...' : ''}"
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <button
              onClick={() => {
                setPopupType('annotation');
                setAnnotationInput('');
              }}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
            >
              💬 Add Annotation
            </button>
            
            <button
              onClick={() => {
                setPopupType('tag');
                setNewTag('');
              }}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#d97706'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f59e0b'}
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
              style={{
                background: '#f3f4f6',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fast annotation input popup */}
      {popupType === 'annotation' && selectionRect && (
        <div
          className="fast-annotation-popup"
          style={{
            position: 'fixed',
            left: popupPosition.x,
            top: popupPosition.y,
            zIndex: 2001,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '12px',
            minWidth: '250px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px'
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Add Annotation
          </div>
          
          <textarea
            placeholder="Enter your annotation..."
            value={annotationInput}
            onChange={e => setAnnotationInput(e.target.value)}
            rows={3}
            style={{ 
              width: '100%', 
              marginBottom: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '13px',
              resize: 'vertical',
              minHeight: '60px',
              fontFamily: 'inherit'
            }}
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
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setPopupType(null);
                setAnnotationInput('');
              }}
              style={{
                background: '#f3f4f6',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => createAnnotation('annotation')}
              disabled={!annotationInput.trim()}
              style={{
                background: annotationInput.trim() ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: annotationInput.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Save (Ctrl+Enter)
            </button>
          </div>
        </div>
      )}

      {/* Fast tag input popup */}
      {popupType === 'tag' && selectionRect && (
        <div
          className="fast-tag-popup"
          style={{
            position: 'fixed',
            left: popupPosition.x,
            top: popupPosition.y,
            zIndex: 2001,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '12px',
            minWidth: '250px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px'
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Add Tag
          </div>
          
          <select
            value={selectedTagType}
            onChange={e => setSelectedTagType(e.target.value as Tag['tagType'])}
            style={{
              width: '100%',
              marginBottom: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '13px',
              fontFamily: 'inherit'
            }}
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
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setPopupType(null);
                setNewTag('');
              }}
              style={{
                background: '#f3f4f6',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => createAnnotation('tag')}
              disabled={!newTag.trim()}
              style={{
                background: newTag.trim() ? '#f59e0b' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: newTag.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Save (Enter)
            </button>
          </div>
        </div>
      )}

      {/* Navigation loading indicator */}
      {isNavigating && (
        <div className="navigation-loading">
          <div className="spinner"></div>
          <span>Navigating to annotation...</span>
        </div>
      )}
    </div>
  );
};

export default ScreenplayViewer; 