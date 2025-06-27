import React, { useState, useEffect } from 'react';
import { SocialService } from '../../utilities/socialService';

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
  onFollowRequest?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
  currentUserId, 
  targetUserId, 
  onFollowRequest,
  className = '',
  size = 'md',
  showCount = false
}) => {
  const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'following' | 'blocked'>('none');
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await SocialService.getFollowStatus(currentUserId, targetUserId);
      setFollowStatus(status);
    };
    checkStatus();
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    if (showCount) {
      const getCount = async () => {
        const count = await SocialService.getFollowersCount(targetUserId);
        setFollowersCount(count);
      };
      getCount();
    }
  }, [targetUserId, showCount]);

  const handleFollow = async () => {
    if (onFollowRequest) {
      onFollowRequest();
      return;
    }

    try {
      setLoading(true);
      console.log('[FollowButton] Sending follow request from', currentUserId, 'to', targetUserId);
      await SocialService.sendFollowRequest(currentUserId, targetUserId);
      console.log('[FollowButton] Follow request sent successfully');
      setFollowStatus('pending');
    } catch (error) {
      console.error('[FollowButton] Error sending follow request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoading(true);
      await SocialService.unfollow(currentUserId, targetUserId);
      setFollowStatus('none');
      if (showCount) {
        setFollowersCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const renderButton = () => {
    const baseClasses = `font-light tracking-wide rounded-lg transition-all duration-300 disabled:opacity-50 ${getSizeClasses()} ${className}`;

    switch (followStatus) {
      case 'following':
        return (
          <button
            onClick={handleUnfollow}
            disabled={loading}
            className={`bg-red-600 text-white hover:bg-red-700 hover:scale-105 ${baseClasses} flex items-center gap-2`}
            title="Click to unfollow"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Unfollowing...
              </>
            ) : (
              <>
                <span>✓</span>
                Following
              </>
            )}
          </button>
        );
      case 'pending':
        return (
          <span className={`bg-yellow-100 text-yellow-800 font-medium rounded-full tracking-wider ${getSizeClasses()} ${className} flex items-center gap-2`} title="Request sent, waiting for approval">
            <span>⏳</span>
            Request Sent
          </span>
        );
      default:
        return (
          <button
            onClick={handleFollow}
            disabled={loading}
            className={`bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 ${baseClasses} flex items-center gap-2`}
            title="Click to send follow request"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <span>+</span>
                Follow
              </>
            )}
          </button>
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      {renderButton()}
      {showCount && followersCount > 0 && (
        <span className="text-xs text-gray-500">
          {followersCount} follower{followersCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default FollowButton; 