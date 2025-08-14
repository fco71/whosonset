"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[336],{

/***/ 336:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Chat_ChatTestPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./src/utilities/messagingService.ts
var messagingService = __webpack_require__(4672);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
// EXTERNAL MODULE: ./src/utilities/emailNotificationService.ts
var emailNotificationService = __webpack_require__(4221);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(5072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(7825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(7659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(5056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(1113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Chat/ChatInterface.scss
var ChatInterface = __webpack_require__(7388);
;// ./src/components/Chat/ChatInterface.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(ChatInterface/* default */.A, options);




       /* harmony default export */ const Chat_ChatInterface = (ChatInterface/* default */.A && ChatInterface/* default */.A.locals ? ChatInterface/* default */.A.locals : undefined);

;// ./src/components/Chat/ChatInterface.tsx









const ChatInterface_ChatInterface = ({ currentUserId, currentUserName, currentUserAvatar, demoUsers = {}, initialSelectedUser }) => {
    const { t } = (0,es/* useTranslation */.Bd)();
    // State
    const [conversations, setConversations] = (0,react.useState)([]);
    const [selectedUser, setSelectedUser] = (0,react.useState)(initialSelectedUser || null);
    const [messages, setMessages] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [sending, setSending] = (0,react.useState)(false);
    const [showNewChat, setShowNewChat] = (0,react.useState)(false);
    const [newChatSearchQuery, setNewChatSearchQuery] = (0,react.useState)('');
    const [searchResults, setSearchResults] = (0,react.useState)([]);
    const [isSearching, setIsSearching] = (0,react.useState)(false);
    const [typingUsers, setTypingUsers] = (0,react.useState)([]);
    const [messageInput, setMessageInput] = (0,react.useState)('');
    const [showEmojiPicker, setShowEmojiPicker] = (0,react.useState)(false);
    const [isRecording, setIsRecording] = (0,react.useState)(false);
    const [recordingTime, setRecordingTime] = (0,react.useState)(0);
    const [pendingAttachment, setPendingAttachment] = (0,react.useState)(null);
    const [pendingAttachmentType, setPendingAttachmentType] = (0,react.useState)(null);
    const [showReactionPicker, setShowReactionPicker] = (0,react.useState)(null);
    // Refs
    const messagesEndRef = (0,react.useRef)(null);
    const conversationListenerRef = (0,react.useRef)(null);
    const messageListenerRef = (0,react.useRef)(null);
    const typingListenerRef = (0,react.useRef)(null);
    const fileInputRef = (0,react.useRef)(null);
    const mediaRecorderRef = (0,react.useRef)(null);
    const recordingTimerRef = (0,react.useRef)(null);
    // Emoji picker - memoized to prevent re-creation
    const emojis = (0,react.useMemo)(() => ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙏', '😎', '🤝', '💪', '🚀', '⭐'], []);
    // Reaction emojis - commonly used reactions
    const reactionEmojis = (0,react.useMemo)(() => ['👍', '❤️', '😂', '😮', '😢', '😡'], []);
    // Initialize chat
    (0,react.useEffect)(() => {
        if (!currentUserId)
            return;
        const initializeChat = async () => {
            try {
                setLoading(true);
                setError(null);
                // Set up conversation listener
                const unsubscribe = messagingService.MessagingService.subscribeToConversations(currentUserId, (conversations) => {
                    setConversations(conversations);
                    setLoading(false);
                });
                conversationListenerRef.current = unsubscribe;
            }
            catch (error) {
                console.error('Error initializing chat:', error);
                setError('Failed to load conversations');
                setLoading(false);
            }
        };
        initializeChat();
        return () => {
            cleanup();
        };
    }, [currentUserId]);
    // Mark conversation as read when selected user changes
    (0,react.useEffect)(() => {
        if (selectedUser && conversations.length > 0) {
            const conversation = conversations.find(c => c.userId === selectedUser);
            if (conversation && conversation.unreadCount > 0) {
                const markAsRead = async () => {
                    try {
                        await messagingService.MessagingService.markConversationAsRead(currentUserId, selectedUser);
                    }
                    catch (error) {
                        console.error('Error marking conversation as read:', error);
                    }
                };
                markAsRead();
            }
        }
    }, [selectedUser, conversations, currentUserId]);
    // Set up message listener when user is selected
    (0,react.useEffect)(() => {
        if (!selectedUser || !currentUserId)
            return;
        const setupMessageListener = () => {
            const unsubscribe = messagingService.MessagingService.subscribeToConversation(currentUserId, selectedUser, (messages) => {
                setMessages(messages);
                // Scroll to bottom
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                // Mark conversation as read when messages are loaded
                if (messages.length > 0) {
                    messagingService.MessagingService.markConversationAsRead(currentUserId, selectedUser).catch(error => {
                        console.error('[ChatInterface] Error marking conversation as read:', error);
                    });
                }
            });
            messageListenerRef.current = unsubscribe;
        };
        setupMessageListener();
        // Set up typing indicator listener
        const typingUnsubscribe = messagingService.MessagingService.subscribeToTypingIndicators(selectedUser, (typingUsers) => {
            setTypingUsers(typingUsers);
        });
        typingListenerRef.current = typingUnsubscribe;
        return () => {
            if (messageListenerRef.current) {
                messageListenerRef.current();
                messageListenerRef.current = null;
            }
            if (typingListenerRef.current) {
                typingListenerRef.current();
                typingListenerRef.current = null;
            }
        };
    }, [selectedUser, currentUserId]);
    // Mark messages as read when they are viewed
    (0,react.useEffect)(() => {
        if (!selectedUser || !currentUserId || messages.length === 0)
            return;
        // Mark unread messages from the other user as read
        const unreadMessages = messages.filter(message => message.senderId === selectedUser &&
            !message.isRead &&
            message.status !== 'read');
        if (unreadMessages.length > 0) {
            console.log('[ChatInterface] Marking messages as read:', unreadMessages.length);
            // Mark each unread message as read
            unreadMessages.forEach(async (message) => {
                try {
                    await messagingService.MessagingService.markMessageAsRead(message.id);
                }
                catch (error) {
                    console.error('[ChatInterface] Error marking message as read:', error);
                }
            });
        }
    }, [messages, selectedUser, currentUserId]);
    // Cleanup
    const cleanup = (0,react.useCallback)(() => {
        try {
            if (conversationListenerRef.current) {
                conversationListenerRef.current();
                conversationListenerRef.current = null;
            }
            if (messageListenerRef.current) {
                messageListenerRef.current();
                messageListenerRef.current = null;
            }
            if (typingListenerRef.current) {
                typingListenerRef.current();
                typingListenerRef.current = null;
            }
            messagingService.MessagingService.cleanup();
        }
        catch (error) {
            console.error('Error during cleanup:', error);
        }
    }, []);
    // Search for users to start new chat - memoized to prevent unnecessary re-renders
    const searchUsers = (0,react.useCallback)(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const crewQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* where */._M)('isPublished', '==', true), (0,index_esm/* limit */.AB)(20));
            const crewSnapshot = await (0,index_esm/* getDocs */.GG)(crewQuery);
            const results = [];
            crewSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const name = data.name || data.displayName || data.firstName || '';
                if (doc.id !== currentUserId &&
                    name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        id: doc.id,
                        name: name || `Crew Member ${doc.id.slice(-4)}`,
                        avatar: data.profileImageUrl || data.avatarUrl,
                        role: data.role,
                        company: data.company,
                        location: data.residences?.[0]?.city || data.location,
                        type: 'crew'
                    });
                }
            });
            setSearchResults(results);
        }
        catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        }
        finally {
            setIsSearching(false);
        }
    }, [currentUserId]);
    const startNewConversation = (0,react.useCallback)(async (userId, userName) => {
        setSelectedUser(userId);
        setShowNewChat(false);
        setNewChatSearchQuery('');
        setSearchResults([]);
        // Mark conversation as read when starting a new conversation
        try {
            await messagingService.MessagingService.markConversationAsRead(currentUserId, userId);
        }
        catch (error) {
            console.error('Error marking conversation as read:', error);
        }
    }, [currentUserId]);
    const handleNewChatSearch = (0,react.useCallback)((e) => {
        const query = e.target.value;
        setNewChatSearchQuery(query);
        if (query.trim()) {
            const timeoutId = setTimeout(() => searchUsers(query), 300);
            return () => clearTimeout(timeoutId);
        }
        else {
            setSearchResults([]);
        }
    }, [searchUsers]);
    const getUserInfo = (0,react.useCallback)((userId) => {
        const conv = conversations.find(c => c.userId === userId);
        return conv || null;
    }, [conversations]);
    // Get user email for notifications
    const getUserEmail = (0,react.useCallback)(async (userId) => {
        try {
            console.log('[ChatInterface] Getting email for user:', userId);
            // Try users collection first
            const userDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'users', userId));
            if (userDoc.exists()) {
                const email = userDoc.data()?.email;
                console.log('[ChatInterface] Found email in users collection:', email);
                return email || null;
            }
            // Try crewProfiles collection if not found in users
            const crewDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'crewProfiles', userId));
            if (crewDoc.exists()) {
                const email = crewDoc.data()?.email;
                console.log('[ChatInterface] Found email in crewProfiles collection:', email);
                return email || null;
            }
            console.log('[ChatInterface] No email found for user:', userId);
            return null;
        }
        catch (error) {
            console.error('Error getting user email:', error);
            return null;
        }
    }, []);
    // File handling - optimized
    const handleFileSelect = (0,react.useCallback)((event) => {
        const file = event.target.files?.[0];
        if (file && selectedUser) {
            setPendingAttachment(file);
            setPendingAttachmentType(file.type);
        }
        event.target.value = '';
    }, [selectedUser]);
    const cancelPendingAttachment = (0,react.useCallback)(() => {
        setPendingAttachment(null);
        setPendingAttachmentType(null);
    }, []);
    const sendPendingAttachment = (0,react.useCallback)(async () => {
        if (!pendingAttachment || !selectedUser || sending)
            return;
        setSending(true);
        try {
            // Upload file to storage first
            let fileUrl = '';
            if (pendingAttachmentType?.startsWith('audio/')) {
                // For voice messages, upload to storage
                fileUrl = await messagingService.MessagingService.uploadFileToStorage(pendingAttachment, 'voice-messages');
            }
            else {
                // For other files, use existing logic
                fileUrl = await messagingService.MessagingService.uploadFileToStorage(pendingAttachment);
            }
            const content = pendingAttachmentType?.startsWith('audio/')
                ? 'Voice message'
                : pendingAttachment.name;
            const messageType = pendingAttachmentType?.startsWith('audio/')
                ? 'voice'
                : pendingAttachmentType?.startsWith('image/')
                    ? 'image'
                    : 'file';
            const optimisticMessage = {
                id: `temp_${Date.now()}`,
                senderId: currentUserId,
                receiverId: selectedUser,
                content,
                timestamp: new Date(),
                isRead: false,
                status: 'sending',
                messageType,
                fileUrl,
                fileName: pendingAttachment.name,
                fileSize: pendingAttachment.size,
                fileType: pendingAttachment.type
            };
            setMessages(prev => [...prev, optimisticMessage]);
            await messagingService.MessagingService.sendDirectMessage(currentUserId, selectedUser, content, messageType, undefined, fileUrl);
            setMessages(prev => prev.map(msg => msg.id === optimisticMessage.id
                ? { ...msg, status: 'sent' }
                : msg));
            // Clear pending attachment
            setPendingAttachment(null);
            setPendingAttachmentType(null);
        }
        catch (error) {
            console.error('Error sending file:', error);
            setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
            setError('Failed to send attachment. Please try again.');
        }
        finally {
            setSending(false);
        }
    }, [pendingAttachment, selectedUser, sending, currentUserId]);
    // Voice recording - optimized
    const startRecording = (0,react.useCallback)(async () => {
        try {
            // Check if microphone is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError('Microphone not supported in this browser. Please use a modern browser.');
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                const file = new File([blob], `voice-message-${Date.now()}.wav`, { type: 'audio/wav' });
                setPendingAttachment(file);
                setPendingAttachmentType('audio/wav');
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
                setRecordingTime(0);
                if (recordingTimerRef.current) {
                    clearInterval(recordingTimerRef.current);
                }
            };
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            // Start timer
            const timer = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            mediaRecorderRef.current = mediaRecorder;
            recordingTimerRef.current = timer;
        }
        catch (error) {
            console.error('Error starting recording:', error);
            // Provide specific guidance based on error type
            let errorMessage = 'Could not access microphone';
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and try again.';
            }
            else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                errorMessage = 'No microphone found. Please connect a microphone and try again.';
            }
            else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                errorMessage = 'Microphone is already in use by another application. Please close other apps using the microphone and try again.';
            }
            else if (error.name === 'OverconstrainedError') {
                errorMessage = 'Microphone does not meet the required constraints. Please try a different microphone.';
            }
            setError(errorMessage);
        }
    }, []);
    const stopRecording = (0,react.useCallback)(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    }, [isRecording]);
    const formatRecordingTime = (0,react.useCallback)((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);
    // Emoji handling
    const addEmoji = (0,react.useCallback)((emoji) => {
        setMessageInput(prev => prev + emoji);
        setShowEmojiPicker(false);
    }, []);
    // Reaction handling
    const addReaction = (0,react.useCallback)(async (messageId, emoji) => {
        try {
            await messagingService.MessagingService.addMessageReaction(messageId, currentUserId, currentUserName, emoji);
            setShowReactionPicker(null);
        }
        catch (error) {
            console.error('Error adding reaction:', error);
            setError('Failed to add reaction');
        }
    }, [currentUserId, currentUserName]);
    const toggleReactionPicker = (0,react.useCallback)((messageId) => {
        setShowReactionPicker(showReactionPicker === messageId ? null : messageId);
    }, [showReactionPicker]);
    const sendMessage = (0,react.useCallback)(async () => {
        if (!selectedUser || sending || !messageInput.trim())
            return;
        const content = messageInput.trim();
        setSending(true);
        setMessageInput('');
        try {
            const optimisticMessage = {
                id: `temp_${Date.now()}`,
                senderId: currentUserId,
                receiverId: selectedUser,
                content,
                timestamp: new Date(),
                isRead: false,
                messageType: 'text',
                status: 'sending'
            };
            setMessages(prev => [...prev, optimisticMessage]);
            await messagingService.MessagingService.sendDirectMessage(currentUserId, selectedUser, content, 'text');
            setMessages(prev => prev.map(msg => msg.id === optimisticMessage.id
                ? { ...msg, status: 'sent' }
                : msg));
            // Send email notification
            try {
                const recipientEmail = await getUserEmail(selectedUser);
                if (recipientEmail) {
                    console.log('[ChatInterface] Sending email notification to:', recipientEmail);
                    const messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
                    await emailNotificationService/* default */.A.sendChatNotification(recipientEmail, currentUserName, messagePreview, undefined, // conversationUrl
                    selectedUser // userId
                    );
                    console.log('[ChatInterface] Email notification sent successfully to:', recipientEmail);
                }
                else {
                    console.log('[ChatInterface] No email found for recipient:', selectedUser);
                }
            }
            catch (emailError) {
                console.error('Error sending email notification:', emailError);
                // Don't fail the message send if email notification fails
            }
        }
        catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
        }
        finally {
            setSending(false);
        }
    }, [selectedUser, sending, currentUserId, messageInput, currentUserName, getUserEmail]);
    const handleKeyPress = (0,react.useCallback)((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);
    const formatTime = (0,react.useCallback)((date) => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            return '';
        }
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        else if (days === 1) {
            return 'Yesterday';
        }
        else if (days < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }, []);
    // Memoized message rendering to improve performance
    const renderMessage = (0,react.useCallback)((message) => {
        try {
            const isSent = message.senderId === currentUserId;
            // Defensive programming - ensure message has required properties
            if (!message || !message.id) {
                return null;
            }
            return ((0,jsx_runtime.jsxs)("div", { className: `message ${isSent ? 'sent' : 'received'}`, style: { position: 'relative' }, children: [(0,jsx_runtime.jsxs)("div", { className: "message-content", children: [['deleted_text', 'deleted_image', 'deleted_audio', 'deleted_file'].includes(message.messageType) ? ((0,jsx_runtime.jsxs)("div", { className: "deleted-message-placeholder", style: {
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    color: '#b0b6be',
                                    fontStyle: 'italic',
                                    fontSize: 13,
                                    background: 'none',
                                    borderRadius: 0,
                                    padding: 0,
                                    margin: '2px 0 0 0',
                                    boxShadow: 'none',
                                    minHeight: 0
                                }, children: [(0,jsx_runtime.jsx)("span", { style: { fontSize: 15, opacity: 0.7, marginRight: 2 }, children: "\uD83D\uDDD1\uFE0F" }), message.content] })) : message.messageType === 'image' && message.fileUrl && !message.fileUrl.startsWith('FILE_TOO_LARGE:') && !message.fileUrl.startsWith('UPLOAD_FAILED:') ? ((0,jsx_runtime.jsxs)("div", { className: "message-image", children: [(0,jsx_runtime.jsx)("img", { src: message.fileUrl, alt: message.fileName || 'Image', className: "message-image-content", onError: imageErrorFallback/* imageErrorFallback */.i }), message.content && (0,jsx_runtime.jsx)("p", { className: "image-caption", children: message.content })] })) : message.messageType === 'voice' && message.fileUrl && !message.fileUrl.startsWith('FILE_TOO_LARGE:') && !message.fileUrl.startsWith('UPLOAD_FAILED:') ? ((0,jsx_runtime.jsxs)("div", { className: "message-voice", children: [(0,jsx_runtime.jsx)("div", { className: "voice-player", children: (0,jsx_runtime.jsxs)("div", { className: "custom-audio-player", children: [(0,jsx_runtime.jsx)("button", { className: "play-button", onClick: (e) => {
                                                        e.preventDefault();
                                                        const audioElement = e.currentTarget.parentElement?.querySelector('audio');
                                                        if (audioElement) {
                                                            if (audioElement.paused) {
                                                                audioElement.play().catch(err => {
                                                                    console.error('Error playing audio:', err);
                                                                });
                                                                e.currentTarget.innerHTML = '⏸️';
                                                            }
                                                            else {
                                                                audioElement.pause();
                                                                e.currentTarget.innerHTML = '▶️';
                                                            }
                                                        }
                                                    }, type: "button", children: "\u25B6\uFE0F" }), (0,jsx_runtime.jsx)("audio", { src: message.fileUrl, preload: "metadata", onEnded: (e) => {
                                                        const button = e.currentTarget.parentElement?.querySelector('.play-button');
                                                        if (button)
                                                            button.innerHTML = '▶️';
                                                    }, onError: (e) => {
                                                        console.error('Audio error:', e);
                                                    } }), (0,jsx_runtime.jsx)("div", { className: "audio-info", children: (0,jsx_runtime.jsx)("span", { className: "audio-duration", children: "Voice message" }) })] }) }), message.content && (0,jsx_runtime.jsx)("p", { className: "voice-caption", children: message.content })] })) : ((0,jsx_runtime.jsx)("div", { className: "message-text", children: message.content })), (0,jsx_runtime.jsxs)("div", { className: "message-meta", children: [(0,jsx_runtime.jsx)("span", { className: "message-time", children: formatTime(message.timestamp) }), isSent && ((0,jsx_runtime.jsxs)("span", { className: "message-status", children: [message.status === 'sending' && '⏳', message.status === 'sent' && '✓', message.status === 'delivered' && '✓✓', message.status === 'read' && '✓✓'] }))] }), message.reactions && message.reactions.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "message-reactions", children: Object.entries(message.reactions.reduce((acc, reaction) => {
                                    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                                    return acc;
                                }, {})).map(([emoji, count], index) => ((0,jsx_runtime.jsxs)("span", { className: "reaction", children: [emoji, (0,jsx_runtime.jsx)("span", { className: "reaction-count", children: count })] }, index))) }))] }), (0,jsx_runtime.jsxs)("div", { className: "message-actions", children: [(0,jsx_runtime.jsx)("button", { title: "Add reaction", className: "reaction-button", onClick: () => toggleReactionPicker(message.id), children: "\uD83D\uDE00" }), isSent && !['deleted_text', 'deleted_image', 'deleted_audio', 'deleted_file'].includes(message.messageType) && ((0,jsx_runtime.jsx)("button", { title: "Delete message", className: "delete-message-button", onClick: async () => {
                                    const confirmMessage = 'Delete this message for everyone?';
                                    if (window.confirm(confirmMessage)) {
                                        try {
                                            await messagingService.MessagingService.deleteMessage(message.id, message.fileUrl, message.messageType, currentUserId);
                                            // The message will be updated via the listener, no need to manually update state
                                        }
                                        catch (error) {
                                            console.error('Error deleting message:', error);
                                            setError('Failed to delete message. Please try again.');
                                        }
                                    }
                                }, children: "\uD83D\uDDD1\uFE0F" }))] }), showReactionPicker === message.id && ((0,jsx_runtime.jsx)("div", { className: "reaction-picker", children: reactionEmojis.map((emoji, index) => ((0,jsx_runtime.jsx)("button", { onClick: () => addReaction(message.id, emoji), className: "reaction-option", children: emoji }, index))) }))] }, message.id));
        }
        catch (error) {
            console.error('Error rendering message:', error);
            return null; // Return null to avoid rendering a broken message
        }
    }, [currentUserId, formatTime, showReactionPicker, reactionEmojis, addReaction, toggleReactionPicker]);
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "chat-interface", children: (0,jsx_runtime.jsxs)("div", { className: "loading-container", children: [(0,jsx_runtime.jsx)("div", { className: "loading-spinner" }), (0,jsx_runtime.jsx)("p", { children: "Loading conversations..." })] }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "chat-interface", children: [error && ((0,jsx_runtime.jsxs)("div", { className: "error-banner", children: [(0,jsx_runtime.jsx)("span", { children: error }), (0,jsx_runtime.jsx)("button", { onClick: () => setError(null), className: "error-close-btn", title: "Dismiss error", type: "button", children: "\u2715" })] })), (0,jsx_runtime.jsxs)("div", { className: "chat-container", children: [(0,jsx_runtime.jsxs)("div", { className: "chat-sidebar", children: [(0,jsx_runtime.jsxs)("div", { className: "sidebar-header", children: [(0,jsx_runtime.jsx)("h2", { children: "Messages" }), (0,jsx_runtime.jsx)("button", { onClick: () => setShowNewChat(!showNewChat), className: "new-chat-button", children: "\u2795" })] }), showNewChat && ((0,jsx_runtime.jsxs)("div", { className: "new-chat-section", children: [(0,jsx_runtime.jsx)("h3", { children: "Start New Chat" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search users...", value: newChatSearchQuery, onChange: handleNewChatSearch, className: "search-input" }), isSearching && ((0,jsx_runtime.jsx)("div", { className: "search-loading", children: "Searching..." })), searchResults.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "search-results", children: searchResults.map((user) => ((0,jsx_runtime.jsxs)("div", { className: "search-result-item", onClick: () => startNewConversation(user.id, user.name), children: [(0,jsx_runtime.jsx)("div", { className: "user-avatar", children: user.avatar ? ((0,jsx_runtime.jsx)("img", { src: user.avatar, alt: user.name, onError: imageErrorFallback/* imageErrorFallback */.i })) : ((0,jsx_runtime.jsx)("div", { className: "avatar-placeholder", children: user.name.charAt(0).toUpperCase() })) }), (0,jsx_runtime.jsxs)("div", { className: "user-info", children: [(0,jsx_runtime.jsx)("h4", { children: user.name }), user.role && (0,jsx_runtime.jsx)("p", { children: user.role })] })] }, user.id))) }))] })), (0,jsx_runtime.jsx)("div", { className: "conversations-list", children: conversations.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "no-conversations", children: [(0,jsx_runtime.jsx)("p", { children: "No conversations yet" }), (0,jsx_runtime.jsx)("p", { children: "Start a new chat to begin messaging" })] })) : (
                                // Deduplicate conversations by userId to prevent React key conflicts
                                conversations
                                    .filter((conversation, index, self) => index === self.findIndex(c => c.userId === conversation.userId))
                                    .map((conversation) => {
                                    const isSelected = selectedUser === conversation.userId;
                                    return ((0,jsx_runtime.jsxs)("div", { className: `conversation-item ${isSelected ? 'selected' : ''}`, onClick: async () => {
                                            console.log('[ChatInterface] Selecting conversation:', conversation.userId, 'Unread count:', conversation.unreadCount);
                                            setSelectedUser(conversation.userId);
                                            // Mark conversation as read when selected
                                            if (conversation.unreadCount > 0) {
                                                try {
                                                    console.log('[ChatInterface] Marking conversation as read:', conversation.userId);
                                                    // Add a small delay to make the unread count visible before clearing
                                                    setTimeout(async () => {
                                                        await messagingService.MessagingService.markConversationAsRead(currentUserId, conversation.userId);
                                                        console.log('[ChatInterface] Conversation marked as read successfully');
                                                        // Update the conversation list to reflect the change
                                                        setConversations(prev => prev.map(conv => conv.userId === conversation.userId
                                                            ? { ...conv, unreadCount: 0 }
                                                            : conv));
                                                    }, 100); // 100ms delay
                                                }
                                                catch (error) {
                                                    console.error('Error marking conversation as read:', error);
                                                }
                                            }
                                        }, children: [(0,jsx_runtime.jsxs)("div", { className: "conversation-avatar", children: [conversation.userAvatar ? ((0,jsx_runtime.jsx)("img", { src: conversation.userAvatar, alt: conversation.userName, onError: imageErrorFallback/* imageErrorFallback */.i })) : ((0,jsx_runtime.jsx)("div", { className: "avatar-placeholder", children: conversation.userName.charAt(0).toUpperCase() })), conversation.isOnline && ((0,jsx_runtime.jsx)("div", { className: "online-indicator" }))] }), (0,jsx_runtime.jsxs)("div", { className: "conversation-content", children: [(0,jsx_runtime.jsxs)("div", { className: "conversation-header", children: [(0,jsx_runtime.jsx)("h4", { children: conversation.userName }), conversation.lastMessageTime && ((0,jsx_runtime.jsx)("span", { children: formatTime(conversation.lastMessageTime) }))] }), (0,jsx_runtime.jsxs)("div", { className: "conversation-preview", children: [(0,jsx_runtime.jsx)("p", { children: conversation.lastMessage || 'No messages yet' }), conversation.unreadCount > 0 && ((0,jsx_runtime.jsx)("span", { className: "unread-badge", children: conversation.unreadCount }))] })] })] }, conversation.userId));
                                })) })] }), (0,jsx_runtime.jsx)("div", { className: "chat-area", children: selectedUser ? ((0,jsx_runtime.jsxs)("div", { className: "chat-messages-container", children: [(0,jsx_runtime.jsx)("div", { className: "chat-header", children: (0,jsx_runtime.jsxs)("div", { className: "chat-user-info", children: [selectedUser ? ((0,jsx_runtime.jsx)("img", { src: getUserInfo(selectedUser)?.userAvatar || '', alt: getUserInfo(selectedUser)?.userName || '', onError: imageErrorFallback/* imageErrorFallback */.i })) : ((0,jsx_runtime.jsx)("div", { className: "avatar-placeholder", children: selectedUser ? getUserInfo(selectedUser)?.userName?.charAt(0).toUpperCase() : '' })), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { children: selectedUser ? getUserInfo(selectedUser)?.userName : '' }), typingUsers.includes(selectedUser) && ((0,jsx_runtime.jsx)("p", { className: "typing-indicator", children: "typing..." }))] })] }) }), (0,jsx_runtime.jsxs)("div", { className: "messages-container", children: [messages.map(renderMessage), typingUsers.includes(selectedUser) && ((0,jsx_runtime.jsx)("div", { className: "typing-indicator-message", children: (0,jsx_runtime.jsxs)("div", { className: "typing-dots", children: [(0,jsx_runtime.jsx)("span", {}), (0,jsx_runtime.jsx)("span", {}), (0,jsx_runtime.jsx)("span", {})] }) })), (0,jsx_runtime.jsx)("div", { ref: messagesEndRef })] }), (0,jsx_runtime.jsxs)("div", { className: "message-input-wrapper", children: [isRecording && ((0,jsx_runtime.jsxs)("div", { className: "recording-indicator", children: [(0,jsx_runtime.jsx)("div", { className: "recording-dot" }), (0,jsx_runtime.jsxs)("span", { children: ["Recording... ", formatRecordingTime(recordingTime)] }), (0,jsx_runtime.jsx)("button", { onClick: stopRecording, className: "stop-recording", children: "Stop" })] })), pendingAttachment && ((0,jsx_runtime.jsxs)("div", { className: "attachment-preview", children: [(0,jsx_runtime.jsxs)("div", { className: "preview-header", children: [(0,jsx_runtime.jsx)("span", { children: "\uD83D\uDCCE Attachment Preview" }), (0,jsx_runtime.jsx)("button", { onClick: cancelPendingAttachment, className: "close-preview", children: "\u2715" })] }), (0,jsx_runtime.jsx)("div", { className: "preview-content", children: pendingAttachmentType?.startsWith('image/') ? ((0,jsx_runtime.jsx)("img", { src: URL.createObjectURL(pendingAttachment), alt: "Preview", className: "image-preview" })) : pendingAttachmentType?.startsWith('audio/') ? ((0,jsx_runtime.jsxs)("div", { className: "audio-preview", children: [(0,jsx_runtime.jsx)("audio", { controls: true, src: URL.createObjectURL(pendingAttachment) }), (0,jsx_runtime.jsx)("span", { children: "\uD83C\uDFA4 Voice Message" })] })) : ((0,jsx_runtime.jsxs)("div", { className: "file-preview", children: [(0,jsx_runtime.jsxs)("span", { children: ["\uD83D\uDCC4 ", pendingAttachment.name] }), (0,jsx_runtime.jsxs)("span", { className: "file-size", children: ["(", (pendingAttachment.size / 1024).toFixed(1), " KB)"] })] })) }), (0,jsx_runtime.jsxs)("div", { className: "preview-actions", children: [(0,jsx_runtime.jsx)("button", { onClick: sendPendingAttachment, disabled: sending, className: "send-attachment-btn", children: sending ? 'Sending...' : 'Send' }), (0,jsx_runtime.jsx)("button", { onClick: cancelPendingAttachment, className: "cancel-attachment-btn", children: "Cancel" })] })] })), showEmojiPicker && ((0,jsx_runtime.jsx)("div", { className: "emoji-picker", children: emojis.map((emoji, index) => ((0,jsx_runtime.jsx)("button", { onClick: () => addEmoji(emoji), className: "emoji-button", children: emoji }, index))) })), (0,jsx_runtime.jsxs)("div", { className: "message-input-container", children: [(0,jsx_runtime.jsxs)("div", { className: "input-actions", children: [(0,jsx_runtime.jsx)("button", { onClick: () => fileInputRef.current?.click(), className: "action-button", title: t('chat.attachFile'), children: "\uD83D\uDCCE" }), (0,jsx_runtime.jsx)("button", { onClick: () => setShowEmojiPicker(!showEmojiPicker), className: "action-button", title: t('chat.emoji'), children: "\uD83D\uDE00" }), (0,jsx_runtime.jsx)("button", { onClick: isRecording ? stopRecording : startRecording, className: `action-button ${isRecording ? 'recording' : ''}`, title: isRecording ? t('chat.stopRecording') : t('chat.voiceMessage'), children: isRecording ? '⏹️' : '🎤' })] }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: t('chat.typeMessage'), value: messageInput, onChange: (e) => setMessageInput(e.target.value), onKeyPress: handleKeyPress, disabled: sending, className: "message-input" }), (0,jsx_runtime.jsx)("button", { onClick: sendMessage, disabled: sending || !messageInput.trim(), className: "send-button", children: sending ? t('chat.sending') : t('chat.send') })] }), (0,jsx_runtime.jsx)("input", { ref: fileInputRef, type: "file", onChange: handleFileSelect, style: { display: 'none' }, accept: "image/*,audio/*,video/*,.pdf,.doc,.docx,.txt" })] })] })) : ((0,jsx_runtime.jsxs)("div", { className: "no-conversation", children: [(0,jsx_runtime.jsx)("div", { className: "no-conversation-icon", children: "\uD83D\uDCAC" }), (0,jsx_runtime.jsx)("h3", { children: "Select a conversation" }), (0,jsx_runtime.jsx)("p", { children: "Choose a contact to start messaging" })] })) })] })] }));
};
/* harmony default export */ const components_Chat_ChatInterface = (ChatInterface_ChatInterface);

// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
;// ./src/utilities/socialService.v2.ts


// Cache for storing profile data
const profileCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
class SocialService {
    /**
     * Get a list of crew profiles (paginated)
     */
    static async getCrewProfiles(limitCount = 20, lastDocId) {
        try {
            let q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* orderBy */.My)('name'), (0,index_esm/* limit */.AB)(limitCount));
            // Add cursor for pagination if provided
            if (lastDocId) {
                const lastDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'crewProfiles', lastDocId));
                if (lastDoc.exists()) {
                    q = (0,index_esm/* query */.P)(q, (0,index_esm/* where */._M)('name', '>', lastDoc.data().name));
                }
            }
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            return querySnapshot.docs.map(doc => this.mapProfileData(doc));
        }
        catch (error) {
            console.error('Error getting crew profiles:', error);
            return [];
        }
    }
    /**
     * Send a follow request to another user
     */
    static async sendFollowRequest(followerId, followingId) {
        try {
            // Check if follow relationship already exists
            const existingFollow = await this.getFollow(followerId, followingId);
            if (existingFollow) {
                if (existingFollow.status === 'pending') {
                    throw new Error('Follow request already sent');
                }
                else if (existingFollow.status === 'accepted') {
                    throw new Error('Already following this user');
                }
            }
            // Create new follow request
            const followRef = (0,index_esm.doc)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'));
            await (0,index_esm/* setDoc */.BN)(followRef, {
                followerId,
                followingId,
                status: 'pending',
                createdAt: (0,index_esm/* serverTimestamp */.O5)(),
                updatedAt: (0,index_esm/* serverTimestamp */.O5)(),
            });
            // Create notification for the user being followed
            await this.createNotification({
                userId: followingId,
                type: 'follow_request',
                message: 'sent you a follow request',
                metadata: { followerId }
            });
        }
        catch (error) {
            console.error('Error sending follow request:', error);
            throw error;
        }
    }
    /**
     * Respond to a follow request
     */
    static async respondToFollowRequest(followId, accept) {
        try {
            const followRef = (0,index_esm.doc)(firebase.db, 'follows', followId);
            const followDoc = await (0,index_esm.getDoc)(followRef);
            if (!followDoc.exists()) {
                throw new Error('Follow request not found');
            }
            const followData = followDoc.data();
            if (accept) {
                await (0,index_esm/* updateDoc */.mZ)(followRef, {
                    status: 'accepted',
                    updatedAt: (0,index_esm/* serverTimestamp */.O5)(),
                });
                // Create notification for the follower
                await this.createNotification({
                    userId: followData.followerId,
                    type: 'follow_accepted',
                    message: 'accepted your follow request',
                    metadata: { followingId: followData.followingId }
                });
            }
            else {
                await (0,index_esm/* deleteDoc */.kd)(followRef);
            }
        }
        catch (error) {
            console.error('Error responding to follow request:', error);
            throw error;
        }
    }
    /**
     * Unfollow a user
     */
    static async unfollow(followerId, followingId) {
        try {
            // Find the follow document
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followerId', '==', followerId), (0,index_esm/* where */._M)('followingId', '==', followingId));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            if (!querySnapshot.empty) {
                // Delete all matching follow documents (should only be one)
                const batch = (0,index_esm/* writeBatch */.wP)(firebase.db);
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
        }
        catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    }
    /**
     * Get a user's followers
     */
    static async getFollowers(userId) {
        try {
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followingId', '==', userId), (0,index_esm/* where */._M)('status', '==', 'accepted'), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const followerIds = querySnapshot.docs.map(doc => doc.data().followerId);
            // Get profiles for all followers
            const followers = await Promise.all(followerIds.map(id => this.getProfile(id)));
            return followers.filter(Boolean);
        }
        catch (error) {
            console.error('Error getting followers:', error);
            return [];
        }
    }
    /**
     * Get users that a user is following
     */
    static async getFollowing(userId) {
        try {
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followerId', '==', userId), (0,index_esm/* where */._M)('status', '==', 'accepted'), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const followingIds = querySnapshot.docs.map(doc => doc.data().followingId);
            // Get profiles for all followed users
            const following = await Promise.all(followingIds.map(id => this.getProfile(id)));
            return following.filter(Boolean);
        }
        catch (error) {
            console.error('Error getting following:', error);
            return [];
        }
    }
    /**
     * Get pending follow requests for a user
     */
    static async getFollowRequests(userId) {
        try {
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followingId', '==', userId), (0,index_esm/* where */._M)('status', '==', 'pending'), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const requesterIds = querySnapshot.docs.map(doc => doc.data().followerId);
            // Get profiles for all requesters
            const requesters = await Promise.all(requesterIds.map(id => this.getProfile(id)));
            return requesters.filter(Boolean);
        }
        catch (error) {
            console.error('Error getting follow requests:', error);
            return [];
        }
    }
    /**
     * Get suggested users to follow (currently returns random crew members)
     */
    static async getSuggestedUsers(userId, limitCount = 10) {
        try {
            // Get users that the current user is already following
            const following = await this.getFollowing(userId);
            const followingIds = new Set(following.map(user => user.id));
            // Get random crew members that the user isn't already following
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* orderBy */.My)('name'), (0,index_esm/* limit */.AB)(limitCount * 2) // Get more than needed to have enough after filtering
            );
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const profiles = querySnapshot.docs
                .map(doc => this.mapProfileData(doc))
                .filter(profile => !followingIds.has(profile.id));
            // Shuffle and return the requested number of profiles
            return this.shuffleArray(profiles).slice(0, limitCount);
        }
        catch (error) {
            console.error('Error getting suggested users:', error);
            return [];
        }
    }
    /**
     * Get a user's notifications
     */
    static async getNotifications(userId) {
        try {
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'notifications'), (0,index_esm/* where */._M)('userId', '==', userId), (0,index_esm/* orderBy */.My)('createdAt', 'desc'), (0,index_esm/* limit */.AB)(50));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            }));
        }
        catch (error) {
            console.error('Error getting notifications:', error);
            return [];
        }
    }
    /**
     * Mark notifications as read
     */
    static async markNotificationsAsRead(notificationIds) {
        try {
            const batch = (0,index_esm/* writeBatch */.wP)(firebase.db);
            notificationIds.forEach(id => {
                const ref = (0,index_esm.doc)(firebase.db, 'notifications', id);
                batch.update(ref, { isRead: true });
            });
            await batch.commit();
        }
        catch (error) {
            console.error('Error marking notifications as read:', error);
            throw error;
        }
    }
    /**
     * Get a user's profile by ID
     */
    static async getProfile(userId) {
        // Check cache first
        const cached = profileCache.get(userId);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }
        try {
            // Only use crewProfiles, just like crew cards
            const crewDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'crewProfiles', userId));
            if (crewDoc.exists()) {
                const data = crewDoc.data() || {};
                // Always provide a valid name and image if possible
                const name = data.name || data.displayName || 'Unnamed Crew';
                const displayName = data.displayName || data.name || 'Unnamed Crew';
                const photoURL = data.photoURL || data.profileImageUrl || data.avatarUrl || '/default-avatar.png';
                const profileImageUrl = data.profileImageUrl || data.photoURL || data.avatarUrl || '/default-avatar.png';
                if (!data.name || !data.profileImageUrl) {
                    console.warn('[SocialService] crewProfiles doc missing name or profileImageUrl for', userId, data);
                }
                const user = {
                    id: userId,
                    name,
                    displayName,
                    username: data.username || '',
                    photoURL,
                    profileImageUrl,
                    bio: data.bio || '',
                    jobTitle: data.jobTitles?.[0]?.title,
                    location: data.location,
                    jobTitles: data.jobTitles,
                    isFollowing: false,
                    isFollower: false,
                };
                this.cacheProfile(user);
                return user;
            }
            // If no crew profile, fallback to a default SocialUser
            const fallback = {
                id: userId,
                name: 'Unknown Crew',
                displayName: 'Unknown Crew',
                username: '',
                photoURL: '/default-avatar.png',
                profileImageUrl: '/default-avatar.png',
                bio: '',
                jobTitles: [],
                isFollowing: false,
                isFollower: false,
            };
            console.warn('[SocialService] No crewProfiles doc found for', userId);
            return fallback;
        }
        catch (error) {
            console.error('Error getting profile:', error);
            return null;
        }
    }
    /**
     * Get follow relationship between two users
     */
    static async getFollow(followerId, followingId) {
        try {
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followerId', '==', followerId), (0,index_esm/* where */._M)('followingId', '==', followingId), (0,index_esm/* limit */.AB)(1));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            if (querySnapshot.empty) {
                return null;
            }
            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            };
        }
        catch (error) {
            console.error('Error getting follow relationship:', error);
            return null;
        }
    }
    /**
     * Create a notification
     */
    static async createNotification(data) {
        try {
            await (0,index_esm/* setDoc */.BN)((0,index_esm.doc)((0,index_esm/* collection */.rJ)(firebase.db, 'notifications')), {
                ...data,
                isRead: false,
                createdAt: (0,index_esm/* serverTimestamp */.O5)(),
            });
        }
        catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }
    /**
     * Map Firestore document to SocialUser
     */
    static mapProfileData(doc) {
        const data = doc.data();
        const id = doc.id;
        // Use only the correct field names
        const profileImageUrl = data.profileImageUrl || undefined;
        const user = {
            id,
            name: data.name || data.displayName,
            displayName: data.displayName || data.name || 'User',
            username: data.username,
            profileImageUrl, // Use only the correct field
            bio: data.bio,
            jobTitle: data.jobTitles?.[0]?.title,
            location: data.location,
            jobTitles: data.jobTitles,
            isFollowing: false,
            isFollower: false,
        };
        return user;
    }
    /**
     * Cache a profile
     */
    static cacheProfile(profile) {
        profileCache.set(profile.id, {
            data: profile,
            timestamp: Date.now(),
        });
    }
    /**
     * Shuffle an array (Fisher-Yates algorithm)
     */
    static shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}
