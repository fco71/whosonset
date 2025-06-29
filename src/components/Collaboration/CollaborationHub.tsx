import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CollaborationWorkspace,
  CollaborationChannel,
  CollaborativeDocument,
  Whiteboard,
  Task,
  VideoCall
} from '../../types/Collaboration';
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
          documents: [],
          whiteboards: [],
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
      alert('Create workspace functionality coming soon!');
    } catch (error) {
      console.error('Error in handleCreateWorkspace:', error);
    }
  };

  const handleCreateChannel = () => {
    try {
      console.log('Create channel clicked');
      alert('Create channel functionality coming soon!');
    } catch (error) {
      console.error('Error in handleCreateChannel:', error);
    }
  };

  const handleCreateDocument = () => {
    try {
      console.log('Create document clicked');
      alert('Create document functionality coming soon!');
    } catch (error) {
      console.error('Error in handleCreateDocument:', error);
    }
  };

  const handleCreateWhiteboard = () => {
    try {
      console.log('Create whiteboard clicked');
      alert('Create whiteboard functionality coming soon!');
    } catch (error) {
      console.error('Error in handleCreateWhiteboard:', error);
    }
  };

  const handleCreateTask = () => {
    try {
      console.log('Create task clicked');
      alert('Create task functionality coming soon!');
    } catch (error) {
      console.error('Error in handleCreateTask:', error);
    }
  };

  const handleJoinWorkspace = (workspaceId: string) => {
    try {
      console.log('Join workspace clicked:', workspaceId);
      alert(`Joining workspace ${workspaceId} - functionality coming soon!`);
    } catch (error) {
      console.error('Error in handleJoinWorkspace:', error);
    }
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    try {
      console.log('Workspace settings clicked:', workspaceId);
      alert(`Workspace settings for ${workspaceId} - functionality coming soon!`);
    } catch (error) {
      console.error('Error in handleWorkspaceSettings:', error);
    }
  };

  const renderWorkspacesTab = () => (
    <div className="workspaces-tab">
      <div className="workspaces-header">
        <h2>Workspaces</h2>
        <button className="btn-primary" onClick={handleCreateWorkspace}>Create Workspace</button>
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
                  handleWorkspaceSettings(workspace.id);
                }}
              >
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>
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
      <div className="documents-header">
        <h2>Collaborative Documents</h2>
        <button className="btn-primary" onClick={handleCreateDocument}>Create Document</button>
      </div>
      
      <div className="documents-grid">
        <div className="document-card">
          <div className="document-icon">📄</div>
          <div className="document-info">
            <h3>Script Draft v2.1</h3>
            <p>Main screenplay with latest revisions</p>
            <div className="document-meta">
              <span className="document-type">Script</span>
              <span className="document-collaborators">5 collaborators</span>
              <span className="document-updated">Updated 2 hours ago</span>
            </div>
          </div>
          <div className="document-actions">
            <button className="btn-secondary">Open</button>
            <button className="btn-secondary">Share</button>
          </div>
        </div>
        
        <div className="document-card">
          <div className="document-icon">📋</div>
          <div className="document-info">
            <h3>Production Schedule</h3>
            <p>Detailed shooting schedule</p>
            <div className="document-meta">
              <span className="document-type">Schedule</span>
              <span className="document-collaborators">5 collaborators</span>
              <span className="document-updated">Updated 1 day ago</span>
            </div>
          </div>
          <div className="document-actions">
            <button className="btn-secondary">Open</button>
            <button className="btn-secondary">Share</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWhiteboardsTab = () => (
    <div className="whiteboards-tab">
      <div className="whiteboards-header">
        <h2>Whiteboards</h2>
        <button className="btn-primary" onClick={handleCreateWhiteboard}>Create Whiteboard</button>
      </div>
      
      <div className="whiteboards-grid">
        <div className="whiteboard-card">
          <div className="whiteboard-preview">
            <div className="preview-placeholder">Storyboard Layout</div>
          </div>
          <div className="whiteboard-info">
            <h3>Storyboard v1</h3>
            <p>Scene breakdown and shot planning</p>
            <div className="whiteboard-meta">
              <span className="whiteboard-collaborators">4 collaborators</span>
              <span className="whiteboard-updated">Updated 3 hours ago</span>
            </div>
          </div>
          <div className="whiteboard-actions">
            <button className="btn-secondary">Open</button>
            <button className="btn-secondary">Export</button>
          </div>
        </div>
        
        <div className="whiteboard-card">
          <div className="whiteboard-preview">
            <div className="preview-placeholder">Set Design</div>
          </div>
          <div className="whiteboard-info">
            <h3>Set Layout</h3>
            <p>Production design and set planning</p>
            <div className="whiteboard-meta">
              <span className="whiteboard-collaborators">2 collaborators</span>
              <span className="whiteboard-updated">Updated 1 day ago</span>
            </div>
          </div>
          <div className="whiteboard-actions">
            <button className="btn-secondary">Open</button>
            <button className="btn-secondary">Export</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h2>Tasks</h2>
        <button className="btn-primary" onClick={handleCreateTask}>Create Task</button>
      </div>
      
      <div className="tasks-list">
        <div className="task-item">
          <div className="task-priority high"></div>
          <div className="task-content">
            <h3>Review script changes</h3>
            <p>Review and approve the latest script revisions</p>
            <div className="task-meta">
              <span className="task-assignee">Assigned to: John Doe</span>
              <span className="task-due">Due: Tomorrow</span>
              <span className="task-status pending">Pending</span>
            </div>
          </div>
          <div className="task-actions">
            <button className="btn-secondary">View</button>
            <button className="btn-secondary">Complete</button>
          </div>
        </div>
        
        <div className="task-item">
          <div className="task-priority medium"></div>
          <div className="task-content">
            <h3>Update production schedule</h3>
            <p>Update the production schedule with new dates</p>
            <div className="task-meta">
              <span className="task-assignee">Assigned to: You</span>
              <span className="task-due">Due: Friday</span>
              <span className="task-status in-progress">In Progress</span>
            </div>
          </div>
          <div className="task-actions">
            <button className="btn-secondary">View</button>
            <button className="btn-secondary">Update</button>
          </div>
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