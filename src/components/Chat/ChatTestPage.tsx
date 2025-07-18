import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { useAuth } from '../../contexts/AuthContext';
import { SocialService } from '../../utilities/socialService.v2';
import { getDisplayName, getPhotoUrl } from '../../types/Profile';

const ChatTestPage: React.FC = () => {
  const { currentUser } = useAuth();
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
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Chat System</h1>
            <p className="text-gray-600">Checking authentication and loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">💬</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Chat System</h1>
            <p className="text-gray-600 mb-8">Please sign in to access the messaging system</p>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🔐 Sign In
              </button>
              
              <button
                onClick={() => window.location.href = '/register'}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                📝 Create Account
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need an account? Sign up to start messaging with your network
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showChat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">
                {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pro-Level Chat System</h1>
            <p className="text-gray-600">Connect with your network using real-time messaging</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Welcome, {userProfile?.displayName}!</h3>
              <p className="text-blue-700 text-sm">
                You're logged in as {userProfile?.role} from {userProfile?.company || 'your organization'}.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Real Data</h3>
              <p className="text-green-700 text-sm">
                This chat system uses your actual Firestore data - no mock data here!
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowChat(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            💬 Start Chat
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Your conversations and contacts will be loaded from Firestore
            </p>
          </div>
        </div>
      </div>
    );
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