/* harmony default export */ const socialService_v2 = ((/* unused pure expression or super */ null && (SocialService)));

// EXTERNAL MODULE: ./src/types/Profile.ts
var Profile = __webpack_require__(835);
;// ./src/components/Chat/ChatTestPage.tsx






const ChatTestPage = () => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [showChat, setShowChat] = (0,react.useState)(false);
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    const [userProfile, setUserProfile] = (0,react.useState)(null);
    // Load real user profile when component mounts
    (0,react.useEffect)(() => {
        const loadUserProfile = async () => {
            if (!currentUser?.uid) {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                // Get user profile from crewProfiles (single source of truth)
                const profile = await SocialService.getProfile(currentUser.uid);
                if (profile) {
                    setUserProfile({
                        id: currentUser.uid,
                        name: profile.name || profile.displayName || currentUser.email?.split('@')[0] || 'User',
                        displayName: profile.name || profile.displayName || currentUser.email?.split('@')[0] || 'User',
                        avatar: (0,Profile/* getPhotoUrl */.ed)(profile),
                        role: profile.jobTitles?.[0]?.title || profile.role || 'Crew Member',
                        company: profile.company || '',
                        location: profile.residences?.[0]?.city || profile.location || '',
                        isOnline: true,
                        lastSeen: new Date()
                    });
                }
                else {
                    // Fallback if no profile found
                    setUserProfile({
                        id: currentUser.uid,
                        name: currentUser.email?.split('@')[0] || 'User',
                        displayName: currentUser.email?.split('@')[0] || 'User',
                        avatar: currentUser.photoURL || undefined,
                        role: 'Crew Member',
                        company: '',
                        location: '',
                        isOnline: true,
                        lastSeen: new Date()
                    });
                }
            }
            catch (error) {
                console.error('Error loading user profile:', error);
                // Fallback to basic user info
                setUserProfile({
                    id: currentUser.uid,
                    name: currentUser.email?.split('@')[0] || 'User',
                    displayName: currentUser.email?.split('@')[0] || 'User',
                    avatar: currentUser.photoURL || undefined,
                    role: 'Crew Member',
                    company: '',
                    location: '',
                    isOnline: true,
                    lastSeen: new Date()
                });
            }
            finally {
                setIsLoading(false);
            }
        };
        loadUserProfile();
    }, [currentUser?.uid]);
    if (isLoading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Loading chat..." })] }) }));
    }
    if (!currentUser) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Chat" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-6", children: "Please sign in to access messaging" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsx)("button", { onClick: () => window.location.href = '/login', className: "bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors", children: "Sign In" }), (0,jsx_runtime.jsx)("button", { onClick: () => window.location.href = '/register', className: "block bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors", children: "Create Account" })] })] }) }));
    }
    // Remove the intro and go directly to chat
    if (!showChat) {
        setShowChat(true);
        return null;
    }
    return ((0,jsx_runtime.jsx)(components_Chat_ChatInterface, { currentUserId: currentUser.uid, currentUserName: userProfile?.displayName || 'User', currentUserAvatar: userProfile?.avatar }));
};
/* harmony default export */ const Chat_ChatTestPage = (ChatTestPage);


