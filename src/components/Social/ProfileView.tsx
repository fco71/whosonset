import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { CrewProfile } from '../../types/CrewProfile';
import { FollowRequest, Follow } from '../../types/Social';
import { SocialService } from '../../utilities/socialService';
import './ProfileView.scss';

interface ProfileViewProps {
  profileId: string;
  currentUserId: string;
  currentUser: any;
  onClose?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profileId, currentUserId, currentUser, onClose }) => {
  const [profile, setProfile] = useState<CrewProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'following' | 'blocked'>('none');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'contact'>('overview');
  const [mutualFollowers, setMutualFollowers] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
    checkFollowStatus();
  }, [profileId, currentUserId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const profileDoc = await getDoc(doc(db, 'crewProfiles', profileId));
      
      if (profileDoc.exists()) {
        const profileData = {
          uid: profileDoc.id,
          ...profileDoc.data()
        } as CrewProfile;
        setProfile(profileData);
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const status = await SocialService.getFollowStatus(currentUserId, profileId);
      setFollowStatus(status);
      
      if (status === 'following') {
        loadMutualFollowers();
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const loadMutualFollowers = async () => {
    try {
      // Get current user's followers
      const userFollowersQuery = query(
        collection(db, 'follows'),
        where('followingId', '==', currentUserId),
        where('status', '==', 'active')
      );
      const userFollowers = await getDocs(userFollowersQuery);
      const userFollowerIds = userFollowers.docs.map(doc => doc.data().followerId);

      // Get profile's followers
      const profileFollowersQuery = query(
        collection(db, 'follows'),
        where('followingId', '==', profileId),
        where('status', '==', 'active')
      );
      const profileFollowers = await getDocs(profileFollowersQuery);
      const profileFollowerIds = profileFollowers.docs.map(doc => doc.data().followerId);

      // Find mutual followers
      const mutualIds = userFollowerIds.filter(id => profileFollowerIds.includes(id));
      
      if (mutualIds.length > 0) {
        const mutualFollowersData = await Promise.all(
          mutualIds.map(async (id) => {
            const followDoc = await getDoc(doc(db, 'follows', id));
            return followDoc.data() as Follow;
          })
        );
        setMutualFollowers(mutualFollowersData);
      }
    } catch (error) {
      console.error('Error loading mutual followers:', error);
    }
  };

  const sendFollowRequest = async (message: string) => {
    try {
      setLoading(true);
      setError(null);
      await SocialService.sendFollowRequest(currentUserId, profileId, message);
      setFollowStatus('pending');
      setShowRequestModal(false);
      setRequestMessage('');
    } catch (error) {
      console.error('Error sending follow request:', error);
      setError(error instanceof Error ? error.message : 'Failed to send follow request');
    } finally {
      setLoading(false);
    }
  };

  const respondToFollowRequest = async (status: 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the request
      const requestsQuery = query(
        collection(db, 'followRequests'),
        where('fromUserId', '==', profileId),
        where('toUserId', '==', currentUserId)
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      
      if (!requestsSnapshot.empty) {
        const requestDoc = requestsSnapshot.docs[0];
        await SocialService.respondToFollowRequest(requestDoc.id, status);
        
        if (status === 'accepted') {
          setFollowStatus('following');
          loadMutualFollowers();
        } else {
          setFollowStatus('none');
        }
      }
    } catch (error) {
      console.error('Error responding to follow request:', error);
      setError(error instanceof Error ? error.message : 'Failed to respond to follow request');
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async () => {
    try {
      setLoading(true);
      setError(null);
      await SocialService.unfollow(currentUserId, profileId);
      setFollowStatus('none');
      setMutualFollowers([]);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setError(error instanceof Error ? error.message : 'Failed to unfollow user');
    } finally {
      setLoading(false);
    }
  };

  const getFollowButton = () => {
    switch (followStatus) {
      case 'none':
        return (
          <button 
            className="connect-btn primary"
            onClick={() => setShowRequestModal(true)}
          >
            Follow
          </button>
        );
      case 'pending':
        return (
          <button className="connect-btn pending" disabled>
            Request Sent
          </button>
        );
      case 'following':
        return (
          <button 
            className="connect-btn connected"
            onClick={unfollowUser}
            disabled={loading}
          >
            {loading ? 'Unfollowing...' : 'Unfollow'}
          </button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="profile-view-overlay">
        <div className="profile-view-modal">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-view-overlay">
        <div className="profile-view-modal">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error || 'Profile not found'}</p>
            <button onClick={onClose} className="close-btn">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-view-overlay">
      <div className="profile-view-modal">
        <button onClick={onClose} className="close-btn">×</button>
        
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt={profile.name} />
            ) : (
              <div className="avatar-placeholder">
                {profile.name?.charAt(0) || '?'}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <div className="profile-main">
              <h1>{profile.name}</h1>
              <p className="primary-role">
                {profile.jobTitles?.[0]?.title || 'Film Professional'}
              </p>
              <p className="location">
                📍 {profile.residences?.[0]?.city}, {profile.residences?.[0]?.country}
              </p>
              <div className="availability-badge">
                {profile.availability === 'available' && '🟢 Available'}
                {profile.availability === 'unavailable' && '🔴 Unavailable'}
                {profile.availability === 'soon' && '🟡 Available Soon'}
              </div>
            </div>
            
            <div className="profile-actions">
              {getFollowButton()}
              {followStatus === 'pending' && (
                <div className="pending-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => respondToFollowRequest('accepted')}
                    disabled={loading}
                  >
                    Accept Request
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => respondToFollowRequest('rejected')}
                    disabled={loading}
                  >
                    Decline
                  </button>
                </div>
              )}
              <button className="message-btn">Message</button>
              <button className="share-btn">Share Profile</button>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        <div className="profile-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'projects' ? 'active' : ''} 
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={activeTab === 'skills' ? 'active' : ''} 
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
          <button 
            className={activeTab === 'contact' ? 'active' : ''} 
            onClick={() => setActiveTab('contact')}
          >
            Contact
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {profile.bio && (
                <div className="bio-section">
                  <h3>About</h3>
                  <p>{profile.bio}</p>
                </div>
              )}
              
              {mutualFollowers.length > 0 && (
                <div className="mutual-followers-section">
                  <h3>Mutual Followers ({mutualFollowers.length})</h3>
                  <div className="mutual-followers-list">
                    {mutualFollowers.slice(0, 5).map((follow) => (
                      <div key={follow.id} className="mutual-follower">
                        <span>{follow.followerId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="projects-tab">
              <p>Projects will be displayed here</p>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="skills-tab">
              {profile.languages && profile.languages.length > 0 ? (
                <div className="skills-list">
                  <h3>Languages</h3>
                  {profile.languages.map((language: string, index: number) => (
                    <span key={index} className="skill-tag">{language}</span>
                  ))}
                </div>
              ) : (
                <p>No languages listed</p>
              )}
              
              {profile.jobTitles && profile.jobTitles.length > 0 && (
                <div className="skills-list">
                  <h3>Roles & Specializations</h3>
                  {profile.jobTitles.map((job: any, index: number) => (
                    <span key={index} className="skill-tag">{job.title}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="contact-tab">
              <p>Contact information will be displayed here</p>
            </div>
          )}
        </div>

        {/* Follow Request Modal */}
        {showRequestModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Send Follow Request</h3>
              <p>Send a message to {profile.name} along with your follow request.</p>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Write a brief message..."
                rows={4}
              />
              <div className="modal-actions">
                <button
                  onClick={() => sendFollowRequest(requestMessage)}
                  disabled={loading}
                  className="primary-btn"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestMessage('');
                  }}
                  disabled={loading}
                  className="secondary-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
