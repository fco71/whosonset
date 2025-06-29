import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SocialProfile, SocialPost, SocialFeedItem, IndustryGroup, SocialEvent } from '../../types/Social';
import './NetworkingHub.scss';

const NetworkingHub: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'groups' | 'events' | 'connections'>('feed');
  const [feedItems, setFeedItems] = useState<SocialFeedItem[]>([]);
  const [discoverProfiles, setDiscoverProfiles] = useState<SocialProfile[]>([]);
  const [groups, setGroups] = useState<IndustryGroup[]>([]);
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API calls
      switch (activeTab) {
        case 'feed':
          setFeedItems(generateMockFeed());
          break;
        case 'discover':
          setDiscoverProfiles(generateMockProfiles());
          break;
        case 'groups':
          setGroups(generateMockGroups());
          break;
        case 'events':
          setEvents(generateMockEvents());
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockFeed = (): SocialFeedItem[] => [
    {
      id: '1',
      type: 'post',
      content: {
        id: '1',
        authorId: 'user1',
        content: 'Just wrapped up an amazing shoot for "The Midnight Project"! The cinematography team was incredible. Can\'t wait to share the final cut! 🎬✨',
        tags: ['cinematography', 'filmmaking', 'project'],
        likesCount: 24,
        commentsCount: 8,
        sharesCount: 3
      },
      author: {
        id: 'profile1',
        userId: 'user1',
        displayName: 'Sarah Chen',
        bio: 'Cinematographer | DP | Visual Storyteller',
        avatar: '/default-avatar.svg',
        location: 'Los Angeles, CA',
        department: 'Camera',
        experience: 'expert',
        skills: ['Cinematography', 'Lighting', 'Color Grading'],
        portfolio: [],
        availability: 'available',
        verified: true,
        followersCount: 1240,
        followingCount: 890,
        projectsCount: 45,
        createdAt: null,
        updatedAt: null
      },
      engagement: { likes: 24, comments: 8, shares: 3 },
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'project_update',
      content: {
        id: '2',
        authorId: 'user2',
        content: 'Project Update: "Urban Dreams" is now in post-production! Looking for experienced sound designers and composers. DM if interested!',
        projectId: 'project123',
        tags: ['sound-design', 'post-production', 'hiring'],
        likesCount: 12,
        commentsCount: 15,
        sharesCount: 7
      },
      author: {
        id: 'profile2',
        userId: 'user2',
        displayName: 'Marcus Rodriguez',
        bio: 'Producer | Director | Creative Visionary',
        avatar: '/default-avatar.svg',
        location: 'New York, NY',
        department: 'Production',
        experience: 'expert',
        skills: ['Producing', 'Directing', 'Project Management'],
        portfolio: [],
        availability: 'busy',
        verified: true,
        followersCount: 2100,
        followingCount: 1200,
        projectsCount: 67,
        createdAt: null,
        updatedAt: null
      },
      engagement: { likes: 12, comments: 15, shares: 7 },
      timestamp: new Date(Date.now() - 3600000)
    }
  ];

  const generateMockProfiles = (): SocialProfile[] => [
    {
      id: 'profile3',
      userId: 'user3',
      displayName: 'Alex Thompson',
      bio: 'Sound Designer & Audio Engineer | 10+ years in film & TV',
      avatar: '/default-avatar.svg',
      location: 'Atlanta, GA',
      department: 'Sound',
      experience: 'expert',
      skills: ['Sound Design', 'Audio Engineering', 'Foley', 'ADR'],
      portfolio: [],
      availability: 'available',
      verified: true,
      followersCount: 890,
      followingCount: 450,
      projectsCount: 32,
      createdAt: null,
      updatedAt: null
    },
    {
      id: 'profile4',
      userId: 'user4',
      displayName: 'Emma Watson',
      bio: 'Production Designer | Creating immersive worlds through design',
      avatar: '/default-avatar.svg',
      location: 'Vancouver, BC',
      department: 'Art',
      experience: 'advanced',
      skills: ['Production Design', 'Set Design', 'Art Direction'],
      portfolio: [],
      availability: 'available',
      verified: false,
      followersCount: 567,
      followingCount: 234,
      projectsCount: 18,
      createdAt: null,
      updatedAt: null
    }
  ];

  const generateMockGroups = (): IndustryGroup[] => [
    {
      id: 'group1',
      name: 'Cinematographers United',
      description: 'A community for cinematographers to share techniques, equipment reviews, and industry insights.',
      avatar: '/default-avatar.svg',
      department: 'Camera',
      visibility: 'public',
      membersCount: 1247,
      postsCount: 89,
      createdBy: 'user1',
      createdAt: null,
      updatedAt: null
    },
    {
      id: 'group2',
      name: 'Independent Filmmakers Network',
      description: 'Supporting independent filmmakers with resources, networking, and collaboration opportunities.',
      avatar: '/default-avatar.svg',
      department: 'Production',
      visibility: 'public',
      membersCount: 2341,
      postsCount: 156,
      createdBy: 'user2',
      createdAt: null,
      updatedAt: null
    }
  ];

  const generateMockEvents = (): SocialEvent[] => [
    {
      id: 'event1',
      title: 'Film Industry Networking Mixer',
      description: 'Join us for an evening of networking with industry professionals. Light refreshments provided.',
      location: 'Los Angeles, CA',
      startDate: new Date(Date.now() + 86400000 * 7),
      endDate: new Date(Date.now() + 86400000 * 7 + 7200000),
      organizerId: 'user1',
      attendees: ['user2', 'user3', 'user4'],
      maxAttendees: 50,
      eventType: 'networking',
      department: 'Production',
      tags: ['networking', 'industry', 'mixer'],
      createdAt: null,
      updatedAt: null
    },
    {
      id: 'event2',
      title: 'Cinematography Workshop',
      description: 'Learn advanced lighting techniques and camera movement from industry experts.',
      location: 'New York, NY',
      startDate: new Date(Date.now() + 86400000 * 14),
      endDate: new Date(Date.now() + 86400000 * 14 + 14400000),
      organizerId: 'user2',
      attendees: ['user1', 'user3'],
      maxAttendees: 25,
      eventType: 'workshop',
      department: 'Camera',
      tags: ['workshop', 'cinematography', 'lighting'],
      createdAt: null,
      updatedAt: null
    }
  ];

  const renderFeedItem = (item: SocialFeedItem) => (
    <div key={item.id} className="feed-item">
      <div className="feed-item-header">
        <img src={item.author.avatar} alt={item.author.displayName} className="author-avatar" />
        <div className="author-info">
          <h4>{item.author.displayName}</h4>
          <span className="author-bio">{item.author.bio}</span>
          <span className="timestamp">{item.timestamp.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="feed-item-content">
        <p>{item.content.content}</p>
        {item.content.tags && (
          <div className="tags">
            {item.content.tags.map((tag: string, idx: number) => (
              <span key={idx} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="feed-item-actions">
        <button className="action-btn">
          <span>👍</span> {item.engagement.likes}
        </button>
        <button className="action-btn">
          <span>💬</span> {item.engagement.comments}
        </button>
        <button className="action-btn">
          <span>🔄</span> {item.engagement.shares}
        </button>
      </div>
    </div>
  );

  const renderProfileCard = (profile: SocialProfile) => (
    <div key={profile.id} className="profile-card">
      <div className="profile-header">
        <img src={profile.avatar} alt={profile.displayName} className="profile-avatar" />
        <div className="profile-info">
          <h4>{profile.displayName}</h4>
          <p className="profile-bio">{profile.bio}</p>
          <p className="profile-location">📍 {profile.location}</p>
          <p className="profile-department">🎬 {profile.department}</p>
        </div>
      </div>
      <div className="profile-skills">
        {profile.skills.slice(0, 3).map((skill: string) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>
      <div className="profile-stats">
        <span>{profile.followersCount} followers</span>
        <span>{profile.projectsCount} projects</span>
      </div>
      <div className="profile-actions">
        <button className="btn-primary">Connect</button>
        <button className="btn-secondary">View Profile</button>
      </div>
    </div>
  );

  const renderGroupCard = (group: IndustryGroup) => (
    <div key={group.id} className="group-card">
      <div className="group-header">
        <img src={group.avatar} alt={group.name} className="group-avatar" />
        <div className="group-info">
          <h4>{group.name}</h4>
          <p className="group-description">{group.description}</p>
          <p className="group-department">🎬 {group.department}</p>
        </div>
      </div>
      <div className="group-stats">
        <span>{group.membersCount} members</span>
        <span>{group.postsCount} posts</span>
      </div>
      <div className="group-actions">
        <button className="btn-primary">Join Group</button>
        <button className="btn-secondary">View Details</button>
      </div>
    </div>
  );

  const renderEventCard = (event: SocialEvent) => (
    <div key={event.id} className="event-card">
      <div className="event-header">
        <h4>{event.title}</h4>
        <p className="event-description">{event.description}</p>
        <p className="event-location">📍 {event.location}</p>
        <p className="event-date">
          📅 {event.startDate.toLocaleDateString()} at {event.startDate.toLocaleTimeString()}
        </p>
      </div>
      <div className="event-stats">
        <span>{event.attendees.length} attending</span>
        {event.maxAttendees && <span>Max: {event.maxAttendees}</span>}
      </div>
      <div className="event-tags">
        {event.tags.map((tag: string, idx: number) => (
          <span key={idx} className="tag">#{tag}</span>
        ))}
      </div>
      <div className="event-actions">
        <button className="btn-primary">Attend</button>
        <button className="btn-secondary">View Details</button>
      </div>
    </div>
  );

  return (
    <div className="networking-hub">
      <div className="hub-header">
        <h2>🎬 Film Industry Network</h2>
        <p>Connect, collaborate, and grow your career in the film industry</p>
      </div>

      <div className="hub-navigation">
        <button 
          className={`nav-tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          📰 Activity Feed
        </button>
        <button 
          className={`nav-tab ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          🔍 Discover People
        </button>
        <button 
          className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          👥 Industry Groups
        </button>
        <button 
          className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          📅 Events
        </button>
        <button 
          className={`nav-tab ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          🤝 My Connections
        </button>
      </div>

      <div className="hub-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'feed' && (
              <div className="feed-container">
                <h3>Recent Activity</h3>
                {feedItems.map(renderFeedItem)}
              </div>
            )}

            {activeTab === 'discover' && (
              <div className="discover-container">
                <h3>Discover Amazing Professionals</h3>
                <div className="profiles-grid">
                  {discoverProfiles.map(renderProfileCard)}
                </div>
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="groups-container">
                <h3>Industry Groups</h3>
                <div className="groups-grid">
                  {groups.map(renderGroupCard)}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="events-container">
                <h3>Upcoming Events</h3>
                <div className="events-grid">
                  {events.map(renderEventCard)}
                </div>
              </div>
            )}

            {activeTab === 'connections' && (
              <div className="connections-container">
                <h3>My Network</h3>
                <p>Connection management coming soon...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkingHub; 