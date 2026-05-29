import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove, limit, getDoc, serverTimestamp } from 'firebase/firestore';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import './ScreenplayViewer.scss';
import { useTranslation } from 'react-i18next';
import EmailNotificationService from '../../services/emailNotificationService';
import { logWorkspaceActivity, WorkspaceActivityVerb } from '../../services/workspaceActivityService';
import FountainViewer from './FountainViewer';
import type { ScreenplayReviewStatus, WorkspaceMember } from '../../types/Collaboration';

const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

// pdfjs-dist v5 (pulled in by react-pdf v10) only ships the ES-module worker (.mjs).
// jsDelivr serves the npm package version directly; cdnjs does not host every pdfjs-dist release.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_PAGE_GAP = 20;
const PDF_SCROLL_PADDING = 40;
const MIN_PDF_PAGE_WIDTH = 280;
const MAX_PDF_PAGE_WIDTH = 920;
const REVIEW_STATUS_ORDER: ScreenplayReviewStatus[] = ['draft', 'submitted', 'changes_requested', 'approved'];
const isScreenplayReviewStatus = (value: unknown): value is ScreenplayReviewStatus =>
  typeof value === 'string' && REVIEW_STATUS_ORDER.includes(value as ScreenplayReviewStatus);

interface ScreenplayViewerProps {
  screenplay: {
    id: string;
    name: string;
    url: string;
    type: string;
    format?: 'pdf' | 'fountain';
    fountainSource?: string;
    reviewStatus?: ScreenplayReviewStatus;
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
  supervisorAtAuthorTime?: boolean;
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
  tagType: 'cast_member' | 'background_actors' | 'stunts' | 'vehicles' | 'props' | 'camera' | 'special_effects' | 'vfx' | 'mechanical_effects' | 'wardrobe' | 'makeup_hair' | 'animals' | 'animal_wrangler' | 'music' | 'sound' | 'art_department' | 'set_dressing' | 'greenery' | 'special_equipment' | 'security' | 'additional_labor' | 'miscellaneous' | 'other' | 'notes' | 'comments' | 'set' | 'sequence' | 'script_day' | 'unit' | 'location' | 'character' | 'character_arc' | 'character_development' | 'location_detail' | 'costume' | 'makeup' | 'scene' | 'scene_transition' | 'scene_beat' | 'lighting' | 'plot_point' | 'subplot' | 'theme' | 'budget' | 'schedule' | 'logistics' | 'note' | 'revision' | 'research';
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
  supervisorAtAuthorTime?: boolean;
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
  const [useNativePdfFallback, setUseNativePdfFallback] = useState(false);
  const [scale, setScale] = useState(1);
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [session, setSession] = useState<ScreenplaySession | null>(null);
  const [activeUsers, setActiveUsers] = useState<ScreenplaySession['activeUsers']>([]);
  const [viewMode, setViewMode] = useState<'single' | 'split' | 'fullscreen'>('single');
  const [filterType, setFilterType] = useState<'all' | 'annotations' | 'tags' | 'resolved'>('all');
  const [statusFilter, setStatusFilter] = useState<'open' | 'mine' | 'from_teacher' | 'all'>('open');
  const [screenplayWorkspaceId, setScreenplayWorkspaceId] = useState<string | null>(null);
  const [screenplayUploadedBy, setScreenplayUploadedBy] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ScreenplayReviewStatus>(screenplay.reviewStatus || 'draft');
  const [reviewStatusNote, setReviewStatusNote] = useState<string>('');
  const [canUpdateReviewAsCreator, setCanUpdateReviewAsCreator] = useState(false);
  const [canUpdateReviewAsReviewer, setCanUpdateReviewAsReviewer] = useState(false);
  const [updatingReviewStatus, setUpdatingReviewStatus] = useState(false);
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [requestChangesDraft, setRequestChangesDraft] = useState('');
  const [fountainNote, setFountainNote] = useState('');
  const [addingFountainNote, setAddingFountainNote] = useState(false);
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
  // On phones the side panel becomes a fixed overlay over the PDF, so default
  // it to collapsed there — otherwise the user opens the viewer and sees the
  // panel covering the document, with no obvious "back to PDF" affordance.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 900
  );
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
  const popupTypeRef = useRef<'annotation' | 'tag' | null>(null);
  const pdfScrollRef = useRef<HTMLDivElement>(null);

  // Add state for virtualization
  const [visiblePageRange, setVisiblePageRange] = useState<[number, number]>([1, 10]);
  const [pageRenderWidth, setPageRenderWidth] = useState(760);
  // Measured live from the first rendered Page so virtualization + placeholders use the
  // actual height (varies with PDF dimensions and the current zoom level). Defaults to
  // a US Letter-ish guess until the first measurement lands.
  const [measuredPageHeight, setMeasuredPageHeight] = useState(1100);

  // Focus trap for modal
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [searchLoading, setSearchLoading] = useState(false);

  const { t } = useTranslation();

  if (!screenplay || !screenplay.id) return null;

  const isFountain = screenplay.format === 'fountain' || screenplay.type === 'fountain';
  const isPdfDocument = !isFountain && (
    screenplay.type?.toLowerCase().includes('pdf') ||
    screenplay.name?.toLowerCase().endsWith('.pdf') ||
    screenplay.url?.toLowerCase().includes('.pdf')
  );
  const renderedPageWidth = Math.max(
    MIN_PDF_PAGE_WIDTH,
    Math.round(pageRenderWidth * scale)
  );

