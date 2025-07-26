import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SocialService } from '../../utilities/socialService.v2';
import { getDisplayName, getPhotoUrl } from '../../types/Profile';
import ChatInterface from './ChatInterface';

const ChatTestPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load real user profile when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!currentUser?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get user profile from crewProfiles (single source of truth)
        const profile = await SocialService.getProfile(currentUser.uid);
        
        if (profile) {
          setUserProfile({
            id: currentUser.uid,
            name: profile.name || profile.displayName || currentUser.email?.split('@')[0] || 'User',
            displayName: profile.name || profile.displayName || currentUser.email?.split('@')[0] || 'User',
            avatar: getPhotoUrl(profile),
            role: profile.jobTitles?.[0]?.title || profile.role || 'Crew Member',
            company: profile.company || '',
            location: profile.residences?.[0]?.city || profile.location || '',
            isOnline: true,
            lastSeen: new Date()
          });
        } else {
          // Fallback if no profile found
          setUserProfile({
            id: currentUser.uid,
            name: currentUser.email?.split('@')[0] || 'User',
            displayName: currentUser.email?.split('@')[0] || 'User',
            avatar: currentUser.photoURL || undefined,
            role: 'Crew Member',
            company: '',
            location: '',
            isOnline: true,
            lastSeen: new Date()
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Fallback to basic user info
        setUserProfile({
          id: currentUser.uid,
          name: currentUser.email?.split('@')[0] || 'User',
          displayName: currentUser.email?.split('@')[0] || 'User',
          avatar: currentUser.photoURL || undefined,
          role: 'Crew Member',
          company: '',
          location: '',
          isOnline: true,
          lastSeen: new Date()
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [currentUser?.uid]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat</h1>
          <p className="text-gray-600 mb-6">Please sign in to access messaging</p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            
            <button
              onClick={() => navigate('/register')}
              className="block bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Remove the intro and go directly to chat
  if (!showChat) {
    setShowChat(true);
    return null;
  }

  return (
    <ChatInterface
      currentUserId={currentUser.uid}
      currentUserName={userProfile?.displayName || 'User'}
      currentUserAvatar={userProfile?.avatar}
    />
  );
};

export default ChatTestPage; 