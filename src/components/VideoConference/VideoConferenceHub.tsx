import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  VideoMeeting,
  MeetingParticipant,
  MeetingSettings,
  ScreenShare,
  MeetingMessage,
  VirtualBackground
} from '../../types/VideoConference';
import './VideoConferenceHub.scss';

interface VideoConferenceHubProps {
  meetingId?: string;
  onClose?: () => void;
}

const VideoConferenceHub: React.FC<VideoConferenceHubProps> = ({
  meetingId,
  onClose
}) => {
  const { currentUser } = useAuth();
  const [meeting, setMeeting] = useState<VideoMeeting | null>(null);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeScreenShare, setActiveScreenShare] = useState<ScreenShare | null>(null);
  const [chatMessages, setChatMessages] = useState<MeetingMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<VirtualBackground | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [bandwidth, setBandwidth] = useState(5.2); // Mbps

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentUser) {
      loadMeeting();
      loadParticipants();
      loadChatMessages();
      loadVirtualBackgrounds();
    }
  }, [currentUser, meetingId]);

  useEffect(() => {
    // Simulate connection quality monitoring
    const interval = setInterval(() => {
      const qualities: Array<'excellent' | 'good' | 'fair' | 'poor'> = ['excellent', 'good', 'fair', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      setBandwidth(Math.random() * 10 + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadMeeting = async () => {
    try {
      // Mock meeting data
      const mockMeeting: VideoMeeting = {
        id: meetingId || 'meeting-1',
        title: 'Production Team Weekly Standup',
        description: 'Weekly sync meeting for the production team',
        hostId: currentUser?.uid || '',
        participants: [],
        status: 'active',
        startTime: new Date(),
        duration: 60,
        maxParticipants: 50,
        isRecording: false,
        settings: {
          allowParticipantsToJoinBeforeHost: true,
          muteParticipantsOnEntry: false,
          enableWaitingRoom: false,
          enableChat: true,
          enableScreenSharing: true,
          enableRecording: true,
          enableAnnotations: true,
          enableVirtualBackground: true,
          enableBackgroundBlur: true,
          maxScreenShares: 1,
          videoQuality: 'auto',
          audioQuality: 'high',
          bandwidthLimit: 10
        },
        chat: [],
        screenShares: [],
        whiteboards: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setMeeting(mockMeeting);
    } catch (error) {
      console.error('Error loading meeting:', error);
    }
  };

  const loadParticipants = async () => {
    try {
      // Mock participants data
      const mockParticipants: MeetingParticipant[] = [
        {
          userId: currentUser?.uid || '',
          displayName: currentUser?.displayName || 'You',
          avatar: currentUser?.photoURL || undefined,
          role: 'host',
          status: 'joined',
          joinedAt: new Date(),
          isVideoEnabled: true,
          isAudioEnabled: true,
          isScreenSharing: false,
          isHandRaised: false,
          permissions: [
            {
              canShareScreen: true,
              canRecord: true,
              canChat: true,
              canAnnotate: true,
              canManageParticipants: true,
              canMuteOthers: true,
              canRemoveOthers: true
            }
          ],
          connectionQuality: 'excellent',
          bandwidth: 8.5
        },
        {
          userId: 'user-2',
          displayName: 'John Doe',
          avatar: 'https://via.placeholder.com/40',
          role: 'participant',
          status: 'joined',
          joinedAt: new Date(Date.now() - 30000),
          isVideoEnabled: true,
          isAudioEnabled: true,
          isScreenSharing: false,
          isHandRaised: false,
          permissions: [
            {
              canShareScreen: true,
              canRecord: false,
              canChat: true,
              canAnnotate: false,
              canManageParticipants: false,
              canMuteOthers: false,
              canRemoveOthers: false
            }
          ],
          connectionQuality: 'good',
          bandwidth: 6.2
        },
        {
          userId: 'user-3',
          displayName: 'Jane Smith',
          avatar: 'https://via.placeholder.com/40',
          role: 'participant',
          status: 'joined',
          joinedAt: new Date(Date.now() - 60000),
          isVideoEnabled: false,
          isAudioEnabled: true,
          isScreenSharing: false,
          isHandRaised: true,
          permissions: [
            {
              canShareScreen: true,
              canRecord: false,
              canChat: true,
              canAnnotate: false,
              canManageParticipants: false,
              canMuteOthers: false,
              canRemoveOthers: false
            }
          ],
          connectionQuality: 'fair',
          bandwidth: 3.8
        }
      ];
      setParticipants(mockParticipants);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const loadChatMessages = async () => {
    try {
      // Mock chat messages
      const mockMessages: MeetingMessage[] = [
        {
          id: '1',
          senderId: 'user-2',
          senderName: 'John Doe',
          message: 'Good morning everyone!',
          timestamp: new Date(Date.now() - 300000),
          type: 'text',
          reactions: [],
          isPrivate: false
        },
        {
          id: '2',
          senderId: currentUser?.uid || '',
          senderName: 'You',
          message: 'Morning John! How\'s the pre-production going?',
          timestamp: new Date(Date.now() - 240000),
          type: 'text',
          reactions: [],
          isPrivate: false
        },
        {
          id: '3',
          senderId: 'user-3',
          senderName: 'Jane Smith',
          message: 'I have a question about the lighting setup for scene 3',
          timestamp: new Date(Date.now() - 120000),
          type: 'text',
          reactions: [],
          isPrivate: false
        }
      ];
      setChatMessages(mockMessages);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const loadVirtualBackgrounds = async () => {
    // Mock virtual backgrounds
    const backgrounds: VirtualBackground[] = [
      {
        id: '1',
        name: 'Office',
        type: 'image',
        url: 'https://via.placeholder.com/1920x1080/4A90E2/FFFFFF?text=Office',
        thumbnailUrl: 'https://via.placeholder.com/120x67/4A90E2/FFFFFF?text=Office',
        isDefault: true,
        isCustom: false,
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Studio',
        type: 'image',
        url: 'https://via.placeholder.com/1920x1080/7B68EE/FFFFFF?text=Studio',
        thumbnailUrl: 'https://via.placeholder.com/120x67/7B68EE/FFFFFF?text=Studio',
        isDefault: false,
        isCustom: false,
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Blur',
        type: 'blur',
        url: '',
        thumbnailUrl: 'https://via.placeholder.com/120x67/CCCCCC/FFFFFF?text=Blur',
        isDefault: false,
        isCustom: false,
        createdAt: new Date()
      }
    ];
    setSelectedBackground(backgrounds[0]);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Update participant status
    setParticipants(prev => prev.map(p => 
      p.userId === currentUser?.uid 
        ? { ...p, isVideoEnabled: !isVideoEnabled }
        : p
    ));
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // Update participant status
    setParticipants(prev => prev.map(p => 
      p.userId === currentUser?.uid 
        ? { ...p, isAudioEnabled: !isAudioEnabled }
        : p
    ));
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      setIsScreenSharing(false);
      setActiveScreenShare(null);
    } else {
      // Start screen sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream;
        }
        
        setIsScreenSharing(true);
        const screenShare: ScreenShare = {
          id: `share-${Date.now()}`,
          sharerId: currentUser?.uid || '',
          sharerName: currentUser?.displayName || 'You',
          type: 'fullscreen',
          title: 'Screen Share',
          startedAt: new Date(),
          isActive: true,
          annotations: [],
          viewers: participants.map(p => p.userId)
        };
        setActiveScreenShare(screenShare);
      } catch (error) {
        console.error('Error starting screen share:', error);
      }
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    // Update participant status
    setParticipants(prev => prev.map(p => 
      p.userId === currentUser?.uid 
        ? { ...p, isHandRaised: !isHandRaised }
        : p
    ));
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: MeetingMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser?.uid || '',
        senderName: 'You',
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'text',
        reactions: [],
        isPrivate: false
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (meeting) {
      setMeeting(prev => prev ? { ...prev, isRecording: !isRecording } : null);
    }
  };

  const leaveMeeting = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderVideoGrid = () => (
    <div className="video-grid">
      {participants.map(participant => (
        <div key={participant.userId} className="video-participant">
          <div className="video-container">
            {participant.isVideoEnabled ? (
              <video
                ref={participant.userId === currentUser?.uid ? videoRef : undefined}
                className="participant-video"
                autoPlay
                muted={participant.userId === currentUser?.uid}
                playsInline
              />
            ) : (
              <div className="video-placeholder">
                <div className="avatar">
                  {participant.avatar ? (
                    <img src={participant.avatar} alt={participant.displayName} />
                  ) : (
                    <span>{participant.displayName.charAt(0)}</span>
                  )}
                </div>
                <p>{participant.displayName}</p>
              </div>
            )}
            
            <div className="participant-overlay">
              <div className="participant-info">
                <span className="name">{participant.displayName}</span>
                {participant.role === 'host' && <span className="role">Host</span>}
              </div>
              
              <div className="participant-status">
                {!participant.isAudioEnabled && <span className="status-icon">🔇</span>}
                {participant.isHandRaised && <span className="status-icon">✋</span>}
                <span className={`connection-quality ${participant.connectionQuality}`}>
                  {participant.connectionQuality === 'excellent' && '●●●'}
                  {participant.connectionQuality === 'good' && '●●○'}
                  {participant.connectionQuality === 'fair' && '●○○'}
                  {participant.connectionQuality === 'poor' && '○○○'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderScreenShare = () => (
    <div className="screen-share-container">
      {activeScreenShare && (
        <div className="screen-share">
          <div className="screen-share-header">
            <span className="sharer-name">{activeScreenShare.sharerName} is sharing</span>
            <button className="stop-share-btn" onClick={toggleScreenShare}>
              Stop Sharing
            </button>
          </div>
          <video
            ref={screenShareRef}
            className="screen-share-video"
            autoPlay
            playsInline
          />
        </div>
      )}
    </div>
  );

  const renderChat = () => (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>Chat ({chatMessages.length})</h3>
        <button className="close-btn" onClick={() => setShowChat(false)}>×</button>
      </div>
      
      <div className="chat-messages">
        {chatMessages.map(message => (
          <div key={message.id} className={`chat-message ${message.senderId === currentUser?.uid ? 'own' : ''}`}>
            <div className="message-header">
              <span className="sender-name">{message.senderName}</span>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{message.message}</div>
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="message-input"
        />
        <button onClick={sendMessage} className="send-btn">Send</button>
      </div>
    </div>
  );

  const renderParticipants = () => (
    <div className="participants-panel">
      <div className="participants-header">
        <h3>Participants ({participants.length})</h3>
        <button className="close-btn" onClick={() => setShowParticipants(false)}>×</button>
      </div>
      
      <div className="participants-list">
        {participants.map(participant => (
          <div key={participant.userId} className="participant-item">
            <div className="participant-avatar">
              {participant.avatar ? (
                <img src={participant.avatar} alt={participant.displayName} />
              ) : (
                <span>{participant.displayName.charAt(0)}</span>
              )}
            </div>
            
            <div className="participant-details">
              <span className="participant-name">{participant.displayName}</span>
              {participant.role === 'host' && <span className="participant-role">Host</span>}
            </div>
            
            <div className="participant-controls">
              {!participant.isAudioEnabled && <span className="control-icon">🔇</span>}
              {!participant.isVideoEnabled && <span className="control-icon">📹</span>}
              {participant.isHandRaised && <span className="control-icon">✋</span>}
              {participant.isScreenSharing && <span className="control-icon">🖥️</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="meeting-controls">
      <div className="control-group">
        <button
          className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
          onClick={toggleAudio}
        >
          {isAudioEnabled ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          ) : '🔇'}
        </button>
        
        <button
          className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
          onClick={toggleVideo}
        >
          {isVideoEnabled ? '📹' : '📷'}
        </button>
        
        <button
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
        >
          🖥️
        </button>
        
        <button
          className={`control-btn ${isHandRaised ? 'active' : ''}`}
          onClick={toggleHandRaise}
        >
          ✋
        </button>
      </div>
      
      <div className="control-group">
        <button
          className={`control-btn ${isRecording ? 'active' : ''}`}
          onClick={toggleRecording}
        >
          {isRecording ? '⏹️' : '🔴'}
        </button>
        
        <button className="control-btn" onClick={() => setShowChat(!showChat)}>
          💬
        </button>
        
        <button className="control-btn" onClick={() => setShowParticipants(!showParticipants)}>
          👥
        </button>
        
        <button className="control-btn" onClick={() => setShowSettings(!showSettings)}>
          ⚙️
        </button>
      </div>
      
      <div className="control-group">
        <button className="control-btn leave-btn" onClick={leaveMeeting}>
          Leave
        </button>
      </div>
    </div>
  );

  const renderConnectionInfo = () => (
    <div className="connection-info">
      <span className={`connection-quality ${connectionQuality}`}>
        {connectionQuality === 'excellent' && '●●●'}
        {connectionQuality === 'good' && '●●○'}
        {connectionQuality === 'fair' && '●○○'}
        {connectionQuality === 'poor' && '○○○'}
      </span>
      <span className="bandwidth">{bandwidth.toFixed(1)} Mbps</span>
    </div>
  );

  if (!meeting) {
    return <div className="loading">Loading meeting...</div>;
  }

  return (
    <div className="video-conference-hub">
      <div className="meeting-header">
        <div className="meeting-info">
          <h2>{meeting.title}</h2>
          <p>{meeting.description}</p>
          <span className="meeting-duration">
            {Math.floor((Date.now() - meeting.startTime.getTime()) / 60000)}m
          </span>
        </div>
        
        {renderConnectionInfo()}
      </div>

      <div className="meeting-main">
        <div className="video-section">
          {activeScreenShare ? renderScreenShare() : renderVideoGrid()}
        </div>
        
        {showChat && renderChat()}
        {showParticipants && renderParticipants()}
      </div>

      {renderControls()}
    </div>
  );
};

export default VideoConferenceHub; 