import React, { useState, useEffect, useRef } from 'react';
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
}

interface Tag {
  id: string;
  userId: string;
  userName: string;
  tagType: 'character' | 'location' | 'prop' | 'scene' | 'note';
  content: string;
  timestamp: Date;
  pageNumber?: number;
  lineNumber?: number;
  selection?: string;
  color: string;
}

const ScreenplayViewer: React.FC<ScreenplayViewerProps> = ({ screenplay, projectId, onClose }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTagType, setSelectedTagType] = useState<Tag['tagType']>('character');
  const [selectedText, setSelectedText] = useState('');
  const [showCommentPanel, setShowCommentPanel] = useState(false);
  const [showTagPanel, setShowTagPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [screenplayContent, setScreenplayContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'fdx' | 'text'>('text');
  const viewerRef = useRef<HTMLDivElement>(null);

  const tagColors = {
    character: '#FF6B6B',
    location: '#4ECDC4',
    prop: '#45B7D1',
    scene: '#96CEB4',
    note: '#FFEAA7'
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
    console.log('Panel state changed:', { showCommentPanel, showTagPanel });
  }, [showCommentPanel, showTagPanel]);

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
        where('screenplayId', '==', screenplay.id),
        orderBy('timestamp', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const commentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as Comment[];
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
        where('screenplayId', '==', screenplay.id),
        orderBy('timestamp', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tagsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as Tag[];
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
      setSelectedText(selection.toString().trim());
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
        ref={viewerRef}
      >
        <pre className="screenplay-text">{screenplayContent}</pre>
        
        {/* Render tags as overlays */}
        {tags.map(tag => (
          <div
            key={tag.id}
            className="tag-overlay"
            style={{
              backgroundColor: tag.color,
              opacity: 0.8
            }}
            title={`${tag.tagType}: ${tag.content} by ${tag.userName}`}
          >
            <span className="tag-label">{tag.tagType}</span>
          </div>
        ))}
      </div>
    );
  };

  // Debug logging for panel state
  console.log('ScreenplayViewer render state:', {
    showCommentPanel,
    showTagPanel,
    commentsCount: comments.length,
    tagsCount: tags.length
  });

  return (
    <div className="screenplay-viewer-overlay">
      <div className="screenplay-viewer">
        <div className="viewer-header">
          <div className="header-left">
            <h2 style={{ margin: 0, padding: 0, lineHeight: '1.2', display: 'flex', alignItems: 'center' }}>{screenplay.name}</h2>
            <span className="file-type">{screenplay.type}</span>
          </div>
          <div className="header-actions">
            <button
              onClick={() => {
                console.log('Toggle comment panel. Current state:', showCommentPanel);
                setShowCommentPanel(!showCommentPanel);
              }}
              className={`btn-toggle ${showCommentPanel ? 'active' : ''}`}
            >
              Comments ({comments.length})
            </button>
            <button
              onClick={() => {
                console.log('Toggle tag panel. Current state:', showTagPanel);
                setShowTagPanel(!showTagPanel);
              }}
              className={`btn-toggle ${showTagPanel ? 'active' : ''}`}
            >
              Tags ({tags.length})
            </button>
            <button onClick={onClose} className="btn-close">
              ×
            </button>
          </div>
        </div>

        <div className="viewer-content">
          <div className="screenplay-panel">
            {renderScreenplayContent()}
          </div>

          {showCommentPanel && (
            <div className="comment-panel">
              <h3>Comments ({comments.length})</h3>
              <div className="comment-input">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                {selectedText && (
                  <div className="selected-text">
                    Selected: "{selectedText}"
                  </div>
                )}
                <button onClick={addComment} disabled={!newComment.trim()}>
                  Add Comment
                </button>
              </div>
              <div className="comments-list">
                {comments.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                    No comments yet. Be the first to add one!
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item">
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
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {showTagPanel && (
            <div className="tag-panel">
              <h3>Tags ({tags.length})</h3>
              <div className="tag-input">
                <select
                  value={selectedTagType}
                  onChange={(e) => setSelectedTagType(e.target.value as Tag['tagType'])}
                >
                  <option value="character">Character</option>
                  <option value="location">Location</option>
                  <option value="prop">Prop</option>
                  <option value="scene">Scene</option>
                  <option value="note">Note</option>
                </select>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                />
                {selectedText && (
                  <div className="selected-text">
                    Selected: "{selectedText}"
                  </div>
                )}
                <button onClick={addTag} disabled={!newTag.trim()}>
                  Add Tag
                </button>
              </div>
              <div className="tags-list">
                {tags.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                    No tags yet. Add your first tag!
                  </div>
                ) : (
                  tags.map(tag => (
                    <div key={tag.id} className="tag-item">
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