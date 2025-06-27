import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { CrewProfile } from '../../types/CrewProfile';
import { FriendRequest, SocialConnection } from '../../types/Social';
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
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected' | 'blocked'>('none');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'contact'>('overview');
  const [mutualConnections, setMutualConnections] = useState<SocialConnection[]>([]);

  useEffect(() => {
    loadProfile();
    checkConnectionStatus();
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

  const checkConnectionStatus = async () => {
    try {
      // Check for existing friend request
      const requestsQuery = query(
        collection(db, 'friendRequests'),
        where('fromUserId', '==', currentUserId),
        where('toUserId', '==', profileId)
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      
      if (!requestsSnapshot.empty) {
        const request = requestsSnapshot.docs[0].data();
        setConnectionStatus(request.status);
        return;
      }

      // Check for reverse request
      const reverseRequestsQuery = query(
        collection(db, 'friendRequests'),
        where('fromUserId', '==', profileId),
        where('toUserId', '==', currentUserId)
      );
      const reverseSnapshot = await getDocs(reverseRequestsQuery);
      
      if (!reverseSnapshot.empty) {
        const request = reverseSnapshot.docs[0].data();
        setConnectionStatus(request.status);
        return;
      }

      // Check for existing connection
      const connectionsQuery = query(
        collection(db, 'connections'),
        where('userId', '==', currentUserId),
        where('connectedUserId', '==', profileId),
        where('status', '==', 'connected')
      );
      const connectionsSnapshot = await getDocs(connectionsQuery);
      
      if (!connectionsSnapshot.empty) {
        setConnectionStatus('connected');
        loadMutualConnections();
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const loadMutualConnections = async () => {
    try {
      // Get current user's connections
      const userConnectionsQuery = query(
        collection(db, 'connections'),
        where('userId', '==', currentUserId),
        where('status', '==', 'connected')
      );
      const userConnections = await getDocs(userConnectionsQuery);
      const userConnectionIds = userConnections.docs.map(doc => doc.data().connectedUserId);

      // Get profile's connections
      const profileConnectionsQuery = query(
        collection(db, 'connections'),
        where('userId', '==', profileId),
        where('status', '==', 'connected')
      );
      const profileConnections = await getDocs(profileConnectionsQuery);
      const profileConnectionIds = profileConnections.docs.map(doc => doc.data().connectedUserId);

      // Find mutual connections
      const mutualIds = userConnectionIds.filter(id => profileConnectionIds.includes(id));
      
      if (mutualIds.length > 0) {
        const mutualConnectionsData = await Promise.all(
          mutualIds.map(async (id) => {
            const connectionDoc = await getDoc(doc(db, 'connections', id));
            return connectionDoc.data() as SocialConnection;
          })
        );
        setMutualConnections(mutualConnectionsData);
      }
    } catch (error) {
      console.error('Error loading mutual connections:', error);
    }
  };

  const sendFriendRequest = async (message: string) => {
    try {
      const requestData = {
        fromUserId: currentUserId,
        toUserId: profileId,
        status: 'pending',
        message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'friendRequests'), requestData);
      setConnectionStatus('pending');
      setShowRequestModal(false);
      setRequestMessage('');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const respondToFriendRequest = async (status: 'accepted' | 'rejected') => {
    try {
      // Find the request
      const requestsQuery = query(
        collection(db, 'friendRequests'),
        where('fromUserId', '==', profileId),
        where('toUserId', '==', currentUserId)
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      
      if (!requestsSnapshot.empty) {
        const requestDoc = requestsSnapshot.docs[0];
        await updateDoc(doc(db, 'friendRequests', requestDoc.id), { 
          status, 
          updatedAt: serverTimestamp() 
        });

        if (status === 'accepted') {
          // Create connection
          const connectionData = {
            userId: currentUserId,
            connectedUserId: profileId,
            status: 'connected',
            mutualConnections: 0,
            createdAt: serverTimestamp()
          };
          await addDoc(collection(db, 'connections'), connectionData);
          setConnectionStatus('connected');
          loadMutualConnections();
        } else {
          setConnectionStatus('none');
        }
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  const getConnectionButton = () => {
    switch (connectionStatus) {
      case 'none':
        return (
          <button 
            className="connect-btn primary"
            onClick={() => setShowRequestModal(true)}
          >
            Connect
          </button>
        );
      case 'pending':
        return (
          <button className="connect-btn pending" disabled>
            Request Sent
          </button>
        );
      case 'connected':
        return (
          <button className="connect-btn connected" disabled>
            Connected
          </button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="profile-view">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-view">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Profile Not Found</h3>
          <p>{error || 'The requested profile could not be loaded.'}</p>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-view">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar">
            <img src={profile.profileImageUrl || '/default-avatar.png'} alt={profile.name} />
            <div className="online-indicator"></div>
          </div>
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
            {getConnectionButton()}
            {connectionStatus === 'pending' && (
              <div className="pending-actions">
                <button 
                  className="accept-btn"
                  onClick={() => respondToFriendRequest('accepted')}
                >
                  Accept Request
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => respondToFriendRequest('rejected')}
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

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills & Experience
        </button>
        <button 
          className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="bio-section">
              <h3>About</h3>
              <p>{profile.bio || 'No bio available.'}</p>
            </div>

            {connectionStatus === 'connected' && mutualConnections.length > 0 && (
              <div className="mutual-connections">
                <h3>Mutual Connections ({mutualConnections.length})</h3>
                <div className="connections-grid">
                  {mutualConnections.slice(0, 6).map((connection, index) => (
                    <div key={index} className="connection-item">
                      <img src="/default-avatar.png" alt="" />
                      <span>Connection {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="stats-section">
              <div className="stat-item">
                <span className="stat-number">{profile.jobTitles?.length || 0}</span>
                <span className="stat-label">Roles</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profile.projects?.length || 0}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profile.languages?.length || 0}</span>
                <span className="stat-label">Languages</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-section">
            <h3>Recent Projects</h3>
            {profile.projects && profile.projects.length > 0 ? (
              <div className="projects-grid">
                {profile.projects.map((project, index) => (
                  <div key={index} className="project-card">
                    <h4>{project.projectName}</h4>
                    <p>{project.role}</p>
                    {project.description && (
                      <p className="project-description">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No projects listed yet.</p>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-section">
            <div className="job-titles">
              <h3>Roles & Specializations</h3>
              <div className="skills-grid">
                {profile.jobTitles?.map((job, index) => (
                  <div key={index} className="skill-tag">
                    {job.title}
                  </div>
                ))}
              </div>
            </div>

            <div className="languages">
              <h3>Languages</h3>
              <div className="skills-grid">
                {profile.languages?.map((language, index) => (
                  <div key={index} className="skill-tag">
                    {language}
                  </div>
                ))}
              </div>
            </div>

            <div className="education">
              <h3>Education</h3>
              {profile.education && profile.education.length > 0 ? (
                <ul className="education-list">
                  {profile.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              ) : (
                <p>No education information available.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <h3>Contact Information</h3>
            {profile.contactInfo ? (
              <div className="contact-info">
                {profile.contactInfo.email && (
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span>{profile.contactInfo.email}</span>
                  </div>
                )}
                {profile.contactInfo.phone && (
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span>{profile.contactInfo.phone}</span>
                  </div>
                )}
                {profile.contactInfo.website && (
                  <div className="contact-item">
                    <span className="contact-icon">🌐</span>
                    <a href={profile.contactInfo.website} target="_blank" rel="noopener noreferrer">
                      {profile.contactInfo.website}
                    </a>
                  </div>
                )}
                {profile.contactInfo.instagram && (
                  <div className="contact-item">
                    <span className="contact-icon">📷</span>
                    <a href={`https://instagram.com/${profile.contactInfo.instagram}`} target="_blank" rel="noopener noreferrer">
                      @{profile.contactInfo.instagram}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p>No contact information available.</p>
            )}
          </div>
        )}
      </div>

      {showRequestModal && (
        <div className="request-modal">
          <div className="modal-content">
            <h3>Connect with {profile.name}</h3>
            <div className="profile-preview">
              <img src={profile.profileImageUrl || '/default-avatar.png'} alt="" />
              <div>
                <h4>{profile.name}</h4>
                <p>{profile.jobTitles?.[0]?.title}</p>
              </div>
            </div>
            <textarea
              placeholder="Add a personal message (optional)..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="request-message"
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </button>
              <button 
                className="send-btn"
                onClick={() => sendFriendRequest(requestMessage)}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {onClose && (
        <button className="close-profile-btn" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default ProfileView;
