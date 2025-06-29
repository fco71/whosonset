import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CollaborationWorkspace,
  CollaborationChannel,
  CollaborativeDocument,
  Whiteboard,
  Task,
  VideoCall,
  WorkspaceMember
} from '../../types/Collaboration';
import CollaborativeTasksHub from '../CollaborativeTasks/CollaborativeTasksHub';
import './CollaborationHub.scss';

interface CollaborationHubProps {
  projectId?: string;
}

// Error Boundary Component
class CollaborationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CollaborationHub Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong with the Collaboration Hub.</h2>
          <p>Please refresh the page or try again later.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ projectId }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('workspaces');
  const [workspaces, setWorkspaces] = useState<CollaborationWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CollaborationWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateDocumentModal, setShowCreateDocumentModal] = useState(false);
  const [showCreateWhiteboardModal, setShowCreateWhiteboardModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newWhiteboardName, setNewWhiteboardName] = useState('');

  useEffect(() => {
    console.log('CollaborationHub mounted with projectId:', projectId);
    console.log('Current user:', currentUser);
    
    try {
      loadWorkspaces();
    } catch (err) {
      console.error('Error in CollaborationHub useEffect:', err);
      setError('Failed to initialize Collaboration Hub');
    }
  }, [currentUser, projectId]);

  const loadWorkspaces = async () => {
    try {
      console.log('Loading workspaces...');
      setLoading(true);
      setError(null);
      
      // Mock data for demonstration
      const mockWorkspaces: CollaborationWorkspace[] = [
        {
          id: '1',
          projectId: projectId || 'default-project',
          name: 'Production Team',
          description: 'Main workspace for production team collaboration',
          type: 'project',
          members: [
            { userId: currentUser?.uid || 'default-user', role: 'admin', joinedAt: new Date(), permissions: ['read', 'write'], isOnline: true, lastSeen: new Date() },
            { userId: 'user-2', role: 'member', joinedAt: new Date(), permissions: ['read', 'write'], isOnline: true, lastSeen: new Date() },
            { userId: 'user-3', role: 'member', joinedAt: new Date(), permissions: ['read'], isOnline: false, lastSeen: new Date(Date.now() - 3600000) }
          ],
          channels: [],
          documents: [
            {
              id: 'doc-1',
              workspaceId: '1',
              title: 'Script Draft v2.1',
              content: 'Main screenplay with latest revisions',
              type: 'script',
              version: 2,
              collaborators: [
                { userId: currentUser?.uid || 'default-user', role: 'editor', isTyping: false, lastActivity: new Date() }
              ],
              changes: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              lastEditedBy: currentUser?.uid || 'default-user'
            },
            {
              id: 'doc-2',
              workspaceId: '1',
              title: 'Production Schedule',
              content: 'Detailed shooting schedule',
              type: 'schedule',
              version: 1,
              collaborators: [
                { userId: currentUser?.uid || 'default-user', role: 'editor', isTyping: false, lastActivity: new Date() }
              ],
              changes: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              lastEditedBy: currentUser?.uid || 'default-user'
            }
          ],
          whiteboards: [
            {
              id: 'wb-1',
              workspaceId: '1',
              name: 'Storyboard v1',
              elements: [],
              collaborators: [
                { userId: currentUser?.uid || 'default-user', cursor: { x: 0, y: 0 }, isDrawing: false, lastActivity: new Date() }
              ],
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: 'wb-2',
              workspaceId: '1',
              name: 'Set Layout',
              elements: [],
              collaborators: [
                { userId: currentUser?.uid || 'default-user', cursor: { x: 0, y: 0 }, isDrawing: false, lastActivity: new Date() }
              ],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          settings: {
            allowGuestAccess: false,
            requireApproval: true,
            autoArchive: false,
            retentionDays: 365,
            maxFileSize: 100 * 1024 * 1024, // 100MB
            allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
          }
        },
        {
          id: '2',
          projectId: projectId || 'default-project',
          name: 'Camera Department',
          description: 'Camera and lighting team workspace',
          type: 'department',
          members: [
            { userId: currentUser?.uid || 'default-user', role: 'member', joinedAt: new Date(), permissions: ['read', 'write'], isOnline: true, lastSeen: new Date() }
          ],
          channels: [],
          documents: [],
          whiteboards: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          settings: {
            allowGuestAccess: false,
            requireApproval: false,
            autoArchive: false,
            retentionDays: 365,
            maxFileSize: 100 * 1024 * 1024,
            allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
          }
        }
      ];
      
      console.log('Setting workspaces:', mockWorkspaces);
      setWorkspaces(mockWorkspaces);
      if (mockWorkspaces.length > 0) {
        setSelectedWorkspace(mockWorkspaces[0]);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
      setError('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = () => {
    try {
      console.log('Create workspace clicked');
      if (!newWorkspaceName.trim()) {
        alert('Please enter a workspace name');
        return;
      }
      
      const newWorkspace: CollaborationWorkspace = {
        id: Date.now().toString(),
        projectId: projectId || 'default-project',
        name: newWorkspaceName.trim(),
        description: `Workspace for ${newWorkspaceName.trim()}`,
        type: 'project',
        members: [
          { 
            userId: currentUser?.uid || 'default-user', 
            role: 'admin', 
            joinedAt: new Date(), 
            permissions: ['read', 'write'], 
            isOnline: true, 
            lastSeen: new Date() 
          }
        ],
        channels: [],
        documents: [],
        whiteboards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          allowGuestAccess: false,
          requireApproval: true,
          autoArchive: false,
          retentionDays: 365,
          maxFileSize: 100 * 1024 * 1024,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
        }
      };

      setWorkspaces(prev => [...prev, newWorkspace]);
      setSelectedWorkspace(newWorkspace);
      setNewWorkspaceName('');
      setShowCreateWorkspaceModal(false);
      alert(`Workspace "${newWorkspaceName.trim()}" created successfully!`);
    } catch (error) {
      console.error('Error in handleCreateWorkspace:', error);
      alert('Failed to create workspace. Please try again.');
    }
  };

  const handleCreateChannel = () => {
    try {
      console.log('Create channel clicked');
      if (!selectedWorkspace) {
        alert('Please select a workspace first');
        return;
      }
      
      const channelName = prompt('Enter channel name:');
      if (channelName && channelName.trim()) {
        const newChannel: CollaborationChannel = {
          id: Date.now().toString(),
          workspaceId: selectedWorkspace.id,
          name: channelName.trim(),
          description: `Channel for ${channelName.trim()}`,
          type: 'text',
          members: [currentUser?.uid || 'default-user'],
          messages: [],
          isPrivate: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setWorkspaces(prev => prev.map(ws => 
          ws.id === selectedWorkspace.id 
            ? { ...ws, channels: [...ws.channels, newChannel] }
            : ws
        ));

        setSelectedWorkspace(prev => prev ? {
          ...prev,
          channels: [...prev.channels, newChannel]
        } : null);

        alert(`Channel "${channelName}" created successfully!`);
      }
    } catch (error) {
      console.error('Error in handleCreateChannel:', error);
      alert('Failed to create channel. Please try again.');
    }
  };

  const handleCreateDocument = () => {
    try {
      console.log('Create document clicked');
      const documentName = prompt('Enter document name:');
      if (documentName && documentName.trim() && selectedWorkspace) {
        const newDocument: CollaborativeDocument = {
          id: Date.now().toString(),
          workspaceId: selectedWorkspace.id,
          title: documentName.trim(),
          content: `Document: ${documentName.trim()}`,
          type: 'notes',
          version: 1,
          collaborators: [
            { userId: currentUser?.uid || 'default-user', role: 'editor', isTyping: false, lastActivity: new Date() }
          ],
          changes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          lastEditedBy: currentUser?.uid || 'default-user'
        };

        setWorkspaces(prev => prev.map(ws => 
          ws.id === selectedWorkspace.id 
            ? { ...ws, documents: [...ws.documents, newDocument] }
            : ws
        ));

        setSelectedWorkspace(prev => prev ? {
          ...prev,
          documents: [...prev.documents, newDocument]
        } : null);

        alert(`Document "${documentName}" created successfully!`);
      } else if (!selectedWorkspace) {
        alert('Please select a workspace first');
      }
    } catch (error) {
      console.error('Error in handleCreateDocument:', error);
      alert('Failed to create document. Please try again.');
    }
  };

  const handleCreateWhiteboard = () => {
    try {
      console.log('Create whiteboard clicked');
      const whiteboardName = prompt('Enter whiteboard name:');
      if (whiteboardName && whiteboardName.trim() && selectedWorkspace) {
        const newWhiteboard: Whiteboard = {
          id: Date.now().toString(),
          workspaceId: selectedWorkspace.id,
          name: whiteboardName.trim(),
          elements: [],
          collaborators: [
            { userId: currentUser?.uid || 'default-user', cursor: { x: 0, y: 0 }, isDrawing: false, lastActivity: new Date() }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setWorkspaces(prev => prev.map(ws => 
          ws.id === selectedWorkspace.id 
            ? { ...ws, whiteboards: [...ws.whiteboards, newWhiteboard] }
            : ws
        ));

        setSelectedWorkspace(prev => prev ? {
          ...prev,
          whiteboards: [...prev.whiteboards, newWhiteboard]
        } : null);

        alert(`Whiteboard "${whiteboardName}" created successfully!`);
      } else if (!selectedWorkspace) {
        alert('Please select a workspace first');
      }
    } catch (error) {
      console.error('Error in handleCreateWhiteboard:', error);
      alert('Failed to create whiteboard. Please try again.');
    }
  };

  const handleJoinWorkspace = (workspaceId: string) => {
    try {
      console.log('Join workspace clicked:', workspaceId);
      const workspace = workspaces.find(ws => ws.id === workspaceId);
      if (workspace) {
        setSelectedWorkspace(workspace);
        alert(`Successfully joined workspace: ${workspace.name}`);
      }
    } catch (error) {
      console.error('Error in handleJoinWorkspace:', error);
    }
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    try {
      console.log('Workspace settings clicked:', workspaceId);
      const workspace = workspaces.find(ws => ws.id === workspaceId);
      if (workspace) {
        const settingsInfo = `
Workspace: ${workspace.name}
Type: ${workspace.type}
Members: ${workspace.members.length}
Guest Access: ${workspace.settings.allowGuestAccess ? 'Enabled' : 'Disabled'}
Approval Required: ${workspace.settings.requireApproval ? 'Yes' : 'No'}
Auto Archive: ${workspace.settings.autoArchive ? 'Enabled' : 'Disabled'}
        `.trim();
        alert(settingsInfo);
      }
    } catch (error) {
      console.error('Error in handleWorkspaceSettings:', error);
    }
  };

  const handleAddWorkspaceMember = (workspaceId: string) => {
    try {
      console.log('Add workspace member clicked:', workspaceId);
      const memberEmail = prompt('Enter member email:');
      if (memberEmail && memberEmail.trim()) {
        const newMember: WorkspaceMember = {
          userId: `user-${Date.now()}`, // In real app, this would be the actual user ID
          email: memberEmail.trim(),
          role: 'member',
          joinedAt: new Date(),
          permissions: ['read', 'write'],
          isOnline: false,
          lastSeen: new Date()
        };

        setWorkspaces(prev => prev.map(ws => 
          ws.id === workspaceId 
            ? { ...ws, members: [...ws.members, newMember] }
            : ws
        ));

        if (selectedWorkspace?.id === workspaceId) {
          setSelectedWorkspace(prev => prev ? {
            ...prev,
            members: [...prev.members, newMember]
          } : null);
        }

        alert(`Member ${memberEmail} added to workspace successfully!`);
      }
    } catch (error) {
      console.error('Error in handleAddWorkspaceMember:', error);
      alert('Failed to add member. Please try again.');
    }
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

  const renderWorkspacesTab = () => (
    <div className="workspaces-tab">
      <div className="workspaces-header">
        <h2>Workspaces</h2>
        <button className="btn-primary" onClick={() => setShowCreateWorkspaceModal(true)}>Create Workspace</button>
      </div>
      
      <div className="workspaces-grid">
        {workspaces.map(workspace => (
          <div 
            key={workspace.id} 
            className={`workspace-card ${selectedWorkspace?.id === workspace.id ? 'selected' : ''}`}
            onClick={() => setSelectedWorkspace(workspace)}
          >
            <div className="workspace-header">
              <h3>{workspace.name}</h3>
              <span className={`workspace-type ${workspace.type}`}>{workspace.type}</span>
            </div>
            <p className="workspace-description">{workspace.description}</p>
            <div className="workspace-stats">
              <div className="stat">
                <span className="stat-label">Members</span>
                <span className="stat-value">{workspace.members.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Online</span>
                <span className="stat-value">{workspace.members.filter(m => m.isOnline).length}</span>
              </div>
            </div>
            <div className="workspace-actions">
              <button 
                className="btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinWorkspace(workspace.id);
                }}
              >
                Join
              </button>
              <button 
                className="btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddWorkspaceMember(workspace.id);
                }}
              >
                Add Member
              </button>
              <button 
                className="btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkspaceSettings(workspace.id);
                }}
              >
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Workspace Modal */}
      {showCreateWorkspaceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Workspace</h3>
              <button onClick={() => setShowCreateWorkspaceModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Workspace Name</label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="Enter workspace name"
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateWorkspaceModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreateWorkspace} className="btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderChannelsTab = () => (
    <div className="channels-tab">
      <div className="channels-header">
        <h2>Channels</h2>
        <button className="btn-primary" onClick={handleCreateChannel}>Create Channel</button>
      </div>
      
      {selectedWorkspace ? (
        <div className="channels-content">
          <div className="channels-list">
            <div className="channel-item">
              <div className="channel-info">
                <span className="channel-icon">#</span>
                <span className="channel-name">general</span>
                <span className="channel-description">General discussion</span>
              </div>
              <div className="channel-stats">
                <span className="online-count">12 online</span>
              </div>
            </div>
            
            <div className="channel-item">
              <div className="channel-info">
                <span className="channel-icon">📢</span>
                <span className="channel-name">announcements</span>
                <span className="channel-description">Important updates</span>
              </div>
              <div className="channel-stats">
                <span className="online-count">8 online</span>
              </div>
            </div>
            
            <div className="channel-item">
              <div className="channel-info">
                <span className="channel-icon">🎬</span>
                <span className="channel-name">production</span>
                <span className="channel-description">Production discussions</span>
              </div>
              <div className="channel-stats">
                <span className="online-count">15 online</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-workspace-selected">
          <p>Please select a workspace to view channels</p>
        </div>
      )}
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="documents-tab">
      <div className="tab-header">
        <h3>Documents</h3>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateDocumentModal(true)}
        >
          Create Document
        </button>
      </div>
      
      <div className="documents-grid">
        {selectedWorkspace?.documents.map((doc) => (
          <div key={doc.id} className="document-card">
            <div className="document-header">
              <h4>{doc.title}</h4>
              <span className="document-type">{doc.type}</span>
            </div>
            <div className="document-content">
              <p>{doc.content.substring(0, 100)}...</p>
            </div>
            <div className="document-footer">
              <div className="collaborators">
                <span>Collaborators: {doc.collaborators.length}</span>
              </div>
              <div className="document-meta">
                <span>v{doc.version}</span>
                <span>{formatTimeAgo(doc.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWhiteboardsTab = () => (
    <div className="whiteboards-tab">
      <div className="tab-header">
        <h3>Whiteboards</h3>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateWhiteboardModal(true)}
        >
          Create Whiteboard
        </button>
      </div>
      
      <div className="whiteboards-grid">
        {selectedWorkspace?.whiteboards.map((wb) => (
          <div key={wb.id} className="whiteboard-card">
            <div className="whiteboard-header">
              <h4>{wb.name}</h4>
            </div>
            <div className="whiteboard-content">
              <p>Elements: {wb.elements.length}</p>
            </div>
            <div className="whiteboard-footer">
              <div className="collaborators">
                <span>Collaborators: {wb.collaborators.length}</span>
              </div>
              <div className="whiteboard-meta">
                <span>{formatTimeAgo(wb.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h2>Tasks</h2>
        <p>Manage collaborative tasks and project workflows</p>
      </div>
      
      <div className="tasks-content">
        <CollaborativeTasksHub projectId={projectId || 'default-project'} />
      </div>
    </div>
  );

  const renderHelpSection = () => (
    <div className="help-section">
      <h3>What's the difference?</h3>
      <div className="help-grid">
        <div className="help-item">
          <h4>📄 Documents</h4>
          <p>Text-based collaborative editing for scripts, storyboards, schedules, budgets, and notes. Multiple users can edit simultaneously with real-time updates.</p>
        </div>
        <div className="help-item">
          <h4>🎨 Whiteboards</h4>
          <p>Visual collaboration tools for brainstorming, storyboarding, and creative planning. Draw, add shapes, and collaborate visually in real-time.</p>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    try {
      console.log('Rendering tab content for:', activeTab);
      switch (activeTab) {
        case 'workspaces':
          return renderWorkspacesTab();
        case 'channels':
          return renderChannelsTab();
        case 'documents':
          return renderDocumentsTab();
        case 'whiteboards':
          return renderWhiteboardsTab();
        case 'tasks':
          return renderTasksTab();
        case 'help':
          return renderHelpSection();
        default:
          return renderWorkspacesTab();
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <div className="error-content">
          <h2>Error loading content</h2>
          <p>Please try refreshing the page.</p>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="collaboration-hub loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collaboration-hub error">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  console.log('Rendering CollaborationHub with:', {
    activeTab,
    workspacesCount: workspaces.length,
    selectedWorkspace: selectedWorkspace?.name
  });

  return (
    <CollaborationErrorBoundary>
      <div className="collaboration-hub">
        <div className="collaboration-header">
          <h1>Collaboration Hub</h1>
          <div className="header-actions">
            <button className="btn-primary">Start Video Call</button>
          </div>
        </div>

        <div className="collaboration-content">
          <div className="collaboration-sidebar">
            <nav className="collaboration-nav">
              <button 
                className={`nav-item ${activeTab === 'workspaces' ? 'active' : ''}`}
                onClick={() => setActiveTab('workspaces')}
              >
                <span className="nav-icon">🏢</span>
                <span className="nav-label">Workspaces</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'channels' ? 'active' : ''}`}
                onClick={() => setActiveTab('channels')}
              >
                <span className="nav-icon">💬</span>
                <span className="nav-label">Channels</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <span className="nav-icon">📄</span>
                <span className="nav-label">Documents</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'whiteboards' ? 'active' : ''}`}
                onClick={() => setActiveTab('whiteboards')}
              >
                <span className="nav-icon">🖼️</span>
                <span className="nav-label">Whiteboards</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                <span className="nav-icon">✅</span>
                <span className="nav-label">Tasks</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => setActiveTab('help')}
              >
                <span className="nav-icon">❓</span>
                <span className="nav-label">Help</span>
              </button>
            </nav>
          </div>

          <div className="collaboration-main">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </CollaborationErrorBoundary>
  );
};

export default CollaborationHub; 