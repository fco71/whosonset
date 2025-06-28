import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { CrewProfile } from '../../types/CrewProfile';
import { Project } from '../../models/Project';
import './NetworkingHub.scss';

interface NetworkingHubProps {
  currentUserId: string;
  currentUser: any;
}

interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
}

interface Collaboration {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  status: 'invited' | 'accepted' | 'declined';
  message?: string;
  createdAt: Date;
}

const NetworkingHub: React.FC<NetworkingHubProps> = ({ currentUserId, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'connections' | 'collaborations' | 'events'>('discover');
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CrewProfile | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');

  const departments = [
    'Camera', 'Sound', 'Lighting', 'Art', 'Costume', 'Makeup', 'Hair', 
    'Production', 'Directing', 'Editing', 'VFX', 'Stunts', 'Transport'
  ];

  const locations = [
    'Los Angeles', 'New York', 'London', 'Toronto', 'Vancouver', 'Atlanta',
    'New Orleans', 'Albuquerque', 'Prague', 'Budapest', 'Other'
  ];

  useEffect(() => {
    loadCrewProfiles();
    loadProjects();
    loadConnections();
    loadCollaborations();
  }, [currentUserId]);

  const loadCrewProfiles = async () => {
    try {
      const profilesQuery = query(
        collection(db, 'crewProfiles'),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(profilesQuery);
      const profiles = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as CrewProfile[];
      setCrewProfiles(profiles);
    } catch (error) {
      console.error('Error loading crew profiles:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(projectsQuery);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadConnections = async () => {
    try {
      const connectionsQuery = query(
        collection(db, 'connections'),
        where('userId', '==', currentUserId)
      );
      const snapshot = await getDocs(connectionsQuery);
      const connectionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Connection[];
      setConnections(connectionsData);
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const loadCollaborations = async () => {
    try {
      const collaborationsQuery = query(
        collection(db, 'collaborations'),
        where('userId', '==', currentUserId)
      );
      const snapshot = await getDocs(collaborationsQuery);
      const collaborationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Collaboration[];
      setCollaborations(collaborationsData);
    } catch (error) {
      console.error('Error loading collaborations:', error);
    }
  };

  const sendConnectionRequest = async (targetUserId: string, message: string) => {
    try {
      const connectionData: Omit<Connection, 'id'> = {
        userId: currentUserId,
        connectedUserId: targetUserId,
        status: 'pending',
        message,
        createdAt: new Date()
      };
      await addDoc(collection(db, 'connections'), connectionData);
      setShowConnectionModal(false);
      setConnectionMessage('');
      loadConnections();
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const respondToConnection = async (connectionId: string, status: 'accepted' | 'rejected') => {
    try {
      const connectionRef = doc(db, 'connections', connectionId);
      await updateDoc(connectionRef, { status });
      loadConnections();
    } catch (error) {
      console.error('Error responding to connection:', error);
    }
  };

  const inviteToCollaborate = async (userId: string, projectId: string, role: string, message: string) => {
    try {
      const collaborationData: Omit<Collaboration, 'id'> = {
        projectId,
        userId,
        role,
        status: 'invited',
        message,
        createdAt: new Date()
      };
      await addDoc(collection(db, 'collaborations'), collaborationData);
    } catch (error) {
      console.error('Error inviting to collaborate:', error);
    }
  };

  const filteredProfiles = crewProfiles.filter(profile => {
    const matchesDepartment = filterDepartment === 'all' || 
      profile.jobTitles?.some(job => job.title === filterDepartment);
    const matchesLocation = filterLocation === 'all' || 
      profile.residences?.some(residence => residence.country === filterLocation || residence.city === filterLocation);
    const matchesSearch = searchQuery === '' || 
      profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.jobTitles?.some(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesDepartment && matchesLocation && matchesSearch;
  });

  const getConnectionStatus = (userId: string) => {
    const connection = connections.find(c => c.connectedUserId === userId);
    return connection?.status || null;
  };

  const getCollaborationStatus = (userId: string, projectId: string) => {
    const collaboration = collaborations.find(c => 
      c.userId === userId && c.projectId === projectId
    );
    return collaboration?.status || null;
  };

  return (
    <div className="networking-hub">
      <div className="networking-header">
        <h1>🎬 Film Industry Network</h1>
        <p>Connect with crew members, discover projects, and build your professional network</p>
      </div>

      <div className="networking-tabs">
        <button 
          className={`tab ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          🔍 Discover Crew
        </button>
        <button 
          className={`tab ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          👥 Connections
        </button>
        <button 
          className={`tab ${activeTab === 'collaborations' ? 'active' : ''}`}
          onClick={() => setActiveTab('collaborations')}
        >
          🤝 Collaborations
        </button>
        <button 
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          📅 Industry Events
        </button>
      </div>

      {activeTab === 'discover' && (
        <div className="discover-section">
          <div className="filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name, skills, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select 
                value={filterDepartment} 
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select 
                value={filterLocation} 
                onChange={(e) => setFilterLocation(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="crew-grid">
            {filteredProfiles.map(profile => (
              <div key={profile.uid} className="crew-card">
                <div className="crew-header">
                  <div className="crew-avatar">
                    <img src={profile.profileImageUrl || '/bust-avatar.svg'} alt="" />
                    <div className="online-indicator"></div>
                  </div>
                  <div className="crew-info">
                    <h3>{profile.name}</h3>
                    <p className="primary-role">
                      {profile.jobTitles?.[0]?.title || 'Film Professional'}
                    </p>
                    <p className="location">
                      📍 {profile.residences?.[0]?.city}, {profile.residences?.[0]?.country}
                    </p>
                  </div>
                  <div className="connection-status">
                    {getConnectionStatus(profile.uid) === 'pending' && (
                      <span className="status pending">Pending</span>
                    )}
                    {getConnectionStatus(profile.uid) === 'accepted' && (
                      <span className="status connected">Connected</span>
                    )}
                  </div>
                </div>

                <div className="crew-skills">
                  {profile.jobTitles?.slice(0, 3).map((job, index) => (
                    <span key={index} className="skill-tag">
                      {job.title}
                    </span>
                  ))}
                </div>

                <div className="crew-actions">
                  {!getConnectionStatus(profile.uid) && (
                    <button 
                      className="connect-btn"
                      onClick={() => {
                        setSelectedProfile(profile);
                        setShowConnectionModal(true);
                      }}
                    >
                      Connect
                    </button>
                  )}
                  <button 
                    className="view-profile-btn"
                    onClick={() => setSelectedProfile(profile)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="connections-section">
          <div className="connections-tabs">
            <button className="tab active">All Connections</button>
            <button className="tab">Pending Requests</button>
            <button className="tab">Recent Activity</button>
          </div>

          <div className="connections-list">
            {connections.map(connection => {
              const connectedProfile = crewProfiles.find(p => p.uid === connection.connectedUserId);
              if (!connectedProfile) return null;

              return (
                <div key={connection.id} className="connection-item">
                  <div className="connection-avatar">
                    <img src={connectedProfile.profileImageUrl || '/bust-avatar.svg'} alt="" />
                  </div>
                  <div className="connection-info">
                    <h4>{connectedProfile.name}</h4>
                    <p>{connectedProfile.jobTitles?.[0]?.title}</p>
                    <span className={`status ${connection.status}`}>
                      {connection.status}
                    </span>
                  </div>
                  <div className="connection-actions">
                    {connection.status === 'pending' && connection.userId === currentUserId && (
                      <button className="cancel-btn">Cancel</button>
                    )}
                    {connection.status === 'pending' && connection.connectedUserId === currentUserId && (
                      <>
                        <button 
                          className="accept-btn"
                          onClick={() => respondToConnection(connection.id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => respondToConnection(connection.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {connection.status === 'accepted' && (
                      <button className="message-btn">Message</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'collaborations' && (
        <div className="collaborations-section">
          <div className="collaborations-header">
            <h3>Project Collaborations</h3>
            <button className="create-collaboration-btn">+ New Collaboration</button>
          </div>

          <div className="collaborations-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h4>{project.projectName}</h4>
                  <span className="project-type">{project.genre}</span>
                </div>
                <p className="project-description">{project.logline}</p>
                <div className="project-meta">
                  <span>📍 {project.location}</span>
                  <span>📅 {project.startDate}</span>
                  <span>💰 {project.productionBudget}</span>
                </div>
                <div className="project-actions">
                  <button className="view-project-btn">View Project</button>
                  <button className="invite-crew-btn">Invite Crew</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="events-section">
          <div className="events-header">
            <h3>Industry Events & Networking</h3>
            <button className="create-event-btn">+ Add Event</button>
          </div>

          <div className="events-grid">
            <div className="event-card">
              <div className="event-date">
                <span className="day">15</span>
                <span className="month">DEC</span>
              </div>
              <div className="event-info">
                <h4>Film Industry Mixer</h4>
                <p>Los Angeles, CA</p>
                <p>Network with producers, directors, and crew members</p>
                <div className="event-attendees">
                  <span>👥 127 attending</span>
                </div>
              </div>
              <button className="rsvp-btn">RSVP</button>
            </div>

            <div className="event-card">
              <div className="event-date">
                <span className="day">22</span>
                <span className="month">DEC</span>
              </div>
              <div className="event-info">
                <h4>Cinematography Workshop</h4>
                <p>New York, NY</p>
                <p>Advanced lighting and camera techniques</p>
                <div className="event-attendees">
                  <span>👥 45 attending</span>
                </div>
              </div>
              <button className="rsvp-btn">RSVP</button>
            </div>
          </div>
        </div>
      )}

      {showConnectionModal && selectedProfile && (
        <div className="connection-modal">
          <div className="modal-content">
            <h3>Connect with {selectedProfile.name}</h3>
            <div className="profile-preview">
              <img src={selectedProfile.profileImageUrl || '/bust-avatar.svg'} alt="" />
              <div>
                <h4>{selectedProfile.name}</h4>
                <p>{selectedProfile.jobTitles?.[0]?.title}</p>
              </div>
            </div>
            <textarea
              placeholder="Add a personal message (optional)..."
              value={connectionMessage}
              onChange={(e) => setConnectionMessage(e.target.value)}
              className="connection-message"
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowConnectionModal(false)}
              >
                Cancel
              </button>
              <button 
                className="send-btn"
                onClick={() => sendConnectionRequest(selectedProfile.uid, connectionMessage)}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkingHub; 