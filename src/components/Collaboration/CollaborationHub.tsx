import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CollaborationWorkspace,
  Task,
  WorkspaceMember
} from '../../types/Collaboration';
import CollaborativeTasksHub from '../CollaborativeTasks/CollaborativeTasksHub';
import ScreenplayBreakdown from '../ScreenplayBreakdown';
import BreakdownReports from '../BreakdownReports';
import './CollaborationHub.scss';
import UserAutocomplete, { UserAutocompleteOption } from './UserAutocomplete';
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import ScreenplayViewer from './ScreenplayViewer';
import { useTranslation } from 'react-i18next';

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

// Screenplay interface
interface Screenplay {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy?: string;
  teamMembers?: string[];
  uploadedAt?: Date | { seconds: number; nanoseconds: number };
  lastModified?: Date | { seconds: number; nanoseconds: number };
  size?: number;
}

// Screenplay Annotation interface
interface ScreenplayAnnotation {
  id: string;
  userId: string;
  userName: string;
  annotation: string;
  timestamp: Date;
  page?: string;
  scene?: string;
  screenplayId?: string;
}

// Workspace creation step
type WorkspaceCreationStep = 'details' | 'members' | 'settings';

// Define TabType at the top of the file
type TabType = 'workspaces' | 'tasks' | 'screenplays';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CollaborationErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
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
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('workspaces');
  const [workspaces, setWorkspaces] = useState<CollaborationWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CollaborationWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // Video call functionality will be added in a future update
  const [showScreenplayViewer, setShowScreenplayViewer] = useState(false);
  const [showScreenplayModal, setShowScreenplayModal] = useState(false);

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

  // Settings state
  const [workspaceSettings, setWorkspaceSettings] = useState(newWorkspaceData.settings);

  // Screenplay upload state
  const [screenplayFile, setScreenplayFile] = useState<File | null>(null);
  const [uploadingScreenplay, setUploadingScreenplay] = useState(false);
  const [uploadedScreenplay, setUploadedScreenplay] = useState<Screenplay | null>(null);

  // Screenplay collaboration state
  const [screenplayAnnotations, setScreenplayAnnotations] = useState<ScreenplayAnnotation[]>([]);
  const [newAnnotation, setNewAnnotation] = useState('');

  const [teamMembers, setTeamMembers] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    isOnline?: boolean;
  }[]>([]);

  const [userScreenplays, setUserScreenplays] = useState<Screenplay[]>([]);
  const [selectedScreenplayId, setSelectedScreenplayId] = useState<string | null>(null);

  const [approvedContacts, setApprovedContacts] = useState<string[]>([]);

  useEffect(() => {
    // Load workspaces and team members
    loadWorkspaces();
    loadTeamMembers();
    if (!currentUser) return;
    
    // Load all screenplays for this user (uploaded or as team member)
    const fetchScreenplays = async () => {
      try {
        const screenplaysRef = collection(db, 'screenplays');
        const q1 = query(screenplaysRef, where('uploadedBy', '==', currentUser.uid));
        const snap1 = await getDocs(q1);
        const q2 = query(screenplaysRef, where('teamMembers', 'array-contains', currentUser.uid));
        const snap2 = await getDocs(q2);
        
        // Combine and deduplicate screenplays
        const allScreenplays = [...snap1.docs, ...snap2.docs];
        const uniqueScreenplays = Array.from(
          new Map(
            allScreenplays.map(doc => {
              const data = doc.data();
              // Ensure we have all required fields and handle timestamps
              const screenplay: Screenplay = {
                id: doc.id,
                name: data.name || 'Untitled Screenplay',
                type: data.type || 'pdf',
                url: data.url || '',
                uploadedBy: data.uploadedBy,
                teamMembers: data.teamMembers || [],
                size: data.size,
                // Convert Firestore timestamps to Date objects
                uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : data.uploadedAt,
                lastModified: data.lastModified?.toDate ? data.lastModified.toDate() : data.lastModified
              };
              return [doc.id, screenplay];
            })
          ).values()
        ) as Screenplay[];
        
        setUserScreenplays(uniqueScreenplays);
      } catch (err) {
        console.error('Error fetching user screenplays:', err);
      }
    };
    
    fetchScreenplays();
  }, [currentUser, projectId]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchApprovedContacts = async () => {
      try {
        const connectionsQuery = query(
          collection(db, 'connections'),
          where('status', '==', 'accepted'),
          where('userId', '==', currentUser.uid)
        );
        const reverseConnectionsQuery = query(
          collection(db, 'connections'),
          where('status', '==', 'accepted'),
          where('connectedUserId', '==', currentUser.uid)
        );
        const [directSnap, reverseSnap] = await Promise.all([
          getDocs(connectionsQuery),
          getDocs(reverseConnectionsQuery)
        ]);
        const directContacts = directSnap.docs.map(doc => doc.data().connectedUserId);
        const reverseContacts = reverseSnap.docs.map(doc => doc.data().userId);
        setApprovedContacts([...new Set([...directContacts, ...reverseContacts])]);
      } catch (error) {
        setApprovedContacts([]);
      }
    };
    fetchApprovedContacts();
  }, [currentUser]);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load real workspaces from Firestore
      const workspacesRef = collection(db, 'workspaces');
      let q = query(workspacesRef);
      if (projectId) {
        q = query(workspacesRef, where('projectId', '==', projectId));
      }
      const snap = await getDocs(q);
      const workspaceList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CollaborationWorkspace[];
      setWorkspaces(workspaceList);
      if (workspaceList.length > 0) {
        setSelectedWorkspace(workspaceList[0]);
      } else {
        setSelectedWorkspace(null);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
      setError('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  // User search functionality
  const searchUsers = async (queryStr: string) => {
    if (!queryStr.trim()) {
      setUserSearchResults([]);
      return;
    }
    setIsSearchingUsers(true);
    // Do NOT clear userSearchResults here; keep previous results while loading
    try {
      let allResults: UserSearchResult[] = [];
      if (approvedContacts.length > 0) {
        // Fetch all approved contacts' crew profiles in chunks of 10
        const crewProfilesRef = collection(db, 'crewProfiles');
        const approvedChunks = [];
        for (let i = 0; i < approvedContacts.length; i += 10) {
          approvedChunks.push(approvedContacts.slice(i, i + 10));
        }
        for (const chunk of approvedChunks) {
          const q = query(crewProfilesRef, where('uid', 'in', chunk));
          const snap = await getDocs(q);
          allResults = allResults.concat(
            snap.docs.map(doc => ({
              id: doc.id,
              name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
              email: doc.data().email || '',
              avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
              role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
              company: doc.data().company || ''
            }))
          );
        }
      } else {
        // Fallback: search all crew profiles
        const crewProfilesRef = collection(db, 'crewProfiles');
        const snap = await getDocs(crewProfilesRef);
        console.log('[CollabModal] Fallback: found', snap.docs.length, 'crew profiles in Firestore');
        allResults = snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
          email: doc.data().email || '',
          avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
          role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
          company: doc.data().company || ''
        }));
        if (allResults.length === 0) {
          console.warn('[CollabModal] No crew profiles found in Firestore crewProfiles collection.');
        }
      }
      // Filter by search query
      const filtered = allResults.filter(user =>
        (user.name || '').toLowerCase().includes(queryStr.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(queryStr.toLowerCase()) ||
        (user.role || '').toLowerCase().includes(queryStr.toLowerCase()) ||
        (user.company || '').toLowerCase().includes(queryStr.toLowerCase())
      );
      console.log('[CollabModal] Filtered users after search:', filtered.length, filtered.map(u => u.name));
      setUserSearchResults(filtered);
    } catch (error) {
      console.error('[CollabModal] Error searching users:', error);
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
    toast.success(`Added ${user.name} to workspace successfully!`);
  };

  // Workspace creation handlers
  const handleCreateWorkspaceStep = () => {
    if (workspaceCreationStep === 'details') {
      if (!newWorkspaceData.name.trim()) {
        toast.error('Please enter a workspace name');
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
      toast.success(`Workspace "${newWorkspaceData.name.trim()}" created successfully!`);
    } catch (error) {
      console.error('Error in handleCreateWorkspace:', error);
      toast.error('Failed to create workspace. Please try again.');
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
    toast.success('Workspace settings updated successfully!');
  };

  // Video call functionality will be added in a future update

  // Handle joining a workspace
  const handleJoinWorkspace = (workspaceId: string) => {
    try {
      console.log('Join workspace clicked:', workspaceId);
      const workspace = workspaces.find(ws => ws.id === workspaceId);
      if (workspace) {
        setSelectedWorkspace(workspace);
        toast.success(`Successfully joined workspace: ${workspace.name}`);
      }
    } catch (error) {
      console.error('Error in handleJoinWorkspace:', error);
    }
  };

  // Handle workspace settings
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

  // Screenplay upload handler
  const handleScreenplayUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setScreenplayFile(file);
    setUploadingScreenplay(true);

    try {
      // Upload file to storage
      const storageRef = ref(storage, `screenplays/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Create screenplay data with proper typing
      const now = new Date();
      const screenplayData: Omit<Screenplay, 'id'> = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        url: downloadURL,
        uploadedBy: currentUser.uid,
        teamMembers: [currentUser.uid],
        size: file.size,
        uploadedAt: now,
        lastModified: now
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'screenplays'), screenplayData);
      
      // Create the complete screenplay object with ID
      const uploadedScreenplay: Screenplay = {
        ...screenplayData,
        id: docRef.id
      };

      // Update state
      setUploadedScreenplay(uploadedScreenplay);
      setScreenplayFile(null);
      
      // Update the screenplays list
      setUserScreenplays(prev => [...prev, uploadedScreenplay]);
      
      toast.success(`${file.name} ${t('collaboration.screenplaysTab.uploadSuccess')}`);
      loadTeamMembers();
    } catch (error) {
      console.error('Error uploading screenplay:', error);
      toast.error(t('collaboration.screenplaysTab.uploadFailed'));
    } finally {
      setUploadingScreenplay(false);
      e.target.value = '';
    }
  };

  const loadTeamMembers = async () => {
    try {
      if (!selectedWorkspace) {
        setTeamMembers([]);
        return;
      }
      // Load real team members from Firestore crewProfiles collection
      const memberIds = selectedWorkspace.members?.map(m => m.userId) || [];
      if (memberIds.length === 0) {
        setTeamMembers([]);
        return;
      }
      const crewProfilesRef = collection(db, 'crewProfiles');
      const chunks = [];
      for (let i = 0; i < memberIds.length; i += 10) {
        chunks.push(memberIds.slice(i, i + 10));
      }
      let allMembers: any[] = [];
      for (const chunk of chunks) {
        const q = query(crewProfilesRef, where('uid', 'in', chunk));
        const snap = await getDocs(q);
        allMembers = allMembers.concat(snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
          email: doc.data().email || '',
          role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
          avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
          isOnline: doc.data().isOnline || false
        })));
      }
      setTeamMembers(allMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
      setTeamMembers([]);
    }
  };

  // Add annotation to screenplay (reference version)
  const addAnnotation = async () => {
    if (!newAnnotation.trim() || !uploadedScreenplay) return;
    try {
      const annotationData = {
        screenplayId: uploadedScreenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        annotation: newAnnotation.trim(),
        timestamp: new Date(),
        projectId: projectId || 'default-project'
      };
      await addDoc(collection(db, 'screenplayAnnotations'), annotationData);
      setScreenplayAnnotations(prev => [...prev, {
        id: Date.now().toString(),
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        annotation: newAnnotation.trim(),
        timestamp: new Date()
      }]);
      setNewAnnotation('');
      setShowScreenplayViewer(true);
      toast.success('Annotation added successfully!');
    } catch (error) {
      console.error('Error adding annotation:', error);
      toast.error('Failed to add annotation');
    }
  };

  // Load screenplay annotations (reference version)
  const loadAnnotations = async () => {
    if (!uploadedScreenplay) return;
    try {
      const q = query(
        collection(db, 'screenplayAnnotations'),
        where('screenplayId', '==', uploadedScreenplay.id),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const annotations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setScreenplayAnnotations(annotations);
    } catch (error) {
      console.error('Error loading annotations:', error);
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

  const handleGenerateReport = () => {
    // Navigate to the breakdown reports component
    setActiveTab('screenplays');
    // You can add additional logic here to generate a comprehensive report
    // For now, we'll just show a toast notification
    toast.success('Generating screenplay breakdown report...');

    // In a real implementation, you might want to:
    // 1. Collect all annotations and tags
    // 2. Generate a PDF report
    // 3. Include breakdown elements
    // 4. Add analytics and insights
  };

  // No-op: upload is handled by handleScreenplayUpload
  function handleUploadScreenplay() {
    // Upload is handled by handleScreenplayUpload via file input
  }

  const handleDeleteScreenplay = async (screenplayId: string) => {
    if (window.confirm(t('collaboration.screenplaysTab.deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'screenplays', screenplayId));
        toast.success(t('collaboration.screenplaysTab.deleteSuccess'));
        // Refresh the screenplays list
        loadUserScreenplays();
      } catch (error) {
        console.error('Error deleting screenplay:', error);
        toast.error(t('collaboration.screenplaysTab.deleteFailed'));
      }
    }
  };

  const loadUserScreenplays = async () => {
    if (!currentUser) return;

    try {
      const screenplaysRef = collection(db, 'screenplays');
      // Query 1: uploadedBy == currentUser.uid
      const q1 = query(screenplaysRef, where('uploadedBy', '==', currentUser.uid));
      const snap1 = await getDocs(q1);
      // Query 2: teamMembers array-contains currentUser.uid
      const q2 = query(screenplaysRef, where('teamMembers', 'array-contains', currentUser.uid));
      const snap2 = await getDocs(q2);
      
      // Combine and deduplicate screenplays
      const allScreenplays = [...snap1.docs, ...snap2.docs];
      const uniqueScreenplays = Array.from(
        new Map(
          allScreenplays.map(doc => {
            const data = doc.data();
            // Ensure we have all required fields and handle timestamps
            const screenplay: Screenplay = {
              id: doc.id,
              name: data.name || 'Untitled Screenplay',
              type: data.type || 'pdf',
              url: data.url || '',
              uploadedBy: data.uploadedBy,
              teamMembers: data.teamMembers || [],
              size: data.size,
              // Convert Firestore timestamps to Date objects
              uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : data.uploadedAt,
              lastModified: data.lastModified?.toDate ? data.lastModified.toDate() : data.lastModified
            };
            return [doc.id, screenplay];
          })
        ).values()
      ) as Screenplay[];
      
      setUserScreenplays(uniqueScreenplays);
    } catch (err) {
      console.error('Error fetching user screenplays:', err);
    }
  };

  // Open screenplay viewer modal (reference version)
  const openScreenplayViewer = (screenplay: any) => {
    setSelectedScreenplayId(screenplay.id);
    setShowScreenplayModal(true);
  };

  // Delete workspace handler
  const handleDeleteWorkspace = (workspaceId: string) => {
    if (window.confirm(t('collaboration.workspaceDeleteConfirm'))) {
      setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
      if (selectedWorkspace?.id === workspaceId) {
        setSelectedWorkspace(null);
      }
    }
  };

  const renderWorkspacesTab = () => (
    <div className="workspaces-tab">
      <div className="workspaces-header">
        <h2>{t('collaboration.workspacesTab.title')}</h2>
        <button className="create-workspace-btn" onClick={() => setShowCreateWorkspaceModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {t('collaboration.workspacesTab.createWorkspace')}
        </button>
      </div>

      <div className="workspaces-grid">
        {workspaces.map(workspace => (
          <div
            key={workspace.id}
            className={`workspace-card ${selectedWorkspace?.id === workspace.id ? 'selected' : ''}`}
            onClick={() => setSelectedWorkspace(workspace)}
          >
            {/* Settings gear icon in top-right */}
            <button
              className="workspace-settings-gear"
              title="Settings"
              aria-label="Settings"
              onClick={e => { e.stopPropagation(); handleWorkspaceSettings(workspace.id); }}
              style={{ position: 'absolute', top: 16, right: 48, background: 'none', border: 'none', padding: 0, cursor: 'pointer', zIndex: 2 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            {/* Delete workspace button */}
            <button
              className="workspace-delete-btn"
              title="Delete Workspace"
              aria-label="Delete Workspace"
              onClick={e => { e.stopPropagation(); handleDeleteWorkspace(workspace.id); }}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', padding: 0, cursor: 'pointer', zIndex: 2 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
            {/* Card content */}
            <div className="workspace-header">
              <div className="workspace-title-section">
                <div className="workspace-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </div>
                <div className="workspace-info">
                  <h3 className="workspace-title" style={{ color: selectedWorkspace?.id === workspace.id ? '#1a1a1a' : '#fff', fontWeight: 600 }}>{workspace.name}</h3>
                  <span className={`workspace-type ${workspace.type}`} style={{ color: selectedWorkspace?.id === workspace.id ? '#666' : '#fff', background: selectedWorkspace?.id === workspace.id ? '#f0f0f0' : 'rgba(255,255,255,0.15)' }}>{workspace.type}</span>
                </div>
              </div>
            </div>

            <p className="workspace-description" style={{ color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{workspace.description}</p>

            <div className="workspace-stats">
              <div className="stat" style={{ color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span className="stat-value" style={{ color: selectedWorkspace?.id === workspace.id ? '#333' : '#fff', fontWeight: 600 }}>{workspace.members.length}</span>
                <span className="stat-label" style={{ color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)' }}>Members</span>
              </div>
              <div className="stat" style={{ color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span className="stat-value" style={{ color: selectedWorkspace?.id === workspace.id ? '#333' : '#fff', fontWeight: 600 }}>{workspace.members.filter(m => m.isOnline).length}</span>
                <span className="stat-label" style={{ color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)' }}>Online</span>
              </div>
            </div>

            <div className="workspace-actions">
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinWorkspace(workspace.id);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10,17 15,12 10,7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Join
              </button>
              <button
                className="btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddMemberModal(true);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Add Member
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
              <h3>{t('collaboration.createWorkspaceModal.title')}</h3>
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
                  <h4>{t('collaboration.createWorkspaceModal.step1')}</h4>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.workspaceName')} *</label>
                    <input
                      type="text"
                      value={newWorkspaceData.name}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('collaboration.createWorkspaceModal.workspaceNamePlaceholder')}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.description')}</label>
                    <textarea
                      value={newWorkspaceData.description}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t('collaboration.createWorkspaceModal.descriptionPlaceholder')}
                      className="form-input"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.workspaceType')}</label>
                    <select
                      value={newWorkspaceData.type}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="form-input"
                    >
                      <option value="project">{t('collaboration.workspaceTypes.project')}</option>
                      <option value="department">{t('collaboration.workspaceTypes.department')}</option>
                      <option value="general">{t('collaboration.workspaceTypes.general')}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Add Members */}
              {workspaceCreationStep === 'members' && (
                <div className="step-content">
                  <h4>{t('collaboration.createWorkspaceModal.step2')}</h4>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.searchUsers')}</label>
                    <UserAutocomplete
                      value={newWorkspaceData.selectedMembers}
                      onChange={(users: UserAutocompleteOption[]) => setNewWorkspaceData(prev => ({ ...prev, selectedMembers: users }))}
                      onSearch={handleUserSearchChange}
                      options={userSearchResults}
                      loading={isSearchingUsers}
                      placeholder={t('collaboration.createWorkspaceModal.searchPlaceholder')}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Settings */}
              {workspaceCreationStep === 'settings' && (
                <div className="step-content">
                  <h4>{t('collaboration.createWorkspaceModal.step3')}</h4>
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
                      {t('collaboration.createWorkspaceModal.allowGuestAccess')}
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
                      {t('collaboration.createWorkspaceModal.requireApproval')}
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
                      {t('collaboration.createWorkspaceModal.autoArchive')}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.retentionPeriod')}</label>
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
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem 1rem 2rem' }}>
              <button className="btn-secondary" onClick={() => {
                if (workspaceCreationStep === 'details') {
                  setShowCreateWorkspaceModal(false);
                  setWorkspaceCreationStep('details');
                } else if (workspaceCreationStep === 'members') {
                  setWorkspaceCreationStep('details');
                } else if (workspaceCreationStep === 'settings') {
                  setWorkspaceCreationStep('members');
                }
              }}>{t('collaboration.createWorkspaceModal.cancel')}</button>
              <button className="btn-primary" onClick={handleCreateWorkspaceStep}>{workspaceCreationStep === 'settings' ? t('collaboration.createWorkspaceModal.createWorkspace') : t('collaboration.createWorkspaceModal.next')}</button>
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
              }} className="close-btn" aria-label="Close">×</button>
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
                  onChange={(users: UserAutocompleteOption[]) => {
                    // Only add new users
                    const newUsers = users.filter((u: UserAutocompleteOption) => !(selectedWorkspace && selectedWorkspace.members.some(m => m.userId === u.id)));
                    newUsers.forEach((user: UserAutocompleteOption) => addUserToWorkspace(user));
                    setShowAddMemberModal(false);
                    setUserSearchQuery('');
                    setUserSearchResults([]);
                  }}
                  onSearch={handleUserSearchChange}
                  options={userSearchResults}
                  loading={isSearchingUsers}
                  placeholder="Search by name, email, or role..."
                />
                {/* Live feedback for search */}
                {isSearchingUsers && <div className="searching-indicator">Searching...</div>}
                {!isSearchingUsers && userSearchQuery.trim() && userSearchResults.length === 0 && <div className="searching-indicator">No friends found.</div>}
                {!isSearchingUsers && !userSearchQuery.trim() && <div className="searching-indicator">Start typing to search for users</div>}
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
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem 1rem 2rem' }}>
              <button className="btn-secondary" onClick={() => setShowSettingsModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateWorkspaceSettings}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* Video call functionality will be added in a future update */}
    </div>
  );

  const renderTasksTab = () => (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h2>{t('collaboration.tasksTab.title')}</h2>
        <p>{t('collaboration.tasksTab.subtitle')}</p>
      </div>

      <div className="tasks-content">
        <CollaborativeTasksHub projectId={projectId || 'default-project'} />
      </div>
    </div>
  );

  const renderScreenplaysTab = () => (
    <div className="screenplays-tab">
      <div className="screenplays-header">
        <h2>{t('collaboration.screenplaysTab.title')}</h2>
        <p>{t('collaboration.screenplaysTab.subtitle')}</p>
      </div>
      <div className="screenplays-content">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label htmlFor="screenplay-upload" style={{
            display: 'inline-block',
            background: '#1976d2',
            color: '#fff',
            padding: '0.75rem 2rem',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: uploadingScreenplay ? 'not-allowed' : 'pointer',
            opacity: uploadingScreenplay ? 0.6 : 1,
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
            marginBottom: 16
          }}>
            {uploadingScreenplay ? t('collaboration.screenplaysTab.uploading') : t('collaboration.screenplaysTab.uploadScreenplay')}
            <input
              id="screenplay-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              onChange={handleScreenplayUpload}
              disabled={uploadingScreenplay}
            />
          </label>
        </div>
        <div className="screenplays-list bg-white rounded-lg shadow-md p-6">
          {userScreenplays.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>
              No screenplays uploaded yet.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {userScreenplays.map(screenplay => (
                <li key={screenplay.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: '#222' }}>{screenplay.name}</span>
                    <span style={{ color: '#888', fontSize: '0.95em', marginLeft: 12 }}>{screenplay.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.95em' }}
                      onClick={() => openScreenplayViewer(screenplay)}
                    >
                      {t('collaboration.view')}
                    </button>
                    <button
                      className="btn-danger"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.95em' }}
                      onClick={() => handleDeleteScreenplay(screenplay.id)}
                    >
                      {t('collaboration.delete')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workspaces':
        return renderWorkspacesTab();
      case 'tasks':
        return renderTasksTab();
      case 'screenplays':
        return renderScreenplaysTab();
      default:
        return (
          <div className="error-content">
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
          <h1>{t('collaboration.title')}</h1>
          <div className="header-actions">
            {/* Video call functionality will be added in a future update */}
          </div>
        </div>

        <div className="collaboration-content">
          <div className="collaboration-sidebar">
            <nav className="collaboration-nav">
              <button 
                className={`nav-item ${activeTab === 'workspaces' ? 'active' : ''}`}
                onClick={() => setActiveTab('workspaces')}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                <span className="nav-label">{t('collaboration.workspaces')}</span>
              </button>
              

              <button 
                className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                <span className="nav-label">{t('collaboration.tasks')}</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'screenplays' ? 'active' : ''}`}
                onClick={() => setActiveTab('screenplays')}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <span className="nav-label">{t('collaboration.screenplays')}</span>
              </button>
            </nav>
          </div>

          <div className="collaboration-main">
            {renderTabContent()}
          </div>
        </div>

        {/* Screenplay Viewer Modal */}
        {showScreenplayViewer && uploadedScreenplay && (
          <ScreenplayViewer
            screenplay={{
              id: uploadedScreenplay.id || '',
              name: uploadedScreenplay.name,
              url: uploadedScreenplay.url,
              type: uploadedScreenplay.type
            }}
            projectId={projectId || 'default-project'}
            onClose={() => setShowScreenplayViewer(false)}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {/* Full-Screen Screenplay Modal */}
        {showScreenplayModal && selectedScreenplayId && (
          <div 
            className="screenplay-modal-overlay"
            onScroll={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="screenplay-modal">
              <div className="modal-content">
                {(() => {
                  const selectedScreenplay = userScreenplays.find(s => s.id === selectedScreenplayId);
                  if (!selectedScreenplay) return null;
                  
                  return (
                    <ScreenplayViewer
                      screenplay={{
                        id: selectedScreenplay.id,
                        name: selectedScreenplay.name,
                        url: selectedScreenplay.url,
                        type: selectedScreenplay.type
                      }}
                      projectId={projectId || 'default-project'}
                      onClose={() => {
                        setShowScreenplayModal(false);
                        setSelectedScreenplayId(null);
                      }}
                      onGenerateReport={handleGenerateReport}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </CollaborationErrorBoundary>
  );
};

export default CollaborationHub; 