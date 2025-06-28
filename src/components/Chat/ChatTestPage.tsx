import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { MessagingService } from '../../utilities/messagingService';
import { DirectMessage } from '../../types/Chat';

// Mock user data for demo
const DEMO_USERS = {
  'demo-user-1': {
    id: 'demo-user-1',
    name: 'John Producer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  'demo-user-2': {
    id: 'demo-user-2',
    name: 'Sarah Director',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  'demo-user-3': {
    id: 'demo-user-3',
    name: 'Mike Cinematographer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  'demo-user-4': {
    id: 'demo-user-4',
    name: 'Emma Production Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
};

const ChatTestPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS['demo-user-1']);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  if (!showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">💬</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pro-Level Chat System</h1>
          <p className="text-gray-600 mb-8">
            Experience the next-generation chat interface with real-time messaging, 
            typing indicators, message reactions, and smooth animations.
          </p>
          
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-800">Choose Your Demo User:</h3>
            <div className="space-y-2">
              {Object.values(DEMO_USERS).map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSwitch(user.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    currentUser.id === user.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-left">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">Click to switch</div>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowChat(true)}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '🔄 Creating Sample Data...' : '🚀 Launch Chat Interface'}
          </button>

          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2">✨ Features included:</p>
            <ul className="text-left space-y-1">
              <li>• Real-time messaging with Firebase</li>
              <li>• Typing indicators</li>
              <li>• Message reactions (👍❤️😊🎉)</li>
              <li>• Message delivery status</li>
              <li>• Conversation search</li>
              <li>• Smooth animations</li>
              <li>• Responsive design</li>
              <li>• Chat settings & permissions</li>
            </ul>
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
        currentUserName={currentUser.name}
        currentUserAvatar={currentUser.avatar}
      />
    </div>
  );
};

export default ChatTestPage; 