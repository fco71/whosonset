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
import UserAutocomplete, { UserAutocompleteOption } from './UserAutocomplete';

interface CollaborationHubProps {
  projectId?: string;
}

// User search interface
interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  company?: string;
}

// Workspace creation step
type WorkspaceCreationStep = 'details' | 'members' | 'settings';

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
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  
  // Workspace creation state
  const [workspaceCreationStep, setWorkspaceCreationStep] = useState<WorkspaceCreationStep>('details');
  const [newWorkspaceData, setNewWorkspaceData] = useState({
    name: '',
    description: '',
    type: 'project' as const,
    selectedMembers: [] as UserSearchResult[],
    settings: {
      allowGuestAccess: false,
      requireApproval: true,
      autoArchive: false,
      retentionDays: 365,
      maxFileSize: 100 * 1024 * 1024,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
    }
  });
  
  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  
  // Document and whiteboard creation
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newWhiteboardName, setNewWhiteboardName] = useState('');
  
  // Settings state
  const [workspaceSettings, setWorkspaceSettings] = useState(newWorkspaceData.settings);

  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newChannelData, setNewChannelData] = useState({
    name: '',
    type: 'text',
    isPrivate: false,
  });

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

  // User search functionality
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setUserSearchResults([]);
      return;
    }

    setIsSearchingUsers(true);
    try {
      // Mock user search results - in real app, this would query Firestore
      const mockUsers: UserSearchResult[] = [
        { id: 'user-1', name: 'John Director', email: 'john@example.com', role: 'Director', company: 'Film Co' },
        { id: 'user-2', name: 'Sarah Producer', email: 'sarah@example.com', role: 'Producer', company: 'Production Inc' },
        { id: 'user-3', name: 'Mike DP', email: 'mike@example.com', role: 'DP', company: 'Camera Dept' },
        { id: 'user-4', name: 'Lisa Editor', email: 'lisa@example.com', role: 'Editor', company: 'Post House' },
        { id: 'user-5', name: 'Tom Sound', email: 'tom@example.com', role: 'Sound Designer', company: 'Audio Studio' }
      ];

      const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.role?.toLowerCase().includes(query.toLowerCase()) ||
        user.company?.toLowerCase().includes(query.toLowerCase())
      );

      setUserSearchResults(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setUserSearchResults([]);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const handleUserSearchChange = (query: string) => {
    setUserSearchQuery(query);
    if (query.trim()) {
      setTimeout(() => searchUsers(query), 300);
    } else {
      setUserSearchResults([]);
    }
  };

  const addUserToWorkspace = (user: UserSearchResult) => {
    if (!selectedWorkspace) return;

    const newMember: WorkspaceMember = {
      userId: user.id,
      email: user.email,
      role: 'member',
      joinedAt: new Date(),
      permissions: ['read', 'write'],
      isOnline: false,
      lastSeen: new Date()
    };

    setWorkspaces(prev => prev.map(ws => 
      ws.id === selectedWorkspace.id 
        ? { ...ws, members: [...ws.members, newMember] }
        : ws
    ));

    setSelectedWorkspace(prev => prev ? {
      ...prev,
      members: [...prev.members, newMember]
    } : null);

    setShowAddMemberModal(false);
    setUserSearchQuery('');
    setUserSearchResults([]);
    alert(`Added ${user.name} to workspace successfully!`);
  };

  // Workspace creation handlers
  const handleCreateWorkspaceStep = () => {
    if (workspaceCreationStep === 'details') {
      if (!newWorkspaceData.name.trim()) {
        alert('Please enter a workspace name');
        return;
      }
      setWorkspaceCreationStep('members');
    } else if (workspaceCreationStep === 'members') {
      setWorkspaceCreationStep('settings');
    } else if (workspaceCreationStep === 'settings') {
      handleCreateWorkspace();
    }
  };

  const handleCreateWorkspace = () => {
    try {
      console.log('Creating workspace with data:', newWorkspaceData);
      
      const newWorkspace: CollaborationWorkspace = {
        id: Date.now().toString(),
        projectId: projectId || 'default-project',
        name: newWorkspaceData.name.trim(),
        description: newWorkspaceData.description.trim(),
        type: newWorkspaceData.type,
        members: [
          { 
            userId: currentUser?.uid || 'default-user', 
            role: 'admin', 
            joinedAt: new Date(), 
            permissions: ['read', 'write'], 
            isOnline: true, 
            lastSeen: new Date() 
          },
          ...newWorkspaceData.selectedMembers.map(user => ({
            userId: user.id,
            email: user.email,
            role: 'member' as const,
            joinedAt: new Date(),
            permissions: ['read', 'write'],
            isOnline: false,
            lastSeen: new Date()
          }))
        ],
        channels: [],
        documents: [],
        whiteboards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: newWorkspaceData.settings
      };

      setWorkspaces(prev => [...prev, newWorkspace]);
      setSelectedWorkspace(newWorkspace);
      
      // Reset form
      setNewWorkspaceData({
        name: '',
        description: '',
        type: 'project',
        selectedMembers: [],
        settings: {
          allowGuestAccess: false,
          requireApproval: true,
          autoArchive: false,
          retentionDays: 365,
          maxFileSize: 100 * 1024 * 1024,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
        }
      });
      setWorkspaceCreationStep('details');
      setShowCreateWorkspaceModal(false);
      alert(`Workspace "${newWorkspaceData.name.trim()}" created successfully!`);
    } catch (error) {
      console.error('Error in handleCreateWorkspace:', error);
      alert('Failed to create workspace. Please try again.');
    }
  };

  const handleAddMemberToCreation = (user: UserSearchResult) => {
    if (!newWorkspaceData.selectedMembers.find(m => m.id === user.id)) {
      setNewWorkspaceData(prev => ({
        ...prev,
        selectedMembers: [...prev.selectedMembers, user]
      }));
    }
  };

  const handleRemoveMemberFromCreation = (userId: string) => {
    setNewWorkspaceData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.filter(m => m.id !== userId)
    }));
  };

  const handleCreateChannel = () => {
    setShowCreateChannelModal(true);
  };

  const handleChannelFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkspace) return;
    if (!newChannelData.name.trim()) {
      alert('Please enter a channel name');
      return;
    }
    const newChannel: CollaborationChannel = {
      id: Date.now().toString(),
      workspaceId: selectedWorkspace.id,
      name: newChannelData.name.trim(),
      description: `Channel for ${newChannelData.name.trim()}`,
      type: newChannelData.type as any,
      members: [currentUser?.uid || 'default-user'],
      messages: [],
      isPrivate: newChannelData.isPrivate,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    setShowCreateChannelModal(false);
    setNewChannelData({ name: '', type: 'text', isPrivate: false });
    alert(`Channel "${newChannel.name}" created successfully!`);
  };

  const handleCreateDocument = () => {
    try {
      console.log('Create document clicked');
      if (!selectedWorkspace) {
        alert('Please select a workspace first');
        return;
      }

      const documentName = prompt('Enter document name:');
      if (documentName && documentName.trim()) {
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
      }
    } catch (error) {
      console.error('Error in handleCreateDocument:', error);
      alert('Failed to create document. Please try again.');
    }
  };

  const handleCreateWhiteboard = () => {
    try {
      console.log('Create whiteboard clicked');
      if (!selectedWorkspace) {
        alert('Please select a workspace first');
        return;
      }

      const whiteboardName = prompt('Enter whiteboard name:');
      if (whiteboardName && whiteboardName.trim()) {
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
        setWorkspaceSettings(workspace.settings);
        setShowSettingsModal(true);
      }
    } catch (error) {
      console.error('Error in handleWorkspaceSettings:', error);
    }
  };

  const handleUpdateWorkspaceSettings = () => {
    if (!selectedWorkspace) return;

    setWorkspaces(prev => prev.map(ws => 
      ws.id === selectedWorkspace.id 
        ? { ...ws, settings: workspaceSettings }
        : ws
    ));

    setSelectedWorkspace(prev => prev ? {
      ...prev,
      settings: workspaceSettings
    } : null);

    setShowSettingsModal(false);
    alert('Workspace settings updated successfully!');
  };

  const handleStartVideoCall = () => {
    if (!selectedWorkspace) {
      alert('Please select a workspace first');
      return;
    }
    setShowVideoCallModal(true);
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
                  setShowAddMemberModal(true);
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

      {/* Create Workspace Modal - 2-Step Process */}
      {showCreateWorkspaceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Workspace</h3>
              <button onClick={() => {
                setShowCreateWorkspaceModal(false);
                setWorkspaceCreationStep('details');
                setNewWorkspaceData({
                  name: '',
                  description: '',
                  type: 'project',
                  selectedMembers: [],
                  settings: {
                    allowGuestAccess: false,
                    requireApproval: true,
                    autoArchive: false,
                    retentionDays: 365,
                    maxFileSize: 100 * 1024 * 1024,
                    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
                  }
                });
              }} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              {/* Step 1: Workspace Details */}
              {workspaceCreationStep === 'details' && (
                <div className="step-content">
                  <h4>Step 1: Workspace Details</h4>
                  <div className="form-group">
                    <label>Workspace Name *</label>
                    <input
                      type="text"
                      value={newWorkspaceData.name}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter workspace name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newWorkspaceData.description}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter workspace description"
                      className="form-input"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Workspace Type</label>
                    <select
                      value={newWorkspaceData.type}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="form-input"
                    >
                      <option value="project">Project</option>
                      <option value="department">Department</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Add Members */}
              {workspaceCreationStep === 'members' && (
                <div className="step-content">
                  <h4>Step 2: Add Members</h4>
                  <div className="form-group">
                    <label>Search Users</label>
                    <UserAutocomplete
                      value={newWorkspaceData.selectedMembers}
                      onChange={(users) => setNewWorkspaceData(prev => ({ ...prev, selectedMembers: users }))}
                      onSearch={handleUserSearchChange}
                      options={userSearchResults}
                      loading={isSearchingUsers}
                      placeholder="Search by name, email, or role..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Settings */}
              {workspaceCreationStep === 'settings' && (
                <div className="step-content">
                  <h4>Step 3: Workspace Settings</h4>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newWorkspaceData.settings.allowGuestAccess}
                        onChange={(e) => setNewWorkspaceData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, allowGuestAccess: e.target.checked }
                        }))}
                      />
                      Allow Guest Access
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newWorkspaceData.settings.requireApproval}
                        onChange={(e) => setNewWorkspaceData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, requireApproval: e.target.checked }
                        }))}
                      />
                      Require Approval for New Members
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newWorkspaceData.settings.autoArchive}
                        onChange={(e) => setNewWorkspaceData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, autoArchive: e.target.checked }
                        }))}
                      />
                      Auto-archive Inactive Content
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Retention Period (days)</label>
                    <input
                      type="number"
                      value={newWorkspaceData.settings.retentionDays}
                      onChange={(e) => setNewWorkspaceData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, retentionDays: parseInt(e.target.value) || 365 }
                      }))}
                      className="form-input"
                      min="30"
                      max="3650"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => {
                  if (workspaceCreationStep === 'details') {
                    setShowCreateWorkspaceModal(false);
                    setWorkspaceCreationStep('details');
                  } else if (workspaceCreationStep === 'members') {
                    setWorkspaceCreationStep('details');
                  } else if (workspaceCreationStep === 'settings') {
                    setWorkspaceCreationStep('members');
                  }
                }} 
                className="btn-secondary"
              >
                {workspaceCreationStep === 'details' ? 'Cancel' : 'Back'}
              </button>
              <button 
                onClick={handleCreateWorkspaceStep} 
                className="btn-primary"
              >
                {workspaceCreationStep === 'settings' ? 'Create Workspace' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Member to Workspace</h3>
              <button onClick={() => {
                setShowAddMemberModal(false);
                setUserSearchQuery('');
                setUserSearchResults([]);
              }} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Search Users</label>
                <UserAutocomplete
                  value={selectedWorkspace ? selectedWorkspace.members.map(m => ({
                    id: m.userId,
                    name: m.email || m.userId,
                    email: m.email || '',
                    avatar: '',
                    role: m.role,
                    company: ''
                  })) : []}
                  onChange={(users) => {
                    // Only add new users
                    const newUsers = users.filter(u => !(selectedWorkspace && selectedWorkspace.members.some(m => m.userId === u.id)));
                    newUsers.forEach(user => addUserToWorkspace(user));
                  }}
                  onSearch={handleUserSearchChange}
                  options={userSearchResults}
                  loading={isSearchingUsers}
                  placeholder="Search by name, email, or role..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Workspace Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.allowGuestAccess}
                    onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, allowGuestAccess: e.target.checked }))}
                  />
                  Allow Guest Access
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.requireApproval}
                    onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
                  />
                  Require Approval for New Members
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.autoArchive}
                    onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, autoArchive: e.target.checked }))}
                  />
                  Auto-archive Inactive Content
                </label>
              </div>
              <div className="form-group">
                <label>Retention Period (days)</label>
                <input
                  type="number"
                  value={workspaceSettings.retentionDays}
                  onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) || 365 }))}
                  className="form-input"
                  min="30"
                  max="3650"
                />
              </div>
              <div className="form-group">
                <label>Max File Size (MB)</label>
                <input
                  type="number"
                  value={Math.round(workspaceSettings.maxFileSize / (1024 * 1024))}
                  onChange={(e) => setWorkspaceSettings(prev => ({ 
                    ...prev, 
                    maxFileSize: (parseInt(e.target.value) || 100) * 1024 * 1024 
                  }))}
                  className="form-input"
                  min="1"
                  max="1000"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowSettingsModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleUpdateWorkspaceSettings} className="btn-primary">Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCallModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Start Video Call</h3>
              <button onClick={() => setShowVideoCallModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p>Video call functionality is coming soon!</p>
              <p>This will integrate with your preferred video conferencing platform.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowVideoCallModal(false)} className="btn-secondary">Close</button>
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

      {showCreateChannelModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 400, width: '90%' }}>
            <div className="modal-header">
              <h3>Create Channel</h3>
              <button onClick={() => setShowCreateChannelModal(false)} className="close-btn">×</button>
            </div>
            <form className="modal-body" onSubmit={handleChannelFormSubmit}>
              <div className="form-group">
                <label>Channel Name *</label>
                <input
                  type="text"
                  value={newChannelData.name}
                  onChange={e => setNewChannelData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Enter channel name"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newChannelData.type}
                  onChange={e => setNewChannelData(prev => ({ ...prev, type: e.target.value }))}
                  className="form-input"
                >
                  <option value="text">Text</option>
                  <option value="voice">Voice</option>
                  <option value="video">Video</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newChannelData.isPrivate}
                    onChange={e => setNewChannelData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  />
                  Private Channel
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateChannelModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
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
            <button className="btn-primary" onClick={handleStartVideoCall}>Start Video Call</button>
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