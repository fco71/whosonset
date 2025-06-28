import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { MessagingService } from '../../utilities/messagingService';
import { DirectMessage } from '../../types/Chat';

// Enhanced mock user data for demo
const DEMO_USERS = {
  'demo-user-1': {
    id: 'demo-user-1',
    name: 'John Producer',
    displayName: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'Film Producer',
    company: 'Cinema Studios',
    location: 'Los Angeles, CA',
    isOnline: true,
    lastSeen: new Date()
  },
  'demo-user-2': {
    id: 'demo-user-2',
    name: 'Sarah Director',
    displayName: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'Film Director',
    company: 'Creative Films',
    location: 'New York, NY',
    isOnline: true,
    lastSeen: new Date()
  },
  'demo-user-3': {
    id: 'demo-user-3',
    name: 'Mike Cinematographer',
    displayName: 'Mike Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Director of Photography',
    company: 'Visual Arts Co.',
    location: 'Atlanta, GA',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000)
  },
  'demo-user-4': {
    id: 'demo-user-4',
    name: 'Emma Production Designer',
    displayName: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'Production Designer',
    company: 'Set Design Pro',
    location: 'Vancouver, BC',
    isOnline: true,
    lastSeen: new Date()
  },
  'demo-user-5': {
    id: 'demo-user-5',
    name: 'Alex Sound Engineer',
    displayName: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'Sound Engineer',
    company: 'Audio Masters',
    location: 'Toronto, ON',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  'demo-user-6': {
    id: 'demo-user-6',
    name: 'Lisa Casting Director',
    displayName: 'Lisa Thompson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: 'Casting Director',
    company: 'Talent Finders',
    location: 'Chicago, IL',
    isOnline: true,
    lastSeen: new Date()
  }
};

const ChatTestPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS['demo-user-1']);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Create sample data when component mounts
  useEffect(() => {
    createSampleData();
  }, []);

  const createSampleData = async () => {
    setIsLoading(true);
    try {
      console.log('Creating sample chat data...');
      
      // Create sample messages
      const sampleMessages = [
        {
          senderId: 'demo-user-2',
          receiverId: 'demo-user-1',
          content: 'Hey John! I loved the script you sent. When can we discuss the project?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          senderId: 'demo-user-1',
          receiverId: 'demo-user-2',
          content: 'Thanks Sarah! How about tomorrow at 3 PM? I have some ideas for the visual style.',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
        },
        {
          senderId: 'demo-user-2',
          receiverId: 'demo-user-1',
          content: 'Perfect! I\'ll bring my mood board. Looking forward to it! 🎬',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          senderId: 'demo-user-3',
          receiverId: 'demo-user-1',
          content: 'John, I\'m available for the cinematography role. What\'s the budget range?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          senderId: 'demo-user-1',
          receiverId: 'demo-user-3',
          content: 'Hi Mike! Budget is $50-75k. Are you interested?',
          timestamp: new Date(Date.now() - 15 * 60 * 1000)
        },
        {
          senderId: 'demo-user-4',
          receiverId: 'demo-user-1',
          content: 'Just finished the production design concept. Should I send it over?',
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          senderId: 'demo-user-5',
          receiverId: 'demo-user-1',
          content: 'John, I can handle the sound design for the project. What\'s your timeline?',
          timestamp: new Date(Date.now() - 10 * 60 * 1000)
        },
        {
          senderId: 'demo-user-6',
          receiverId: 'demo-user-1',
          content: 'I have some great actors in mind for the lead roles. When can we meet?',
          timestamp: new Date(Date.now() - 3 * 60 * 1000)
        }
      ];

      // Send each message to Firebase
      for (const message of sampleMessages) {
        try {
          await MessagingService.sendDirectMessage(
            message.senderId,
            message.receiverId,
            message.content
          );
          console.log(`Created message: ${message.content.substring(0, 30)}...`);
        } catch (error) {
          console.log('Message might already exist:', error);
        }
      }

      console.log('✅ Sample chat data created successfully!');
    } catch (error) {
      console.error('❌ Error creating sample data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSwitch = (userId: string) => {
    setCurrentUser(DEMO_USERS[userId as keyof typeof DEMO_USERS]);
  };

  const filteredUsers = Object.values(DEMO_USERS).filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return lastSeen.toLocaleDateString();
  };

  if (!showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💬</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pro-Level Chat System</h1>
            <p className="text-gray-600">
              Experience the next-generation chat interface with real-time messaging, 
              typing indicators, message reactions, and smooth animations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current User Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Current User:</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.displayName}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      currentUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{currentUser.displayName}</h4>
                    <p className="text-sm text-gray-600">{currentUser.role}</p>
                    <p className="text-xs text-gray-500">{currentUser.company}</p>
                    <p className="text-xs text-gray-500">{currentUser.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Switch to:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(DEMO_USERS).map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSwitch(user.id)}
                      className={`flex items-center space-x-2 p-2 rounded-lg border transition-all ${
                        currentUser.id === user.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {user.displayName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* User Search & Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Find & Connect:</h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users by name, role, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">
                    🔍
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedUsers.includes(user.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleUserSelect(user.id)}
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 truncate">{user.displayName}</h4>
                          {selectedUsers.includes(user.id) && (
                            <span className="text-blue-600 text-sm">✓ Selected</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.role}</p>
                        <p className="text-xs text-gray-500">{user.company}</p>
                        <p className="text-xs text-gray-500">
                          {user.isOnline ? '🟢 Online' : `⚫ ${formatLastSeen(user.lastSeen)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedUsers.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Selected {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} for connection
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowChat(true)}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '🔄 Creating Sample Data...' : '🚀 Launch Chat Interface'}
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2 font-medium">✨ Features included:</p>
            <div className="grid md:grid-cols-2 gap-2 text-left">
              <ul className="space-y-1">
                <li>• Real-time messaging with Firebase</li>
                <li>• Typing indicators</li>
                <li>• Message reactions (👍❤️😊🎉)</li>
                <li>• Message delivery status</li>
              </ul>
              <ul className="space-y-1">
                <li>• Conversation search</li>
                <li>• Smooth animations</li>
                <li>• Responsive design</li>
                <li>• Chat settings & permissions</li>
              </ul>
            </div>
          </div>

          {isLoading && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700">Setting up demo data...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => setShowChat(false)}
          className="bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back to Demo
        </button>
      </div>
      <ChatInterface
        currentUserId={currentUser.id}
        currentUserName={currentUser.displayName}
        currentUserAvatar={currentUser.avatar}
      />
    </div>
  );
};

export default ChatTestPage; 