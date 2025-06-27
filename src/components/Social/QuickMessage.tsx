import React, { useState, useEffect } from 'react';
import { MessagingService } from '../../utilities/messagingService';
import { SocialService } from '../../utilities/socialService';
import { Follow } from '../../types/Social';

interface QuickMessageProps {
  currentUserId: string;
  targetUserId: string;
  targetUserName?: string;
  onMessageSent?: () => void;
  className?: string;
}

const QuickMessage: React.FC<QuickMessageProps> = ({ 
  currentUserId, 
  targetUserId, 
  targetUserName = 'this user',
  onMessageSent,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canMessage, setCanMessage] = useState(false);
  const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'following' | 'blocked'>('none');

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const canSend = await MessagingService.canSendMessage(currentUserId, targetUserId);
        setCanMessage(canSend);
        
        const status = await SocialService.getFollowStatus(currentUserId, targetUserId);
        setFollowStatus(status);
      } catch (error) {
        console.error('Error checking message permissions:', error);
        setCanMessage(false);
      }
    };
    
    checkPermissions();
  }, [currentUserId, targetUserId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await MessagingService.sendDirectMessage(currentUserId, targetUserId, message.trim());
      
      setMessage('');
      setIsOpen(false);
      onMessageSent?.();
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (!canMessage) {
      return 'Cannot Message';
    }
    
    switch (followStatus) {
      case 'following':
        return 'Message';
      case 'pending':
        return 'Follow First';
      default:
        return 'Follow to Message';
    }
  };

  const getButtonClasses = () => {
    if (!canMessage) {
      return 'px-4 py-2 bg-gray-300 text-gray-500 font-light tracking-wide rounded-lg cursor-not-allowed text-sm';
    }
    
    switch (followStatus) {
      case 'following':
        return 'px-4 py-2 bg-blue-600 text-white font-light tracking-wide rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm';
      case 'pending':
        return 'px-4 py-2 bg-yellow-100 text-yellow-800 font-light tracking-wide rounded-lg cursor-not-allowed text-sm';
      default:
        return 'px-4 py-2 bg-gray-600 text-white font-light tracking-wide rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm';
    }
  };

  const handleButtonClick = () => {
    if (!canMessage || followStatus !== 'following') {
      return;
    }
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleButtonClick}
        disabled={!canMessage || followStatus !== 'following'}
        className={getButtonClasses()}
      >
        {getButtonText()}
      </button>

      {/* Message Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Message {targetUserName}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none resize-none mb-4"
              rows={4}
              maxLength={500}
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {message.length}/500 characters
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickMessage; 