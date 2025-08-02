import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CollaborativeDocument, DocumentCollaborator, DocumentChange } from '../../types/Collaboration';
import './CollaborativeDocumentEditor.scss';

interface CollaborativeDocumentEditorProps {
  document: CollaborativeDocument;
  onSave: (content: string) => void;
  onClose: () => void;
}

const CollaborativeDocumentEditor: React.FC<CollaborativeDocumentEditorProps> = ({
  document,
  onSave,
  onClose
}) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState(document.content);
  const [isTyping, setIsTyping] = useState(false);
  const [collaborators, setCollaborators] = useState<DocumentCollaborator[]>(document.collaborators);
  const [version, setVersion] = useState(document.version);
  const [autoSave, setAutoSave] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Simulate real-time collaboration updates
    const interval = setInterval(() => {
      // Mock: Update collaborator cursors and typing status
      setCollaborators(prev => prev.map(collab => ({
        ...collab,
        cursorPosition: {
          line: Math.floor(Math.random() * 50) + 1,
          column: Math.floor(Math.random() * 20) + 1
        },
        isTyping: Math.random() > 0.7
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-save functionality
    if (autoSave && content !== document.content) {
      const timeout = setTimeout(() => {
        handleSave();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [content, autoSave]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Update typing status
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    // Simulate sending typing indicator to other collaborators
    updateTypingStatus(true);
  };

  const updateTypingStatus = (typing: boolean) => {
    setCollaborators(prev => prev.map(collab => 
      collab.userId === currentUser?.uid 
        ? { ...collab, isTyping: typing }
        : collab
    ));
  };

  const handleSave = () => {
    const newVersion = version + 1;
    setVersion(newVersion);
    onSave(content);
    
    // Create a document change record
    const change: DocumentChange = {
      id: `change-${Date.now()}`,
      userId: currentUser?.uid || '',
      type: 'insert',
      position: content.length,
      content: content,
      timestamp: new Date()
    };

    console.log('Document saved:', { version: newVersion, change });
  };

  const handleCursorPosition = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;

      // Update current user's cursor position
      setCollaborators(prev => prev.map(collab => 
        collab.userId === currentUser?.uid 
          ? { 
              ...collab, 
              cursorPosition: { line, column },
              lastActivity: new Date()
            }
          : collab
      ));
    }
  };

  const formatDocument = () => {
    // Basic text formatting
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`(.*?)`/g, '<code>$1</code>') // Code
      .replace(/^### (.*$)/gim, '<h3>$1</h3>') // H3
      .replace(/^## (.*$)/gim, '<h2>$1</h2>') // H2
      .replace(/^# (.*$)/gim, '<h1>$1</h1>'); // H1
    
    setContent(formatted);
  };

  const insertTemplate = (template: string) => {
    const templates = {
      script: `SCENE 1 - INT. LOCATION - DAY

CHARACTER NAME
(Dialogue here)

CHARACTER NAME
(Response here)

ACTION: Description of what's happening.

SCENE 2 - EXT. LOCATION - NIGHT

CHARACTER NAME
(More dialogue)

ACTION: More action description.`,
      
      schedule: `PRODUCTION SCHEDULE

Day 1 - [DATE]
- 8:00 AM - Call time
- 9:00 AM - Setup
- 10:00 AM - First shot
- 12:00 PM - Lunch
- 1:00 PM - Continue shooting
- 6:00 PM - Wrap

Day 2 - [DATE]
- [Schedule details]`,
      
      budget: `BUDGET BREAKDOWN

PRE-PRODUCTION
- Script Development: $[AMOUNT]
- Location Scouting: $[AMOUNT]
- Casting: $[AMOUNT]

PRODUCTION
- Equipment Rental: $[AMOUNT]
- Crew Salaries: $[AMOUNT]
- Location Fees: $[AMOUNT]

POST-PRODUCTION
- Editing: $[AMOUNT]
- Sound Design: $[AMOUNT]
- Color Grading: $[AMOUNT]

TOTAL BUDGET: $[TOTAL]`
    };

    setContent(templates[template as keyof typeof templates] || template);
  };

  const renderCollaborators = () => (
    <div className="collaborators-panel">
      <div className="collaborators-header">
        <h3>Collaborators ({collaborators.length})</h3>
        <button 
          className="toggle-btn"
          onClick={() => setShowCollaborators(!showCollaborators)}
        >
          {showCollaborators ? '−' : '+'}
        </button>
      </div>
      
      {showCollaborators && (
        <div className="collaborators-list">
          {collaborators.map(collaborator => (
            <div key={collaborator.userId} className="collaborator-item">
              <div className="collaborator-avatar">
                {collaborator.userId === currentUser?.uid ? '👤' : '👥'}
              </div>
              <div className="collaborator-info">
                <span className="collaborator-name">
                  {collaborator.userId === currentUser?.uid ? 'You' : `User ${collaborator.userId.slice(-4)}`}
                </span>
                <span className="collaborator-role">{collaborator.role}</span>
                {collaborator.isTyping && (
                  <span className="typing-indicator">typing...</span>
                )}
                {collaborator.cursorPosition && (
                  <span className="cursor-position">
                    Line {collaborator.cursorPosition.line}, Col {collaborator.cursorPosition.column}
                  </span>
                )}
              </div>
              <div className={`online-status ${collaborator.lastActivity ? 'online' : 'offline'}`}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderToolbar = () => (
    <div className="editor-toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn" onClick={() => insertTemplate('script')}>
          📄 Script
        </button>
        <button className="toolbar-btn" onClick={() => insertTemplate('schedule')}>
          📅 Schedule
        </button>
        <button className="toolbar-btn" onClick={() => insertTemplate('budget')}>
          💰 Budget
        </button>
        <button className="toolbar-btn" onClick={formatDocument}>
          ✨ Format
        </button>
      </div>
      
      <div className="toolbar-right">
        <label className="auto-save-toggle">
          <input 
            type="checkbox" 
            checked={autoSave} 
            onChange={(e) => setAutoSave(e.target.checked)}
          />
          Auto-save
        </label>
        <button className="save-btn" onClick={handleSave}>
          💾 Save (v{version})
        </button>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );

  return (
    <div className="collaborative-document-editor">
      <div className="editor-header">
        <div className="document-info">
          <h2>{document.title}</h2>
          <span className="document-type">{document.type}</span>
          <span className="document-version">v{version}</span>
        </div>
        {renderCollaborators()}
      </div>

      {renderToolbar()}

      <div className="editor-main">
        <div className="editor-content">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onSelect={handleCursorPosition}
            onKeyUp={handleCursorPosition}
            placeholder="Start typing your document..."
            className="document-textarea"
          />
        </div>
        
        <div className="editor-sidebar">
          <div className="document-stats">
            <h4>Document Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Characters:</span>
              <span className="stat-value">{content.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Words:</span>
              <span className="stat-value">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lines:</span>
              <span className="stat-value">{content.split('\n').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last saved:</span>
              <span className="stat-value">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="recent-changes">
            <h4>Recent Changes</h4>
            <div className="changes-list">
              {document.changes.slice(-5).map(change => (
                <div key={change.id} className="change-item">
                  <span className="change-user">User {change.userId.slice(-4)}</span>
                  <span className="change-type">{change.type}</span>
                  <span className="change-time">
                    {new Date(change.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeDocumentEditor; 