/***/ }),

/***/ 676:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ imageErrorFallback)
/* harmony export */ });
// Utility for robust <img> error fallback
function imageErrorFallback(e, fallback = '/bust-avatar.svg') {
    const target = e.target;
    if (!target.src.endsWith(fallback)) {
        target.src = fallback;
        // Ensure proper sizing for the fallback image
        target.style.minWidth = '32px';
        target.style.minHeight = '32px';
        target.style.width = 'auto';
        target.style.height = 'auto';
    }
}


/***/ }),

/***/ 835:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lx: () => (/* binding */ getProfileId),
/* harmony export */   Mn: () => (/* binding */ getDisplayName),
/* harmony export */   ed: () => (/* binding */ getPhotoUrl),
/* harmony export */   pu: () => (/* binding */ isCrewProfile)
/* harmony export */ });
/* unused harmony export isUserProfile */
// Type guard to check if a profile is a CrewProfile
function isCrewProfile(profile) {
    return 'jobTitles' in profile && 'residences' in profile;
}
// Type guard to check if a profile is a UserProfile
function isUserProfile(profile) {
    return !isCrewProfile(profile);
}
// Helper function to get a display name from any profile type
function getDisplayName(profile) {
    // Try all possible name/display fields for maximum compatibility
    if (isCrewProfile(profile)) {
        return (profile.name ||
            profile.displayName ||
            'Unknown Crew');
    }
    return (profile.displayName ||
        profile.name ||
        profile.firstName ||
        profile.username ||
        (typeof profile.email === 'string' ? profile.email.split('@')[0] : undefined) ||
        'Unknown User');
}
// Helper function to get a photo URL from any profile type
function getPhotoUrl(profile) {
    // Use only the correct field names to avoid legacy field issues
    let url = undefined;
    if (isCrewProfile(profile)) {
        // For crew profiles, use only profileImageUrl (the correct field)
        url = profile.profileImageUrl;
    }
    else {
        // For user profiles, use only avatarUrl (the correct field)
        url = profile.avatarUrl;
    }
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return '/bust-avatar.svg';
    }
    return url;
}
// Helper to get the ID from any profile type
function getProfileId(profile) {
    if (isCrewProfile(profile)) {
        return profile.uid || profile.id;
    }
    return profile.id;
}


/***/ }),

/***/ 4221:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9487);


class EmailNotificationService {
    // Check if user can receive email based on preferences and frequency
    static async canSendEmail(userIdentifier, template) {
        try {
            // First check if user has email notifications enabled
            // Try to get user by ID first, then by email
            let userDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'users', userIdentifier));
            if (!userDoc.exists()) {
                // Try to find user by email
                const usersRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'users');
                const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(usersRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('email', '==', userIdentifier));
                const querySnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(q);
                if (!querySnapshot.empty) {
                    userDoc = querySnapshot.docs[0];
                }
            }
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const notificationPreferences = userData.notificationPreferences;
                if (notificationPreferences) {
                    // Check if email notifications are enabled for this template
                    const emailEnabled = notificationPreferences.emailNotifications?.[template];
                    if (!emailEnabled) {
                        console.log(`[EmailNotificationService] Email notifications disabled for ${userIdentifier} (${template})`);
                        return false;
                    }
                    // Check frequency settings
                    const frequency = notificationPreferences.emailFrequency?.[template] || 'weekly';
                    const timeLimit = this.getTimeLimitForFrequency(frequency);
                    if (timeLimit === 0) {
                        // Immediate - always send
                        return true;
                    }
                    // Check last sent time
                    const emailTrackingRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'emailTracking', userIdentifier);
                    const emailTrackingDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)(emailTrackingRef);
                    if (!emailTrackingDoc.exists()) {
                        // First time sending email to this user
                        return true;
                    }
                    const data = emailTrackingDoc.data();
                    const lastSent = data[template]?.lastSent;
                    if (!lastSent) {
                        // First time sending this template to this user
                        return true;
                    }
                    const timeSinceLastEmail = Date.now() - lastSent.toMillis();
                    return timeSinceLastEmail >= timeLimit;
                }
            }
            // Fallback to weekly limit if no preferences found
            const emailTrackingRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'emailTracking', userIdentifier);
            const emailTrackingDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)(emailTrackingRef);
            if (!emailTrackingDoc.exists()) {
                return true;
            }
            const data = emailTrackingDoc.data();
            const lastSent = data[template]?.lastSent;
            if (!lastSent) {
                return true;
            }
            const timeSinceLastEmail = Date.now() - lastSent.toMillis();
            return timeSinceLastEmail >= this.WEEKLY_LIMIT_MS;
        }
        catch (error) {
            console.error('Error checking email limit:', error);
            // If there's an error checking, allow the email to be sent
            return true;
        }
    }
    // Get time limit in milliseconds for each frequency
    static getTimeLimitForFrequency(frequency) {
        switch (frequency) {
            case 'immediate':
                return 0; // No limit
            case 'daily':
                return 24 * 60 * 60 * 1000; // 24 hours
            case 'weekly':
                return 7 * 24 * 60 * 60 * 1000; // 7 days
            case 'monthly':
                return 30 * 24 * 60 * 60 * 1000; // 30 days
            default:
                return this.WEEKLY_LIMIT_MS; // Default to weekly
        }
    }
    // Update email tracking after sending
    static async updateEmailTracking(userEmail, template) {
        try {
            const emailTrackingRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'emailTracking', userEmail);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)(emailTrackingRef, {
                [template]: {
                    lastSent: new Date(),
                    count: (await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)(emailTrackingRef)).data()?.[template]?.count || 0 + 1
                }
            });
        }
        catch (error) {
            console.error('Error updating email tracking:', error);
        }
    }
    static async sendNotification(data) {
        try {
            console.log('[EmailNotificationService] Sending notification:', data);
            // Check frequency limit using userId if available, otherwise use email
            const userIdentifier = data.userId || data.to;
            const canSend = await this.canSendEmail(userIdentifier, data.template || 'general');
            if (!canSend) {
                console.log(`[EmailNotificationService] Frequency limit reached for ${data.to} (${data.template})`);
                return false;
            }
            const response = await fetch(this.EMAIL_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: data.to,
                    subject: data.subject,
                    message: data.message,
                    senderName: data.senderName,
                }),
            });
            const result = await response.json();
            console.log('[EmailNotificationService] Response:', result);
            if (result.success) {
                // Update tracking after successful send
                await this.updateEmailTracking(data.to, data.template || 'general');
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error sending email notification:', error);
            return false;
        }
    }
    // Chat notification
    static async sendChatNotification(recipientEmail, senderName, messagePreview, conversationUrl, userId) {
        const subject = `New message from ${senderName}`;
        // Just send the message preview - the Firebase function will handle the email template
        const message = messagePreview;
        return this.sendNotification({
            to: recipientEmail,
            subject,
            message,
            senderName: senderName,
            template: 'chat',
            userId: userId
        });
    }
    // Project update notification
    static async sendProjectUpdateNotification(recipientEmail, projectName, updateType, projectUrl) {
        const actionText = {
            created: 'has been created',
            updated: 'has been updated',
            assigned: 'has been assigned to you',
            completed: 'has been completed'
        }[updateType];
        const subject = `Project Update: ${projectName}`;
        const message = `
Hello,

The project "${projectName}" ${actionText}.

${projectUrl ? `Click here to view the project: ${projectUrl}` : 'Log in to your My Film Jobs dashboard to view this project.'}

Best regards,
The My Film Jobs Team
    `;
        return this.sendNotification({
            to: recipientEmail,
            subject,
            message,
            senderName: 'My Film Jobs',
            template: 'project'
        });
    }
    // Job application notification
    static async sendJobApplicationNotification(recipientEmail, jobTitle, applicantName, applicationUrl) {
        const subject = `New job application for ${jobTitle}`;
        const message = `
Hello,

You have received a new job application for "${jobTitle}" from ${applicantName}.

${applicationUrl ? `Click here to view the application: ${applicationUrl}` : 'Log in to your My Film Jobs dashboard to review this application.'}

Best regards,
The My Film Jobs Team
    `;
        return this.sendNotification({
            to: recipientEmail,
            subject,
            message,
            senderName: 'My Film Jobs',
            template: 'job'
        });
    }
    // General notification
    static async sendGeneralNotification(recipientEmail, subject, message) {
        return this.sendNotification({
            to: recipientEmail,
            subject,
            message,
            senderName: 'My Film Jobs',
            template: 'general'
        });
    }
}
EmailNotificationService.EMAIL_FUNCTION_URL = 'https://us-central1-my-film-jobs.cloudfunctions.net/emailSend';
EmailNotificationService.WEEKLY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EmailNotificationService);


