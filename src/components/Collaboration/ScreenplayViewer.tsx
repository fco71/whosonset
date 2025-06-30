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
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'annotation' | 'tag' | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [session, setSession] = useState<ScreenplaySession | null>(null);
  const [activeUsers, setActiveUsers] = useState<ScreenplaySession['activeUsers']>([]);
  const [viewMode, setViewMode] = useState<'single' | 'split' | 'fullscreen'>('single');
  const [filterType, setFilterType] = useState<'all' | 'annotations' | 'tags' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'page' | 'type' | 'user'>('time');
  const [showUserCursors, setShowUserCursors] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [annotationPopup, setAnnotationPopup] = useState<{
    pageNumber: number;
    x: number;
    y: number;
  } | null>(null);
  const [annotationInput, setAnnotationInput] = useState('');
  const [activeThread, setActiveThread] = useState<Annotation | null>(null);
  const [showAnnotationSidebar, setShowAnnotationSidebar] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
  const [newReply, setNewReply] = useState('');
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [panelX, setPanelX] = useState(0);
  const [panelY, setPanelY] = useState(0);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);

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

  const addAnnotation = async (position: { x: number; y: number; width: number; height: number }) => {
    if (!newAnnotation.trim()) return;

    try {
      const annotationData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        userAvatar: currentUser?.photoURL || '',
        annotation: newAnnotation.trim(),
        timestamp: new Date(),
        projectId: projectId,
        pageNumber: 1,
        position,
        replies: [],
        resolved: false,
        priority: 'medium' as const
      };

      await addDoc(collection(db, 'screenplayAnnotations'), annotationData);
      setNewAnnotation('');
      setDrawingMode(null);
      toast.success('Annotation added successfully!');
    } catch (error) {
      console.error('Error adding annotation:', error);
      toast.error('Failed to add annotation');
    }
  };

  const addTag = async (position: { x: number; y: number; width: number; height: number }) => {
    if (!newTag.trim()) return;

    try {
      const tagData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        userAvatar: currentUser?.photoURL || '',
        tagType: selectedTagType,
        content: newTag.trim(),
        timestamp: new Date(),
        projectId: projectId,
        pageNumber: 1,
        position,
        color: tagColors[selectedTagType],
        resolved: false
      };

      await addDoc(collection(db, 'screenplayTags'), tagData);
      setNewTag('');
      setDrawingMode(null);
      toast.success('Tag added successfully!');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!drawingMode || !pdfContainerRef.current) return;

    setIsDrawing(true);
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    setMousePosition({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !pdfContainerRef.current) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Update drawing canvas
    if (drawingCanvasRef.current) {
      const ctx = drawingCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
        ctx.strokeStyle = drawingMode === 'annotation' ? '#3B82F6' : tagColors[selectedTagType];
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          mousePosition.x,
          mousePosition.y,
          x - mousePosition.x,
          y - mousePosition.y
        );
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !pdfContainerRef.current) return;

    setIsDrawing(false);
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const position = {
      x: Math.min(mousePosition.x, x),
      y: Math.min(mousePosition.y, y),
      width: Math.abs(x - mousePosition.x),
      height: Math.abs(y - mousePosition.y)
    };

    if (drawingMode === 'annotation') {
      addAnnotation(position);
    } else if (drawingMode === 'tag') {
      addTag(position);
    }

    // Clear drawing canvas
    if (drawingCanvasRef.current) {
      const ctx = drawingCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
      }
    }
  };

  const navigateToElement = (element: Annotation | Tag) => {
    setSelectedElement(element.id);
    
    // Scroll to the element position
    setTimeout(() => {
      if (pdfContainerRef.current) {
        const elementDiv = pdfContainerRef.current.querySelector(`[data-element-id="${element.id}"]`);
        if (elementDiv) {
          elementDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 100);

    // Clear selection after 3 seconds
    setTimeout(() => setSelectedElement(null), 3000);
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully, numPages:', numPages);
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF document');
    setLoading(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - toDate(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredAnnotations = useMemo(() => {
    let filtered = annotations;
    
    if (filterType === 'annotations') {
      filtered = annotations;
    } else if (filterType === 'tags') {
      filtered = [];
    } else if (filterType === 'resolved') {
      filtered = annotations.filter(c => c.resolved);
    }

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.annotation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'time':
        return filtered.sort((a, b) => toDate(b.timestamp).getTime() - toDate(a.timestamp).getTime());
      case 'page':
        return filtered.sort((a, b) => a.pageNumber - b.pageNumber);
      case 'user':
        return filtered.sort((a, b) => a.userName.localeCompare(b.userName));
      default:
        return filtered;
    }
  }, [annotations, filterType, searchQuery, sortBy]);

  const filteredTags = useMemo(() => {
    let filtered = tags;
    
    if (filterType === 'annotations') {
      filtered = [];
    } else if (filterType === 'tags') {
      filtered = tags;
    } else if (filterType === 'resolved') {
      filtered = tags.filter(t => t.resolved);
    }

    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tagType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'time':
        return filtered.sort((a, b) => toDate(b.timestamp).getTime() - toDate(a.timestamp).getTime());
      case 'page':
        return filtered.sort((a, b) => a.pageNumber - b.pageNumber);
      case 'type':
        return filtered.sort((a, b) => a.tagType.localeCompare(b.tagType));
      case 'user':
        return filtered.sort((a, b) => a.userName.localeCompare(b.userName));
      default:
        return filtered;
    }
  }, [tags, filterType, searchQuery, sortBy]);

  const handleAddTag = () => {
    if (!newTag.trim()) return;

    try {
      const tagData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        userAvatar: currentUser?.photoURL || '',
        tagType: selectedTagType,
        content: newTag.trim(),
        timestamp: new Date(),
        projectId: projectId,
        pageNumber: 1,
        position: { x: 0, y: 0, width: 0, height: 0 },
        color: tagColors[selectedTagType],
        resolved: false
      };

      addTag(tagData.position);
      setNewTag('');
      setDrawingMode(null);
      toast.success('Tag added successfully!');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const handleRemoveTag = (tag: string) => {
    // Implement the logic to remove a tag from the activeAnnotation
    console.log('Removing tag:', tag);
  };

  const handleAddReply = () => {
    if (!newReply.trim()) return;

    try {
      const replyData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        userAvatar: currentUser?.photoURL || '',
        content: newReply.trim(),
        timestamp: new Date()
      };

      // Implement the logic to add a reply to the activeAnnotation
      console.log('Adding reply:', replyData);
      setNewReply('');
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    }
  };

  return (
    <div className="screenplay-viewer-overlay">
      <div className={`screenplay-viewer ${viewMode}`}>
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
            
            <div className="drawing-controls">
              <button
                onClick={() => setDrawingMode(drawingMode === 'annotation' ? null : 'annotation')}
                className={`draw-btn ${drawingMode === 'annotation' ? 'active' : ''}`}
              >
                💬 Annotation
              </button>
              <button
                onClick={() => setDrawingMode(drawingMode === 'tag' ? null : 'tag')}
                className={`draw-btn ${drawingMode === 'tag' ? 'active' : ''}`}
              >
                🏷️ Tag
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
          <div className={`pdf-panel ${viewMode}`}>
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
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {error ? (
                <div className="error-message">{error}</div>
              ) : screenplay.url ? (
                <>
                  <Document
                    file={screenplay.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
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
                          // Additional safety checks
                          if (!numPages || numPages <= 0 || pageNumber <= 0 || pageNumber > numPages) {
                            return null;
                          }
                          
                          return (
                            <div key={`page_${pageNumber}`} className="page-container">
                              <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                onLoadSuccess={() => console.log(`Page ${pageNumber} loaded successfully`)}
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
                              {/* Annotation markers for this page */}
                              {annotations
                                .filter(annotation => annotation.pageNumber === pageNumber)
                                .map((annotation) => (
                                  <div
                                    key={annotation.id}
                                    className="annotation-marker"
                                    style={{
                                      position: 'absolute',
                                      left: `${annotation.position.x * 100}%`,
                                      top: `${annotation.position.y * 100}%`,
                                      transform: 'translate(-50%, -50%)',
                                      zIndex: 10,
                                      cursor: 'pointer',
                                    }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      setActiveAnnotation(annotation);
                                      setShowAnnotationPanel(true);
                                    }}
                                  >
                                    <span className="annotation-dot" />
                                    <div className="annotation-tooltip">
                                      <div className="author">{annotation.userName || 'User'}</div>
                                      <div className="preview">{annotation.annotation.slice(0, 40)}...</div>
                                    </div>
                                  </div>
                                ))}
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
                      {/* Annotation Overlays */}
                      {filteredAnnotations.map(annotation => (
                        <div
                          key={`annotation-${annotation.id}`}
                          className={`annotation-overlay ${selectedElement === annotation.id ? 'selected' : ''} ${annotation.resolved ? 'resolved' : ''}`}
                          style={{
                            position: 'absolute',
                            left: annotation.position.x * scale,
                            top: annotation.position.y * scale,
                            width: annotation.position.width * scale,
                            height: annotation.position.height * scale,
                            border: `2px solid ${annotation.priority ? priorityColors[annotation.priority] : '#3B82F6'}`,
                            backgroundColor: `${annotation.priority ? priorityColors[annotation.priority] : '#3B82F6'}20`,
                            cursor: 'pointer',
                            zIndex: 5
                          }}
                          data-element-id={annotation.id}
                          onClick={() => navigateToElement(annotation)}
                          title={`Annotation by ${annotation.userName}: ${annotation.annotation}`}
                        >
                          <div className="overlay-icon">💬</div>
                        </div>
                      ))}

                      {/* Tag Overlays */}
                      {filteredTags.map(tag => (
                        <div
                          key={`tag-${tag.id}`}
                          className={`tag-overlay ${selectedElement === tag.id ? 'selected' : ''} ${tag.resolved ? 'resolved' : ''}`}
                          style={{
                            position: 'absolute',
                            left: tag.position.x * scale,
                            top: tag.position.y * scale,
                            width: tag.position.width * scale,
                            height: tag.position.height * scale,
                            border: `2px solid ${tag.color}`,
                            backgroundColor: `${tag.color}20`,
                            cursor: 'pointer',
                            zIndex: 5
                          }}
                          data-element-id={tag.id}
                          onClick={() => navigateToElement(tag)}
                          title={`${tag.tagType}: ${tag.content} by ${tag.userName}`}
                        >
                          <div className="overlay-icon" style={{ color: tag.color }}>
                            {tag.tagType === 'character' ? '👤' :
                             tag.tagType === 'location' ? '📍' :
                             tag.tagType === 'prop' ? '🎭' :
                             tag.tagType === 'scene' ? '🎬' :
                             tag.tagType === 'camera' ? '📹' :
                             tag.tagType === 'lighting' ? '💡' :
                             tag.tagType === 'sound' ? '🔊' :
                             tag.tagType === 'budget' ? '💰' :
                             tag.tagType === 'schedule' ? '📅' :
                             '🏷️'}
                          </div>
                        </div>
                      ))}

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

          {/* Collaboration Panel */}
          {(viewMode === 'split' || viewMode === 'fullscreen') && (
            <div className="collaboration-panel">
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
                  <h4>💬 Annotations ({filteredAnnotations.length})</h4>
                  <div className="annotations-list">
                    {filteredAnnotations.map(annotation => (
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
                          <button onClick={() => navigateToElement(annotation)} className="action-btn">
                            📍 Go to
                          </button>
                          <button 
                            onClick={() => toggleElementResolved(annotation.id, 'annotation')}
                            className={`action-btn ${annotation.resolved ? 'resolved' : ''}`}
                          >
                            {annotation.resolved ? '🔄 Reopen' : '✅ Resolve'}
                          </button>
                          <button 
                            onClick={() => deleteElement(annotation.id, 'annotation')}
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
                  <h4>🏷️ Tags ({filteredTags.length})</h4>
                  <div className="tags-list">
                    {filteredTags.map(tag => (
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
                          <button onClick={() => navigateToElement(tag)} className="action-btn">
                            📍 Go to
                          </button>
                          <button 
                            onClick={() => toggleElementResolved(tag.id, 'tag')}
                            className={`action-btn ${tag.resolved ? 'resolved' : ''}`}
                          >
                            {tag.resolved ? '🔄 Reopen' : '✅ Resolve'}
                          </button>
                          <button 
                            onClick={() => deleteElement(tag.id, 'tag')}
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
            </div>
          )}
        </div>

        {/* Drawing Mode Instructions */}
        {drawingMode && (
          <div className="drawing-instructions">
            <p>
              {drawingMode === 'annotation' ? '💬' : '🏷️'} 
              Click and drag to create a {drawingMode === 'annotation' ? 'annotation' : 'tag'} area
            </p>
          </div>
        )}

        {/* Sidebar/popup for annotation thread and tags */}
        {showAnnotationSidebar && activeThread && (
          <div className="annotation-sidebar">
            <button className="close-btn" onClick={() => setShowAnnotationSidebar(false)}>×</button>
            <h4>Annotation</h4>
            <div className="annotation-main-text">{activeThread.annotation}</div>
            <div className="annotation-tags">
              {activeThread.replies?.map((reply, idx) => (
                <span key={idx} className="tag-chip">{reply.content} <button onClick={() => handleRemoveTag(reply.content)}>×</button></span>
              ))}
              <input
                type="text"
                placeholder="Add reply..."
                value={newReply}
                onChange={e => setNewReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddReply()}
              />
              <button onClick={handleAddReply}>Reply</button>
            </div>
            <div className="annotation-thread">
              {activeThread.replies?.map((reply, idx) => (
                <div key={idx} className="annotation-reply">
                  <span className="reply-author">{reply.userName}:</span> {reply.content}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating annotation thread panel */}
        {showAnnotationPanel && activeAnnotation && (
          <div className="annotation-panel" style={{ left: panelX, top: panelY }}>
            <div className="panel-header">
              <span className="author-avatar">{activeAnnotation.userAvatar ? <img src={activeAnnotation.userAvatar} alt="avatar" /> : '👤'}</span>
              <span className="author-name">{activeAnnotation.userName || 'User'}</span>
              <span className="timestamp">{
                activeAnnotation?.timestamp
                  ? (activeAnnotation.timestamp instanceof Date
                      ? activeAnnotation.timestamp.toLocaleString()
                      : typeof activeAnnotation.timestamp === 'object' && 'seconds' in activeAnnotation.timestamp
                        ? new Date(activeAnnotation.timestamp.seconds * 1000).toLocaleString()
                        : '')
                  : ''
              }</span>
              <button className="close-btn" onClick={() => setShowAnnotationPanel(false)}>×</button>
            </div>
            <div className="panel-tags">
              {activeAnnotation.replies?.map(reply => (
                <span key={reply.id} className="tag-chip">{reply.content} <button onClick={() => handleRemoveTag(reply.content)}>×</button></span>
              ))}
              <input
                type="text"
                placeholder="Add reply..."
                value={newReply}
                onChange={e => setNewReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddReply()}
              />
              <button onClick={handleAddReply}>Reply</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenplayViewer; 