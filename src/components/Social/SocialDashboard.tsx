import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { FollowRequest, SocialNotification, ActivityFeedItem, Follow } from '../../types/Social';
import { CrewProfile } from '../../types/CrewProfile';
import { SocialService } from '../../utilities/socialService';
import { UserUtils, UserProfile } from '../../utilities/userUtils';
import QuickMessage from './QuickMessage';
import FollowButton from './FollowButton';
import ActivityFeed from './ActivityFeed';
import ChatInterface from '../Chat/ChatInterface';
import { SocialAnalytics } from './SocialAnalytics';
import { AdvancedMessaging } from './AdvancedMessaging';
import NotificationBell from './NotificationBell';
import { performanceMonitor } from '../../utilities/performanceUtils';
import './SocialDashboard.scss';

interface SocialDashboardProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
}

const SocialDashboard: React.FC<SocialDashboardProps> = ({ 
  currentUserId, 
  currentUserName,
  currentUserAvatar 
}) => {
  console.log('[SocialDashboard] Component rendered with props:', { currentUserId, currentUserName, currentUserAvatar });
  
  const [activeTab, setActiveTab] = useState<'feed' | 'analytics' | 'messaging'>('feed');
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CrewProfile | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User profiles cache
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());

  // Early return if no user ID
  if (!currentUserId) {
    console.log('[SocialDashboard] No currentUserId provided, showing loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-light text-gray-600">Loading social dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">User ID: {currentUserId || 'Not provided'}</p>
        </div>
      </div>
    );
  }

  // Simple test version - just show basic content
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Social Hub</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">User Info</h3>
              <p className="text-sm text-blue-700">ID: {currentUserId}</p>
              <p className="text-sm text-blue-700">Name: {currentUserName}</p>
              <p className="text-sm text-blue-700">Avatar: {currentUserAvatar || 'None'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Followers</h3>
              <p className="text-2xl font-bold text-green-700">{followers.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Following</h3>
              <p className="text-2xl font-bold text-purple-700">{following.length}</p>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tabs</h2>
            <div className="flex space-x-4 mb-6">
              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'feed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab('feed')}
              >
                Activity Feed
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'messaging' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab('messaging')}
              >
                Messaging
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {activeTab === 'feed' && 'Activity Feed'}
                {activeTab === 'analytics' && 'Social Analytics'}
                {activeTab === 'messaging' && 'Advanced Messaging'}
              </h3>
              
              {activeTab === 'feed' && (
                <div>
                  <p className="text-gray-600 mb-4">Activity feed content will be loaded here.</p>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-500">Loading ActivityFeed component...</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div>
                  <p className="text-gray-600 mb-4">Analytics content will be loaded here.</p>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-500">Loading SocialAnalytics component...</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'messaging' && (
                <div>
                  <p className="text-gray-600 mb-4">Messaging content will be loaded here.</p>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-500">Loading AdvancedMessaging component...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">State</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Loading: {loading ? 'Yes' : 'No'}</li>
                <li>Error: {error || 'None'}</li>
                <li>Follow Requests: {followRequests.length}</li>
                <li>Notifications: {notifications.length}</li>
                <li>Crew Profiles: {crewProfiles.length}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Props</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>User ID: {currentUserId}</li>
                <li>User Name: {currentUserName}</li>
                <li>User Avatar: {currentUserAvatar || 'None'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialDashboard;
