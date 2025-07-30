import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProjectCrewService } from '../services/ProjectCrewService';
import { Project, ProjectCrewMember, ProjectInvitation } from '../models/Project';
import { User, Plus, X, Users, Mail, Calendar, Trash2, UserCheck, UserX, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  company?: string;
}

interface ProjectCrewManagementProps {
  project: Project;
  onUpdate: () => void;
}

const ProjectCrewManagement: React.FC<ProjectCrewManagementProps> = ({ project, onUpdate }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [crewMembers, setCrewMembers] = useState<ProjectCrewMember[]>([]);
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteRole, setInviteRole] = useState('');
  const [inviteDepartment, setInviteDepartment] = useState('');
  
  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  const isOwner = currentUser?.uid === project.owner_uid;
  const currentUserCrewMember = crewMembers.find(member => member.userId === currentUser?.uid);

  useEffect(() => {
    loadCrewData();
  }, [project.id]);

  const loadCrewData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [crew, invites] = await Promise.all([
        ProjectCrewService.getProjectCrewMembers(project.id),
        Promise.resolve(project.invitedCrewMembers || [])
      ]);
      
      setCrewMembers(crew);
      setInvitations(invites);
    } catch (err) {
      console.error('Error loading crew data:', err);
      setError('Failed to load crew data');
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
    try {
      // Search crew profiles
      const crewProfilesRef = collection(db, 'crewProfiles');
      const crewQuery = query(
        crewProfilesRef,
        where('isPublished', '==', true),
        limit(20)
      );
      const crewSnapshot = await getDocs(crewQuery);
      
      const results: UserSearchResult[] = [];
      crewSnapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        const name = data.name || data.displayName || data.firstName || '';
        
        if (doc.id !== currentUser?.uid && 
            name.toLowerCase().includes(queryStr.toLowerCase())) {
          results.push({
            id: doc.id,
            name: name || `Crew Member ${doc.id.slice(-4)}`,
            email: data.email || '',
            avatar: data.profileImageUrl || data.avatarUrl,
            role: data.jobTitles?.[0]?.title || data.role || 'Crew Member',
            company: data.company || ''
          });
        }
      });
      
      console.log('[CrewManagement] Found users:', results.length);
      setUserSearchResults(results);
    } catch (error) {
      console.error('[CrewManagement] Error searching users:', error);
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

  const handleInviteCrewMember = async () => {
    if (!selectedUser) {
      setError(t('crewManagement.selectUser'));
      return;
    }

    try {
      setError(null);
      console.log('[CrewManagement] Starting to add crew member:', selectedUser.name);
      console.log('[CrewManagement] Project ID:', project.id);
      console.log('[CrewManagement] User ID:', selectedUser.id);
      console.log('[CrewManagement] Role:', inviteRole || 'Crew Member');
      console.log('[CrewManagement] Department:', inviteDepartment || 'General');
      
      // For now, allow adding any crew member without authentication requirements
      await ProjectCrewService.addCrewMember(project.id, {
        userId: selectedUser.id,
        userEmail: selectedUser.email,
        displayName: selectedUser.name,
        role: inviteRole || 'Crew Member',
        department: inviteDepartment || 'General',
        status: 'active',
        permissions: [],
        canEdit: false,
        canInvite: false,
        canRemoveSelf: true
      });

      console.log('[CrewManagement] Crew member added successfully');
      setSelectedUser(null);
      setInviteRole('');
      setInviteDepartment('');
      setShowInviteForm(false);
      setUserSearchQuery('');
      setUserSearchResults([]);
      onUpdate();
      loadCrewData();
    } catch (err: any) {
      console.error('[CrewManagement] Error adding crew member:', err);
      console.error('[CrewManagement] Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      setError(err.message || t('crewManagement.failedToInvite'));
    }
  };

  const handleRemoveCrewMember = async (userId: string) => {
    if (!currentUser?.uid) return;

    try {
      setError(null);
      await ProjectCrewService.removeCrewMember(project.id, userId, currentUser.uid);
      onUpdate();
      loadCrewData();
    } catch (err: any) {
      console.error('Error removing crew member:', err);
      setError(err.message || t('crewManagement.failedToRemove'));
    }
  };

  const handleRespondToInvitation = async (invitation: ProjectInvitation, response: 'accepted' | 'declined') => {
    try {
      setError(null);
      await ProjectCrewService.respondToInvitation(project.id, invitation.userId, response);
      onUpdate();
      loadCrewData();
    } catch (err: any) {
      console.error('Error responding to invitation:', err);
      setError(err.message || t('crewManagement.failedToRespond'));
    }
  };

  const canInvite = isOwner || currentUserCrewMember?.canInvite;
  const canRemove = isOwner || (currentUserCrewMember?.canEdit && currentUserCrewMember?.userId === currentUser?.uid);

  console.log('[CrewManagement] Debug info:', {
    isOwner,
    currentUserCrewMember,
    canInvite,
    currentUser: currentUser?.uid
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('crewManagement.title')}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {crewMembers.length}
          </span>
        </div>
        
        <button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          style={{ display: canInvite ? 'flex' : 'none' }}
        >
          <Plus className="w-4 h-4" />
          Add Crew Member
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Invite Form */}
      {showInviteForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Add New Crew Member</h4>
            <button
              onClick={() => {
                setShowInviteForm(false);
                setSelectedUser(null);
                setUserSearchQuery('');
                setUserSearchResults([]);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* User Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Crew Members
            </label>
            <div className="relative">
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => handleUserSearchChange(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, role, or company..."
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            
            {/* Search Results */}
            {userSearchResults.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {userSearchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <User className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.role} • {user.company}</p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isSearchingUsers && (
              <div className="mt-2 text-sm text-gray-500">Searching...</div>
            )}
          </div>
          
          {/* Selected User Display */}
          {selectedUser && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.role} • {selectedUser.company}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('crewManagement.role')}
              </label>
              <input
                type="text"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('crewManagement.rolePlaceholder')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('crewManagement.department')}
              </label>
              <input
                type="text"
                value={inviteDepartment}
                onChange={(e) => setInviteDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('crewManagement.departmentPlaceholder')}
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleInviteCrewMember}
              disabled={!selectedUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Crew Member
            </button>
            <button
              onClick={() => {
                setShowInviteForm(false);
                setSelectedUser(null);
                setUserSearchQuery('');
                setUserSearchResults([]);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              {t('crewManagement.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Crew Members List */}
      <div className="space-y-3">
        {crewMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('crewManagement.noCrewMembers')}</p>
            {canInvite && (
              <p className="text-sm mt-1">{t('crewManagement.inviteToGetStarted')}</p>
            )}
          </div>
        ) : (
          crewMembers.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.displayName}</p>
                  <p className="text-sm text-gray-600">{member.role} • {member.department}</p>
                  <p className="text-xs text-gray-500">
                    {t('crewManagement.joinedRecently')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {member.status === 'active' && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {t('crewManagement.active')}
                  </span>
                )}
                
                {(isOwner || (member.userId === currentUser?.uid && member.canRemoveSelf)) && (
                  <button
                    onClick={() => handleRemoveCrewMember(member.userId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('crewManagement.removeFromProject')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pending Invitations */}
      {invitations.filter(invite => invite.status === 'pending').length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">{t('crewManagement.pendingInvitations')}</h4>
          <div className="space-y-3">
            {invitations
              .filter(invite => invite.status === 'pending')
              .map((invitation) => (
                <div
                  key={invitation.userId}
                  className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invitation.displayName}</p>
                      <p className="text-sm text-gray-600">{invitation.role} • {invitation.department}</p>
                      <p className="text-xs text-gray-500">{invitation.userEmail}</p>
                    </div>
                  </div>
                  
                  {invitation.userId === currentUser?.uid && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespondToInvitation(invitation, 'accepted')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRespondToInvitation(invitation, 'declined')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCrewManagement; 