/***/ }),

/***/ 7388:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.chat-interface{height:100vh;background:#f8fafc;display:flex;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}.chat-interface .error-banner{position:fixed;top:0;left:0;right:0;background:#ef4444;color:#fff;padding:12px 20px;text-align:center;font-weight:500;z-index:1000}.chat-interface .loading-container{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;color:#6b7280}.chat-interface .loading-container .loading-spinner{width:40px;height:40px;border:3px solid #e5e7eb;border-top:3px solid #3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:16px}.chat-interface .loading-container p{font-size:14px;font-weight:500}.chat-interface .chat-container{display:flex;width:100%;height:100%;background:#fff;box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.chat-interface .chat-container .chat-sidebar{width:320px;background:#f9fafb;border-right:1px solid #e5e7eb;display:flex;flex-direction:column}.chat-interface .chat-container .chat-sidebar .sidebar-header{padding:20px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;background:#fff}.chat-interface .chat-container .chat-sidebar .sidebar-header h2{font-size:18px;font-weight:600;color:#111827;margin:0}.chat-interface .chat-container .chat-sidebar .sidebar-header .new-chat-button{background:#3b82f6;color:#fff;border:none;border-radius:8px;padding:8px 12px;font-size:16px;cursor:pointer;transition:all .2s ease}.chat-interface .chat-container .chat-sidebar .sidebar-header .new-chat-button:hover{background:#2563eb;transform:scale(1.05)}.chat-interface .chat-container .chat-sidebar .new-chat-section{padding:20px;border-bottom:1px solid #e5e7eb;background:#fff}.chat-interface .chat-container .chat-sidebar .new-chat-section h3{font-size:14px;font-weight:600;color:#111827;margin:0 0 12px 0}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-input{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;background:#fff;color:#111827;transition:all .2s ease}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-input::-moz-placeholder{color:#9ca3af}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-input::placeholder{color:#9ca3af}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-loading{text-align:center;padding:12px;color:#6b7280;font-size:14px}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results{margin-top:12px;max-height:200px;overflow-y:auto}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results .search-result-item{display:flex;align-items:center;padding:12px;border-radius:8px;cursor:pointer;transition:all .2s ease;margin-bottom:4px}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results .search-result-item:hover{background:#f3f4f6}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results .search-result-item .user-avatar{margin-right:12px}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results .search-result-item .user-avatar img{width:40px;height:40px;border-radius:50%;-o-object-fit:cover;object-fit:cover}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results .search-result-item .user-avatar .avatar-placeholder{width:40px;height:40px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-weight:600;color:#6b7280;font-size:16px}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results .search-result-item .user-info{flex:1}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results .search-result-item .user-info h4{font-size:14px;font-weight:500;color:#111827;margin:0 0 2px 0}.chat-interface .chat-container .chat-sidebar .new-chat-section .search-results .search-result-item .user-info p{font-size:12px;color:#6b7280;margin:0}.chat-interface .chat-container .chat-sidebar .conversations-list{flex:1;overflow-y:auto;padding:8px 0}.chat-interface .chat-container .chat-sidebar .conversations-list .no-conversations{display:flex;flex-direction:column;align-items:center;justify-content:center;height:200px;color:#9ca3af;text-align:center}.chat-interface .chat-container .chat-sidebar .conversations-list .no-conversations p{font-size:14px;margin:4px 0}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item{display:flex;align-items:center;padding:12px 20px;cursor:pointer;transition:all .2s ease;position:relative}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item:hover{background:#f3f4f6}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item.selected{background:#eff6ff;border-right:3px solid #3b82f6}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-avatar{position:relative;margin-right:12px}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-avatar img{width:48px;height:48px;border-radius:50%;-o-object-fit:cover;object-fit:cover}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-avatar .avatar-placeholder{width:48px;height:48px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-weight:600;color:#6b7280;font-size:18px}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-avatar .online-indicator{position:absolute;bottom:2px;right:2px;width:12px;height:12px;background:#10b981;border:2px solid #fff;border-radius:50%}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-content{flex:1;min-width:0}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-content .conversation-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-content .conversation-header h4{font-size:14px;font-weight:500;color:#374151;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-content .conversation-header span{font-size:11px;color:#9ca3af;font-weight:500}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-content .conversation-preview{display:flex;align-items:center;justify-content:space-between}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-content .conversation-preview p{font-size:13px;color:#6b7280;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-content .conversation-preview .unread-badge{background:#ef4444;color:#fff;font-size:11px;font-weight:600;padding:2px 6px;border-radius:10px;min-width:18px;text-align:center;margin-left:8px}.chat-interface .chat-container .chat-area{flex:1;display:flex;flex-direction:column;background:#fff}.chat-interface .chat-container .chat-area .chat-messages-container{display:flex;flex-direction:column;height:100%}.chat-interface .chat-container .chat-area .chat-messages-container .chat-header{padding:16px 20px;border-bottom:1px solid #e5e7eb;background:#fff}.chat-interface .chat-container .chat-area .chat-messages-container .chat-header .chat-user-info{display:flex;align-items:center}.chat-interface .chat-container .chat-area .chat-messages-container .chat-header .chat-user-info img{width:40px;height:40px;border-radius:50%;-o-object-fit:cover;object-fit:cover;margin-right:12px}.chat-interface .chat-container .chat-area .chat-messages-container .chat-header .chat-user-info .avatar-placeholder{width:40px;height:40px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-weight:600;color:#6b7280;font-size:16px;margin-right:12px}.chat-interface .chat-container .chat-area .chat-messages-container .chat-header .chat-user-info h3{font-size:16px;font-weight:600;color:#111827;margin:0 0 2px 0}.chat-interface .chat-container .chat-area .chat-messages-container .chat-header .chat-user-info .typing-indicator{font-size:12px;color:#6b7280;margin:0;font-style:italic}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container{flex:1;overflow-y:auto;padding:20px;background:#f8fafc}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message{display:flex;margin-bottom:16px;position:relative}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message.sent{justify-content:flex-end}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message.sent .message-content{background:#3b82f6;color:#fff;border-radius:18px 18px 4px 18px;margin-left:40px}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message.sent .message-content .message-meta{justify-content:flex-end}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message.received{justify-content:flex-start}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message.received .message-content{background:#fff;color:#1f2937;border-radius:18px 18px 18px 4px;margin-right:40px;border:1px solid #e5e7eb}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content{max-width:70%;padding:12px 16px;position:relative;word-wrap:break-word}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-text{margin:0;line-height:1.4;font-size:14px}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-image .message-image-content{max-width:100%;max-height:300px;border-radius:8px;cursor:pointer;transition:transform .2s ease;display:block;margin-bottom:8px}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-image .message-image-content:hover{transform:scale(1.02)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-image .image-caption{margin:8px 0 0 0;font-size:13px;opacity:.8;line-height:1.4}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-player{margin-bottom:8px}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-player .custom-audio-player{display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(0,0,0,.05);border-radius:12px;border:1px solid rgba(0,0,0,.1)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-player .custom-audio-player .play-button{background:#3b82f6;color:#fff;border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-player .custom-audio-player .play-button:hover{background:#2563eb;transform:scale(1.05)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-player .custom-audio-player .play-button:active{transform:scale(0.95)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-player .custom-audio-player audio{display:none}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-player .custom-audio-player .audio-info{flex:1;display:flex;align-items:center;gap:8px}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-player .custom-audio-player .audio-info .audio-duration{font-size:13px;color:#6b7280;font-weight:500}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-voice .voice-caption{margin:8px 0 0 0;font-size:13px;opacity:.8;line-height:1.4}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-meta{display:flex;align-items:center;gap:8px;margin-top:4px;font-size:11px;opacity:.7}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-meta .message-time{font-weight:500}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-content .message-meta .message-status{font-size:12px;font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif;letter-spacing:-1.5px;margin-left:4px;color:hsla(0,0%,100%,.8);font-weight:400}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .delete-message-button{position:absolute;top:8px;right:8px;background:rgba(239,68,68,.1);border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:4px 6px;border-radius:6px;opacity:0;transition:all .2s ease;z-index:10}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .delete-message-button:hover{background:rgba(239,68,68,.2);transform:scale(1.1)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message:hover .delete-message-button{opacity:1}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-reactions{display:flex;gap:4px;margin-top:8px;flex-wrap:wrap}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-reactions .reaction{display:flex;align-items:center;gap:2px;background:rgba(0,0,0,.05);border-radius:12px;padding:2px 6px;font-size:12px;cursor:pointer;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-reactions .reaction:hover{background:rgba(0,0,0,.1);transform:scale(1.05)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-reactions .reaction .reaction-count{font-size:10px;font-weight:500;color:#6b7280}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-actions{position:absolute;top:8px;right:8px;display:flex;gap:4px;opacity:0;transition:all .2s ease;z-index:10}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-actions .reaction-button{background:rgba(59,130,246,.1);border:none;color:#3b82f6;cursor:pointer;font-size:14px;padding:4px 6px;border-radius:6px;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-actions .reaction-button:hover{background:rgba(59,130,246,.2);transform:scale(1.1)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-actions .delete-message-button{position:static;opacity:1;background:rgba(239,68,68,.1);border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:4px 6px;border-radius:6px;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .message-actions .delete-message-button:hover{background:rgba(239,68,68,.2);transform:scale(1.1)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message:hover .message-actions{opacity:1}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .reaction-picker{position:absolute;bottom:100%;right:0;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.15);padding:8px;display:flex;gap:4px;z-index:20;margin-bottom:8px}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .reaction-picker .reaction-option{background:none;border:none;font-size:18px;padding:6px;border-radius:6px;cursor:pointer;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .message .reaction-picker .reaction-option:hover{background:#f3f4f6;transform:scale(1.2)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .typing-indicator-message{display:flex;align-items:center;margin-bottom:16px}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .typing-indicator-message .typing-dots{display:flex;gap:4px;padding:12px 16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px rgba(0,0,0,.1)}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .typing-indicator-message .typing-dots span{width:8px;height:8px;background:#9ca3af;border-radius:50%;animation:typingBounce 1.4s infinite ease-in-out}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .typing-indicator-message .typing-dots span:nth-child(1){animation-delay:-0.32s}.chat-interface .chat-container .chat-area .chat-messages-container .messages-container .typing-indicator-message .typing-dots span:nth-child(2){animation-delay:-0.16s}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper{padding:16px 20px;border-top:1px solid #e5e7eb;background:#fff}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .recording-indicator{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin-bottom:8px;animation:pulse 2s infinite}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .recording-indicator .recording-dot{width:8px;height:8px;background:#ef4444;border-radius:50%;animation:blink 1s infinite}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .recording-indicator span{color:#dc2626;font-size:14px;font-weight:500}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .recording-indicator .stop-recording{background:#dc2626;color:#fff;border:none;padding:4px 12px;border-radius:4px;font-size:12px;cursor:pointer;transition:background .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .recording-indicator .stop-recording:hover{background:#b91c1c}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview{background:#fff;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-header span{font-size:14px;font-weight:500;color:#374151}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-header .close-preview{background:none;border:none;font-size:16px;color:#6b7280;cursor:pointer;padding:4px;border-radius:4px;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-header .close-preview:hover{background:#e5e7eb;color:#374151}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-content{padding:16px;display:flex;flex-direction:column;align-items:center;gap:12px}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-content .image-preview{max-width:240px;max-height:240px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1);-o-object-fit:cover;object-fit:cover}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-content .audio-preview{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;max-width:300px}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-content .audio-preview audio{width:100%;height:40px;border-radius:8px;background:#f3f4f6;border:1px solid #e5e7eb}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-content .audio-preview span{font-size:14px;color:#6b7280;font-weight:500}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-content .file-preview{display:flex;flex-direction:column;align-items:center;gap:4px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-content .file-preview span{font-size:14px;color:#374151;font-weight:500}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-content .file-preview span.file-size{font-size:12px;color:#6b7280;font-weight:400}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-actions{display:flex;gap:12px;padding:16px;background:#f9fafb;border-top:1px solid #e5e7eb}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-actions .send-attachment-btn{flex:1;background:#3b82f6;color:#fff;border:none;padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-actions .send-attachment-btn:hover:not(:disabled){background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 12px rgba(59,130,246,.3)}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-actions .send-attachment-btn:disabled{background:#9ca3af;cursor:not-allowed;transform:none;box-shadow:none}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-actions .cancel-attachment-btn{flex:1;background:#fff;color:#6b7280;border:1px solid #d1d5db;padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .attachment-preview .preview-actions .cancel-attachment-btn:hover{background:#f3f4f6;border-color:#9ca3af;color:#374151}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .emoji-picker{position:absolute;bottom:100%;left:20px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.15);padding:12px;display:grid;grid-template-columns:repeat(8, 1fr);gap:8px;z-index:20;margin-bottom:8px}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .emoji-picker .emoji-button{background:none;border:none;font-size:20px;padding:8px;border-radius:6px;cursor:pointer;transition:all .2s ease}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .emoji-picker .emoji-button:hover{background:#f3f4f6;transform:scale(1.1)}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container{display:flex;align-items:center;gap:12px;position:relative}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .input-actions{display:flex;align-items:center;gap:8px}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .input-actions .action-button{background:none;border:none;font-size:18px;padding:8px;border-radius:8px;cursor:pointer;transition:all .2s ease;color:#6b7280}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .input-actions .action-button:hover{background:#f3f4f6;color:#3b82f6;transform:scale(1.05)}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .input-actions .action-button.recording{background:#ef4444;color:#fff;animation:pulse 1s infinite}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .message-input{flex:1;padding:12px 16px;border:1px solid #d1d5db;border-radius:24px;font-size:14px;background:#fff;color:#111827;transition:all .2s ease;resize:none}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .message-input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .message-input:disabled{background:#f9fafb;color:#9ca3af;cursor:not-allowed}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .message-input::-moz-placeholder{color:#9ca3af}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .message-input::placeholder{color:#9ca3af}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .send-button{background:#3b82f6;color:#fff;border:none;padding:12px 20px;border-radius:24px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease;min-width:80px}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .send-button:hover:not(:disabled){background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 12px rgba(59,130,246,.3)}.chat-interface .chat-container .chat-area .chat-messages-container .message-input-wrapper .message-input-container .send-button:disabled{background:#9ca3af;cursor:not-allowed;transform:none;box-shadow:none}.chat-interface .chat-container .chat-area .no-conversation{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#9ca3af;text-align:center}.chat-interface .chat-container .chat-area .no-conversation .no-conversation-icon{font-size:48px;margin-bottom:16px}.chat-interface .chat-container .chat-area .no-conversation h3{font-size:18px;font-weight:600;color:#6b7280;margin:0 0 8px 0}.chat-interface .chat-container .chat-area .no-conversation p{font-size:14px;margin:0}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes typingBounce{0%,80%,100%{transform:scale(0.8);opacity:.5}40%{transform:scale(1);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:.3}}@media(max-width: 768px){.chat-interface .chat-container .chat-sidebar{width:280px}}@media(max-width: 640px){.chat-interface .chat-container{flex-direction:column}.chat-interface .chat-container .chat-sidebar{width:100%;height:40%;border-right:none;border-bottom:1px solid #e5e7eb}.chat-interface .chat-container .chat-area{height:60%}}`, "",{"version":3,"sources":["webpack://./src/components/Chat/ChatInterface.scss"],"names":[],"mappings":"AAAA,gBACE,YAAA,CACA,kBAAA,CACA,YAAA,CACA,yEAAA,CAEA,8BACE,cAAA,CACA,KAAA,CACA,MAAA,CACA,OAAA,CACA,kBAAA,CACA,UAAA,CACA,iBAAA,CACA,iBAAA,CACA,eAAA,CACA,YAAA,CAGF,mCACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,YAAA,CACA,aAAA,CAEA,oDACE,UAAA,CACA,WAAA,CACA,wBAAA,CACA,4BAAA,CACA,iBAAA,CACA,iCAAA,CACA,kBAAA,CAGF,qCACE,cAAA,CACA,eAAA,CAIJ,gCACE,YAAA,CACA,UAAA,CACA,WAAA,CACA,eAAA,CACA,wCAAA,CAGA,8CACE,WAAA,CACA,kBAAA,CACA,8BAAA,CACA,YAAA,CACA,qBAAA,CAEA,8DACE,YAAA,CACA,+BAAA,CACA,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,eAAA,CAEA,iEACE,cAAA,CACA,eAAA,CACA,aAAA,CACA,QAAA,CAGF,+EACE,kBAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,gBAAA,CACA,cAAA,CACA,cAAA,CACA,uBAAA,CAEA,qFACE,kBAAA,CACA,qBAAA,CAKN,gEACE,YAAA,CACA,+BAAA,CACA,eAAA,CAEA,mEACE,cAAA,CACA,eAAA,CACA,aAAA,CACA,iBAAA,CAGF,8EACE,UAAA,CACA,iBAAA,CACA,wBAAA,CACA,iBAAA,CACA,cAAA,CACA,eAAA,CACA,aAAA,CACA,uBAAA,CAEA,oFACE,YAAA,CACA,oBAAA,CACA,wCAAA,CAGF,gGACE,aAAA,CADF,2FACE,aAAA,CAIJ,gFACE,iBAAA,CACA,YAAA,CACA,aAAA,CACA,cAAA,CAGF,gFACE,eAAA,CACA,gBAAA,CACA,eAAA,CAEA,oGACE,YAAA,CACA,kBAAA,CACA,YAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CACA,iBAAA,CAEA,0GACE,kBAAA,CAGF,iHACE,iBAAA,CAEA,qHACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,mBAAA,CAAA,gBAAA,CAGF,qIACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,kBAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA,CACA,aAAA,CACA,cAAA,CAIJ,+GACE,MAAA,CAEA,kHACE,cAAA,CACA,eAAA,CACA,aAAA,CACA,gBAAA,CAGF,iHACE,cAAA,CACA,aAAA,CACA,QAAA,CAOV,kEACE,MAAA,CACA,eAAA,CACA,aAAA,CAEA,oFACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,YAAA,CACA,aAAA,CACA,iBAAA,CAEA,sFACE,cAAA,CACA,YAAA,CAIJ,qFACE,YAAA,CACA,kBAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CACA,iBAAA,CAEA,2FACE,kBAAA,CAGF,8FACE,kBAAA,CACA,8BAAA,CAGF,0GACE,iBAAA,CACA,iBAAA,CAEA,8GACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,mBAAA,CAAA,gBAAA,CAGF,8HACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,kBAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA,CACA,aAAA,CACA,cAAA,CAGF,4HACE,iBAAA,CACA,UAAA,CACA,SAAA,CACA,UAAA,CACA,WAAA,CACA,kBAAA,CACA,qBAAA,CACA,iBAAA,CAIJ,2GACE,MAAA,CACA,WAAA,CAEA,gIACE,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,iBAAA,CAEA,mIACE,cAAA,CACA,eAAA,CACA,aAAA,CACA,QAAA,CACA,kBAAA,CACA,eAAA,CACA,sBAAA,CAGF,qIACE,cAAA,CACA,aAAA,CACA,eAAA,CAIJ,iIACE,YAAA,CACA,kBAAA,CACA,6BAAA,CAEA,mIACE,cAAA,CACA,aAAA,CACA,QAAA,CACA,kBAAA,CACA,eAAA,CACA,sBAAA,CACA,MAAA,CAGF,+IACE,kBAAA,CACA,UAAA,CACA,cAAA,CACA,eAAA,CACA,eAAA,CACA,kBAAA,CACA,cAAA,CACA,iBAAA,CACA,eAAA,CASZ,2CACE,MAAA,CACA,YAAA,CACA,qBAAA,CACA,eAAA,CAEA,oEACE,YAAA,CACA,qBAAA,CACA,WAAA,CAEA,iFACE,iBAAA,CACA,+BAAA,CACA,eAAA,CAEA,iGACE,YAAA,CACA,kBAAA,CAEA,qGACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,mBAAA,CAAA,gBAAA,CACA,iBAAA,CAGF,qHACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,kBAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA,CACA,aAAA,CACA,cAAA,CACA,iBAAA,CAGF,oGACE,cAAA,CACA,eAAA,CACA,aAAA,CACA,gBAAA,CAGF,mHACE,cAAA,CACA,aAAA,CACA,QAAA,CACA,iBAAA,CAKN,wFACE,MAAA,CACA,eAAA,CACA,YAAA,CACA,kBAAA,CAEA,iGACE,YAAA,CACA,kBAAA,CACA,iBAAA,CAEA,sGACE,wBAAA,CAEA,uHACE,kBAAA,CACA,UAAA,CACA,gCAAA,CACA,gBAAA,CAEA,qIACE,wBAAA,CAKN,0GACE,0BAAA,CAEA,2HACE,eAAA,CACA,aAAA,CACA,gCAAA,CACA,iBAAA,CACA,wBAAA,CAIJ,kHACE,aAAA,CACA,iBAAA,CACA,iBAAA,CACA,oBAAA,CAEA,gIACE,QAAA,CACA,eAAA,CACA,cAAA,CAKA,wJACE,cAAA,CACA,gBAAA,CACA,iBAAA,CACA,cAAA,CACA,6BAAA,CACA,aAAA,CACA,iBAAA,CAEA,8JACE,qBAAA,CAIJ,gJACE,gBAAA,CACA,cAAA,CACA,UAAA,CACA,eAAA,CAMF,+IACE,iBAAA,CAEA,oKACE,YAAA,CACA,kBAAA,CACA,QAAA,CACA,iBAAA,CACA,0BAAA,CACA,kBAAA,CACA,+BAAA,CAEA,iLACE,kBAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,cAAA,CACA,cAAA,CACA,uBAAA,CAEA,uLACE,kBAAA,CACA,qBAAA,CAGF,wLACE,qBAAA,CAIJ,0KACE,YAAA,CAGF,gLACE,MAAA,CACA,YAAA,CACA,kBAAA,CACA,OAAA,CAEA,gMACE,cAAA,CACA,aAAA,CACA,eAAA,CAMR,gJACE,gBAAA,CACA,cAAA,CACA,UAAA,CACA,eAAA,CAIJ,gIACE,YAAA,CACA,kBAAA,CACA,OAAA,CACA,cAAA,CACA,cAAA,CACA,UAAA,CAEA,8IACE,eAAA,CAGF,gJACE,cAAA,CACA,uDAAA,CACA,qBAAA,CACA,eAAA,CACA,wBAAA,CACA,eAAA,CAMN,wHACE,iBAAA,CACA,OAAA,CACA,SAAA,CACA,6BAAA,CACA,WAAA,CACA,aAAA,CACA,cAAA,CACA,cAAA,CACA,eAAA,CACA,iBAAA,CACA,SAAA,CACA,uBAAA,CACA,UAAA,CAEA,8HACE,6BAAA,CACA,oBAAA,CAIJ,8HACE,SAAA,CAIF,oHACE,YAAA,CACA,OAAA,CACA,cAAA,CACA,cAAA,CAEA,8HACE,YAAA,CACA,kBAAA,CACA,OAAA,CACA,0BAAA,CACA,kBAAA,CACA,eAAA,CACA,cAAA,CACA,cAAA,CACA,uBAAA,CAEA,oIACE,yBAAA,CACA,qBAAA,CAGF,8IACE,cAAA,CACA,eAAA,CACA,aAAA,CAMN,kHACE,iBAAA,CACA,OAAA,CACA,SAAA,CACA,YAAA,CACA,OAAA,CACA,SAAA,CACA,uBAAA,CACA,UAAA,CAEA,mIACE,8BAAA,CACA,WAAA,CACA,aAAA,CACA,cAAA,CACA,cAAA,CACA,eAAA,CACA,iBAAA,CACA,uBAAA,CAEA,yIACE,8BAAA,CACA,oBAAA,CAIJ,yIACE,eAAA,CACA,SAAA,CACA,6BAAA,CACA,WAAA,CACA,aAAA,CACA,cAAA,CACA,cAAA,CACA,eAAA,CACA,iBAAA,CACA,uBAAA,CAEA,+IACE,6BAAA,CACA,oBAAA,CAKN,wHACE,SAAA,CAIF,kHACE,iBAAA,CACA,WAAA,CACA,OAAA,CACA,eAAA,CACA,wBAAA,CACA,kBAAA,CACA,qCAAA,CACA,WAAA,CACA,YAAA,CACA,OAAA,CACA,UAAA,CACA,iBAAA,CAEA,mIACE,eAAA,CACA,WAAA,CACA,cAAA,CACA,WAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CAEA,yIACE,kBAAA,CACA,oBAAA,CAMR,kHACE,YAAA,CACA,kBAAA,CACA,kBAAA,CAEA,+HACE,YAAA,CACA,OAAA,CACA,iBAAA,CACA,eAAA,CACA,kBAAA,CACA,mCAAA,CAEA,oIACE,SAAA,CACA,UAAA,CACA,kBAAA,CACA,iBAAA,CACA,gDAAA,CAEA,iJAAA,sBAAA,CACA,iJAAA,sBAAA,CAMR,2FACE,iBAAA,CACA,4BAAA,CACA,eAAA,CAGA,gHACE,YAAA,CACA,kBAAA,CACA,OAAA,CACA,gBAAA,CACA,kBAAA,CACA,wBAAA,CACA,iBAAA,CACA,iBAAA,CACA,2BAAA,CAEA,+HACE,SAAA,CACA,UAAA,CACA,kBAAA,CACA,iBAAA,CACA,2BAAA,CAGF,qHACE,aAAA,CACA,cAAA,CACA,eAAA,CAGF,gIACE,kBAAA,CACA,UAAA,CACA,WAAA,CACA,gBAAA,CACA,iBAAA,CACA,cAAA,CACA,cAAA,CACA,8BAAA,CAEA,sIACE,kBAAA,CAMN,+GACE,eAAA,CACA,wBAAA,CACA,kBAAA,CACA,kBAAA,CACA,eAAA,CACA,mCAAA,CAEA,+HACE,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,iBAAA,CACA,kBAAA,CACA,+BAAA,CAEA,oIACE,cAAA,CACA,eAAA,CACA,aAAA,CAGF,8IACE,eAAA,CACA,WAAA,CACA,cAAA,CACA,aAAA,CACA,cAAA,CACA,WAAA,CACA,iBAAA,CACA,uBAAA,CAEA,oJACE,kBAAA,CACA,aAAA,CAKN,gIACE,YAAA,CACA,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,QAAA,CAEA,+IACE,eAAA,CACA,gBAAA,CACA,iBAAA,CACA,mCAAA,CACA,mBAAA,CAAA,gBAAA,CAGF,+IACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,OAAA,CACA,UAAA,CACA,eAAA,CAEA,qJACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,kBAAA,CACA,wBAAA,CAGF,oJACE,cAAA,CACA,aAAA,CACA,eAAA,CAIJ,8IACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,OAAA,CACA,YAAA,CACA,kBAAA,CACA,iBAAA,CACA,wBAAA,CAEA,mJACE,cAAA,CACA,aAAA,CACA,eAAA,CAEA,6JACE,cAAA,CACA,aAAA,CACA,eAAA,CAMR,gIACE,YAAA,CACA,QAAA,CACA,YAAA,CACA,kBAAA,CACA,4BAAA,CAEA,qJACE,MAAA,CACA,kBAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,iBAAA,CACA,cAAA,CACA,eAAA,CACA,cAAA,CACA,uBAAA,CAEA,0KACE,kBAAA,CACA,0BAAA,CACA,yCAAA,CAGF,8JACE,kBAAA,CACA,kBAAA,CACA,cAAA,CACA,eAAA,CAIJ,uJACE,MAAA,CACA,eAAA,CACA,aAAA,CACA,wBAAA,CACA,iBAAA,CACA,iBAAA,CACA,cAAA,CACA,eAAA,CACA,cAAA,CACA,uBAAA,CAEA,6JACE,kBAAA,CACA,oBAAA,CACA,aAAA,CAOR,yGACE,iBAAA,CACA,WAAA,CACA,SAAA,CACA,eAAA,CACA,wBAAA,CACA,kBAAA,CACA,qCAAA,CACA,YAAA,CACA,YAAA,CACA,oCAAA,CACA,OAAA,CACA,UAAA,CACA,iBAAA,CAEA,uHACE,eAAA,CACA,WAAA,CACA,cAAA,CACA,WAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CAEA,6HACE,kBAAA,CACA,oBAAA,CAKN,oHACE,YAAA,CACA,kBAAA,CACA,QAAA,CACA,iBAAA,CAEA,mIACE,YAAA,CACA,kBAAA,CACA,OAAA,CAEA,kJACE,eAAA,CACA,WAAA,CACA,cAAA,CACA,WAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CACA,aAAA,CAEA,wJACE,kBAAA,CACA,aAAA,CACA,qBAAA,CAGF,4JACE,kBAAA,CACA,UAAA,CACA,2BAAA,CAKN,mIACE,MAAA,CACA,iBAAA,CACA,wBAAA,CACA,kBAAA,CACA,cAAA,CACA,eAAA,CACA,aAAA,CACA,uBAAA,CACA,WAAA,CAEA,yIACE,YAAA,CACA,oBAAA,CACA,wCAAA,CAGF,4IACE,kBAAA,CACA,aAAA,CACA,kBAAA,CAGF,qJACE,aAAA,CADF,gJACE,aAAA,CAIJ,iIACE,kBAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,kBAAA,CACA,cAAA,CACA,eAAA,CACA,cAAA,CACA,uBAAA,CACA,cAAA,CAEA,sJACE,kBAAA,CACA,0BAAA,CACA,yCAAA,CAGF,0IACE,kBAAA,CACA,kBAAA,CACA,cAAA,CACA,eAAA,CAOV,4DACE,MAAA,CACA,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,aAAA,CACA,iBAAA,CAEA,kFACE,cAAA,CACA,kBAAA,CAGF,+DACE,cAAA,CACA,eAAA,CACA,aAAA,CACA,gBAAA,CAGF,8DACE,cAAA,CACA,QAAA,CAQV,gBACE,GAAA,sBAAA,CACA,KAAA,wBAAA,CAAA,CAGF,wBACE,YACE,oBAAA,CACA,UAAA,CAEF,IACE,kBAAA,CACA,SAAA,CAAA,CAIJ,iBACE,QACE,SAAA,CAEF,IACE,UAAA,CAAA,CAIJ,iBACE,OACE,SAAA,CAEF,SACE,UAAA,CAAA,CAKJ,yBAGM,8CACE,WAAA,CAAA,CAMR,yBAEI,gCACE,qBAAA,CAEA,8CACE,UAAA,CACA,UAAA,CACA,iBAAA,CACA,+BAAA,CAGF,2CACE,UAAA,CAAA","sourcesContent":[".chat-interface {\n  height: 100vh;\n  background: #f8fafc;\n  display: flex;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n\n  .error-banner {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    background: #ef4444;\n    color: white;\n    padding: 12px 20px;\n    text-align: center;\n    font-weight: 500;\n    z-index: 1000;\n  }\n\n  .loading-container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    height: 100vh;\n    color: #6b7280;\n\n    .loading-spinner {\n      width: 40px;\n      height: 40px;\n      border: 3px solid #e5e7eb;\n      border-top: 3px solid #3b82f6;\n      border-radius: 50%;\n      animation: spin 1s linear infinite;\n      margin-bottom: 16px;\n    }\n\n    p {\n      font-size: 14px;\n      font-weight: 500;\n    }\n  }\n\n  .chat-container {\n    display: flex;\n    width: 100%;\n    height: 100%;\n    background: white;\n    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n\n    // Sidebar\n    .chat-sidebar {\n      width: 320px;\n      background: #f9fafb;\n      border-right: 1px solid #e5e7eb;\n      display: flex;\n      flex-direction: column;\n\n      .sidebar-header {\n        padding: 20px;\n        border-bottom: 1px solid #e5e7eb;\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        background: white;\n\n        h2 {\n          font-size: 18px;\n          font-weight: 600;\n          color: #111827;\n          margin: 0;\n        }\n\n        .new-chat-button {\n          background: #3b82f6;\n          color: white;\n          border: none;\n          border-radius: 8px;\n          padding: 8px 12px;\n          font-size: 16px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n\n          &:hover {\n            background: #2563eb;\n            transform: scale(1.05);\n          }\n        }\n      }\n\n      .new-chat-section {\n        padding: 20px;\n        border-bottom: 1px solid #e5e7eb;\n        background: white;\n\n        h3 {\n          font-size: 14px;\n          font-weight: 600;\n          color: #111827;\n          margin: 0 0 12px 0;\n        }\n\n        .search-input {\n          width: 100%;\n          padding: 10px 12px;\n          border: 1px solid #d1d5db;\n          border-radius: 8px;\n          font-size: 14px;\n          background: white;\n          color: #111827;\n          transition: all 0.2s ease;\n\n          &:focus {\n            outline: none;\n            border-color: #3b82f6;\n            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n          }\n\n          &::placeholder {\n            color: #9ca3af;\n          }\n        }\n\n        .search-loading {\n          text-align: center;\n          padding: 12px;\n          color: #6b7280;\n          font-size: 14px;\n        }\n\n        .search-results {\n          margin-top: 12px;\n          max-height: 200px;\n          overflow-y: auto;\n\n          .search-result-item {\n            display: flex;\n            align-items: center;\n            padding: 12px;\n            border-radius: 8px;\n            cursor: pointer;\n            transition: all 0.2s ease;\n            margin-bottom: 4px;\n\n            &:hover {\n              background: #f3f4f6;\n            }\n\n            .user-avatar {\n              margin-right: 12px;\n\n              img {\n                width: 40px;\n                height: 40px;\n                border-radius: 50%;\n                object-fit: cover;\n              }\n\n              .avatar-placeholder {\n                width: 40px;\n                height: 40px;\n                border-radius: 50%;\n                background: #e5e7eb;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                font-weight: 600;\n                color: #6b7280;\n                font-size: 16px;\n              }\n            }\n\n            .user-info {\n              flex: 1;\n\n              h4 {\n                font-size: 14px;\n                font-weight: 500;\n                color: #111827;\n                margin: 0 0 2px 0;\n              }\n\n              p {\n                font-size: 12px;\n                color: #6b7280;\n                margin: 0;\n              }\n            }\n          }\n        }\n      }\n\n      .conversations-list {\n        flex: 1;\n        overflow-y: auto;\n        padding: 8px 0;\n\n        .no-conversations {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          height: 200px;\n          color: #9ca3af;\n          text-align: center;\n\n          p {\n            font-size: 14px;\n            margin: 4px 0;\n          }\n        }\n\n        .conversation-item {\n          display: flex;\n          align-items: center;\n          padding: 12px 20px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          position: relative;\n\n          &:hover {\n            background: #f3f4f6;\n          }\n\n          &.selected {\n            background: #eff6ff;\n            border-right: 3px solid #3b82f6;\n          }\n\n          .conversation-avatar {\n            position: relative;\n            margin-right: 12px;\n\n            img {\n              width: 48px;\n              height: 48px;\n              border-radius: 50%;\n              object-fit: cover;\n            }\n\n            .avatar-placeholder {\n              width: 48px;\n              height: 48px;\n              border-radius: 50%;\n              background: #e5e7eb;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              font-weight: 600;\n              color: #6b7280;\n              font-size: 18px;\n            }\n\n            .online-indicator {\n              position: absolute;\n              bottom: 2px;\n              right: 2px;\n              width: 12px;\n              height: 12px;\n              background: #10b981;\n              border: 2px solid white;\n              border-radius: 50%;\n            }\n          }\n\n          .conversation-content {\n            flex: 1;\n            min-width: 0;\n\n            .conversation-header {\n              display: flex;\n              align-items: center;\n              justify-content: space-between;\n              margin-bottom: 4px;\n\n              h4 {\n                font-size: 14px;\n                font-weight: 500;\n                color: #374151;\n                margin: 0;\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n              }\n\n              span {\n                font-size: 11px;\n                color: #9ca3af;\n                font-weight: 500;\n              }\n            }\n\n            .conversation-preview {\n              display: flex;\n              align-items: center;\n              justify-content: space-between;\n\n              p {\n                font-size: 13px;\n                color: #6b7280;\n                margin: 0;\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n                flex: 1;\n              }\n\n              .unread-badge {\n                background: #ef4444;\n                color: white;\n                font-size: 11px;\n                font-weight: 600;\n                padding: 2px 6px;\n                border-radius: 10px;\n                min-width: 18px;\n                text-align: center;\n                margin-left: 8px;\n              }\n            }\n          }\n        }\n      }\n    }\n\n    // Chat Area\n    .chat-area {\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      background: white;\n\n      .chat-messages-container {\n        display: flex;\n        flex-direction: column;\n        height: 100%;\n\n        .chat-header {\n          padding: 16px 20px;\n          border-bottom: 1px solid #e5e7eb;\n          background: white;\n\n          .chat-user-info {\n            display: flex;\n            align-items: center;\n\n            img {\n              width: 40px;\n              height: 40px;\n              border-radius: 50%;\n              object-fit: cover;\n              margin-right: 12px;\n            }\n\n            .avatar-placeholder {\n              width: 40px;\n              height: 40px;\n              border-radius: 50%;\n              background: #e5e7eb;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              font-weight: 600;\n              color: #6b7280;\n              font-size: 16px;\n              margin-right: 12px;\n            }\n\n            h3 {\n              font-size: 16px;\n              font-weight: 600;\n              color: #111827;\n              margin: 0 0 2px 0;\n            }\n\n            .typing-indicator {\n              font-size: 12px;\n              color: #6b7280;\n              margin: 0;\n              font-style: italic;\n            }\n          }\n        }\n\n        .messages-container {\n          flex: 1;\n          overflow-y: auto;\n          padding: 20px;\n          background: #f8fafc;\n\n          .message {\n            display: flex;\n            margin-bottom: 16px;\n            position: relative;\n\n            &.sent {\n              justify-content: flex-end;\n\n              .message-content {\n                background: #3b82f6;\n                color: white;\n                border-radius: 18px 18px 4px 18px;\n                margin-left: 40px;\n\n                .message-meta {\n                  justify-content: flex-end;\n                }\n              }\n            }\n\n            &.received {\n              justify-content: flex-start;\n\n              .message-content {\n                background: white;\n                color: #1f2937;\n                border-radius: 18px 18px 18px 4px;\n                margin-right: 40px;\n                border: 1px solid #e5e7eb;\n              }\n            }\n\n            .message-content {\n              max-width: 70%;\n              padding: 12px 16px;\n              position: relative;\n              word-wrap: break-word;\n\n              .message-text {\n                margin: 0;\n                line-height: 1.4;\n                font-size: 14px;\n              }\n\n              // Message image\n              .message-image {\n                .message-image-content {\n                  max-width: 100%;\n                  max-height: 300px;\n                  border-radius: 8px;\n                  cursor: pointer;\n                  transition: transform 0.2s ease;\n                  display: block;\n                  margin-bottom: 8px;\n\n                  &:hover {\n                    transform: scale(1.02);\n                  }\n                }\n\n                .image-caption {\n                  margin: 8px 0 0 0;\n                  font-size: 13px;\n                  opacity: 0.8;\n                  line-height: 1.4;\n                }\n              }\n\n              // Message voice\n              .message-voice {\n                .voice-player {\n                  margin-bottom: 8px;\n\n                  .custom-audio-player {\n                    display: flex;\n                    align-items: center;\n                    gap: 12px;\n                    padding: 12px 16px;\n                    background: rgba(0, 0, 0, 0.05);\n                    border-radius: 12px;\n                    border: 1px solid rgba(0, 0, 0, 0.1);\n\n                    .play-button {\n                      background: #3b82f6;\n                      color: white;\n                      border: none;\n                      border-radius: 50%;\n                      width: 32px;\n                      height: 32px;\n                      display: flex;\n                      align-items: center;\n                      justify-content: center;\n                      cursor: pointer;\n                      font-size: 14px;\n                      transition: all 0.2s ease;\n\n                      &:hover {\n                        background: #2563eb;\n                        transform: scale(1.05);\n                      }\n\n                      &:active {\n                        transform: scale(0.95);\n                      }\n                    }\n\n                    audio {\n                      display: none;\n                    }\n\n                    .audio-info {\n                      flex: 1;\n                      display: flex;\n                      align-items: center;\n                      gap: 8px;\n\n                      .audio-duration {\n                        font-size: 13px;\n                        color: #6b7280;\n                        font-weight: 500;\n                      }\n                    }\n                  }\n                }\n\n                .voice-caption {\n                  margin: 8px 0 0 0;\n                  font-size: 13px;\n                  opacity: 0.8;\n                  line-height: 1.4;\n                }\n              }\n\n              .message-meta {\n                display: flex;\n                align-items: center;\n                gap: 8px;\n                margin-top: 4px;\n                font-size: 11px;\n                opacity: 0.7;\n\n                .message-time {\n                  font-weight: 500;\n                }\n\n                .message-status {\n                  font-size: 12px;\n                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n                  letter-spacing: -1.5px;\n                  margin-left: 4px;\n                  color: rgba(255, 255, 255, 0.8);\n                  font-weight: 400;\n                }\n              }\n            }\n\n            // Delete message button\n            .delete-message-button {\n              position: absolute;\n              top: 8px;\n              right: 8px;\n              background: rgba(239, 68, 68, 0.1);\n              border: none;\n              color: #ef4444;\n              cursor: pointer;\n              font-size: 14px;\n              padding: 4px 6px;\n              border-radius: 6px;\n              opacity: 0;\n              transition: all 0.2s ease;\n              z-index: 10;\n\n              &:hover {\n                background: rgba(239, 68, 68, 0.2);\n                transform: scale(1.1);\n              }\n            }\n\n            &:hover .delete-message-button {\n              opacity: 1;\n            }\n\n            // Message reactions\n            .message-reactions {\n              display: flex;\n              gap: 4px;\n              margin-top: 8px;\n              flex-wrap: wrap;\n\n              .reaction {\n                display: flex;\n                align-items: center;\n                gap: 2px;\n                background: rgba(0, 0, 0, 0.05);\n                border-radius: 12px;\n                padding: 2px 6px;\n                font-size: 12px;\n                cursor: pointer;\n                transition: all 0.2s ease;\n\n                &:hover {\n                  background: rgba(0, 0, 0, 0.1);\n                  transform: scale(1.05);\n                }\n\n                .reaction-count {\n                  font-size: 10px;\n                  font-weight: 500;\n                  color: #6b7280;\n                }\n              }\n            }\n\n            // Message actions\n            .message-actions {\n              position: absolute;\n              top: 8px;\n              right: 8px;\n              display: flex;\n              gap: 4px;\n              opacity: 0;\n              transition: all 0.2s ease;\n              z-index: 10;\n\n              .reaction-button {\n                background: rgba(59, 130, 246, 0.1);\n                border: none;\n                color: #3b82f6;\n                cursor: pointer;\n                font-size: 14px;\n                padding: 4px 6px;\n                border-radius: 6px;\n                transition: all 0.2s ease;\n\n                &:hover {\n                  background: rgba(59, 130, 246, 0.2);\n                  transform: scale(1.1);\n                }\n              }\n\n              .delete-message-button {\n                position: static;\n                opacity: 1;\n                background: rgba(239, 68, 68, 0.1);\n                border: none;\n                color: #ef4444;\n                cursor: pointer;\n                font-size: 14px;\n                padding: 4px 6px;\n                border-radius: 6px;\n                transition: all 0.2s ease;\n\n                &:hover {\n                  background: rgba(239, 68, 68, 0.2);\n                  transform: scale(1.1);\n                }\n              }\n            }\n\n            &:hover .message-actions {\n              opacity: 1;\n            }\n\n            // Reaction picker\n            .reaction-picker {\n              position: absolute;\n              bottom: 100%;\n              right: 0;\n              background: white;\n              border: 1px solid #e5e7eb;\n              border-radius: 12px;\n              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n              padding: 8px;\n              display: flex;\n              gap: 4px;\n              z-index: 20;\n              margin-bottom: 8px;\n\n              .reaction-option {\n                background: none;\n                border: none;\n                font-size: 18px;\n                padding: 6px;\n                border-radius: 6px;\n                cursor: pointer;\n                transition: all 0.2s ease;\n\n                &:hover {\n                  background: #f3f4f6;\n                  transform: scale(1.2);\n                }\n              }\n            }\n          }\n\n          .typing-indicator-message {\n            display: flex;\n            align-items: center;\n            margin-bottom: 16px;\n\n            .typing-dots {\n              display: flex;\n              gap: 4px;\n              padding: 12px 16px;\n              background: white;\n              border-radius: 18px;\n              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n\n              span {\n                width: 8px;\n                height: 8px;\n                background: #9ca3af;\n                border-radius: 50%;\n                animation: typingBounce 1.4s infinite ease-in-out;\n\n                &:nth-child(1) { animation-delay: -0.32s; }\n                &:nth-child(2) { animation-delay: -0.16s; }\n              }\n            }\n          }\n        }\n\n        .message-input-wrapper {\n          padding: 16px 20px;\n          border-top: 1px solid #e5e7eb;\n          background: white;\n\n          // Recording indicator\n          .recording-indicator {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            padding: 8px 12px;\n            background: #fef2f2;\n            border: 1px solid #fecaca;\n            border-radius: 8px;\n            margin-bottom: 8px;\n            animation: pulse 2s infinite;\n\n            .recording-dot {\n              width: 8px;\n              height: 8px;\n              background: #ef4444;\n              border-radius: 50%;\n              animation: blink 1s infinite;\n            }\n\n            span {\n              color: #dc2626;\n              font-size: 14px;\n              font-weight: 500;\n            }\n\n            .stop-recording {\n              background: #dc2626;\n              color: white;\n              border: none;\n              padding: 4px 12px;\n              border-radius: 4px;\n              font-size: 12px;\n              cursor: pointer;\n              transition: background 0.2s ease;\n\n              &:hover {\n                background: #b91c1c;\n              }\n            }\n          }\n\n          // Attachment preview\n          .attachment-preview {\n            background: white;\n            border: 1px solid #e5e7eb;\n            border-radius: 12px;\n            margin-bottom: 16px;\n            overflow: hidden;\n            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n\n            .preview-header {\n              display: flex;\n              align-items: center;\n              justify-content: space-between;\n              padding: 12px 16px;\n              background: #f9fafb;\n              border-bottom: 1px solid #e5e7eb;\n\n              span {\n                font-size: 14px;\n                font-weight: 500;\n                color: #374151;\n              }\n\n              .close-preview {\n                background: none;\n                border: none;\n                font-size: 16px;\n                color: #6b7280;\n                cursor: pointer;\n                padding: 4px;\n                border-radius: 4px;\n                transition: all 0.2s ease;\n\n                &:hover {\n                  background: #e5e7eb;\n                  color: #374151;\n                }\n              }\n            }\n\n            .preview-content {\n              padding: 16px;\n              display: flex;\n              flex-direction: column;\n              align-items: center;\n              gap: 12px;\n\n              .image-preview {\n                max-width: 240px;\n                max-height: 240px;\n                border-radius: 8px;\n                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n                object-fit: cover;\n              }\n\n              .audio-preview {\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                gap: 8px;\n                width: 100%;\n                max-width: 300px;\n\n                audio {\n                  width: 100%;\n                  height: 40px;\n                  border-radius: 8px;\n                  background: #f3f4f6;\n                  border: 1px solid #e5e7eb;\n                }\n\n                span {\n                  font-size: 14px;\n                  color: #6b7280;\n                  font-weight: 500;\n                }\n              }\n\n              .file-preview {\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                gap: 4px;\n                padding: 16px;\n                background: #f9fafb;\n                border-radius: 8px;\n                border: 1px solid #e5e7eb;\n\n                span {\n                  font-size: 14px;\n                  color: #374151;\n                  font-weight: 500;\n\n                  &.file-size {\n                    font-size: 12px;\n                    color: #6b7280;\n                    font-weight: 400;\n                  }\n                }\n              }\n            }\n\n            .preview-actions {\n              display: flex;\n              gap: 12px;\n              padding: 16px;\n              background: #f9fafb;\n              border-top: 1px solid #e5e7eb;\n\n              .send-attachment-btn {\n                flex: 1;\n                background: #3b82f6;\n                color: white;\n                border: none;\n                padding: 10px 16px;\n                border-radius: 8px;\n                font-size: 14px;\n                font-weight: 500;\n                cursor: pointer;\n                transition: all 0.2s ease;\n\n                &:hover:not(:disabled) {\n                  background: #2563eb;\n                  transform: translateY(-1px);\n                  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n                }\n\n                &:disabled {\n                  background: #9ca3af;\n                  cursor: not-allowed;\n                  transform: none;\n                  box-shadow: none;\n                }\n              }\n\n              .cancel-attachment-btn {\n                flex: 1;\n                background: white;\n                color: #6b7280;\n                border: 1px solid #d1d5db;\n                padding: 10px 16px;\n                border-radius: 8px;\n                font-size: 14px;\n                font-weight: 500;\n                cursor: pointer;\n                transition: all 0.2s ease;\n\n                &:hover {\n                  background: #f3f4f6;\n                  border-color: #9ca3af;\n                  color: #374151;\n                }\n              }\n            }\n          }\n\n          // Emoji picker\n          .emoji-picker {\n            position: absolute;\n            bottom: 100%;\n            left: 20px;\n            background: white;\n            border: 1px solid #e5e7eb;\n            border-radius: 12px;\n            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n            padding: 12px;\n            display: grid;\n            grid-template-columns: repeat(8, 1fr);\n            gap: 8px;\n            z-index: 20;\n            margin-bottom: 8px;\n\n            .emoji-button {\n              background: none;\n              border: none;\n              font-size: 20px;\n              padding: 8px;\n              border-radius: 6px;\n              cursor: pointer;\n              transition: all 0.2s ease;\n\n              &:hover {\n                background: #f3f4f6;\n                transform: scale(1.1);\n              }\n            }\n          }\n\n          .message-input-container {\n            display: flex;\n            align-items: center;\n            gap: 12px;\n            position: relative;\n\n            .input-actions {\n              display: flex;\n              align-items: center;\n              gap: 8px;\n\n              .action-button {\n                background: none;\n                border: none;\n                font-size: 18px;\n                padding: 8px;\n                border-radius: 8px;\n                cursor: pointer;\n                transition: all 0.2s ease;\n                color: #6b7280;\n\n                &:hover {\n                  background: #f3f4f6;\n                  color: #3b82f6;\n                  transform: scale(1.05);\n                }\n\n                &.recording {\n                  background: #ef4444;\n                  color: white;\n                  animation: pulse 1s infinite;\n                }\n              }\n            }\n\n            .message-input {\n              flex: 1;\n              padding: 12px 16px;\n              border: 1px solid #d1d5db;\n              border-radius: 24px;\n              font-size: 14px;\n              background: white;\n              color: #111827;\n              transition: all 0.2s ease;\n              resize: none;\n\n              &:focus {\n                outline: none;\n                border-color: #3b82f6;\n                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n              }\n\n              &:disabled {\n                background: #f9fafb;\n                color: #9ca3af;\n                cursor: not-allowed;\n              }\n\n              &::placeholder {\n                color: #9ca3af;\n              }\n            }\n\n            .send-button {\n              background: #3b82f6;\n              color: white;\n              border: none;\n              padding: 12px 20px;\n              border-radius: 24px;\n              font-size: 14px;\n              font-weight: 500;\n              cursor: pointer;\n              transition: all 0.2s ease;\n              min-width: 80px;\n\n              &:hover:not(:disabled) {\n                background: #2563eb;\n                transform: translateY(-1px);\n                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n              }\n\n              &:disabled {\n                background: #9ca3af;\n                cursor: not-allowed;\n                transform: none;\n                box-shadow: none;\n              }\n            }\n          }\n        }\n      }\n\n      .no-conversation {\n        flex: 1;\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        color: #9ca3af;\n        text-align: center;\n\n        .no-conversation-icon {\n          font-size: 48px;\n          margin-bottom: 16px;\n        }\n\n        h3 {\n          font-size: 18px;\n          font-weight: 600;\n          color: #6b7280;\n          margin: 0 0 8px 0;\n        }\n\n        p {\n          font-size: 14px;\n          margin: 0;\n        }\n      }\n    }\n  }\n}\n\n// Animations\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n@keyframes typingBounce {\n  0%, 80%, 100% {\n    transform: scale(0.8);\n    opacity: 0.5;\n  }\n  40% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n\n@keyframes pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n\n@keyframes blink {\n  0%, 50% {\n    opacity: 1;\n  }\n  51%, 100% {\n    opacity: 0.3;\n  }\n}\n\n// Responsive design\n@media (max-width: 768px) {\n  .chat-interface {\n    .chat-container {\n      .chat-sidebar {\n        width: 280px;\n      }\n    }\n  }\n}\n\n@media (max-width: 640px) {\n  .chat-interface {\n    .chat-container {\n      flex-direction: column;\n      \n      .chat-sidebar {\n        width: 100%;\n        height: 40%;\n        border-right: none;\n        border-bottom: 1px solid #e5e7eb;\n      }\n      \n      .chat-area {\n        height: 60%;\n      }\n    }\n  }\n} "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

}]);
//# sourceMappingURL=336.chunk.js.map