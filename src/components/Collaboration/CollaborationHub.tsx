import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CollaborationWorkspace,
  CollaborationChannel,
  CollaborativeDocument,
  Whiteboard,
  Task,
  VideoCall,
  Notification
} from '../../types/Collaboration';
import './CollaborationHub.scss';

interface CollaborationHubProps {
  projectId?: string;
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ projectId }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('workspaces');
  const [workspaces, setWorkspaces] = useState<CollaborationWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CollaborationWorkspace | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadWorkspaces();
      loadNotifications();
    }
  }, [currentUser, projectId]);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockWorkspaces: CollaborationWorkspace[] = [
        {
          id: '1',
          projectId: projectId || 'project-1',
          name: 'Production Team',
          description: 'Main workspace for production team collaboration',
          type: 'project',
          members: [
            { userId: currentUser?.uid || '', role: 'admin', joinedAt: new Date(), permissions: ['read', 'write'], isOnline: true, lastSeen: new Date() },
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
          projectId: projectId || 'project-1',
          name: 'Camera Department',
          description: 'Camera and lighting team workspace',
          type: 'department',
          members: [
            { userId: currentUser?.uid || '', role: 'member', joinedAt: new Date(), permissions: ['read', 'write'], isOnline: true, lastSeen: new Date() }
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
      setWorkspaces(mockWorkspaces);
      if (mockWorkspaces.length > 0) {
        setSelectedWorkspace(mockWorkspaces[0]);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId: currentUser?.uid || '',
          type: 'message',
          title: 'New message in Production Team',
          message: 'John Doe mentioned you in a message',
          isRead: false,
          createdAt: new Date(Date.now() - 300000),
          actionUrl: '/collaboration/workspace/1'
        },
        {
          id: '2',
          userId: currentUser?.uid || '',
          type: 'task',
          title: 'Task assigned',
          message: 'You have been assigned a new task: "Review script changes"',
          isRead: false,
          createdAt: new Date(Date.now() - 600000),
          actionUrl: '/collaboration/tasks'
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const renderWorkspacesTab = () => (
    <div className="workspaces-tab">
      <div className="workspaces-header">
        <h2>Workspaces</h2>
        <button className="btn-primary">Create Workspace</button>
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
              <button className="btn-secondary">Join</button>
              <button className="btn-secondary">Settings</button>
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
        <button className="btn-primary">Create Channel</button>
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
        <button className="btn-primary">Create Document</button>
      </div>
      
      <div className="documents-grid">
        <div className="document-card">
          <div className="document-icon">📄</div>
          <div className="document-info">
            <h3>Script Draft v2.1</h3>
            <p>Main screenplay with latest revisions</p>
            <div className="document-meta">
              <span className="document-type">Script</span>
              <span className="document-collaborators">3 collaborators</span>
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
        <button className="btn-primary">Create Whiteboard</button>
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
        <button className="btn-primary">Create Task</button>
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
  };

  if (loading) {
    return (
      <div className="collaboration-hub loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="collaboration-hub">
      <div className="collaboration-header">
        <h1>Collaboration Hub</h1>
        <div className="header-actions">
          <div className="notifications-bell">
            <span className="notification-icon">🔔</span>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="notification-badge">{notifications.filter(n => !n.isRead).length}</span>
            )}
          </div>
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
  );
};

export default CollaborationHub; 