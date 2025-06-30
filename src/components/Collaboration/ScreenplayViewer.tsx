import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { Document, Page, pdfjs } from 'react-pdf';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
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
  comment: string;
  timestamp: Date;
  pageNumber?: number;
  lineNumber?: number;
  selection?: string;
  position?: { start: number; end: number };
}

interface Tag {
  id: string;
  userId: string;
  userName: string;
  tagType: 'character' | 'character_arc' | 'character_development' | 'location' | 'set_design' | 'location_detail' | 'prop' | 'costume' | 'makeup' | 'scene' | 'scene_transition' | 'scene_beat' | 'camera' | 'lighting' | 'sound' | 'plot_point' | 'subplot' | 'theme' | 'budget' | 'schedule' | 'logistics' | 'note' | 'revision' | 'research';
  content: string;
  timestamp: Date;
  pageNumber?: number;
  lineNumber?: number;
  selection?: string;
  position?: { start: number; end: number };
  color: string;
}

const ScreenplayViewer: React.FC<ScreenplayViewerProps> = ({ screenplay, projectId, onClose, onGenerateReport }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTagType, setSelectedTagType] = useState<Tag['tagType']>('character');
  const [selectedText, setSelectedText] = useState('');
  const [showCommentPanel, setShowCommentPanel] = useState(true);
  const [showTagPanel, setShowTagPanel] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [screenplayContent, setScreenplayContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'fdx' | 'text'>('text');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'comments' | 'tags' | 'both'>('both');
  const viewerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    console.log('ScreenplayViewer mounted with screenplay:', screenplay);
    determineFileType();
    loadComments();
    loadTags();
  }, [screenplay.id]);

  useEffect(() => {
    console.log('File type changed to:', fileType);
    if (fileType !== 'text') {
      loadScreenplayContent();
    }
  }, [fileType]);

  // Load content for text files immediately
  useEffect(() => {
    if (fileType === 'text') {
      console.log('Loading text content immediately');
      loadScreenplayContent();
    }
  }, [fileType]);

  // Debug panel state changes
  useEffect(() => {
    console.log('Panel state changed:', { showCommentPanel, showTagPanel, activePanel });
  }, [showCommentPanel, showTagPanel, activePanel]);

  const determineFileType = () => {
    const fileName = screenplay.name.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      setFileType('pdf');
    } else if (fileName.endsWith('.fdx')) {
      setFileType('fdx');
    } else {
      setFileType('text');
    }
  };

  const loadScreenplayContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (fileType === 'pdf') {
        // PDF will be handled by react-pdf component
        setLoading(false);
        return;
      } else if (fileType === 'fdx') {
        await loadFDXContent();
      } else {
        await loadTextContent();
      }
    } catch (error) {
      console.error('Error loading screenplay content:', error);
      setError('Failed to load screenplay content');
    } finally {
      setLoading(false);
    }
  };

  const loadFDXContent = async () => {
    try {
      const response = await fetch(screenplay.url);
      const xmlText = await response.text();
      
      // Parse FDX XML to extract screenplay text
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Extract text from FDX structure
      const paragraphs = xmlDoc.querySelectorAll('Paragraph');
      let screenplayText = '';
      
      paragraphs.forEach((paragraph) => {
        const textElements = paragraph.querySelectorAll('Text');
        textElements.forEach((text) => {
          screenplayText += text.textContent + '\n';
        });
        screenplayText += '\n';
      });
      
      setScreenplayContent(screenplayText || 'Unable to parse FDX content');
    } catch (error) {
      console.error('Error parsing FDX:', error);
      setScreenplayContent('Error loading FDX file');
    }
  };

  const loadTextContent = async () => {
    try {
      const response = await fetch(screenplay.url);
      const text = await response.text();
      setScreenplayContent(text);
    } catch (error) {
      console.error('Error loading text content:', error);
      setScreenplayContent('Error loading file content');
    }
  };

  const loadComments = async () => {
    try {
      console.log('Loading comments for screenplay:', screenplay.id);
      const q = query(
        collection(db, 'screenplayComments'),
        where('screenplayId', '==', screenplay.id)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const commentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as Comment[];
        
        commentsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        console.log('Loaded comments:', commentsData);
        setComments(commentsData);
      }, (error) => {
        console.error('Error in comments snapshot:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadTags = async () => {
    try {
      console.log('Loading tags for screenplay:', screenplay.id);
      const q = query(
        collection(db, 'screenplayTags'),
        where('screenplayId', '==', screenplay.id)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tagsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as Tag[];
        
        tagsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        console.log('Loaded tags:', tagsData);
        setTags(tagsData);
      }, (error) => {
        console.error('Error in tags snapshot:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        comment: newComment.trim(),
        timestamp: new Date(),
        projectId: projectId,
        pageNumber: currentPage,
        selection: selectedText
      };

      await addDoc(collection(db, 'screenplayComments'), commentData);
      setNewComment('');
      setSelectedText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) return;

    try {
      const tagData = {
        screenplayId: screenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        tagType: selectedTagType,
        content: newTag.trim(),
        timestamp: new Date(),
        projectId: projectId,
        pageNumber: currentPage,
        selection: selectedText,
        color: tagColors[selectedTagType]
      };

      await addDoc(collection(db, 'screenplayTags'), tagData);
      setNewTag('');
      setSelectedText('');
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      setSelectedText(selectedText);
      console.log('Text selected:', selectedText);
    }
  };

  const clearSelection = () => {
    setSelectedText('');
    window.getSelection()?.removeAllRanges();
  };

  const navigateToComment = useCallback((comment: Comment) => {
    if (comment.selection && contentRef.current) {
      // Find the text in the content and scroll to it
      const content = contentRef.current.textContent || '';
      const index = content.indexOf(comment.selection);
      if (index !== -1) {
        // Create a temporary highlight
        setHighlightedElement(`comment-${comment.id}`);
        setTimeout(() => setHighlightedElement(null), 3000);
        
        // Scroll to the element
        const textNodes = contentRef.current.querySelectorAll('*');
        for (let i = 0; i < textNodes.length; i++) {
          const node = textNodes[i];
          if (node.textContent?.includes(comment.selection)) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          }
        }
      }
    }
  }, []);

  const navigateToTag = useCallback((tag: Tag) => {
    if (tag.selection && contentRef.current) {
      // Find the text in the content and scroll to it
      const content = contentRef.current.textContent || '';
      const index = content.indexOf(tag.selection);
      if (index !== -1) {
        // Create a temporary highlight
        setHighlightedElement(`tag-${tag.id}`);
        setTimeout(() => setHighlightedElement(null), 3000);
        
        // Scroll to the element
        const textNodes = contentRef.current.querySelectorAll('*');
        for (let i = 0; i < textNodes.length; i++) {
          const node = textNodes[i];
          if (node.textContent?.includes(tag.selection)) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          }
        }
      }
    }
  }, []);

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

  const togglePanel = (panel: 'comments' | 'tags') => {
    if (panel === 'comments') {
      setShowCommentPanel(!showCommentPanel);
    } else {
      setShowTagPanel(!showTagPanel);
    }
    
    // Update active panel state
    if (showCommentPanel && showTagPanel) {
      setActivePanel(panel);
    } else if (showCommentPanel && !showTagPanel) {
      setActivePanel('comments');
    } else if (!showCommentPanel && showTagPanel) {
      setActivePanel('tags');
    } else {
      setActivePanel('both');
    }
  };

  const renderScreenplayContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading screenplay...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadScreenplayContent} className="retry-button">
            Retry Loading
          </button>
        </div>
      );
    }

    if (fileType === 'pdf') {
      return (
        <div className="pdf-container">
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
              width={viewerRef.current?.clientWidth ? viewerRef.current.clientWidth - 100 : 600}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
          {numPages && (
            <div className="pdf-navigation">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                className="nav-button"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {numPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
                disabled={currentPage >= numPages}
                className="nav-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div 
        className="screenplay-content"
        onMouseUp={handleTextSelection}
        ref={contentRef}
      >
        <pre className="screenplay-text">{screenplayContent}</pre>
        
        {/* Render highlighted text for comments */}
        {comments.map(comment => (
          comment.selection && (
            <div
              key={`comment-${comment.id}`}
              className={`text-highlight comment-highlight ${highlightedElement === `comment-${comment.id}` ? 'highlighted' : ''}`}
              style={{
                backgroundColor: highlightedElement === `comment-${comment.id}` ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)',
                borderBottom: '2px solid #3b82f6',
                transition: 'all 0.3s ease'
              }}
              title={`Comment by ${comment.userName}: ${comment.comment}`}
              onClick={() => navigateToComment(comment)}
            >
              <span className="highlight-label">💬</span>
            </div>
          )
        ))}
        
        {/* Render highlighted text for tags */}
        {tags.map(tag => (
          tag.selection && (
            <div
              key={`tag-${tag.id}`}
              className={`text-highlight tag-highlight ${highlightedElement === `tag-${tag.id}` ? 'highlighted' : ''}`}
              style={{
                backgroundColor: highlightedElement === `tag-${tag.id}` ? `${tag.color}80` : `${tag.color}40`,
                borderBottom: `2px solid ${tag.color}`,
                transition: 'all 0.3s ease'
              }}
              title={`${tag.tagType}: ${tag.content} by ${tag.userName}`}
              onClick={() => navigateToTag(tag)}
            >
              <span className="highlight-label" style={{ color: tag.color }}>
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
              </span>
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="screenplay-viewer-overlay">
      <div className="screenplay-viewer">
        <div className="viewer-header">
          <div className="header-left">
            <h2>{screenplay.name}</h2>
            <span className="file-type">{screenplay.type}</span>
          </div>
          <div className="header-actions">
            <button
              onClick={() => togglePanel('comments')}
              className={`btn-toggle ${showCommentPanel ? 'active' : ''}`}
            >
              💬 Comments ({comments.length})
            </button>
            <button
              onClick={() => togglePanel('tags')}
              className={`btn-toggle ${showTagPanel ? 'active' : ''}`}
            >
              🏷️ Tags ({tags.length})
            </button>
            {onGenerateReport && (
              <button
                onClick={onGenerateReport}
                className="btn-report"
              >
                📊 Generate Report
              </button>
            )}
            <button onClick={onClose} className="btn-close">
              ×
            </button>
          </div>
        </div>

        <div className="viewer-content">
          <div className={`screenplay-panel ${activePanel === 'both' ? 'with-panels' : activePanel === 'comments' ? 'with-comments' : activePanel === 'tags' ? 'with-tags' : ''}`}>
            {renderScreenplayContent()}
          </div>

          {showCommentPanel && (
            <div className="comment-panel">
              <div className="panel-header">
                <h3>💬 Comments ({comments.length})</h3>
                <button 
                  onClick={() => togglePanel('comments')}
                  className="panel-close"
                >
                  ×
                </button>
              </div>
              <div className="comment-input">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                {selectedText && (
                  <div className="selected-text">
                    <span className="selected-label">Selected:</span>
                    <span className="selected-content">"{selectedText}"</span>
                    <button 
                      onClick={clearSelection}
                      className="clear-selection"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <button onClick={addComment} disabled={!newComment.trim()} className="add-button">
                  Add Comment
                </button>
              </div>
              <div className="comments-list">
                {comments.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <p>No comments yet. Be the first to add one!</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item" onClick={() => navigateToComment(comment)}>
                      <div className="comment-header">
                        <span className="comment-author">{comment.userName}</span>
                        <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                      {comment.selection && (
                        <div className="comment-selection">
                          "{comment.selection}"
                        </div>
                      )}
                      <div className="comment-text">{comment.comment}</div>
                      <div className="comment-actions">
                        <button className="navigate-btn">📍 Go to text</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {showTagPanel && (
            <div className="tag-panel">
              <div className="panel-header">
                <h3>🏷️ Tags ({tags.length})</h3>
                <button 
                  onClick={() => togglePanel('tags')}
                  className="panel-close"
                >
                  ×
                </button>
              </div>
              <div className="tag-input">
                <select
                  value={selectedTagType}
                  onChange={(e) => setSelectedTagType(e.target.value as Tag['tagType'])}
                  className="tag-select"
                >
                  <optgroup label="Character">
                    <option value="character">Character</option>
                    <option value="character_arc">Character Arc</option>
                    <option value="character_development">Character Development</option>
                  </optgroup>
                  <optgroup label="Location">
                    <option value="location">Location</option>
                    <option value="set_design">Set Design</option>
                    <option value="location_detail">Location Detail</option>
                  </optgroup>
                  <optgroup label="Props & Objects">
                    <option value="prop">Prop</option>
                    <option value="costume">Costume</option>
                    <option value="makeup">Makeup</option>
                  </optgroup>
                  <optgroup label="Scene">
                    <option value="scene">Scene</option>
                    <option value="scene_transition">Scene Transition</option>
                    <option value="scene_beat">Scene Beat</option>
                  </optgroup>
                  <optgroup label="Technical">
                    <option value="camera">Camera</option>
                    <option value="lighting">Lighting</option>
                    <option value="sound">Sound</option>
                  </optgroup>
                  <optgroup label="Story Elements">
                    <option value="plot_point">Plot Point</option>
                    <option value="subplot">Subplot</option>
                    <option value="theme">Theme</option>
                  </optgroup>
                  <optgroup label="Production">
                    <option value="budget">Budget</option>
                    <option value="schedule">Schedule</option>
                    <option value="logistics">Logistics</option>
                  </optgroup>
                  <optgroup label="General">
                    <option value="note">Note</option>
                    <option value="revision">Revision</option>
                    <option value="research">Research</option>
                  </optgroup>
                </select>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="tag-input-field"
                />
                {selectedText && (
                  <div className="selected-text">
                    <span className="selected-label">Selected:</span>
                    <span className="selected-content">"{selectedText}"</span>
                    <button 
                      onClick={clearSelection}
                      className="clear-selection"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <button onClick={addTag} disabled={!newTag.trim()} className="add-button">
                  Add Tag
                </button>
              </div>
              <div className="tags-list">
                {tags.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🏷️</div>
                    <p>No tags yet. Add your first tag!</p>
                  </div>
                ) : (
                  tags.map(tag => (
                    <div key={tag.id} className="tag-item" onClick={() => navigateToTag(tag)}>
                      <div className="tag-header">
                        <span 
                          className="tag-type"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.tagType}
                        </span>
                        <span className="tag-author">{tag.userName}</span>
                        <span className="tag-time">{formatTimeAgo(tag.timestamp)}</span>
                      </div>
                      {tag.selection && (
                        <div className="tag-selection">
                          "{tag.selection}"
                        </div>
                      )}
                      <div className="tag-content">{tag.content}</div>
                      <div className="tag-actions">
                        <button className="navigate-btn">📍 Go to text</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenplayViewer; 