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

const handleAddReply = () => {
  // TODO: Implement reply logic
};

const handleRemoveTag = (tagContent: string) => {
  // TODO: Implement tag removal logic
};

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
  const [annotationPopup, setAnnotationPopup] = useState<{
    pageNumber: number;
    x: number;
    y: number;
    position: { x: number; y: number; width: number; height: number };
  } | null>(null);
  const [annotationInput, setAnnotationInput] = useState('');
  const [activeThread, setActiveThread] = useState<Annotation | null>(null);
  const [showAnnotationSidebar, setShowAnnotationSidebar] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
  const [newReply, setNewReply] = useState('');
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [panelX, setPanelX] = useState(0);
  const [panelY, setPanelY] = useState(0);
  const [drawingPage, setDrawingPage] = useState<number | null>(null);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPage, setSelectionPage] = useState<number | null>(null);
  const [showSelectionPopup, setShowSelectionPopup] = useState(false);
  const [popupType, setPopupType] = useState<'annotation' | 'tag' | null>(null);
  
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

  const addAnnotation = async (position: { x: number; y: number; width: number; height: number }, pageNumber: number) => {
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

  const addTag = async (position: { x: number; y: number; width: number; height: number }, pageNumber: number) => {
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

  const handleTextSelection = (e: MouseEvent, pageNumber: number) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionRect(rect);
      setSelectedText(selection.toString());
      setSelectionPage(pageNumber);
      setShowSelectionPopup(true);
    } else {
      setShowSelectionPopup(false);
      setSelectedText('');
      setSelectionRect(null);
      setSelectionPage(null);
    }
  };

  // Attach selection handler to each PDF page
  useEffect(() => {
    const pdfPages = document.querySelectorAll('.react-pdf__Page');
    pdfPages.forEach((page, idx) => {
      page.addEventListener('mouseup', function (e) { handleTextSelection(e as MouseEvent, idx + 1); });
    });
    return () => {
      pdfPages.forEach((page, idx) => {
        page.removeEventListener('mouseup', function (e) { handleTextSelection(e as MouseEvent, idx + 1); });
      });
    };
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
                                    onClick={(e) => {
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
                      {annotations.map(annotation => (
                        <div
                          key={`annotation-${annotation.id}`}
                          className={`annotation-overlay ${selectedElement === annotation.id ? 'selected' : ''} ${annotation.resolved ? 'resolved' : ''}`}
                          style={{
                            position: 'absolute',
                            left: `${annotation.position.x * 100}%`,
                            top: `${annotation.position.y * 100}%`,
                            width: `${annotation.position.width * 100}%`,
                            height: `${annotation.position.height * 100}%`,
                            border: `2px solid ${annotation.priority ? priorityColors[annotation.priority] : '#3B82F6'}`,
                            backgroundColor: `${annotation.priority ? priorityColors[annotation.priority] : '#3B82F6'}20`,
                            cursor: 'pointer',
                            zIndex: 5
                          }}
                          data-element-id={annotation.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElement(annotation.id);
                          }}
                          title={`Annotation by ${annotation.userName}: ${annotation.annotation}`}
                        >
                          <div className="overlay-icon">💬</div>
                        </div>
                      ))}

                      {/* Tag Overlays */}
                      {tags.map(tag => (
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
                            backgroundColor: `${tag.color}20`,
                            cursor: 'pointer',
                            zIndex: 5
                          }}
                          data-element-id={tag.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElement(tag.id);
                          }}
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
                            onClick={(e) => { e.stopPropagation(); setSelectedElement(annotation.id); }}
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
                            onClick={(e) => { e.stopPropagation(); setSelectedElement(tag.id); }}
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
            </div>
          )}
        </div>

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

        {/* Selection Popup */}
        {showSelectionPopup && selectionRect && (
          <div
            className="selection-popup"
            style={{
              position: 'fixed',
              top: selectionRect.bottom + 8,
              left: selectionRect.left,
              zIndex: 2000,
              background: 'white',
              border: '1px solid #eee',
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: '0.5rem 1rem',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <button onClick={() => { setPopupType('annotation'); setShowSelectionPopup(false); }}>Add Annotation</button>
            <button onClick={() => { setPopupType('tag'); setShowSelectionPopup(false); }}>Add Tag</button>
          </div>
        )}

        {/* Inline annotation/tag input popup */}
        {popupType === 'annotation' && selectionRect && (
          <div
            className="annotation-input-popup"
            style={{
              position: 'fixed',
              top: selectionRect.bottom + 8,
              left: selectionRect.left,
              zIndex: 2000,
              background: 'white',
              border: '1px solid #eee',
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: '1rem',
              minWidth: 300,
            }}
          >
            <h4>Add Annotation</h4>
            <textarea
              placeholder="Enter your annotation..."
              value={annotationInput}
              onChange={e => setAnnotationInput(e.target.value)}
              rows={3}
              style={{ width: '100%', marginBottom: 8 }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setPopupType(null); setAnnotationInput(''); }}>Cancel</button>
              <button onClick={() => { setPopupType(null); setAnnotationInput(''); }}>Save</button>
            </div>
          </div>
        )}
        {popupType === 'tag' && selectionRect && (
          <div
            className="tag-input-popup"
            style={{
              position: 'fixed',
              top: selectionRect.bottom + 8,
              left: selectionRect.left,
              zIndex: 2000,
              background: 'white',
              border: '1px solid #eee',
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: '1rem',
              minWidth: 300,
            }}
          >
            <h4>Add Tag</h4>
            <input
              type="text"
              placeholder="Enter tag..."
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              style={{ width: '100%', marginBottom: 8 }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setPopupType(null); setNewTag(''); }}>Cancel</button>
              <button onClick={() => { setPopupType(null); setNewTag(''); }}>Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenplayViewer; 