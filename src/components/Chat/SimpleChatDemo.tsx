import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

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

const SimpleChatDemo: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS['demo-user-1']);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize with sample data
  useEffect(() => {
    initializeSampleData();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSampleData = () => {
    const sampleMessages: Message[] = [
      {
        id: '1',
        senderId: 'demo-user-2',
        senderName: 'Sarah Director',
        senderAvatar: DEMO_USERS['demo-user-2'].avatar,
        content: 'Hey John! I loved the script you sent. When can we discuss the project?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '2',
        senderId: 'demo-user-1',
        senderName: 'John Producer',
        senderAvatar: DEMO_USERS['demo-user-1'].avatar,
        content: 'Thanks Sarah! How about tomorrow at 3 PM? I have some ideas for the visual style.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '3',
        senderId: 'demo-user-2',
        senderName: 'Sarah Director',
        senderAvatar: DEMO_USERS['demo-user-2'].avatar,
        content: 'Perfect! I\'ll bring my mood board. Looking forward to it! 🎬',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: false
      },
      {
        id: '4',
        senderId: 'demo-user-3',
        senderName: 'Mike Cinematographer',
        senderAvatar: DEMO_USERS['demo-user-3'].avatar,
        content: 'John, I\'m available for the cinematography role. What\'s the budget range?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false
      },
      {
        id: '5',
        senderId: 'demo-user-1',
        senderName: 'John Producer',
        senderAvatar: DEMO_USERS['demo-user-1'].avatar,
        content: 'Hi Mike! Budget is $50-75k. Are you interested?',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: true
      },
      {
        id: '6',
        senderId: 'demo-user-4',
        senderName: 'Emma Production Designer',
        senderAvatar: DEMO_USERS['demo-user-4'].avatar,
        content: 'Just finished the production design concept. Should I send it over?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false
      }
    ];

    setMessages(sampleMessages);

    // Create conversations
    const convs: Conversation[] = [
      {
        userId: 'demo-user-2',
        userName: 'Sarah Director',
        userAvatar: DEMO_USERS['demo-user-2'].avatar,
        lastMessage: 'Perfect! I\'ll bring my mood board. Looking forward to it! 🎬',
        lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        unreadCount: 1
      },
      {
        userId: 'demo-user-3',
        userName: 'Mike Cinematographer',
        userAvatar: DEMO_USERS['demo-user-3'].avatar,
        lastMessage: 'John, I\'m available for the cinematography role. What\'s the budget range?',
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 1
      },
      {
        userId: 'demo-user-4',
        userName: 'Emma Production Designer',
        userAvatar: DEMO_USERS['demo-user-4'].avatar,
        lastMessage: 'Just finished the production design concept. Should I send it over?',
        lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
        unreadCount: 1
      }
    ];

    setConversations(convs);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: messageText.trim(),
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setIsTyping(false);

    // Simulate typing indicator
    setTypingUsers(prev => prev.filter(id => id !== selectedUser));

    // Simulate reply after 2-4 seconds
    setTimeout(() => {
      const otherUser = DEMO_USERS[selectedUser as keyof typeof DEMO_USERS];
      const replies = [
        'Thanks for the message! 👍',
        'Got it, I\'ll get back to you soon.',
        'Perfect timing! Let\'s discuss this.',
        'I\'m on it! Will update you shortly.',
        'Great idea! Let me think about it.',
        'Sounds good to me! 🎬',
        'I\'ll review this and get back to you.',
        'Excellent! Looking forward to it.'
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedUser,
        senderName: otherUser.name,
        senderAvatar: otherUser.avatar,
        content: randomReply,
        timestamp: new Date(),
        isRead: false
      };

      setMessages(prev => [...prev, replyMessage]);
    }, 2000 + Math.random() * 2000);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    if (!isTyping && selectedUser) {
      setIsTyping(true);
      setTypingUsers(prev => [...prev, selectedUser]);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTypingUsers(prev => prev.filter(id => id !== selectedUser));
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConversationMessages = (userId: string) => {
    return messages.filter(msg => 
      (msg.senderId === currentUser.id && msg.senderId === userId) ||
      (msg.senderId === userId && msg.senderId === currentUser.id)
    );
  };

  const selectedConversation = conversations.find(c => c.userId === selectedUser);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-full bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <p className="text-sm text-gray-500 mt-1">Demo Chat System</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.userId}
                onClick={() => setSelectedUser(conversation.userId)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedUser === conversation.userId
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <img
                  src={conversation.userAvatar}
                  alt={conversation.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.userName}
                    </h3>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedConversation?.userAvatar}
                    alt={selectedConversation?.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversation?.userName}
                    </h3>
                    {typingUsers.includes(selectedUser) && (
                      <p className="text-sm text-gray-500">typing...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-4">
                  {getConversationMessages(selectedUser).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === currentUser.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {typingUsers.includes(selectedUser) && (
                    <div className="flex justify-start">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={messageText}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleChatDemo; 