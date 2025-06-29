import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SocialProfile, PortfolioItem, SocialPost, SkillEndorsement } from '../../types/Social';
import './ProfileView.scss';

const ProfileView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [endorsements, setEndorsements] = useState<SkillEndorsement[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'portfolio' | 'skills' | 'connections'>('posts');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API calls
      const mockProfile: SocialProfile = {
        id: 'profile1',
        userId: userId || 'user1',
        displayName: 'Sarah Chen',
        bio: 'Award-winning cinematographer with over 15 years of experience in feature films, documentaries, and commercials. Passionate about visual storytelling and pushing creative boundaries.',
        avatar: '/default-avatar.svg',
        coverImage: '/movie-production-avatar.svg',
        location: 'Los Angeles, CA',
        department: 'Camera',
        experience: 'expert',
        skills: ['Cinematography', 'Lighting Design', 'Color Grading', 'Camera Operation', 'Visual Storytelling'],
        portfolio: [
          {
            id: '1',
            title: 'The Midnight Project',
            description: 'Feature film cinematography - Award-winning thriller',
            mediaUrl: '/movie-production-avatar.svg',
            mediaType: 'image',
            projectId: 'project1',
            tags: ['feature-film', 'thriller', 'cinematography'],
            featured: true,
            createdAt: null
          },
          {
            id: '2',
            title: 'Urban Dreams Documentary',
            description: 'Documentary series exploring city life',
            mediaUrl: '/movie-production-avatar.svg',
            mediaType: 'video',
            projectId: 'project2',
            tags: ['documentary', 'urban', 'cinematography'],
            featured: true,
            createdAt: null
          }
        ],
        availability: 'available',
        verified: true,
        followersCount: 1240,
        followingCount: 890,
        projectsCount: 45,
        createdAt: null,
        updatedAt: null
      };

      const mockPosts: SocialPost[] = [
        {
          id: '1',
          authorId: userId || 'user1',
          content: 'Just wrapped up an incredible shoot for "The Midnight Project"! The team was amazing and the footage looks stunning. Can\'t wait to share the final cut! 🎬✨',
          tags: ['cinematography', 'filmmaking', 'project'],
          visibility: 'public',
          likesCount: 24,
          commentsCount: 8,
          sharesCount: 3,
          createdAt: null,
          updatedAt: null
        },
        {
          id: '2',
          authorId: userId || 'user1',
          content: 'Behind the scenes from our latest commercial shoot. Lighting setup for the night scene was particularly challenging but the results were worth it!',
          tags: ['behind-the-scenes', 'lighting', 'commercial'],
          visibility: 'public',
          likesCount: 18,
          commentsCount: 5,
          sharesCount: 2,
          createdAt: null,
          updatedAt: null
        }
      ];

      const mockEndorsements: SkillEndorsement[] = [
        {
          id: '1',
          endorserId: 'user2',
          endorseeId: userId || 'user1',
          skill: 'Cinematography',
          projectId: 'project1',
          message: 'Exceptional work on The Midnight Project. Sarah\'s eye for composition is unmatched.',
          createdAt: null
        },
        {
          id: '2',
          endorserId: 'user3',
          endorseeId: userId || 'user1',
          skill: 'Lighting Design',
          projectId: 'project2',
          message: 'Sarah\'s lighting work transformed our documentary. Highly recommended!',
          createdAt: null
        }
      ];

      setProfile(mockProfile);
      setPosts(mockPosts);
      setEndorsements(mockEndorsements);
      setIsFollowing(false); // Mock following status
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Add API call to follow/unfollow
  };

  const handleMessage = () => {
    // Navigate to messaging
    console.log('Navigate to messaging');
  };

  const renderPortfolioItem = (item: PortfolioItem) => (
    <div key={item.id} className="portfolio-item">
      <div className="portfolio-media">
        <img src={item.mediaUrl} alt={item.title} />
        <div className="portfolio-overlay">
          <button className="view-btn">View</button>
        </div>
      </div>
      <div className="portfolio-info">
        <h4>{item.title}</h4>
        <p>{item.description}</p>
        <div className="portfolio-tags">
          {item.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPost = (post: SocialPost) => (
    <div key={post.id} className="profile-post">
      <div className="post-content">
        <p>{post.content}</p>
        {post.tags && (
          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="post-actions">
        <button className="action-btn">
          <span>👍</span> {post.likesCount}
        </button>
        <button className="action-btn">
          <span>💬</span> {post.commentsCount}
        </button>
        <button className="action-btn">
          <span>🔄</span> {post.sharesCount}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="profile-view loading">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-view error">
        <h2>Profile not found</h2>
        <p>The profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="profile-view">
      {/* Cover Image */}
      <div className="profile-cover">
        <img src={profile.coverImage || '/movie-production-avatar.svg'} alt="Cover" />
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.avatar} alt={profile.displayName} />
          {profile.verified && <span className="verified-badge">✓</span>}
        </div>
        
        <div className="profile-info">
          <h1>{profile.displayName}</h1>
          <p className="profile-bio">{profile.bio}</p>
          <div className="profile-meta">
            <span className="location">📍 {profile.location}</span>
            <span className="department">🎬 {profile.department}</span>
            <span className="experience">⭐ {profile.experience}</span>
            <span className="availability">🟢 {profile.availability}</span>
          </div>
        </div>

        <div className="profile-actions">
          {currentUser?.uid !== profile.userId && (
            <>
              <button 
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="message-btn" onClick={handleMessage}>
                Message
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Stats */}
      <div className="profile-stats">
        <div className="stat">
          <span className="stat-number">{profile.followersCount}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat">
          <span className="stat-number">{profile.followingCount}</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="stat">
          <span className="stat-number">{profile.projectsCount}</span>
          <span className="stat-label">Projects</span>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="profile-navigation">
        <button 
          className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📰 Posts ({posts.length})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          🎨 Portfolio ({profile.portfolio.length})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          🛠️ Skills ({profile.skills.length})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          🤝 Connections
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-tab">
            <h3>Recent Posts</h3>
            {posts.map(renderPost)}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="portfolio-tab">
            <h3>Portfolio</h3>
            <div className="portfolio-grid">
              {profile.portfolio.map(renderPortfolioItem)}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-tab">
            <h3>Skills & Endorsements</h3>
            <div className="skills-grid">
              {profile.skills.map(skill => (
                <div key={skill} className="skill-card">
                  <h4>{skill}</h4>
                  <div className="skill-endorsements">
                    {endorsements
                      .filter(endorsement => endorsement.skill === skill)
                      .map(endorsement => (
                        <div key={endorsement.id} className="endorsement">
                          <p>"{endorsement.message}"</p>
                          <small>- Project: {endorsement.projectId}</small>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="connections-tab">
            <h3>Connections</h3>
            <p>Connection management coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
