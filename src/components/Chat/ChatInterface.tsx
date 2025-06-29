import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessagingService, ConversationSummary } from '../../utilities/messagingService';
import { DirectMessage, ChatSettings, MessageReaction } from '../../types/Chat';
import { SocialService } from '../../utilities/socialService';
import './ChatInterface.scss';
import { collection, getDocs, where, limit, query as firestoreQuery } from 'firebase/firestore';
import { db } from '../../firebase';

// Create a completely independent message input component with rich features
const MessageInput = React.forwardRef<{
  setSendCallback: (callback: (message: string, type?: string, file?: File) => void) => void;
  setCurrentUser: (userId: string) => void;
  setSelectedUser: (userId: string | null) => void;
  setSendingState: (isSending: boolean) => void;
}, {}>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceRecorderRef = useRef<HTMLButtonElement>(null);
  const sendCallbackRef = useRef<((message: string, type?: string, file?: File) => void) | null>(null);
  const currentUserIdRef = useRef<string>('');
  const selectedUserRef = useRef<string | null>(null);
  const sendingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedAudioFile, setRecordedAudioFile] = useState<File | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Expose methods to parent component
  const setSendCallback = useCallback((callback: (message: string, type?: string, file?: File) => void) => {
    sendCallbackRef.current = callback;
  }, []);
  
  const setCurrentUser = useCallback((userId: string) => {
    currentUserIdRef.current = userId;
  }, []);
  
  const setSelectedUser = useCallback((userId: string | null) => {
    selectedUserRef.current = userId;
  }, []);
  
  const setSendingState = useCallback((isSending: boolean) => {
    sendingRef.current = isSending;
    if (inputRef.current) {
      inputRef.current.disabled = isSending;
    }
  }, []);
  
  // Expose these methods to parent
  React.useImperativeHandle(ref, () => ({
    setSendCallback,
    setCurrentUser,
    setSelectedUser,
    setSendingState
  }), [setSendCallback, setCurrentUser, setSelectedUser, setSendingState]);

  // Emoji picker
  const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙏', '😎', '🤝', '💪', '🚀', '⭐'];
  
  const addEmoji = useCallback((emoji: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      const value = inputRef.current.value;
      const newValue = value.substring(0, start) + emoji + value.substring(end);
      inputRef.current.value = newValue;
      inputRef.current.selectionStart = inputRef.current.selectionEnd = start + emoji.length;
      inputRef.current.focus();
    }
    setShowEmojiPicker(false);
  }, []);

  // File handling
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && sendCallbackRef.current) {
      sendCallbackRef.current('', 'file', file);
      event.target.value = '';
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && sendCallbackRef.current) {
      sendCallbackRef.current('', 'file', files[0]);
    }
  }, []);

  // Audio level monitoring
  const startAudioLevelMonitoring = useCallback(async (stream: MediaStream) => {
    try {
      console.log('[Audio Level] Starting audio level monitoring...');
      
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Resume audio context if suspended (required for user interaction)
      if (audioContext.state === 'suspended') {
        console.log('[Audio Level] Audio context suspended, resuming...');
        await audioContext.resume();
        console.log('[Audio Level] Audio context resumed, state:', audioContext.state);
      }
      
      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      
      // Create microphone source
      const microphone = audioContext.createMediaStreamSource(stream);
      microphoneRef.current = microphone;
      
      // Connect microphone to analyser
      microphone.connect(analyser);
      
      console.log('[Audio Level] Audio nodes connected successfully');
      
      // Create data array for frequency analysis
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      // Function to update audio level
      const updateAudioLevel = () => {
        if (!analyserRef.current || !isRecording) {
          return;
        }
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume level
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedLevel = average / 255; // Normalize to 0-1
        
        // Only update if we detect actual audio (not just silence)
        if (average > 5) { // Threshold to avoid noise
          setAudioLevel(normalizedLevel);
          console.log('[Audio Level] Detected audio level:', normalizedLevel.toFixed(3));
        } else {
          setAudioLevel(0);
        }
        
        // Continue monitoring
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      // Start monitoring
      updateAudioLevel();
      
    } catch (error) {
      console.error('[Audio Level] Failed to start audio level monitoring:', error);
    }
  }, [isRecording]);

  // Voice recording
  const startRecording = useCallback(async () => {
    try {
      console.log('[Voice Recording] Starting recording...');
      
      // Check if MediaRecorder is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media recording is not supported in this browser');
      }
      
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder is not supported in this browser');
      }
      
      // Request audio with better constraints for voice recording
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      console.log('[Voice Recording] Got audio stream:', stream);
      console.log('[Voice Recording] Audio tracks:', stream.getAudioTracks());
      
      // Check if we have audio tracks
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio input device found. Please check your microphone.');
      }
      
      // Log audio track details
      audioTracks.forEach((track, index) => {
        console.log(`[Voice Recording] Audio track ${index}:`, {
          label: track.label,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          settings: track.getSettings(),
          constraints: track.getConstraints()
        });
        
        // Check if track is actually receiving audio
        if (track.readyState === 'ended') {
          console.warn(`[Voice Recording] Audio track ${index} is ended`);
        }
      });
      
      // Try different MIME types for better compatibility
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }
      }
      
      console.log('[Voice Recording] Using MIME type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      recordingChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('[Voice Recording] Data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstart = async () => {
        console.log('[Voice Recording] Recording started');
        setIsRecording(true);
        setRecordingTime(0);
        setRecordingError(null);
        setAudioLevel(0);
        
        // Start audio level monitoring
        try {
          await startAudioLevelMonitoring(stream);
          console.log('[Voice Recording] Audio level monitoring started successfully');
        } catch (error) {
          console.error('[Voice Recording] Failed to start audio level monitoring:', error);
        }
        
        // Start recording timer
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      };
      
      mediaRecorder.onstop = () => {
        console.log('[Voice Recording] Recording stopped');
        setIsRecording(false);
        setRecordingTime(0);
        
        // Clear recording timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => {
          console.log('[Voice Recording] Stopping track:', track.kind, track.label);
          track.stop();
        });
        
        // Don't automatically send - let user decide
        if (recordingChunksRef.current.length > 0) {
          const totalSize = recordingChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
          console.log('[Voice Recording] Total recorded size:', totalSize, 'bytes');
          
          if (totalSize < 100) {
            console.warn('[Voice Recording] Recording seems too small, may not have captured audio');
            setRecordingError('No audio detected. Please check your microphone and try again.');
            return;
          }
          
          // Store the recording for user to send or cancel
          const audioBlob = new Blob(recordingChunksRef.current, { type: mimeType || 'audio/webm' });
          console.log('[Voice Recording] Created audio blob:', audioBlob.size, 'bytes');
          
          // Create a file from the blob
          const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, { 
            type: mimeType || 'audio/webm' 
          });
          
          console.log('[Voice Recording] Created audio file:', audioFile.name, audioFile.size, 'bytes');
          
          // Store the file for user to send or cancel
          setRecordedAudioFile(audioFile);
        } else {
          console.warn('[Voice Recording] No recording chunks available');
          setRecordingError('Recording failed. Please try again.');
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('[Voice Recording] MediaRecorder error:', event);
        setRecordingError('Recording error occurred. Please try again.');
        setIsRecording(false);
        setRecordingTime(0);
        
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording with 1-second timeslice for better data handling
      mediaRecorder.start(1000);
      
    } catch (error) {
      console.error('[Voice Recording] Error starting recording:', error);
      
      let errorMessage = 'Failed to start recording. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = `Microphone access denied. Please follow these steps:

1. Click the microphone icon in your browser's address bar
2. Select "Allow" for microphone access
3. Refresh the page and try again

If you don't see the microphone icon, check your browser settings.`;
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Microphone is already in use by another application. Please close other apps using the microphone and try again.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setRecordingError(errorMessage);
      setIsRecording(false);
      setRecordingTime(0);
    }
  }, [startAudioLevelMonitoring]);

  const stopAudioLevelMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setAudioLevel(0);
  }, []);

  const stopRecording = useCallback(() => {
    console.log('[Voice Recording] Stopping recording...');
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      // Stop audio level monitoring
      stopAudioLevelMonitoring();
      console.log('[Voice Recording] Recording stopped successfully');
    } else {
      console.log('[Voice Recording] No active recording to stop');
    }
  }, [isRecording, stopAudioLevelMonitoring]);

  const sendRecordedAudio = useCallback(() => {
    if (recordedAudioFile && sendCallbackRef.current) {
      console.log('[Voice Recording] Sending recorded audio:', recordedAudioFile.name);
      sendCallbackRef.current('Voice Message', 'voice', recordedAudioFile);
      setRecordedAudioFile(null);
    }
  }, [recordedAudioFile]);

  const cancelRecordedAudio = useCallback(() => {
    console.log('[Voice Recording] Canceling recorded audio');
    setRecordedAudioFile(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTypingRef.current && selectedUserRef.current) {
      isTypingRef.current = true;
      MessagingService.setTypingStatus(currentUserIdRef.current, selectedUserRef.current, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      if (selectedUserRef.current) {
        MessagingService.setTypingStatus(currentUserIdRef.current, selectedUserRef.current, false);
      }
    }, 2000);
  }, []);

  const handleSend = useCallback(() => {
    if (!inputRef.current || !selectedUserRef.current || sendingRef.current) return;
    
    const messageContent = inputRef.current.value.trim();
    if (!messageContent) return;
    
    // Clear input immediately
    inputRef.current.value = '';
    
    // Send the message via callback
    if (sendCallbackRef.current) {
      sendCallbackRef.current(messageContent, 'text');
    }
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Test microphone function for debugging
  const testMicrophone = useCallback(async () => {
    try {
      console.log('[Microphone Test] Starting microphone test...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      console.log('[Microphone Test] Got test stream:', stream);
      
      const audioTracks = stream.getAudioTracks();
      console.log('[Microphone Test] Audio tracks:', audioTracks);
      
      audioTracks.forEach((track, index) => {
        console.log(`[Microphone Test] Track ${index}:`, {
          label: track.label,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          settings: track.getSettings()
        });
      });
      
      // Stop the test stream after 2 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        console.log('[Microphone Test] Test stream stopped');
      }, 2000);
      
    } catch (error) {
      console.error('[Microphone Test] Error:', error);
    }
  }, []);

  return (
    <div className={`message-input ${dragOver ? 'drag-over' : ''}`} 
         onDragOver={handleDragOver} 
         onDragLeave={handleDragLeave} 
         onDrop={handleDrop}>
      
      {/* Drag overlay */}
      {dragOver && (
        <div className="drag-overlay">
          <div className="drag-message">
            <span>📎 Drop file to send</span>
          </div>
        </div>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="emoji-picker">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => addEmoji(emoji)}
              className="emoji-button"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input toolbar */}
      <div className="input-toolbar">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="toolbar-button emoji-button"
          title="Add emoji"
        >
          😀
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="toolbar-button"
          title="Attach file"
        >
          📎
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />
        
        {/* Test microphone button for debugging */}
        <button
          onClick={testMicrophone}
          className="toolbar-button test-mic-button"
          title="Test microphone"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
        
        <button
          ref={voiceRecorderRef}
          onClick={isRecording ? stopRecording : startRecording}
          className={`toolbar-button voice-button${isRecording ? ' recording' : ''}`}
          aria-label={isRecording ? 'Stop recording' : 'Record voice message'}
          type="button"
        >
          {/* SVG mic icon for clarity */}
          {isRecording ? (
            <span style={{fontSize: 22}}>⏹️</span>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
          )}
          <span className="voice-tooltip">{isRecording ? 'Stop recording' : 'Record Voice Message'}</span>
        </button>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          <span>Recording... {formatRecordingTime(recordingTime)}</span>
          
          {/* Audio level indicator */}
          <div className="audio-level-meter">
            <div 
              className="audio-level-bar" 
              style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
            ></div>
          </div>
          
          <button onClick={stopRecording} className="stop-recording">
            Stop
          </button>
        </div>
      )}

      {/* Recording error */}
      {recordingError && (
        <div className="recording-error">
          <div className="error-icon">⚠️</div>
          <div className="error-message">
            {recordingError.split('\n').map((line: string, index: number) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <button 
            onClick={() => setRecordingError(null)} 
            className="error-close"
            title="Close error message"
          >
            ×
          </button>
        </div>
      )}

      {/* Recorded audio review */}
      {recordedAudioFile && (
        <div className="recorded-audio-review">
          <div className="audio-info">
            <div className="audio-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </div>
            <div className="audio-details">
              <div className="audio-name">Voice Message</div>
              <div className="audio-size">{(recordedAudioFile.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
          <div className="audio-actions">
            <button 
              onClick={sendRecordedAudio} 
              className="send-audio-btn"
              title="Send voice message"
            >
              📤 Send
            </button>
            <button 
              onClick={cancelRecordedAudio} 
              className="cancel-audio-btn"
              title="Cancel and delete recording"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main input */}
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="message-input-field"
          disabled={sendingRef.current}
        />
        <button
          onClick={handleSend}
          disabled={sendingRef.current}
          className="send-button"
        >
          {sendingRef.current ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

// Interface for the main component
interface ChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  demoUsers?: Record<string, any>; // fallback demo users
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentUserId, 
  currentUserName,
  currentUserAvatar,
  demoUsers = {}
}) => {
  // State
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    userId: currentUserId,
    allowMessagesFrom: 'everyone',
    showOnlineStatus: true,
    showLastSeen: true,
    isAway: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [profileUser, setProfileUser] = useState<ConversationSummary | null>(null);
  const [newChatSearchQuery, setNewChatSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false); // Track if user is actively typing

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationListenerRef = useRef<(() => void) | null>(null);
  const messageListenerRef = useRef<(() => void) | null>(null);
  const typingListenerRef = useRef<(() => void) | null>(null);
  const messageInputRef = useRef<{
    setSendCallback: (callback: (message: string, type?: string, file?: File) => void) => void;
    setCurrentUser: (userId: string) => void;
    setSelectedUser: (userId: string | null) => void;
    setSendingState: (isSending: boolean) => void;
  }>(null);

  // Memoized values
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(conv => 
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const selectedConversation = useMemo(() => 
    conversations.find(c => c.userId === selectedUser), 
    [conversations, selectedUser]
  );

  // Initialize chat
  useEffect(() => {
    initializeChat();
    return cleanup;
  }, []);

  // Handle conversation selection
  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser);
      markConversationAsRead(selectedUser);
      setupTypingListener(selectedUser);
    }
  }, [selectedUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await MessagingService.getChatSettings(currentUserId);
        if (settings) {
          setChatSettings(settings);
        }
      } catch (error) {
        console.error('Error loading chat settings:', error);
      }
    };
    loadSettings();
  }, [currentUserId]);

  // Initialize chat system
  const initializeChat = async () => {
    try {
      setLoading(true);
      setError(null);

      // Setup real-time listeners
      setupConversationListener();
    } catch (error) {
      console.error('Error initializing chat:', error);
      setError('Failed to initialize chat. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time conversation listener
  const setupConversationListener = () => {
    if (conversationListenerRef.current) {
      conversationListenerRef.current();
    }

    conversationListenerRef.current = MessagingService.subscribeToConversations(
      currentUserId,
      (conversations) => {
        setConversations(conversations);
      }
    );
  };

  // Load conversation messages
  const loadConversation = (otherUserId: string) => {
    // Clean up existing message listener
    if (messageListenerRef.current) {
      messageListenerRef.current();
    }

    // Set up message listener
    messageListenerRef.current = MessagingService.subscribeToConversation(
      currentUserId,
      otherUserId,
      (messages) => {
        setMessages(messages);
      }
    );

    // Set up typing listener
    setupTypingListener(otherUserId);
  };

  // Setup typing indicator listener
  const setupTypingListener = (otherUserId: string) => {
    if (typingListenerRef.current) {
      typingListenerRef.current();
    }

    typingListenerRef.current = MessagingService.subscribeToTypingIndicators(
      currentUserId,
      (users) => {
        setTypingUsers(users.filter(user => user !== currentUserId));
      }
    );
  };

  // Mark conversation as read
  const markConversationAsRead = async (otherUserId: string) => {
    try {
      await MessagingService.markConversationAsRead(currentUserId, otherUserId);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  // Add reaction to message - memoized with useCallback
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      await MessagingService.addMessageReaction(messageId, currentUserId, currentUserName, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
      setError('Failed to add reaction. Please try again.');
    }
  }, [currentUserId, currentUserName]);

  // Create memoized reaction handlers to prevent re-renders
  const createReactionHandler = useCallback((messageId: string, emoji: string) => {
    return () => addReaction(messageId, emoji);
  }, [addReaction]);

  // Create stable reaction handlers map to prevent re-renders
  const reactionHandlersRef = useRef<Map<string, () => void>>(new Map());
  
  const getReactionHandler = useCallback((messageId: string, emoji: string) => {
    const key = `${messageId}-${emoji}`;
    if (!reactionHandlersRef.current.has(key)) {
      reactionHandlersRef.current.set(key, () => addReaction(messageId, emoji));
    }
    return reactionHandlersRef.current.get(key)!;
  }, [addReaction]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Utility functions
  const formatTime = (date: Date | undefined | null) => {
    // Handle undefined, null, or invalid dates
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getReactionCount = (reactions: MessageReaction[] = [], emoji: string) => {
    return reactions.filter(r => r.emoji === emoji).length;
  };

  const hasUserReacted = (reactions: MessageReaction[] = [], emoji: string) => {
    return reactions.some(r => r.userId === currentUserId && r.emoji === emoji);
  };

  // Cleanup
  const cleanup = () => {
    if (conversationListenerRef.current) conversationListenerRef.current();
    if (messageListenerRef.current) messageListenerRef.current();
    if (typingListenerRef.current) typingListenerRef.current();
    MessagingService.cleanup();
  };

  // Search for users to start new chat
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search in users collection
      const usersQuery = firestoreQuery(
        collection(db, 'users'),
        where('displayName', '>=', query),
        where('displayName', '<=', query + '\uf8ff'),
        limit(10)
      );
      
      // Search in crewProfiles collection
      const crewQuery = firestoreQuery(
        collection(db, 'crewProfiles'),
        where('name', '>=', query),
        where('name', '<=', query + '\uf8ff'),
        limit(10)
      );

      const [usersSnapshot, crewSnapshot] = await Promise.all([
        getDocs(usersQuery),
        getDocs(crewQuery)
      ]);

      const results: Array<{
        id: string;
        name: string;
        avatar?: string;
        role?: string;
        company?: string;
        location?: string;
        type: 'user' | 'crew';
      }> = [];

      // Add users
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        if (doc.id !== currentUserId) { // Don't show current user
          results.push({
            id: doc.id,
            name: data.displayName || data.firstName || `User ${doc.id.slice(-4)}`,
            avatar: data.avatarUrl,
            role: data.role,
            company: data.company,
            location: data.location,
            type: 'user'
          });
        }
      });

      // Add crew members
      crewSnapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        if (doc.id !== currentUserId) { // Don't show current user
          results.push({
            id: doc.id,
            name: data.name || data.firstName || `Crew ${doc.id.slice(-4)}`,
            avatar: data.avatarUrl,
            role: data.role,
            company: data.company,
            location: data.location,
            type: 'crew'
          });
        }
      });

      // Remove duplicates and limit results
      const uniqueResults = results.filter((result, index, self) => 
        index === self.findIndex(r => r.id === result.id)
      ).slice(0, 10);

      setSearchResults(uniqueResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Start new conversation
  const startNewConversation = async (userId: string, userName: string) => {
    setSelectedUser(userId);
    setShowNewChat(false);
    setNewChatSearchQuery('');
    setSearchResults([]);
    
    // MessageInput component will handle its own focus
  };

  // Handle new chat search input
  const handleNewChatSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setNewChatSearchQuery(query);
    
    // Debounce search
    if (query.trim()) {
      setTimeout(() => searchUsers(query), 300);
    } else {
      setSearchResults([]);
    }
  };

  // Helper to get user info for conversations/messages
  const getUserInfo = (userId: string) => {
    // Try to find in conversations (from Firestore)
    const conv = conversations.find(c => c.userId === userId);
    if (conv && conv.userName && conv.userAvatar) {
      return { name: conv.userName, avatar: conv.userAvatar };
    }
    // Try demo users
    if (demoUsers[userId]) {
      return { name: demoUsers[userId].displayName, avatar: demoUsers[userId].avatar };
    }
    // Fallback
    return { name: 'Unknown User', avatar: undefined };
  };

  // Send message function - memoized with useCallback
  const sendMessage = useCallback(async (messageContent: string, messageType: string = 'text', file?: File) => {
    if (!selectedUser || sending) return;

    console.log('[SendMessage] Starting to send message:', { messageContent, messageType, file: file?.name, fileType: file?.type });

    setSending(true);

    try {
      let content = messageContent;
      let type = messageType as 'text' | 'image' | 'file' | 'voice' | 'project_invite';

      // Handle file uploads
      if (file) {
        console.log('[SendMessage] Processing file:', file.name, file.type, file.size);
        
        if (file.type.startsWith('image/')) {
          type = 'image';
          content = `📷 ${file.name}`;
        } else if (file.type.startsWith('audio/')) {
          type = 'voice';
          content = `Voice Message (${(file.size / 1024).toFixed(1)} KB)`;
          console.log('[SendMessage] Detected voice message:', content);
        } else if (file.type.startsWith('video/')) {
          type = 'file';
          content = `🎥 ${file.name}`;
        } else {
          type = 'file';
          content = `📎 ${file.name}`;
        }
        
        // TODO: Upload file to Firebase Storage and get URL
        // For now, we'll just send the file name
        console.log('[SendMessage] File to upload:', file.name, file.type, file.size);
      }

      console.log('[SendMessage] Final message data:', { content, type });

      // Optimistically add message to UI
      const optimisticMessage: DirectMessage = {
        id: `temp_${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedUser,
        content,
        timestamp: new Date(),
        isRead: false,
        messageType: type,
        status: 'sending',
        fileUrl: file ? URL.createObjectURL(file) : undefined,
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Send actual message
      console.log('[SendMessage] Calling MessagingService.sendDirectMessage with:', { currentUserId, selectedUser, content, type });
      await MessagingService.sendDirectMessage(currentUserId, selectedUser, content, type);
      
      // Update optimistic message status
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...msg, status: 'sent' as any }
          : msg
      ));

      // Stop typing indicator
      MessagingService.setTypingStatus(currentUserId, selectedUser, false);
    } catch (error) {
      console.error('[SendMessage] Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
    } finally {
      setSending(false);
    }
  }, [selectedUser, sending, currentUserId]);

  // Set up MessageInput communication - moved after sendMessage is defined
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.setCurrentUser(currentUserId);
      messageInputRef.current.setSendCallback(sendMessage);
    }
  }, [currentUserId, sendMessage]);

  // Update MessageInput when selectedUser changes
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.setSelectedUser(selectedUser);
    }
  }, [selectedUser]);

  // Update MessageInput sending state
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.setSendingState(sending);
    }
  }, [sending]);

  if (loading) {
    return (
      <div className="chat-interface">
        <div className="chat-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2 className="text-xl font-light text-gray-900 tracking-wide">Messages</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="new-chat-button"
                title="New Chat"
              >
                ➕
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="settings-button"
                title="Chat Settings"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* New Chat Section */}
          {showNewChat && (
            <div className="new-chat-section">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Start New Chat</h3>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users to chat with..."
                    value={newChatSearchQuery}
                    onChange={handleNewChatSearch}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                
                {searchResults.length > 0 && (
                  <div className="search-results max-h-48 overflow-y-auto space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
                        onClick={() => startNewConversation(user.id, user.name)}
                      >
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{user.name}</h4>
                          {user.role && (
                            <p className="text-xs text-gray-600 truncate">{user.role}</p>
                          )}
                          {user.company && (
                            <p className="text-xs text-gray-500 truncate">{user.company}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-xs text-blue-600">💬</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {newChatSearchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="text-xs text-gray-500 text-center py-2">
                    No users found. Try a different search term.
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Find users by name, role, or company
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Chat Settings */}
          {showSettings && (
            <div className="settings-panel">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Chat Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Allow messages from:</label>
                  <select
                    value={chatSettings?.allowMessagesFrom || 'everyone'}
                    onChange={(e) => {
                      const newSettings: ChatSettings = { 
                        userId: currentUserId,
                        allowMessagesFrom: e.target.value as 'followers' | 'everyone' | 'none',
                        showOnlineStatus: chatSettings?.showOnlineStatus ?? true,
                        showLastSeen: chatSettings?.showLastSeen ?? true,
                        autoReply: chatSettings?.autoReply || '',
                        isAway: chatSettings?.isAway ?? false,
                        awayMessage: chatSettings?.awayMessage || ''
                      };
                      setChatSettings(newSettings);
                      MessagingService.updateChatSettings(currentUserId, newSettings);
                    }}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="followers">Followers Only</option>
                    <option value="none">No One</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showOnline"
                    checked={chatSettings?.showOnlineStatus || false}
                    onChange={(e) => {
                      const newSettings: ChatSettings = { 
                        userId: currentUserId,
                        allowMessagesFrom: chatSettings?.allowMessagesFrom || 'everyone',
                        showOnlineStatus: e.target.checked,
                        showLastSeen: chatSettings?.showLastSeen ?? true,
                        autoReply: chatSettings?.autoReply || '',
                        isAway: chatSettings?.isAway ?? false,
                        awayMessage: chatSettings?.awayMessage || ''
                      };
                      setChatSettings(newSettings);
                      MessagingService.updateChatSettings(currentUserId, newSettings);
                    }}
                  />
                  <label htmlFor="showOnline" className="text-xs text-gray-600">Show online status</label>
                </div>
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="empty-state">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
                <p className="text-xs text-gray-400">
                  {searchQuery ? 'Try a different search term' : 'Start messaging your connections'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const { name, avatar } = getUserInfo(conversation.userId);
                return (
                  <div
                    key={conversation.userId}
                    className={`conversation-item ${selectedUser === conversation.userId ? 'active' : ''}`}
                  >
                    <div 
                      className="conversation-content"
                      onClick={() => setSelectedUser(conversation.userId)}
                    >
                      <div className="user-avatar">
                        {avatar ? (
                          <img 
                            src={avatar} 
                            alt={name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {conversation.isOnline && (
                          <div className="online-indicator"></div>
                        )}
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-header">
                          <h4 className="user-name">{name}</h4>
                          {conversation.lastMessageTime && (
                            <span className="message-time">{formatTime(conversation.lastMessageTime)}</span>
                          )}
                        </div>
                        <div className="conversation-preview">
                          {conversation.lastMessage && (
                            <p className="last-message">{conversation.lastMessage}</p>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="unread-badge">{conversation.unreadCount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setProfileUser(conversation);
                        setShowUserProfile(true);
                      }}
                      className="profile-button"
                      title="View Profile"
                    >
                      👤
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="user-info">
                  {selectedUser ? (
                    <img 
                      src={selectedUser ? getUserInfo(selectedUser).avatar : ''} 
                      alt={selectedUser ? getUserInfo(selectedUser).name : ''}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {selectedUser ? getUserInfo(selectedUser).name.charAt(0).toUpperCase() : ''}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="user-name">{selectedUser ? getUserInfo(selectedUser).name : ''}</h3>
                    {typingUsers.includes(selectedUser) && (
                      <p className="typing-indicator">typing...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      {/* Message content based on type */}
                      {message.messageType === 'image' && message.fileUrl ? (
                        <div className="message-image">
                          <img 
                            src={message.fileUrl} 
                            alt={message.fileName || 'Image'} 
                            className="message-image-content"
                            onClick={() => window.open(message.fileUrl, '_blank')}
                          />
                          {message.content && <p className="image-caption">{message.content}</p>}
                        </div>
                      ) : message.messageType === 'file' ? (
                        <div className="message-file">
                          <div className="file-info">
                            <div className="file-icon">📎</div>
                            <div className="file-details">
                              <div className="file-name">{message.fileName || 'File'}</div>
                              {message.fileSize && (
                                <div className="file-size">
                                  {(message.fileSize / 1024 / 1024).toFixed(1)} MB
                                </div>
                              )}
                            </div>
                            <button 
                              className="file-download"
                              onClick={() => message.fileUrl && window.open(message.fileUrl, '_blank')}
                            >
                              📥
                            </button>
                          </div>
                          {message.content && <p className="file-caption">{message.content}</p>}
                        </div>
                      ) : message.messageType === 'voice' ? (
                        <div className="message-voice">
                          <div className="voice-player">
                            <button className="play-button">▶️</button>
                            <div className="voice-waveform">
                              {message.voiceWaveform ? (
                                message.voiceWaveform.map((height, index) => (
                                  <div 
                                    key={index} 
                                    className="waveform-bar"
                                    style={{ height: `${height}%` }}
                                  />
                                ))
                              ) : (
                                <div className="voice-placeholder">
                                  {Array.from({ length: 20 }, (_, i) => (
                                    <div key={i} className="waveform-bar" />
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="voice-duration">
                              {message.voiceDuration ? 
                                `${Math.floor(message.voiceDuration / 60)}:${(message.voiceDuration % 60).toString().padStart(2, '0')}` : 
                                '0:00'
                              }
                            </div>
                          </div>
                          {message.content && <p className="voice-caption">{message.content}</p>}
                        </div>
                      ) : (
                        <p className="message-text">{message.content}</p>
                      )}
                      
                      <div className="message-meta">
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                        {message.senderId === currentUserId && (
                          <span className="message-status">
                            {message.status === 'sending' && '⏳'}
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'read' && '✓✓'}
                          </span>
                        )}
                      </div>
                      
                      {/* Message Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="message-reactions">
                          {['👍', '❤️', '😊', '🎉'].map((emoji) => {
                            const count = getReactionCount(message.reactions, emoji);
                            if (count === 0) return null;
                            
                            return (
                              <button
                                key={emoji}
                                onClick={getReactionHandler(message.id, emoji)}
                                className={`reaction-button ${hasUserReacted(message.reactions, emoji) ? 'reacted' : ''}`}
                              >
                                <span className="emoji">{emoji}</span>
                                <span className="count">{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {/* Reaction Buttons - moved inside message-content */}
                      <div className="reaction-buttons">
                        {['👍', '❤️', '😊', '🎉'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={getReactionHandler(message.id, emoji)}
                            className="reaction-option"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {typingUsers.includes(selectedUser) && (
                  <div className="typing-indicator-message">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <MessageInput key="stable-message-input" ref={messageInputRef} />
            </>
          ) : (
            <div className="no-conversation">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-light text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && profileUser && (
        <div className="profile-modal-overlay" onClick={() => setShowUserProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header">
              <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
              <button
                onClick={() => setShowUserProfile(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="profile-content">
              <div className="profile-avatar-section">
                {profileUser.userAvatar ? (
                  <img 
                    src={profileUser.userAvatar} 
                    alt={profileUser.userName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-medium text-gray-600">
                      {profileUser.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="profile-status">
                  {profileUser.isOnline ? (
                    <span className="online-status">🟢 Online</span>
                  ) : (
                    <span className="offline-status">⚫ Offline</span>
                  )}
                </div>
              </div>
              
              <div className="profile-info">
                <h4 className="profile-name">{profileUser.userName}</h4>
                <p className="profile-role">{profileUser.userRole || 'Film Industry Professional'}</p>
                <p className="profile-location">Location: {profileUser.userLocation || 'Not specified'}</p>
                <p className="profile-company">Company: {profileUser.userCompany || 'Not specified'}</p>
              </div>
              
              <div className="profile-actions">
                <button
                  onClick={() => {
                    setSelectedUser(profileUser.userId);
                    setShowUserProfile(false);
                  }}
                  className="start-chat-button"
                >
                  💬 Start Chat
                </button>
                <button className="view-full-profile-button">
                  👁️ View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 