  useEffect(() => {
    if (!isPdfDocument) return;

    const updatePageWidth = () => {
      const container = pdfContainerRef.current;
      if (!container) return;

      const availableWidth = container.clientWidth || container.getBoundingClientRect().width;
      if (!availableWidth) return;

      const nextWidth = Math.min(
        MAX_PDF_PAGE_WIDTH,
        Math.max(MIN_PDF_PAGE_WIDTH, Math.floor(availableWidth - PDF_SCROLL_PADDING))
      );

      setPageRenderWidth(prev => (Math.abs(prev - nextWidth) > 4 ? nextWidth : prev));
    };

    updatePageWidth();

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updatePageWidth)
      : null;

    if (resizeObserver && pdfContainerRef.current) {
      resizeObserver.observe(pdfContainerRef.current);
    }

    window.addEventListener('resize', updatePageWidth);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updatePageWidth);
    };
  }, [isPdfDocument, sidebarCollapsed]);

  useEffect(() => {
    if (!isPdfDocument) return;
    setVisiblePageRange([1, 10]);
    setMeasuredPageHeight(1100);
  }, [isPdfDocument, renderedPageWidth]);

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
              debugLog('[DEBUG] Reply saved to Firestore successfully');
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
    // Cast & Performance
    cast_member: '#FF6B6B',
    background_actors: '#FF8E8E',
    stunts: '#FFB3B3',
    
    // Vehicles & Props
    vehicles: '#4ECDC4',
    props: '#6ED7D0',
    
    // Technical Departments
    camera: '#45B7D1',
    special_effects: '#5FC1D8',
    vfx: '#79CBDF',
    mechanical_effects: '#96CEB4',
    
    // Costume & Makeup
    wardrobe: '#A8D8C0',
    makeup_hair: '#BAE2CC',
    
    // Animals
    animals: '#FFD93D',
    animal_wrangler: '#FFE066',
    
    // Audio
    music: '#FFE680',
    sound: '#A8E6CF',
    
    // Art Department
    art_department: '#B8EBD9',
    set_dressing: '#C8F0E3',
    greenery: '#FF9F43',
    
    // Equipment & Security
    special_equipment: '#FFB366',
    security: '#FFC789',
    
    // Labor & Production
    additional_labor: '#FFEAA7',
    
    // Story & Script
    notes: '#FDCB6E',
    comments: '#F39C12',
    miscellaneous: '#95A5A6',
    
    // Production Structure
    set: '#E74C3C',
    sequence: '#C0392B',
    script_day: '#A93226',
    unit: '#922B21',
    location: '#7B241C',
    
    // Legacy types (keep for backward compatibility)
    character: '#FF6B6B',
    character_arc: '#FF8E8E',
    character_development: '#FFB3B3',
    location_detail: '#8EE1DB',
    costume: '#5FC1D8',
    makeup: '#79CBDF',
    scene: '#96CEB4',
    scene_transition: '#A8D8C0',
    scene_beat: '#BAE2CC',
    lighting: '#FFE066',
    plot_point: '#A8E6CF',
    subplot: '#B8EBD9',
    theme: '#C8F0E3',
    budget: '#FF9F43',
    schedule: '#FFB366',
    logistics: '#FFC789',
    note: '#FFEAA7',
    revision: '#FDCB6E',
    research: '#F39C12',
    other: '#7B7B7B'
  };

  const priorityColors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    critical: '#7C3AED'
  };

  useEffect(() => {
    popupTypeRef.current = popupType;
  }, [popupType]);

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

  // Re-position the popup when its content changes shape (the annotation textarea is
  // taller than the initial choice card and can overflow the viewport from where we
  // first placed it). Use the last selection rect as the anchor.
  useEffect(() => {
    if (popupType && selectionRect) {
      const popupHeight = popupType === 'annotation' ? 240 : 200;
      const next = calculatePopupPosition(selectionRect as DOMRect, 320, popupHeight);
      setPopupPosition(next);
    }
  }, [popupType, selectionRect, calculatePopupPosition]);

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
    debugLog('[DEBUG] ScreenplayViewer mounted with screenplay:', screenplay);
    setError(null);
    setUseNativePdfFallback(false);
    setLoading(true);
    setNumPages(null);
    setScreenplayWorkspaceId(null);
    setScreenplayUploadedBy(null);
    setReviewStatus(screenplay.reviewStatus || 'draft');
    setCanUpdateReviewAsCreator(false);
    setCanUpdateReviewAsReviewer(false);
    if (!screenplay.url || typeof screenplay.url !== 'string' || screenplay.url.trim() === '') {
      setError('No PDF URL found for this screenplay.');
      setLoading(false);
    } else if (!isPdfDocument) {
      setLoading(false);
    }
    let cancelled = false;
    const unsubscribeMetadata = onSnapshot(doc(db, 'screenplays', screenplay.id), async snap => {
      if (cancelled) return;
      const data = snap.exists() ? snap.data() : null;
      const workspaceId = typeof data?.workspaceId === 'string' ? data.workspaceId : null;
      const uploadedBy = typeof data?.uploadedBy === 'string' ? data.uploadedBy : null;
      setScreenplayWorkspaceId(workspaceId);
      setScreenplayUploadedBy(uploadedBy);
      setReviewStatus(isScreenplayReviewStatus(data?.reviewStatus) ? data.reviewStatus : 'draft');
      setReviewStatusNote(typeof data?.reviewStatusNote === 'string' ? data.reviewStatusNote : '');

      let creatorAllowed = Boolean(currentUser?.uid && uploadedBy === currentUser.uid);
      let reviewerAllowed = false;

      if (currentUser?.uid && workspaceId) {
        try {
          const workspaceSnap = await getDoc(doc(db, 'workspaces', workspaceId));
          if (cancelled) return;
          if (workspaceSnap.exists()) {
            const workspace = workspaceSnap.data();
            const members = Array.isArray(workspace.members) ? workspace.members as WorkspaceMember[] : [];
            const memberIds = Array.isArray(workspace.memberIds)
              ? workspace.memberIds
              : members.map(member => member.userId).filter(Boolean);
            const member = members.find(item => item.userId === currentUser.uid);
            const supervisorIds = Array.isArray(workspace.supervisorIds) ? workspace.supervisorIds : [];
            const viewerIds = Array.isArray(workspace.viewerIds) ? workspace.viewerIds : [];
            const selfElectedSupervisors = Array.isArray(workspace.selfElectedSupervisors) ? workspace.selfElectedSupervisors : [];
            const isSupervisor = member?.role === 'supervisor' ||
              supervisorIds.includes(currentUser.uid) ||
              selfElectedSupervisors.includes(currentUser.uid);
            const isViewer = member?.role === 'viewer' || viewerIds.includes(currentUser.uid);
            const isReadOnly = isSupervisor || isViewer;
            creatorAllowed = creatorAllowed ||
              ((workspace.status || 'active') === 'active' && memberIds.includes(currentUser.uid) && !isReadOnly);
            reviewerAllowed = isSupervisor;
          }
        } catch (err) {
          console.error('Failed to read screenplay workspace permissions:', err);
        }
      }

      if (!cancelled) {
        setCanUpdateReviewAsCreator(creatorAllowed);
        setCanUpdateReviewAsReviewer(reviewerAllowed);
      }
    }, err => {
      console.error('Failed to read screenplay metadata:', err);
    });
    initializeSession();
    // Single source of truth for annotations/tags — onSnapshot. The previous one-shot
    // loadAnnotations()/loadTags() calls created a brief race against the live listeners.
    const stopRealTimeSync = startRealTimeSync();
    return () => {
      cancelled = true;
      unsubscribeMetadata();
      if (typeof stopRealTimeSync === 'function') stopRealTimeSync();
    };
  }, [screenplay.id, currentUser?.uid]);

  useEffect(() => {
    if (!screenplay.url || !isPdfDocument || useNativePdfFallback || numPages) return;

    const timeoutId = window.setTimeout(() => {
      setUseNativePdfFallback(true);
      setLoading(false);
    }, 12000);

    return () => window.clearTimeout(timeoutId);
  }, [screenplay.url, isPdfDocument, useNativePdfFallback, numPages]);

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
        
        debugLog(`[DEBUG] Annotation ${doc.id} has ${processedReplies.length} replies:`, processedReplies);
        
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

  // Read the screenplay's workspace at write time to determine whether the current
  // user is effectively acting as a supervisor right now (owner-assigned or self-elected).
  // Denormalized into the annotation/tag doc so read-time filters don't need a join.
  const resolveSupervisorAtAuthorTime = async (): Promise<boolean> => {
    if (!currentUser || !screenplayWorkspaceId) return false;
    try {
      const snap = await getDoc(doc(db, 'workspaces', screenplayWorkspaceId));
      if (!snap.exists()) return false;
      const data = snap.data();
      const supervisorIds: string[] = Array.isArray(data.supervisorIds) ? data.supervisorIds : [];
      const selfElected: string[] = Array.isArray(data.selfElectedSupervisors) ? data.selfElectedSupervisors : [];
      return supervisorIds.includes(currentUser.uid) || selfElected.includes(currentUser.uid);
    } catch (err) {
      console.error('Failed to resolve supervisor-at-author-time:', err);
      return false;
    }
  };

  // G6 — write an in-app notification to the screenplay author when a supervisor leaves a
  // comment or tag. Guarded so:
  //   - only fires when the author was acting as a supervisor at write time
  //   - never notifies the screenplay's own uploader if they're the author of the comment
  //     (no self-notifications when a teacher uploads + comments on their own demo)
  //   - silently no-ops if uploadedBy is missing (defensive — old screenplays)
  // The doc lives in the top-level `notifications` collection (same as the rest of the
  // app's notification system, surfaced by useNotifications + NotificationBell).
  // We deliberately do NOT send email here — see G6 design note. Email digest is a
  // future Cloud-Function workstream so we don't bombard students per keystroke.
  const writeSupervisorCommentNotification = async (params: {
    kind: 'annotation' | 'tag';
    pageNumber: number;
    content: string;
    refId: string;
  }) => {
    if (!currentUser || !screenplayUploadedBy) return;
    if (screenplayUploadedBy === currentUser.uid) return;
    try {
      const authorName = currentUser.displayName || t('screenplay.notifications.fallbackAuthor');
      const screenplayName = screenplay.name || t('screenplay.notifications.fallbackScreenplay');
      const excerpt = params.content.length > 80
        ? `${params.content.slice(0, 80).trim()}…`
        : params.content;
      const titleKey = params.kind === 'annotation'
        ? 'screenplay.notifications.supervisorAnnotation.title'
        : 'screenplay.notifications.supervisorTag.title';
      const bodyKey = params.kind === 'annotation'
        ? 'screenplay.notifications.supervisorAnnotation.body'
        : 'screenplay.notifications.supervisorTag.body';
      const title = t(titleKey, { author: authorName, screenplay: screenplayName });
      const body = t(bodyKey, {
        author: authorName,
        screenplay: screenplayName,
        page: params.pageNumber,
        excerpt
      });
      await addDoc(collection(db, 'notifications'), {
        userId: screenplayUploadedBy,
        type: params.kind === 'annotation' ? 'supervisor_annotation' : 'supervisor_tag',
        title,
        body,
        message: body,
        // Stored title/body are a fallback (author's locale); keys+params render in the
        // recipient's locale. excerpt/screenplay are data; author is a name.
        titleKey,
        bodyKey,
        i18nParams: { author: authorName, screenplay: screenplayName, page: params.pageNumber, excerpt },
        isRead: false,
        read: false,
        createdAt: serverTimestamp(),
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        senderName: authorName,
        relatedId: screenplay.id,
        link: '/collaboration',
        metadata: {
          screenplayId: screenplay.id,
          screenplayName,
          workspaceId: screenplayWorkspaceId || null,
          [params.kind === 'annotation' ? 'annotationId' : 'tagId']: params.refId,
          pageNumber: params.pageNumber,
          kind: params.kind
        }
      });
    } catch (err) {
      // Failure to write a notification must never block the underlying comment.
      console.error('Failed to write supervisor-comment notification:', err);
    }
  };

  // Detect @mentions in free-text. Matches `@token` where token is letters,
  // digits, underscore, dot, or hyphen — collaborators with multi-word names
  // can be reached by their first-name token, or by the squashed full name.
  // Returns deduped matching collaborator ids (excluding the current user).
  const extractMentionedUserIds = (text: string): string[] => {
    if (!text || !collaborators.length) return [];
    const mentionPattern = /@([A-Za-z0-9_.-]{2,})/g;
    const tokens = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = mentionPattern.exec(text)) !== null) {
      tokens.add(match[1].toLowerCase());
    }
    if (tokens.size === 0) return [];
    const ids = new Set<string>();
    for (const c of collaborators) {
      if (!c?.id || c.id === currentUser?.uid) continue;
      const fullName = (c.name || '').toLowerCase();
      const firstName = fullName.split(/\s+/)[0] || '';
      const squashed = fullName.replace(/\s+/g, '');
      const emailLocal = (c.email || '').toLowerCase().split('@')[0] || '';
      for (const tok of tokens) {
        if (tok === firstName || tok === squashed || tok === emailLocal) {
          ids.add(c.id);
          break;
        }
      }
    }
    return [...ids];
  };

  // Best-effort: write a "you were @mentioned" notification per target.
  // Never blocks the underlying write; failures only console.error.
  const notifyMentions = async (
    text: string,
    pageNumber: number,
    refId: string,
    kind: 'annotation' | 'tag'
  ) => {
    const targets = extractMentionedUserIds(text);
    if (!targets.length || !currentUser) return;
    const actorName = currentUser.displayName || t('screenplay.notifications.fallbackAuthor');
    const screenplayName = screenplay.name || t('screenplay.notifications.fallbackScreenplay');
    const excerpt = text.trim().slice(0, 140);
    const titleKey = `screenplay.notifications.mention${kind === 'annotation' ? 'Annotation' : 'Tag'}.title`;
    const bodyKey = `screenplay.notifications.mention${kind === 'annotation' ? 'Annotation' : 'Tag'}.body`;
    const params = { author: actorName, screenplay: screenplayName, page: pageNumber, excerpt };
    try {
      await Promise.all(targets.map(uid => addDoc(collection(db, 'notifications'), {
        userId: uid,
        type: `mention_${kind}`,
        title: t(titleKey, params),
        body: t(bodyKey, params),
        message: t(bodyKey, params),
        titleKey,
        bodyKey,
        i18nParams: params,
        isRead: false,
        read: false,
        createdAt: serverTimestamp(),
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        senderName: actorName,
        relatedId: refId,
        link: '/collaboration',
        metadata: { screenplayId: screenplay.id, screenplayName, kind, refId, pageNumber }
      })));
    } catch (err) {
      console.error('Failed to write @mention notification:', err);
    }
  };

  const addAnnotation = async (position: { x: number; y: number; width: number; height: number }, pageNumber: number, annotation: string) => {
    if (!annotation.trim()) return;

    try {
      const supervisorAtAuthorTime = await resolveSupervisorAtAuthorTime();
      const annotationData: any = {
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
        supervisorAtAuthorTime,
        priority: 'medium' as const
      };

      const annotationRef = await addDoc(collection(db, 'screenplayAnnotations'), annotationData);
      setNewAnnotation('');
      toast.success(supervisorAtAuthorTime ? t('screenplay.toasts.supervisorNoteAdded') : t('screenplay.toasts.annotationAdded'));

      if (screenplayWorkspaceId && currentUser) {
        logWorkspaceActivity({
          workspaceId: screenplayWorkspaceId,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: 'annotation_added',
          targetId: screenplay.id,
          targetName: screenplay.name
        });
      }

      if (supervisorAtAuthorTime) {
        // Don't await — notification is best-effort, never block the user's flow.
        writeSupervisorCommentNotification({
          kind: 'annotation',
          pageNumber,
          content: annotation.trim(),
          refId: annotationRef.id
        });
      }
      // @mention notifications — target anyone tagged in the text. Best-effort.
      notifyMentions(annotation.trim(), pageNumber, annotationRef.id, 'annotation');
    } catch (error) {
      console.error('Error adding annotation:', error);
      toast.error(t('screenplay.toasts.annotationFailed'));
    }
  };

  const addTag = async (position: { x: number; y: number; width: number; height: number }, pageNumber: number, tag: string) => {
    if (!tag.trim()) return;

    try {
      const supervisorAtAuthorTime = await resolveSupervisorAtAuthorTime();
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
        resolved: false,
        supervisorAtAuthorTime
      };

      const tagRef = await addDoc(collection(db, 'screenplayTags'), tagData);
      setNewTag('');
      toast.success(t('screenplay.toasts.tagAdded'));

      if (screenplayWorkspaceId && currentUser) {
        logWorkspaceActivity({
          workspaceId: screenplayWorkspaceId,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: 'tag_added',
          targetId: screenplay.id,
          targetName: screenplay.name
        });
      }

      if (supervisorAtAuthorTime) {
        writeSupervisorCommentNotification({
          kind: 'tag',
          pageNumber,
          content: tag.trim(),
          refId: tagRef.id
        });
      }
      // @mention notifications also fire on tag content.
      notifyMentions(tag.trim(), pageNumber, tagRef.id, 'tag');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error(t('screenplay.toasts.tagFailed'));
    }
  };

  // B6 — doc-level note on a Fountain screenplay. Fountain docs have no PDF text layer to
  // anchor a spatial annotation to, so notes are document-level (pageNumber 0, zero rect).
  // Reuses addAnnotation so supervisor provenance + the G6 notification fire automatically.
  const handleAddFountainNote = async () => {
    const text = fountainNote.trim();
    if (!text || addingFountainNote) return;
    setAddingFountainNote(true);
    try {
      await addAnnotation({ x: 0, y: 0, width: 0, height: 0 }, 0, text);
      setFountainNote('');
    } finally {
      setAddingFountainNote(false);
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
        // While the popup is composing an annotation/tag, an empty selection on the PDF
        // (e.g. an accidental click outside the popup) MUST NOT clear selectionRect/page
        // — that silently breaks Save in createAnnotation.
        if (popupTypeRef.current) return;
        setShowSelectionPopup(false);
        setSelectionRect(null);
        setSelectedText('');
        setSelectionPage(null);
        return;
      }

      if (selection.rangeCount === 0) return;
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

  // CSV export — tags + annotations together. Useful as a film-breakdown deliverable for
  // production crew and as an evaluation artifact for the supervisor.
  const escapeCsvCell = (value: unknown): string => {
    const stringified = value === null || value === undefined ? '' : String(value);
    // Always wrap in quotes; escape internal quotes by doubling them. This handles
    // commas, line breaks and semicolons that often appear in annotation content.
    return `"${stringified.replace(/"/g, '""')}"`;
  };

  const formatTimestampForCsv = (ts: any): string => {
    const d = toDate(ts);
    if (!d || isNaN(d.getTime())) return '';
    return d.toISOString();
  };

  const exportTagReport = () => {
    if (annotations.length === 0 && tags.length === 0) {
      toast(t('screenplay.export.empty'));
      return;
    }
    try {
      const screenplayLabel = screenplay.name || 'screenplay';
      const headers = [
        t('screenplay.export.columns.type'),
        t('screenplay.export.columns.category'),
        t('screenplay.export.columns.page'),
        t('screenplay.export.columns.content'),
        t('screenplay.export.columns.author'),
        t('screenplay.export.columns.supervisor'),
        t('screenplay.export.columns.resolved'),
        t('screenplay.export.columns.timestamp'),
        t('screenplay.export.columns.screenplay')
      ].map(escapeCsvCell).join(',');

      const yes = t('screenplay.export.boolean.yes');
      const no = t('screenplay.export.boolean.no');

      type Row = {
        type: string;
        category: string;
        page: number;
        content: string;
        author: string;
        supervisor: string;
        resolved: string;
        timestamp: string;
      };

      const annotationRows: Row[] = annotations.map(annotation => ({
        type: t('screenplay.export.types.annotation'),
        category: '',
        page: annotation.pageNumber ?? 0,
        content: annotation.annotation || '',
        author: annotation.userName || '',
        supervisor: annotation.supervisorAtAuthorTime ? yes : no,
        resolved: annotation.resolved ? yes : no,
        timestamp: formatTimestampForCsv(annotation.timestamp)
      }));

      const tagRows: Row[] = tags.map(tag => ({
        type: t('screenplay.export.types.tag'),
        category: tag.tagType ? t(`screenplay.categories.${tag.tagType}`, { defaultValue: tag.tagType }) : '',
        page: tag.pageNumber ?? 0,
        content: tag.content || '',
        author: tag.userName || '',
        supervisor: tag.supervisorAtAuthorTime ? yes : no,
        resolved: tag.resolved ? yes : no,
        timestamp: formatTimestampForCsv(tag.timestamp)
      }));

      const allRows = [...annotationRows, ...tagRows].sort((a, b) => {
        if (a.page !== b.page) return a.page - b.page;
        return a.timestamp.localeCompare(b.timestamp);
      });

      const csvRows = allRows.map(row => [
        row.type,
        row.category,
        row.page,
        row.content,
        row.author,
        row.supervisor,
        row.resolved,
        row.timestamp,
        screenplayLabel
      ].map(escapeCsvCell).join(','));

      // BOM prefix so Excel detects UTF-8 (otherwise é/í/ñ render as mojibake on open).
      const csv = '﻿' + [headers, ...csvRows].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const date = new Date().toISOString().slice(0, 10);
      const safeName = screenplayLabel.replace(/\.[^.]+$/, '').replace(/[^a-z0-9\-_]+/gi, '-').slice(0, 60) || 'screenplay';
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeName}-breakdown-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke after a tick so the click has time to bind the URL in some browsers.
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast.success(t('screenplay.export.success'));
    } catch (err) {
      console.error('Export failed:', err);
      toast.error(t('screenplay.export.failed'));
    }
  };

  const toggleElementResolved = async (elementId: string, type: 'annotation' | 'tag') => {
    const collectionName = type === 'annotation' ? 'screenplayAnnotations' : 'screenplayTags';
    const elementRef = doc(db, collectionName, elementId);
    const element = type === 'annotation'
      ? annotations.find(c => c.id === elementId)
      : tags.find(t => t.id === elementId);
    if (!element) return;
    const nextResolved = !element.resolved;
    // Optimistic update so the user sees the state flip instantly, without waiting for
    // the onSnapshot round-trip. If the write fails we roll back below.
    if (type === 'annotation') {
      setAnnotations(prev => prev.map(a => a.id === elementId ? { ...a, resolved: nextResolved } : a));
    } else {
      setTags(prev => prev.map(t => t.id === elementId ? { ...t, resolved: nextResolved } : t));
    }
    try {
      await updateDoc(elementRef, { resolved: nextResolved });
      const toastKey = type === 'annotation'
        ? (nextResolved ? 'annotationResolved' : 'annotationReopened')
        : (nextResolved ? 'tagResolved' : 'tagReopened');
      toast.success(t(`screenplay.toasts.${toastKey}`));
      // Log to the workspace activity feed so the teacher's Recent activity
      // pane reflects student progress. Only meaningful when the note is from
      // a supervisor and the actor is not (i.e. it's a real "addressed" event).
      if (
        screenplayWorkspaceId && currentUser &&
        (element as { supervisorAtAuthorTime?: boolean }).supervisorAtAuthorTime === true &&
        (element as { userId?: string }).userId !== currentUser.uid
      ) {
        logWorkspaceActivity({
          workspaceId: screenplayWorkspaceId,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: nextResolved ? 'supervisor_note_addressed' : 'supervisor_note_reopened',
          targetId: screenplay.id,
          targetName: screenplay.name
        });
      }
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
      toast.error(t('screenplay.toasts.updateFailed'));
      // Roll back the optimistic flip
      if (type === 'annotation') {
        setAnnotations(prev => prev.map(a => a.id === elementId ? { ...a, resolved: !nextResolved } : a));
      } else {
        setTags(prev => prev.map(t => t.id === elementId ? { ...t, resolved: !nextResolved } : t));
      }
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
        x: (selectionRect as any).relativeX ?? selectionRect.left / window.innerWidth,
        y: (selectionRect as any).relativeY ?? selectionRect.top / window.innerHeight,
        width: (selectionRect as any).relativeWidth ?? selectionRect.width / window.innerWidth,
        height: (selectionRect as any).relativeHeight ?? selectionRect.height / window.innerHeight,
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

  // Helper to calculate visible pages based on scroll. Uses the live-measured page height
  // (set from the first rendered Page) so virtualization stays in sync with whatever the
  // PDF and current zoom actually produce.
  const handleVirtualizedScroll = useCallback(() => {
    if (!pdfScrollRef.current || !numPages) return;
    const scrollTop = pdfScrollRef.current.scrollTop;
    const containerHeight = pdfScrollRef.current.clientHeight;

    const pageHeight = Math.max(200, measuredPageHeight);
    const buffer = 2;

    const firstVisible = Math.max(1, Math.floor(scrollTop / pageHeight) - buffer);
    const lastVisible = Math.min(numPages, Math.ceil((scrollTop + containerHeight) / pageHeight) + buffer);

    setVisiblePageRange([firstVisible, lastVisible]);
  }, [numPages, measuredPageHeight]);

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
    debugLog('[DEBUG] Annotations updated:', annotations.length);
    annotations.forEach(annotation => {
      debugLog(`[DEBUG] Annotation ${annotation.id}:`, {
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
          toast.success(`${user.userName} joined the session`);
        }
      });
      
      leftUsers.forEach(user => {
        if (user.userId !== currentUser?.uid) {
          toast(`${user.userName} left the session`);
        }
      });
    }
    
    setPreviousActiveUsers(activeUsers);
  }, [activeUsers, currentUser]);

  // Real-time collaborators listener.
  //
  // teamMembers on a screenplay doc has historically been a MIX of shapes:
  //   - flat uid strings (written by CollaborationHub.syncWorkspaceScreenplayAccess
  //     when a workspace member is added)
  //   - rich {id, name, email, ...} objects (written by the legacy addCollaborator
  //     path inside this viewer)
  // Firestore rules expect uid strings (rule: teamMembers.hasAny([request.auth.uid])).
  // Going forward addCollaborator writes uid strings too — but historic docs can still
  // contain objects, so this listener normalizes both forms to a uid, then hydrates
  // each uid to a crewProfile record so the UI has the real name + avatar instead of
  // the previous "Unknown" placeholder.
  useEffect(() => {
    if (!screenplay.id) return;

    debugLog('Setting up real-time collaborators listener for screenplay:', screenplay.id);

    // Guard against stale async work landing after a newer snapshot has arrived.
    let requestToken = 0;

    const collaboratorsUnsubscribe = onSnapshot(
      doc(db, 'screenplays', screenplay.id),
      async (docSnap) => {
        const myToken = ++requestToken;

        if (!docSnap.exists()) {
          setCollaborators([]);
          return;
        }
        const data = docSnap.data();
        const rawTeamMembers: any[] = Array.isArray(data.teamMembers) ? data.teamMembers : [];

        const uids = Array.from(new Set(
          rawTeamMembers
            .map(entry => {
              if (typeof entry === 'string') return entry;
              if (entry && typeof entry === 'object') return entry.id || entry.userId || '';
              return '';
            })
            .filter(Boolean)
        )) as string[];

        if (uids.length === 0) {
          if (myToken !== requestToken) return;
          setCollaborators([]);
          return;
        }

        const profiles: Array<{ id: string; name: string; email: string; avatar: string; role: string }> = [];
        const crewProfilesRef = collection(db, 'crewProfiles');
        try {
          for (let i = 0; i < uids.length; i += 10) {
            const chunk = uids.slice(i, i + 10);
            const q = query(crewProfilesRef, where('uid', 'in', chunk));
            const snap = await getDocs(q);
            snap.docs.forEach(d => {
              const p: any = d.data();
              profiles.push({
                id: d.id,
                name: p.name || p.displayName || `Crew Member ${d.id.slice(-4)}`,
                email: p.email || '',
                avatar: p.profileImageUrl || p.avatarUrl || '',
                role: p.jobTitles?.[0]?.title || 'Crew Member'
              });
            });
          }
        } catch (err) {
          console.error('Failed to hydrate collaborator profiles:', err);
        }

        // Include any uids we couldn't find a profile for, with a stable identifier
        // (last 4 chars of uid) instead of "Unknown".
        const foundIds = new Set(profiles.map(p => p.id));
        uids.forEach(uid => {
          if (!foundIds.has(uid)) {
            profiles.push({
              id: uid,
              name: `Crew Member ${uid.slice(-4)}`,
              email: '',
              avatar: '',
              role: 'Crew Member'
            });
          }
        });

        if (myToken !== requestToken) return;
        setCollaborators(profiles);
      },
      (error) => {
        console.error('Error listening to collaborators:', error);
        setCollaborators([]);
      }
    );

    return () => {
      debugLog('Cleaning up collaborators listener');
      collaboratorsUnsubscribe();
    };
  }, [screenplay.id]);

  // Fetch current user's followers and following on mount
  useEffect(() => {
    const fetchFollows = async () => {
      if (!currentUser) return;
      try {
        // Get user's followers and following from social data using crewProfiles
        const crewDoc = await getDoc(doc(db, 'crewProfiles', currentUser.uid));
        if (crewDoc.exists()) {
          const data = crewDoc.data();
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
        // Fetch all approved contacts' crew profiles in chunks of 10
        const crewRef = collection(db, 'crewProfiles');
        const approvedChunks = [];
        for (let i = 0; i < approvedContacts.length; i += 10) {
          approvedChunks.push(approvedContacts.slice(i, i + 10));
        }
        for (const chunk of approvedChunks) {
          // Get crew profiles by document ID (which should be the UID)
          const crewDocs = await Promise.all(
            chunk.map(uid => getDoc(doc(crewRef, uid)))
          );
          const validDocs = crewDocs.filter(doc => doc.exists());
          allResults = allResults.concat(validDocs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } else {
        // Fallback: search all crew profiles
        const crewRef = collection(db, 'crewProfiles');
        const snap = await getDocs(crewRef);
        debugLog('[ScreenplayCollabModal] Fallback: found', snap.docs.length, 'crew profiles in Firestore');
        allResults = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (allResults.length === 0) {
          console.warn('[ScreenplayCollabModal] No crew profiles found in Firestore crewProfiles collection.');
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
          name: user.name || user.displayName || `Crew Member ${user.id.slice(-4)}`,
          email: user.email || '',
          avatar: user.profileImageUrl || user.avatarUrl || user.avatar || '',
          role: user.jobTitles?.[0]?.title || user.role || 'Crew Member',
          isFollowing: userFollows.includes(user.id),
          connectionStatus: 'connected',
        }));
      debugLog('[ScreenplayCollabModal] Filtered users after search:', filtered.length, filtered.map(u => u.name));
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
      debugLog('Adding collaborator:', user);
      debugLog('Screenplay ID:', screenplay.id);
      
      // First check if the screenplay document exists
      const screenplayRef = doc(db, 'screenplays', screenplay.id);
      const screenplayDoc = await getDoc(screenplayRef);
      
      if (!screenplayDoc.exists()) {
        throw new Error('Screenplay document not found');
      }
      
      const screenplayData = screenplayDoc.data();
      debugLog('Current screenplay data:', screenplayData);
      
      // teamMembers stores uid strings (aligns with the Firestore rule
      // `teamMembers.hasAny([request.auth.uid])` and with how workspace member sync
      // writes the array). Display metadata is hydrated at read time from crewProfiles.
      debugLog('Adding collaborator uid:', user.id);

      // Update the database
      await updateDoc(screenplayRef, {
        teamMembers: arrayUnion(user.id),
        lastModified: serverTimestamp()
      });

      debugLog('Database updated successfully');

      // Optimistic local update — listener will refresh shortly with hydrated profile data.
      setCollaborators(prev => {
        if (prev.some(c => c.id === user.id)) return prev;
        return [...prev, {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '',
          role: user.role || 'Crew Member'
        }];
      });

      // Show success message
      toast.success(`${user.name} added as collaborator!`);
      // Create notification for the new collaborator
      if (user.id) {
        await addDoc(collection(db, 'notifications'), {
          type: 'collaborator_added',
          message: `You have been added as a collaborator to the screenplay: ${screenplay.id}`,
          timestamp: serverTimestamp(),
          read: false,
          userId: user.id,
          screenplayId: screenplay.id,
          addedBy: currentUser?.uid || '',
        });

        // Send email notification
        await EmailNotificationService.sendCollaboratorAddedEmail(user.id, screenplay.name || screenplay.id, currentUser?.displayName || 'Unknown User');
      }
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
        teamMembers: arrayRemove(userId),
        lastModified: serverTimestamp()
      });
      setCollaborators(collaborators.filter(c => c.id !== userId));
      toast.success('Collaborator removed.');
    } catch (err) {
      toast.error('Failed to remove collaborator.');
    }
  };

  const getReviewActivityVerb = (status: ScreenplayReviewStatus): WorkspaceActivityVerb => {
    switch (status) {
      case 'submitted':
        return 'review_submitted';
      case 'changes_requested':
        return 'review_changes_requested';
      case 'approved':
        return 'review_approved';
      case 'draft':
      default:
        return 'review_returned_to_draft';
    }
  };

  // Close the review loop with notifications (recipient-locale via titleKey/bodyKey).
  // approved / changes_requested -> notify the screenplay author.
  // submitted -> notify the workspace's supervisors (owner-assigned + self-elected).
  // returned_to_draft -> no notification (self-action by the creator).
  // Best-effort: never blocks the status change.
  const notifyReviewStatusChange = async (nextStatus: ScreenplayReviewStatus, note: string = '') => {
    if (!currentUser || !screenplayWorkspaceId) return;
    const actorName = currentUser.displayName || t('screenplay.notifications.fallbackAuthor');
    const screenplayName = screenplay.name || t('screenplay.notifications.fallbackScreenplay');
    const baseDoc = (userId: string, type: string, titleKey: string, bodyKey: string, params: Record<string, unknown>) => ({
      userId,
      type,
      title: t(titleKey, params),
      body: t(bodyKey, params),
      message: t(bodyKey, params),
      titleKey,
      bodyKey,
      i18nParams: params,
      isRead: false,
      read: false,
      createdAt: serverTimestamp(),
      timestamp: serverTimestamp(),
      senderId: currentUser.uid,
      senderName: actorName,
      relatedId: screenplay.id,
      link: '/collaboration',
      metadata: { screenplayId: screenplay.id, screenplayName, workspaceId: screenplayWorkspaceId }
    });
    try {
      if (nextStatus === 'approved' || nextStatus === 'changes_requested') {
        if (screenplayUploadedBy && screenplayUploadedBy !== currentUser.uid) {
          const key = nextStatus === 'approved' ? 'reviewApproved' : 'reviewChangesRequested';
          const trimmedNote = note.trim();
          const useNoteVariant = nextStatus === 'changes_requested' && trimmedNote.length > 0;
          const bodyKeyName = useNoteVariant ? 'bodyWithNote' : 'body';
          await addDoc(collection(db, 'notifications'), baseDoc(
            screenplayUploadedBy,
            `review_${nextStatus}`,
            `screenplay.notifications.${key}.title`,
            `screenplay.notifications.${key}.${bodyKeyName}`,
            { reviewer: actorName, screenplay: screenplayName, note: trimmedNote }
          ));
        }
      } else if (nextStatus === 'submitted') {
        const wsSnap = await getDoc(doc(db, 'workspaces', screenplayWorkspaceId));
        const data = wsSnap.exists() ? wsSnap.data() : {};
        const supervisorIds = new Set<string>([
          ...(Array.isArray(data.supervisorIds) ? data.supervisorIds : []),
          ...(Array.isArray(data.selfElectedSupervisors) ? data.selfElectedSupervisors : [])
        ]);
        supervisorIds.delete(currentUser.uid);
        await Promise.all([...supervisorIds].map(uid => addDoc(collection(db, 'notifications'), baseDoc(
          uid,
          'review_submitted',
          'screenplay.notifications.reviewSubmitted.title',
          'screenplay.notifications.reviewSubmitted.body',
          { author: actorName, screenplay: screenplayName }
        ))));
      }
    } catch (err) {
      console.error('Failed to write review-status notification:', err);
    }
  };

  const handleReviewStatusChange = async (nextStatus: ScreenplayReviewStatus, note: string = '') => {
    if (!currentUser) {
      toast.error(t('collaboration.reviewStatus.toasts.signIn'));
      return;
    }
    if (reviewStatus === nextStatus || updatingReviewStatus) return;

    const creatorAllowed = canUpdateReviewAsCreator && (nextStatus === 'draft' || nextStatus === 'submitted');
    const reviewerAllowed = canUpdateReviewAsReviewer && (nextStatus === 'changes_requested' || nextStatus === 'approved');
    if (!creatorAllowed && !reviewerAllowed) {
      toast.error(t('collaboration.reviewStatus.toasts.notAllowed'));
      return;
    }

    // Keep the note only for changes_requested; every other transition clears it.
    const trimmedNote = nextStatus === 'changes_requested' ? note.trim().slice(0, 1000) : '';

    setUpdatingReviewStatus(true);
    try {
      await updateDoc(doc(db, 'screenplays', screenplay.id), {
        reviewStatus: nextStatus,
        reviewStatusUpdatedAt: serverTimestamp(),
        reviewStatusUpdatedBy: currentUser.uid,
        reviewStatusNote: trimmedNote,
        lastModified: serverTimestamp()
      });
      setReviewStatus(nextStatus);
      setReviewStatusNote(trimmedNote);
      setRequestChangesOpen(false);
      setRequestChangesDraft('');
      if (screenplayWorkspaceId) {
        logWorkspaceActivity({
          workspaceId: screenplayWorkspaceId,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: getReviewActivityVerb(nextStatus),
          targetId: screenplay.id,
          targetName: screenplay.name
        });
      }
      // Notify the relevant party (best-effort — never blocks the status change).
      notifyReviewStatusChange(nextStatus, trimmedNote);
      toast.success(t(`collaboration.reviewStatus.toasts.${nextStatus}`));
    } catch (err) {
      console.error('Failed to update review status:', err);
      toast.error(t('collaboration.reviewStatus.toasts.failed'));
    } finally {
      setUpdatingReviewStatus(false);
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
            {!isFountain && (
              <div className="pdf-floating-zoom-controls">
                <button onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}>-</button>
                <span>{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(prev => Math.min(3, prev + 0.2))}>+</button>
              </div>
            )}
            <div
              className="pdf-container"
              ref={pdfContainerRef}
              style={{ position: 'relative' }}
            >
              {isFountain ? (
                <FountainViewer screenplayId={screenplay.id} screenplayName={screenplay.name} initialSource={screenplay.fountainSource} />
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : screenplay.url && !isPdfDocument ? (
                <div className="file-preview-fallback">
                  <div className="fallback-heading">Preview unavailable</div>
                  <p>This file type cannot be previewed in the screenplay annotator.</p>
                  <a href={screenplay.url} target="_blank" rel="noopener noreferrer">
                    Open file
                  </a>
                </div>
              ) : screenplay.url && useNativePdfFallback ? (
                <div className="native-pdf-fallback">
                  <div className="fallback-heading">PDF preview unavailable</div>
                  <p>
                    The embedded PDF renderer could not load this file. Open it directly while Storage CORS is being applied.
                  </p>
                  <a href={screenplay.url} target="_blank" rel="noopener noreferrer">
                    Open PDF
                  </a>
                </div>
              ) : screenplay.url ? (
                <>
                  <Document
                    file={screenplay.url}
                    onLoadSuccess={({ numPages }: { numPages: number }) => {
                      debugLog('PDF loaded successfully, numPages:', numPages);
                      setNumPages(numPages);
                      setLoading(false);
                      setCurrentPage(1);
                    }}
                    onLoadError={(error: Error) => {
                      console.error('Error loading PDF:', error);
                      setUseNativePdfFallback(true);
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
                            <div
                              key={`page_${pageNumber}`}
                              className="page-container"
                              data-page-number={pageNumber}
                              style={{
                                position: 'relative',
                                marginBottom: PDF_PAGE_GAP,
                                // Reserve the same vertical space whether the page is rendered or virtualized,
                                // so toggling visibility on scroll never shifts the scroll position.
                                minHeight: measuredPageHeight,
                                '--page-reserved-height': `${measuredPageHeight}px`
                              } as React.CSSProperties}
                            >
                              {isVisible ? (
                                // The page-frame wrapper is `display: inline-block` so it shrinks to the
                                // Page's actual rendered size. Selection capture stores positions relative
                                // to .react-pdf__Page; rendering the overlays as children of an
                                // inline-block wrapper that ALSO matches the page's box means a `%`
                                // coordinate inside refers to the same coordinate space as capture.
                                // Without this wrapper, overlays render against the wider .page-container
                                // (which is centered-flex), so highlights drift left by half the gutter.
                                <div className="page-frame" style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
                                  <Page
                                    pageNumber={pageNumber}
                                    width={renderedPageWidth}
                                    onLoadSuccess={() => {
                                      debugLog(`Page ${pageNumber} loaded successfully`);
                                      attachSelectionHandlers();
                                    }}
                                    onRenderSuccess={() => {
                                      debugLog(`Page ${pageNumber} rendered successfully`);
                                      attachSelectionHandlers();
                                      // Measure the rendered Page height from the DOM on the first successful render,
                                      // and again whenever the user changes zoom (page-container minHeight needs to
                                      // track the real rendered size, not a 900px guess).
                                      if (pageNumber === 1) {
                                        const node = document.querySelector(`.page-container[data-page-number="${pageNumber}"] .react-pdf__Page`) as HTMLElement | null;
                                        const height = node?.offsetHeight;
                                        if (height && Math.abs(height - measuredPageHeight) > 16) {
                                          setMeasuredPageHeight(height);
                                        }
                                      }
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
                                    const pagePixelHeight = measuredPageHeight;
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
                                            zIndex: 5,
                                            transition: 'all 0.15s ease',
                                            // Let clicks/mouseups fall through to the underlying PDF text layer so the user
                                            // can still select text beneath an existing annotation. The marker (rendered
                                            // separately below) keeps pointer-events to remain clickable.
                                            pointerEvents: 'none',
                                            background: 'none',
                                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
                                          }}
                                          data-element-id={annotation.id}
                                          title={`${t('screenplay.marker.annotation', { user: annotation.userName })}: ${annotation.annotation}`}
                                        />
                                        <div
                                          className="annotation-marker"
                                          role="button"
                                          tabIndex={0}
                                          aria-label={`Open annotation by ${annotation.userName}`}
                                          onMouseDown={e => e.stopPropagation()}
                                          onClick={e => {
                                            e.stopPropagation();
                                            setActiveAnnotation(annotation);
                                            setShowAnnotationPanel(true);
                                            setPanelX(e.clientX);
                                            setPanelY(e.clientY);
                                            setSelectedElement(annotation.id);
                                            setActiveThread(null);
                                          }}
                                          style={{
                                            position: 'absolute',
                                            left: `calc(${annotation.position.x * 100}% + ${annotation.position.width * 100}% - 10px)`,
                                            top: `calc(${annotation.position.y * 100}% - ${verticalPad}px + ${markerOffset}px)`,
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            background: annotation.supervisorAtAuthorTime ? '#f59e0b' : '#EF4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 11,
                                            color: 'white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                                            border: '1px solid white',
                                            cursor: 'pointer',
                                            pointerEvents: 'auto',
                                            zIndex: 10
                                          }}
                                          title={annotation.supervisorAtAuthorTime
                                            ? t('screenplay.marker.supervisorNote', { user: annotation.userName })
                                            : t('screenplay.marker.annotation', { user: annotation.userName })}
                                        >
                                          {annotation.supervisorAtAuthorTime ? '🎓' : '💬'}
                                        </div>
                                      </React.Fragment>
                                    );
                                  })}
                                  {/* Tag Overlays for this page */}
                                  {showOverlays && tags.filter(tag => tag.pageNumber === pageNumber).map(tag => {
                                    const overlayHeight = `${tag.position.height * 100}%`;
                                    const pagePixelHeight = measuredPageHeight;
                                    const heightPx = tag.position.height * pagePixelHeight;
                                    const isSingleLine = heightPx < 32;
                                    const verticalPad = isSingleLine ? 4 : 0;
                                    const markerOffset = isSingleLine ? -18 : -20;
                                    // Supervisor tags use a deeper amber so they pop against regular tags
                                    // without losing the 🏷️ glyph that distinguishes a tag from an annotation.
                                    const tagBaseColor = tag.supervisorAtAuthorTime ? '180, 83, 9' : '245, 158, 11';
                                    const tagPinColor = tag.supervisorAtAuthorTime ? '#b45309' : '#f59e0b';
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
                                            border: isSingleLine ? `1px solid rgba(${tagBaseColor}, 0.45)` : `2px solid rgba(${tagBaseColor}, 0.7)`,
                                            borderRadius: isSingleLine ? 3 : 8,
                                            zIndex: 5,
                                            transition: 'all 0.15s ease',
                                            // Let text selection pass through. The marker (rendered below) is the click target.
                                            pointerEvents: 'none',
                                            background: 'none',
                                            boxShadow: `0 2px 8px rgba(${tagBaseColor}, 0.08)`
                                          }}
                                          data-element-id={tag.id}
                                          title={t('screenplay.marker.tag', { user: tag.userName, content: tag.content })}
                                        />
                                        <div
                                          className="tag-marker"
                                          role="button"
                                          tabIndex={0}
                                          aria-label={`Open tag by ${tag.userName}`}
                                          onMouseDown={e => e.stopPropagation()}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAnnotation(null);
                                            setShowAnnotationPanel(true);
                                            setPanelX(e.clientX);
                                            setPanelY(e.clientY);
                                            setSelectedElement(tag.id);
                                            setActiveThread(null);
                                          }}
                                          style={{
                                            position: 'absolute',
                                            left: `calc(${tag.position.x * 100}% + ${tag.position.width * 100}% - 10px)`,
                                            top: `calc(${tag.position.y * 100}% - ${verticalPad}px + ${markerOffset}px)`,
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            background: tagPinColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 11,
                                            color: 'white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                                            border: '1px solid white',
                                            cursor: 'pointer',
                                            pointerEvents: 'auto',
                                            zIndex: 10
                                          }}
                                          title={t('screenplay.marker.tag', { user: tag.userName, content: tag.content })}
                                        >
                                          🏷️
                                        </div>
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="page-loading" style={{ minHeight: measuredPageHeight }} />
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
                <div
                  className="review-status-panel"
                  style={{
                    margin: '0 0 12px',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    background: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        {t('collaboration.reviewStatus.title')}
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          background: reviewStatus === 'approved' ? '#dcfce7' : reviewStatus === 'changes_requested' ? '#ffedd5' : reviewStatus === 'submitted' ? '#dbeafe' : '#f1f5f9',
                          color: reviewStatus === 'approved' ? '#166534' : reviewStatus === 'changes_requested' ? '#9a3412' : reviewStatus === 'submitted' ? '#1e40af' : '#475569'
                        }}
                      >
                        {t(`collaboration.reviewStatus.labels.${reviewStatus}`)}
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 0', color: '#475569', fontSize: '0.85rem', lineHeight: 1.4 }}>
                    {t(`collaboration.reviewStatus.descriptions.${reviewStatus}`)}
                  </p>
                  {reviewStatus === 'changes_requested' && reviewStatusNote.trim().length > 0 && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '8px 10px',
                        background: '#fff7ed',
                        border: '1px solid #fdba74',
                        borderRadius: 6,
                        fontSize: '0.85rem',
                        color: '#7c2d12',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: 2, color: '#9a3412' }}>
                        {t('collaboration.reviewStatus.noteLabel')}
                      </div>
                      {reviewStatusNote}
                    </div>
                  )}
                  {(canUpdateReviewAsCreator || canUpdateReviewAsReviewer) && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      {canUpdateReviewAsCreator && (reviewStatus === 'draft' || reviewStatus === 'changes_requested') && (
                        <button
                          type="button"
                          className="btn-primary"
                          disabled={updatingReviewStatus}
                          onClick={() => handleReviewStatusChange('submitted')}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                        >
                          {t('collaboration.reviewStatus.actions.submit')}
                        </button>
                      )}
                      {canUpdateReviewAsReviewer && reviewStatus === 'submitted' && (
                        <>
                          <button
                            type="button"
                            className="btn-secondary"
                            disabled={updatingReviewStatus}
                            onClick={() => {
                              setRequestChangesOpen(prev => !prev);
                              setRequestChangesDraft('');
                            }}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                          >
                            {t('collaboration.reviewStatus.actions.requestChanges')}
                          </button>
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={updatingReviewStatus}
                            onClick={() => handleReviewStatusChange('approved')}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                          >
                            {t('collaboration.reviewStatus.actions.approve')}
                          </button>
                        </>
                      )}
                      {canUpdateReviewAsCreator && reviewStatus !== 'draft' && (
                        <button
                          type="button"
                          className="btn-secondary"
                          disabled={updatingReviewStatus}
                          onClick={() => handleReviewStatusChange('draft')}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                        >
                          {t('collaboration.reviewStatus.actions.returnToDraft')}
                        </button>
                      )}
                    </div>
                  )}
                  {canUpdateReviewAsReviewer && reviewStatus === 'submitted' && requestChangesOpen && (
                    <div style={{ marginTop: 10, padding: 10, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                      <label
                        htmlFor="review-changes-note"
                        style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}
                      >
                        {t('collaboration.reviewStatus.notePromptLabel')}
                      </label>
                      <textarea
                        id="review-changes-note"
                        value={requestChangesDraft}
                        onChange={e => setRequestChangesDraft(e.target.value.slice(0, 1000))}
                        placeholder={t('collaboration.reviewStatus.notePlaceholder')}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: 8,
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          fontSize: '0.85rem',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          disabled={updatingReviewStatus}
                          onClick={() => {
                            setRequestChangesOpen(false);
                            setRequestChangesDraft('');
                          }}
                          style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                        >
                          {t('collaboration.reviewStatus.cancel')}
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          disabled={updatingReviewStatus}
                          onClick={() => handleReviewStatusChange('changes_requested', requestChangesDraft)}
                          style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                        >
                          {t('collaboration.reviewStatus.actions.sendChangesRequested')}
                        </button>
                      </div>
                    </div>
                  )}
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
                    <h4>🤝 {t('screenplay.collaborators')} ({collaborators.filter(user => user && user.id && user.name).length})</h4>
                    <div className="collaborators-list">
                      {uniqueCollaborators.length === 0 && <div className="no-collaborators">{t('screenplay.noCollaborators')}</div>}
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
                    <button className="add-collaborator-btn" onClick={() => setShowAddCollaboratorModal(true)}>+ {t('screenplay.addCollaborator')}</button>
                  </div>

                  {/* Annotations List */}
                  <div className="annotations-section">
                    {(() => {
                      const openCount = annotations.filter(a => !a.resolved).length;
                      const mineCount = annotations.filter(a => a.userId === currentUser?.uid).length;
                      const teacherCount = annotations.filter(a => a.supervisorAtAuthorTime === true).length;
                      return (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <h4 style={{ margin: 0 }}>💬 {t('screenplay.annotations')} ({annotations.length})</h4>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={exportTagReport}
                              title={t('screenplay.export.button')}
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.78em',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#1e293b',
                                borderRadius: 6,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              ⬇ {t('screenplay.export.buttonShort')}
                            </button>
                          </div>
                          <div className="annotations-filter-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0 10px' }}>
                            {([
                              { key: 'open', label: t('screenplay.statusFilters.open', { count: openCount }) },
                              { key: 'mine', label: t('screenplay.statusFilters.mine', { count: mineCount }) },
                              { key: 'from_teacher', label: t('screenplay.statusFilters.fromTeacher', { count: teacherCount }) },
                              { key: 'all', label: t('screenplay.statusFilters.all', { count: annotations.length }) }
                            ] as Array<{ key: typeof statusFilter; label: string }>).map(option => {
                              const active = statusFilter === option.key;
                              return (
                                <button
                                  key={option.key}
                                  type="button"
                                  onClick={() => setStatusFilter(option.key)}
                                  style={{
                                    border: '1px solid',
                                    borderColor: active ? '#2563eb' : '#cbd5e1',
                                    background: active ? '#2563eb' : '#ffffff',
                                    color: active ? '#ffffff' : '#1e293b',
                                    borderRadius: 999,
                                    padding: '3px 10px',
                                    fontSize: '0.78em',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                    {isFountain && (
                      <div className="fountain-note-composer" style={{ margin: '0 0 12px' }}>
                        <textarea
                          value={fountainNote}
                          onChange={e => setFountainNote(e.target.value)}
                          placeholder={t('screenplay.fountainNote.placeholder')}
                          rows={3}
                          style={{
                            width: '100%',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            padding: 8,
                            fontSize: 13,
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box'
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                              e.preventDefault();
                              handleAddFountainNote();
                            }
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={addingFountainNote || !fountainNote.trim()}
                            onClick={handleAddFountainNote}
                            style={{ padding: '5px 14px', fontSize: 13 }}
                          >
                            {addingFountainNote ? t('screenplay.fountainNote.adding') : t('screenplay.fountainNote.add')}
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="annotations-list">
                      {annotations
                        .filter(annotation => {
                          if (statusFilter === 'open') return !annotation.resolved;
                          if (statusFilter === 'mine') return annotation.userId === currentUser?.uid;
                          if (statusFilter === 'from_teacher') return annotation.supervisorAtAuthorTime === true;
                          return true;
                        })
                        .map(annotation => (
                        <div key={annotation.id} className={`annotation-item ${annotation.resolved ? 'resolved' : ''} ${annotation.supervisorAtAuthorTime ? 'from-supervisor' : ''}`}>
                          <div className="annotation-header">
                            <div className="annotation-author">
                              {annotation.userAvatar ? (
                                <img src={annotation.userAvatar} alt={annotation.userName} />
                              ) : (
                                <div className="avatar-placeholder">{annotation.userName.charAt(0)}</div>
                              )}
                              <span>{annotation.userName}</span>
                              {annotation.supervisorAtAuthorTime && (
                                <span
                                  title={t('screenplay.supervisorBadge.tooltip')}
                                  style={{
                                    marginLeft: 6,
                                    padding: '1px 6px',
                                    borderRadius: 999,
                                    fontSize: '0.7em',
                                    fontWeight: 700,
                                    background: '#fde68a',
                                    color: '#92400e'
                                  }}
                                >
                                  🎓 {t('screenplay.supervisorBadge.label')}
                                </span>
                              )}
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
                              <span style={{fontSize: '1.1em', marginRight: 2}}>↩</span> {t('screenplay.actions.reply')}
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
                                placeholder={t('screenplay.popup.writeReply')}
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
                              📍 {t('screenplay.actions.goTo')}
                            </button>
                            {(() => {
                              // When a non-supervisor is acting on a supervisor's annotation,
                              // the verb shifts from "resolve" to "mark as addressed" — the
                              // student is acknowledging a teacher note, not closing their own.
                              const isAddressingSupervisor =
                                annotation.supervisorAtAuthorTime === true &&
                                annotation.userId !== currentUser?.uid;
                              return !annotation.resolved ? (
                                <button
                                  onClick={() => toggleElementResolved(annotation.id, 'annotation')}
                                  className="action-btn"
                                >
                                  ✅ {isAddressingSupervisor
                                    ? t('screenplay.actions.markAddressed')
                                    : t('screenplay.actions.resolve')}
                                </button>
                              ) : (
                                <button
                                  onClick={() => toggleElementResolved(annotation.id, 'annotation')}
                                  className="action-btn"
                                >
                                  🔄 {isAddressingSupervisor
                                    ? t('screenplay.actions.reopenAddressed')
                                    : t('screenplay.actions.reopen')}
                                </button>
                              );
                            })()}
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteElement(annotation.id, 'annotation'); }}
                              className="action-btn delete"
                            >
                              🗑️ {t('screenplay.actions.delete')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags List */}
                  <div className="tags-section">
                    <h4>🏷️ {t('screenplay.tags')} ({tags.length})</h4>
                    <div className="tags-list">
                      {tags.map(tag => (
                        <div key={tag.id} className={`tag-item ${tag.resolved ? 'resolved' : ''} ${tag.supervisorAtAuthorTime ? 'from-supervisor' : ''}`}>
                          <div className="tag-header">
                            <div className="tag-author">
                              {tag.userAvatar ? (
                                <img src={tag.userAvatar} alt={tag.userName} />
                              ) : (
                                <div className="avatar-placeholder">{tag.userName.charAt(0)}</div>
                              )}
                              <span>{tag.userName}</span>
                              {tag.supervisorAtAuthorTime && (
                                <span
                                  title={t('screenplay.supervisorBadge.tooltip')}
                                  style={{
                                    marginLeft: 6,
                                    padding: '1px 6px',
                                    borderRadius: 999,
                                    fontSize: '0.7em',
                                    fontWeight: 700,
                                    background: '#fde68a',
                                    color: '#92400e'
                                  }}
                                >
                                  🎓 {t('screenplay.supervisorBadge.label')}
                                </span>
                              )}
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
                              📍 {t('screenplay.actions.goTo')}
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleElementResolved(tag.id, 'tag'); }}
                              className={`action-btn ${tag.resolved ? 'resolved' : ''}`}
                            >
                              {tag.resolved ? `🔄 ${t('screenplay.actions.reopen')}` : `✅ ${t('screenplay.actions.resolve')}`}
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteElement(tag.id, 'tag'); }}
                              className="action-btn delete"
                            >
                              🗑️ {t('screenplay.actions.delete')}
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
            <span>{t('screenplay.navigation.navigatingTo')}</span>
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
              // Default cursor on the popup body so inputs/buttons/selects behave normally.
              // Only the header drags the popup (see below).
            }}
          >
            <div
              className="popup-header"
              onMouseDown={handlePopupMouseDown}
              style={{
                fontWeight: 600,
                color: '#374151',
                marginBottom: 8,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              title={t('screenplay.popupHeader.dragToMove')}
            >
              <span aria-hidden="true" style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1 }}>⠿</span>
              {popupType === 'annotation' ? t('screenplay.popup.addAnnotation') : popupType === 'tag' ? t('screenplay.popup.addTag') : t('screenplay.popup.addToSelection')}
            </div>
            {popupType === 'annotation' && (
              <textarea
                placeholder={t('screenplay.popup.enterAnnotation')}
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
                  <option value="cast_member">{t('screenplay.categories.cast_member')}</option>
                  <option value="background_actors">{t('screenplay.categories.background_actors')}</option>
                  <option value="stunts">{t('screenplay.categories.stunts')}</option>
                  <option value="vehicles">{t('screenplay.categories.vehicles')}</option>
                  <option value="props">{t('screenplay.categories.props')}</option>
                  <option value="camera">{t('screenplay.categories.camera')}</option>
                  <option value="special_effects">{t('screenplay.categories.special_effects')}</option>
                  <option value="wardrobe">{t('screenplay.categories.wardrobe')}</option>
                  <option value="makeup_hair">{t('screenplay.categories.makeup_hair')}</option>
                  <option value="animals">{t('screenplay.categories.animals')}</option>
                  <option value="animal_wrangler">{t('screenplay.categories.animal_wrangler')}</option>
                  <option value="music">{t('screenplay.categories.music')}</option>
                  <option value="sound">{t('screenplay.categories.sound')}</option>
                  <option value="art_department">{t('screenplay.categories.art_department')}</option>
                  <option value="set_dressing">{t('screenplay.categories.set_dressing')}</option>
                  <option value="greenery">{t('screenplay.categories.greenery')}</option>
                  <option value="special_equipment">{t('screenplay.categories.special_equipment')}</option>
                  <option value="security">{t('screenplay.categories.security')}</option>
                  <option value="additional_labor">{t('screenplay.categories.additional_labor')}</option>
                  <option value="vfx">{t('screenplay.categories.vfx')}</option>
                  <option value="mechanical_effects">{t('screenplay.categories.mechanical_effects')}</option>
                  <option value="miscellaneous">{t('screenplay.categories.miscellaneous')}</option>
                  <option value="notes">{t('screenplay.categories.notes')}</option>
                  <option value="comments">{t('screenplay.categories.comments')}</option>
                  <option value="set">{t('screenplay.categories.set')}</option>
                  <option value="sequence">{t('screenplay.categories.sequence')}</option>
                  <option value="script_day">{t('screenplay.categories.script_day')}</option>
                  <option value="unit">{t('screenplay.categories.unit')}</option>
                  <option value="location">{t('screenplay.categories.location')}</option>
                  <option value="other">{t('screenplay.categories.other')}</option>
                </select>
                <input
                  type="text"
                  placeholder={t('screenplay.popup.enterTag')}
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
                  💬 {t('screenplay.popup.addAnnotation')}
                </button>
                <button
                  onClick={() => {
                    setPopupType('tag');
                    setNewTag('');
                  }}
                  style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: 6, padding: '8px 12px', fontSize: 13, cursor: 'pointer', transition: 'background 0.2s ease' }}
                >
                  🏷️ {t('screenplay.popup.addTag')}
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
                  {t('screenplay.popup.cancel')}
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
                  {t('screenplay.popup.cancel')}
                </button>
                <button
                  onClick={() => createAnnotation(popupType as 'annotation' | 'tag')}
                  disabled={popupType === 'annotation' ? !annotationInput.trim() : !newTag.trim()}
                  style={{ background: (popupType === 'annotation' ? annotationInput.trim() : newTag.trim()) ? (popupType === 'annotation' ? '#3b82f6' : '#f59e0b') : '#9ca3af', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: (popupType === 'annotation' ? annotationInput.trim() : newTag.trim()) ? 'pointer' : 'not-allowed' }}
                >
                  {t('screenplay.popup.save')} {popupType === 'annotation' ? '(Ctrl+Enter)' : '(Enter)'}
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
