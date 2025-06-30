import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Document, Page, pdfjs } from 'react-pdf';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import './ScreenplayViewer.scss';

// Set up PDF.js worker
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

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  timestamp: Date;
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
  timestamp: Date;
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

const ScreenplayViewer: React.FC<ScreenplayViewerProps> = ({ screenplay, projectId, onClose, onGenerateReport }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTagType, setSelectedTagType] = useState<Tag['tagType']>('character');
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.2);
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'comment' | 'tag' | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [session, setSession] = useState<ScreenplaySession | null>(null);
  const [activeUsers, setActiveUsers] = useState<ScreenplaySession['activeUsers']>([]);
  const [viewMode, setViewMode] = useState<'single' | 'split' | 'fullscreen'>('single');
  const [filterType, setFilterType] = useState<'all' | 'comments' | 'tags' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'page' | 'type' | 'user'>('time');
  const [showUserCursors, setShowUserCursors] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  
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
    initializeSession();
    loadComments();
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
    // Real-time comments sync
    const commentsQuery = query(
      collection(db, 'screenplayComments'),
      where('screenplayId', '==', screenplay.id),
      orderBy('timestamp', 'desc')
    );

    const commentsUnsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Comment[];
      setComments(commentsData);
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
        timestamp: doc.data().timestamp.toDate()
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
        commentsUnsubscribe();
        tagsUnsubscribe();
        sessionUnsubscribe();
      };
    }

    return () => {
      commentsUnsubscribe();
      tagsUnsubscribe();
    };
  };

  const loadComments = async () => {
    try {
      const q = query(
        collection(db, 'screenplayComments'),
        where('screenplayId', '==', screenplay.id),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Comment[];
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadTags = async () => {
    try {
      const q = query(
        collection(db, 'screenplayTags'),
        where('screenplayId', '==', screenplay.id),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tagsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Tag[];
      
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const addComment = async (position: { x: number; y: number; width: number; height: number }) => {
    if (!newComment.trim()) return;

    try {
      const commentData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        userAvatar: currentUser?.photoURL || '',
        comment: newComment.trim(),
        timestamp: new Date(),
        projectId: projectId,
        pageNumber: currentPage,
        position,
        replies: [],
        resolved: false,
        priority: 'medium' as const
      };

      await addDoc(collection(db, 'screenplayComments'), commentData);
      setNewComment('');
      setDrawingMode(null);
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
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
        pageNumber: currentPage,
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
        ctx.strokeStyle = drawingMode === 'comment' ? '#3B82F6' : tagColors[selectedTagType];
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

    if (drawingMode === 'comment') {
      addComment(position);
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

  const navigateToElement = (element: Comment | Tag) => {
    setCurrentPage(element.pageNumber);
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

  const toggleElementResolved = async (elementId: string, type: 'comment' | 'tag') => {
    try {
      const collectionName = type === 'comment' ? 'screenplayComments' : 'screenplayTags';
      const elementRef = doc(db, collectionName, elementId);
      const element = type === 'comment' 
        ? comments.find(c => c.id === elementId)
        : tags.find(t => t.id === elementId);
      
      if (element) {
        await updateDoc(elementRef, { resolved: !element.resolved });
        toast.success(`${type === 'comment' ? 'Comment' : 'Tag'} ${element.resolved ? 'reopened' : 'resolved'}!`);
      }
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
      toast.error(`Failed to update ${type}`);
    }
  };

  const deleteElement = async (elementId: string, type: 'comment' | 'tag') => {
    try {
      const collectionName = type === 'comment' ? 'screenplayComments' : 'screenplayTags';
      await deleteDoc(doc(db, collectionName, elementId));
      toast.success(`${type === 'comment' ? 'Comment' : 'Tag'} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
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
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredComments = useMemo(() => {
    let filtered = comments;
    
    if (filterType === 'comments') {
      filtered = comments;
    } else if (filterType === 'tags') {
      filtered = [];
    } else if (filterType === 'resolved') {
      filtered = comments.filter(c => c.resolved);
    }

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'time':
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      case 'page':
        return filtered.sort((a, b) => a.pageNumber - b.pageNumber);
      case 'user':
        return filtered.sort((a, b) => a.userName.localeCompare(b.userName));
      default:
        return filtered;
    }
  }, [comments, filterType, searchQuery, sortBy]);

  const filteredTags = useMemo(() => {
    let filtered = tags;
    
    if (filterType === 'comments') {
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
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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

  const pageComments = useMemo(() => 
    comments.filter(c => c.pageNumber === currentPage), 
    [comments, currentPage]
  );

  const pageTags = useMemo(() => 
    tags.filter(t => t.pageNumber === currentPage), 
    [tags, currentPage]
  );

  return (
    <div className="screenplay-viewer-overlay">
      <div className={`screenplay-viewer ${viewMode}`}>
        {/* Enhanced Header */}
        <div className="viewer-header">
          <div className="header-left">
            <h2>{screenplay.name}</h2>
            <div className="file-info">
              <span className="file-type">{screenplay.type}</span>
              <span className="page-info">Page {currentPage} of {numPages}</span>
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
                onClick={() => setDrawingMode(drawingMode === 'comment' ? null : 'comment')}
                className={`draw-btn ${drawingMode === 'comment' ? 'active' : ''}`}
              >
                💬 Comment
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
              <div className="navigation-controls">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  className="nav-btn"
                >
                  ◀ Previous
                </button>
                <span className="page-display">
                  {currentPage} / {numPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(numPages || 1, prev + 1))}
                  disabled={currentPage >= (numPages || 1)}
                  className="nav-btn"
                >
                  Next ▶
                </button>
              </div>
              
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
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading screenplay...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p className="error-message">{error}</p>
                  <button onClick={() => window.location.reload()} className="retry-button">
                    Retry Loading
                  </button>
                </div>
              ) : (
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
                  >
                    <Page 
                      pageNumber={currentPage} 
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
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
                      {/* Comment Overlays */}
                      {pageComments.map(comment => (
                        <div
                          key={`comment-${comment.id}`}
                          className={`comment-overlay ${selectedElement === comment.id ? 'selected' : ''} ${comment.resolved ? 'resolved' : ''}`}
                          style={{
                            position: 'absolute',
                            left: comment.position.x * scale,
                            top: comment.position.y * scale,
                            width: comment.position.width * scale,
                            height: comment.position.height * scale,
                            border: `2px solid ${comment.priority ? priorityColors[comment.priority] : '#3B82F6'}`,
                            backgroundColor: `${comment.priority ? priorityColors[comment.priority] : '#3B82F6'}20`,
                            cursor: 'pointer',
                            zIndex: 5
                          }}
                          data-element-id={comment.id}
                          onClick={() => navigateToElement(comment)}
                          title={`Comment by ${comment.userName}: ${comment.comment}`}
                        >
                          <div className="overlay-icon">💬</div>
                        </div>
                      ))}

                      {/* Tag Overlays */}
                      {pageTags.map(tag => (
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
                    <option value="comments">Comments</option>
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
                          <span className="user-page">Page {user.currentPage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments List */}
                <div className="comments-section">
                  <h4>💬 Comments ({filteredComments.length})</h4>
                  <div className="comments-list">
                    {filteredComments.map(comment => (
                      <div key={comment.id} className={`comment-item ${comment.resolved ? 'resolved' : ''}`}>
                        <div className="comment-header">
                          <div className="comment-author">
                            {comment.userAvatar ? (
                              <img src={comment.userAvatar} alt={comment.userName} />
                            ) : (
                              <div className="avatar-placeholder">{comment.userName.charAt(0)}</div>
                            )}
                            <span>{comment.userName}</span>
                          </div>
                          <div className="comment-meta">
                            <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                            <span className="comment-page">Page {comment.pageNumber}</span>
                          </div>
                        </div>
                        <div className="comment-content">{comment.comment}</div>
                        <div className="comment-actions">
                          <button onClick={() => navigateToElement(comment)} className="action-btn">
                            📍 Go to
                          </button>
                          <button 
                            onClick={() => toggleElementResolved(comment.id, 'comment')}
                            className={`action-btn ${comment.resolved ? 'resolved' : ''}`}
                          >
                            {comment.resolved ? '🔄 Reopen' : '✅ Resolve'}
                          </button>
                          <button 
                            onClick={() => deleteElement(comment.id, 'comment')}
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
                            <span className="tag-time">{formatTimeAgo(tag.timestamp)}</span>
                            <span className="tag-page">Page {tag.pageNumber}</span>
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
              {drawingMode === 'comment' ? '💬' : '🏷️'} 
              Click and drag to create a {drawingMode === 'comment' ? 'comment' : 'tag'} area
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenplayViewer; 