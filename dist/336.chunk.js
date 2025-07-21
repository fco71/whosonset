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

// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/react-icons/fa/index.mjs + 4 modules
var fa = __webpack_require__(937);
;// ./src/components/Chat/ChatInterface.tsx







// Create a completely independent message input component with rich features
const MessageInput = react.forwardRef((props, ref) => {
    const inputRef = (0,react.useRef)(null);
    const fileInputRef = (0,react.useRef)(null);
    const voiceRecorderRef = (0,react.useRef)(null);
    const sendCallbackRef = (0,react.useRef)(null);
    const currentUserIdRef = (0,react.useRef)('');
    const selectedUserRef = (0,react.useRef)(null);
    const sendingRef = (0,react.useRef)(false);
    const typingTimeoutRef = (0,react.useRef)(null);
    const isTypingRef = (0,react.useRef)(false);
    const [showEmojiPicker, setShowEmojiPicker] = (0,react.useState)(false);
    const [isRecording, setIsRecording] = (0,react.useState)(false);
    const [recordingTime, setRecordingTime] = (0,react.useState)(0);
    const [recordingError, setRecordingError] = (0,react.useState)(null);
    const [dragOver, setDragOver] = (0,react.useState)(false);
    const [audioLevel, setAudioLevel] = (0,react.useState)(0);
    const [recordedAudioFile, setRecordedAudioFile] = (0,react.useState)(null);
    const [pendingAttachment, setPendingAttachment] = (0,react.useState)(null);
    const [pendingAttachmentType, setPendingAttachmentType] = (0,react.useState)(null);
    const mediaRecorderRef = (0,react.useRef)(null);
    const recordingChunksRef = (0,react.useRef)([]);
    const recordingTimerRef = (0,react.useRef)(null);
    const audioContextRef = (0,react.useRef)(null);
    const analyserRef = (0,react.useRef)(null);
    const microphoneRef = (0,react.useRef)(null);
    const animationFrameRef = (0,react.useRef)(null);
    // Expose methods to parent component
    const setSendCallback = (0,react.useCallback)((callback) => {
        sendCallbackRef.current = callback;
    }, []);
    const setCurrentUser = (0,react.useCallback)((userId) => {
        currentUserIdRef.current = userId;
    }, []);
    const setSelectedUser = (0,react.useCallback)((userId) => {
        selectedUserRef.current = userId;
    }, []);
    const setSendingState = (0,react.useCallback)((isSending) => {
        sendingRef.current = isSending;
        if (inputRef.current) {
            inputRef.current.disabled = isSending;
        }
    }, []);
    // Expose these methods to parent
    react.useImperativeHandle(ref, () => ({
        setSendCallback,
        setCurrentUser,
        setSelectedUser,
        setSendingState
    }), [setSendCallback, setCurrentUser, setSelectedUser, setSendingState]);
    // Emoji picker
    const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙏', '😎', '🤝', '💪', '🚀', '⭐'];
    const addEmoji = (0,react.useCallback)((emoji) => {
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
    const handleFileSelect = (0,react.useCallback)((event) => {
        const file = event.target.files?.[0];
        if (file) {
            setPendingAttachment(file);
            setPendingAttachmentType(file.type);
        }
        event.target.value = '';
    }, []);
    const handleDragOver = (0,react.useCallback)((e) => {
        e.preventDefault();
        setDragOver(true);
    }, []);
    const handleDragLeave = (0,react.useCallback)((e) => {
        e.preventDefault();
        setDragOver(false);
    }, []);
    const handleDrop = (0,react.useCallback)((e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0 && sendCallbackRef.current) {
            sendCallbackRef.current('', 'file', files[0]);
        }
    }, []);
    // Audio level monitoring
    const startAudioLevelMonitoring = (0,react.useCallback)(async (stream) => {
        try {
            console.log('[Audio Level] Starting audio level monitoring...');
            // Create audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
                // Lower threshold for better sensitivity
                if (average > 2) { // Lower threshold to detect more audio
                    setAudioLevel(normalizedLevel);
                    console.log('[Audio Level] Detected audio level:', normalizedLevel.toFixed(3));
                }
                else {
                    setAudioLevel(0);
                }
                // Continue monitoring
                animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
            };
            // Start monitoring
            updateAudioLevel();
        }
        catch (error) {
            console.error('[Audio Level] Failed to start audio level monitoring:', error);
        }
    }, [isRecording]);
    // Voice recording
    const startRecording = (0,react.useCallback)(async () => {
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
                }
                catch (error) {
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
                    if (totalSize < 50) {
                        console.warn('[Voice Recording] Recording seems too small, may not have captured audio');
                        setRecordingError('No audio detected. Please speak louder or check your microphone.');
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
                    // Show success message
                    console.log('[Voice Recording] Voice message recorded successfully!');
                }
                else {
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
        }
        catch (error) {
            console.error('[Voice Recording] Error starting recording:', error);
            let errorMessage = 'Failed to start recording. ';
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    errorMessage = `Microphone access denied. Please follow these steps:

1. Click the microphone icon in your browser's address bar
2. Select "Allow" for microphone access
3. Refresh the page and try again

If you don't see the microphone icon, check your browser settings.`;
                }
                else if (error.name === 'NotFoundError') {
                    errorMessage = 'No microphone found. Please connect a microphone and try again.';
                }
                else if (error.name === 'NotReadableError') {
                    errorMessage = 'Microphone is already in use by another application. Please close other apps using the microphone and try again.';
                }
                else {
                    errorMessage += error.message;
                }
            }
            setRecordingError(errorMessage);
            setIsRecording(false);
            setRecordingTime(0);
        }
    }, [startAudioLevelMonitoring]);
    const stopAudioLevelMonitoring = (0,react.useCallback)(() => {
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
    const stopRecording = (0,react.useCallback)(() => {
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
        }
        else {
            console.log('[Voice Recording] No active recording to stop');
        }
    }, [isRecording, stopAudioLevelMonitoring]);
    const sendRecordedAudio = (0,react.useCallback)(() => {
        if (recordedAudioFile && sendCallbackRef.current) {
            console.log('[Voice Recording] Sending recorded audio file:', recordedAudioFile.name);
            sendCallbackRef.current('Voice Message', 'voice', recordedAudioFile);
            setRecordedAudioFile(null);
            setRecordingError(null);
        }
    }, [recordedAudioFile]);
    const cancelRecordedAudio = (0,react.useCallback)(() => {
        console.log('[Voice Recording] Canceling recorded audio');
        setRecordedAudioFile(null);
    }, []);
    // Cleanup on unmount
    (0,react.useEffect)(() => {
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
        };
    }, [isRecording]);
    const handleInputChange = (0,react.useCallback)((e) => {
        if (!isTypingRef.current && selectedUserRef.current) {
            isTypingRef.current = true;
            messagingService/* MessagingService */.U.setTypingStatus(currentUserIdRef.current, selectedUserRef.current, true);
        }
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            if (selectedUserRef.current) {
                messagingService/* MessagingService */.U.setTypingStatus(currentUserIdRef.current, selectedUserRef.current, false);
            }
        }, 2000);
    }, []);
    const handleSend = (0,react.useCallback)(() => {
        if (!inputRef.current || !selectedUserRef.current || sendingRef.current)
            return;
        const messageContent = inputRef.current.value.trim();
        if (!messageContent)
            return;
        // Clear input immediately
        inputRef.current.value = '';
        // Send the message via callback
        if (sendCallbackRef.current) {
            sendCallbackRef.current(messageContent, 'text');
        }
    }, []);
    const handleKeyPress = (0,react.useCallback)((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);
    const formatRecordingTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    // Add cancel and send handlers for preview
    const cancelPendingAttachment = (0,react.useCallback)(() => {
        setPendingAttachment(null);
        setPendingAttachmentType(null);
    }, []);
    const sendPendingAttachment = (0,react.useCallback)(() => {
        if (pendingAttachment) {
            sendCallbackRef.current?.('', undefined, pendingAttachment);
            setPendingAttachment(null);
            setPendingAttachmentType(null);
        }
    }, [pendingAttachment]);
    return ((0,jsx_runtime.jsxs)("div", { className: `message-input ${dragOver ? 'drag-over' : ''}`, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, children: [dragOver && ((0,jsx_runtime.jsx)("div", { className: "drag-overlay", children: (0,jsx_runtime.jsx)("div", { className: "drag-message", children: (0,jsx_runtime.jsx)("span", { children: "\uD83D\uDCCE Drop file to send" }) }) })), showEmojiPicker && ((0,jsx_runtime.jsx)("div", { className: "emoji-picker", children: emojis.map((emoji, index) => ((0,jsx_runtime.jsx)("button", { onClick: () => addEmoji(emoji), className: "emoji-button", children: emoji }, index))) })), (0,jsx_runtime.jsxs)("div", { className: "input-toolbar", children: [(0,jsx_runtime.jsx)("button", { onClick: () => setShowEmojiPicker(!showEmojiPicker), className: "toolbar-button emoji-button", title: "Add emoji", children: "\uD83D\uDE00" }), (0,jsx_runtime.jsx)("button", { onClick: () => fileInputRef.current?.click(), className: "toolbar-button", title: "Attach file", children: "\uD83D\uDCCE" }), (0,jsx_runtime.jsx)("input", { ref: fileInputRef, type: "file", onChange: handleFileSelect, style: { display: 'none' }, accept: "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" }), (0,jsx_runtime.jsxs)("button", { ref: voiceRecorderRef, onClick: isRecording ? stopRecording : startRecording, className: `toolbar-button voice-button${isRecording ? ' recording' : ''}`, "aria-label": isRecording ? 'Stop recording' : 'Record voice message', type: "button", children: [isRecording ? ((0,jsx_runtime.jsx)("span", { style: { fontSize: 22 }, children: "\u23F9\uFE0F" })) : ((0,jsx_runtime.jsxs)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0,jsx_runtime.jsx)("rect", { x: "9", y: "2", width: "6", height: "12", rx: "3" }), (0,jsx_runtime.jsx)("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }), (0,jsx_runtime.jsx)("line", { x1: "12", y1: "19", x2: "12", y2: "22" }), (0,jsx_runtime.jsx)("line", { x1: "8", y1: "22", x2: "16", y2: "22" })] })), (0,jsx_runtime.jsx)("span", { className: "voice-tooltip", children: isRecording ? 'Stop recording' : 'Record Voice Message' })] })] }), isRecording && ((0,jsx_runtime.jsxs)("div", { className: "recording-indicator", children: [(0,jsx_runtime.jsx)("div", { className: "recording-dot" }), (0,jsx_runtime.jsxs)("span", { children: ["Recording... ", formatRecordingTime(recordingTime)] }), (0,jsx_runtime.jsx)("div", { className: "audio-level-meter", children: (0,jsx_runtime.jsx)("div", { className: "audio-level-bar", style: { width: `${Math.min(audioLevel * 100, 100)}%` } }) }), (0,jsx_runtime.jsx)("button", { onClick: stopRecording, className: "stop-recording", children: "Stop" })] })), recordingError && ((0,jsx_runtime.jsxs)("div", { className: "recording-error", children: [(0,jsx_runtime.jsx)("div", { className: "error-icon", children: "\u26A0\uFE0F" }), (0,jsx_runtime.jsx)("div", { className: "error-message", children: recordingError.split('\n').map((line, index) => ((0,jsx_runtime.jsx)("div", { children: line }, index))) }), (0,jsx_runtime.jsx)("button", { onClick: () => setRecordingError(null), className: "error-close", title: "Close error message", children: "\u00D7" })] })), recordedAudioFile && ((0,jsx_runtime.jsxs)("div", { className: "recorded-audio-review", children: [(0,jsx_runtime.jsxs)("div", { className: "audio-info", children: [(0,jsx_runtime.jsx)("div", { className: "audio-icon", children: (0,jsx_runtime.jsxs)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", children: [(0,jsx_runtime.jsx)("path", { d: "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" }), (0,jsx_runtime.jsx)("path", { d: "M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" })] }) }), (0,jsx_runtime.jsxs)("div", { className: "audio-details", children: [(0,jsx_runtime.jsx)("div", { className: "audio-name", children: "Voice Message" }), (0,jsx_runtime.jsxs)("div", { className: "audio-size", children: [(recordedAudioFile.size / 1024).toFixed(1), " KB"] })] })] }), (0,jsx_runtime.jsx)("audio", { controls: true, src: URL.createObjectURL(recordedAudioFile), style: { width: '100%', margin: '12px 0' } }), (0,jsx_runtime.jsxs)("div", { className: "audio-actions", children: [(0,jsx_runtime.jsx)("button", { onClick: sendRecordedAudio, className: "send-audio-btn", title: "Send voice message", children: "\uD83D\uDCE4 Send" }), (0,jsx_runtime.jsx)("button", { onClick: cancelRecordedAudio, className: "cancel-audio-btn", title: "Cancel and delete recording", children: "\u274C Cancel" })] })] })), pendingAttachment && ((0,jsx_runtime.jsxs)("div", { className: "attachment-preview", style: {
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12, zIndex: 10
                }, children: [pendingAttachmentType?.startsWith('image/') ? ((0,jsx_runtime.jsx)("img", { src: URL.createObjectURL(pendingAttachment), alt: "Preview", style: { maxWidth: 240, maxHeight: 240, borderRadius: 8, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } })) : pendingAttachmentType?.startsWith('audio/') ? ((0,jsx_runtime.jsx)("audio", { controls: true, src: URL.createObjectURL(pendingAttachment), style: { width: 220, marginBottom: 12 } })) : ((0,jsx_runtime.jsx)("div", { style: { marginBottom: 12, fontSize: 16 }, children: (0,jsx_runtime.jsxs)("span", { children: ["\uD83D\uDCCE ", pendingAttachment.name] }) })), (0,jsx_runtime.jsxs)("div", { style: { display: 'flex', gap: 16, marginTop: 4 }, children: [(0,jsx_runtime.jsx)("button", { onClick: sendPendingAttachment, style: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }, children: "Send" }), (0,jsx_runtime.jsx)("button", { onClick: cancelPendingAttachment, style: { background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }, children: "Cancel" })] })] })), (0,jsx_runtime.jsxs)("div", { className: "input-container", children: [(0,jsx_runtime.jsx)("label", { htmlFor: "chat-message-input", className: "sr-only", children: "Type your message" }), (0,jsx_runtime.jsx)("input", { ref: inputRef, id: "chat-message-input", name: "chatMessage", type: "text", onChange: handleInputChange, onKeyPress: handleKeyPress, placeholder: "Type a message...", className: "message-input-field", disabled: sendingRef.current, "aria-label": "Type your message", "aria-disabled": sendingRef.current }), (0,jsx_runtime.jsx)("button", { onClick: handleSend, disabled: sendingRef.current, className: "send-button", "aria-label": "Send message", "aria-disabled": sendingRef.current, children: sendingRef.current ? 'Sending...' : 'Send' })] })] }));
});
MessageInput.displayName = 'MessageInput';
const ChatInterface_ChatInterface = ({ currentUserId, currentUserName, currentUserAvatar, demoUsers = {} }) => {
    // State
    const [messages, setMessages] = (0,react.useState)([]);
    const [conversations, setConversations] = (0,react.useState)([]);
    const [selectedUser, setSelectedUser] = (0,react.useState)(null);
    const [typingUsers, setTypingUsers] = (0,react.useState)([]);
    const [sending, setSending] = (0,react.useState)(false);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [chatSettings, setChatSettings] = (0,react.useState)({
        userId: currentUserId,
        allowMessagesFrom: 'everyone',
        showOnlineStatus: true,
        showLastSeen: true,
        isAway: false
    });
    const [showSettings, setShowSettings] = (0,react.useState)(false);
    const [searchQuery, setSearchQuery] = (0,react.useState)('');
    const [showNewChat, setShowNewChat] = (0,react.useState)(false);
    const [showUserProfile, setShowUserProfile] = (0,react.useState)(false);
    const [profileUser, setProfileUser] = (0,react.useState)(null);
    const [newChatSearchQuery, setNewChatSearchQuery] = (0,react.useState)('');
    const [searchResults, setSearchResults] = (0,react.useState)([]);
    const [isSearching, setIsSearching] = (0,react.useState)(false);
    const [isUserTyping, setIsUserTyping] = (0,react.useState)(false); // Track if user is actively typing
    const [notification, setNotification] = (0,react.useState)(null);
    // Refs
    const messagesEndRef = (0,react.useRef)(null);
    const conversationListenerRef = (0,react.useRef)(null);
    const messageListenerRef = (0,react.useRef)(null);
    const typingListenerRef = (0,react.useRef)(null);
    const messageInputRef = (0,react.useRef)(null);
    // Memoized values
    const filteredConversations = (0,react.useMemo)(() => {
        if (!searchQuery.trim())
            return conversations;
        return conversations.filter(conv => conv.userName.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [conversations, searchQuery]);
    const selectedConversation = (0,react.useMemo)(() => conversations.find(c => c.userId === selectedUser), [conversations, selectedUser]);
    // Initialize chat
    (0,react.useEffect)(() => {
        initializeChat();
        return cleanup;
    }, []);
    // Handle conversation selection
    (0,react.useEffect)(() => {
        if (selectedUser) {
            loadConversation(selectedUser);
            markConversationAsRead(selectedUser);
            setupTypingListener(selectedUser);
        }
    }, [selectedUser]);
    // Auto-scroll to bottom when new messages arrive
    (0,react.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    // Load chat settings
    (0,react.useEffect)(() => {
        const loadSettings = async () => {
            try {
                const settings = await messagingService/* MessagingService */.U.getChatSettings(currentUserId);
                if (settings) {
                    setChatSettings(settings);
                }
            }
            catch (error) {
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
            // Optional: Test storage connection (non-blocking)
            setTimeout(async () => {
                try {
                    const storageWorks = await messagingService/* MessagingService */.U.testStorageConnection();
                    if (!storageWorks) {
                        console.warn('[ChatInterface] Firebase Storage connection test failed - file uploads may not work');
                    }
                }
                catch (error) {
                    console.warn('[ChatInterface] Storage test error (non-critical):', error);
                }
            }, 1000); // Delay test to not block chat initialization
        }
        catch (error) {
            console.error('Error initializing chat:', error);
            setError('Failed to initialize chat. Please refresh the page.');
        }
        finally {
            setLoading(false);
        }
    };
    // Setup real-time conversation listener
    const setupConversationListener = () => {
        try {
            if (conversationListenerRef.current) {
                conversationListenerRef.current();
            }
            conversationListenerRef.current = messagingService/* MessagingService */.U.subscribeToConversations(currentUserId, (conversations) => {
                setConversations(conversations);
            });
        }
        catch (error) {
            console.error('Error setting up conversation listener:', error);
            setError('Failed to load conversations. Please refresh the page.');
        }
    };
    // Load conversation messages
    const loadConversation = (otherUserId) => {
        // Clean up existing message listener
        if (messageListenerRef.current) {
            messageListenerRef.current();
        }
        // Set up message listener
        messageListenerRef.current = messagingService/* MessagingService */.U.subscribeToConversation(currentUserId, otherUserId, (messages) => {
            setMessages(messages);
        });
        // Set up typing listener
        setupTypingListener(otherUserId);
    };
    // Setup typing indicator listener
    const setupTypingListener = (otherUserId) => {
        if (typingListenerRef.current) {
            typingListenerRef.current();
        }
        typingListenerRef.current = messagingService/* MessagingService */.U.subscribeToTypingIndicators(currentUserId, (users) => {
            setTypingUsers(users.filter(user => user !== currentUserId));
        });
    };
    // Mark conversation as read
    const markConversationAsRead = async (otherUserId) => {
        try {
            await messagingService/* MessagingService */.U.markConversationAsRead(currentUserId, otherUserId);
        }
        catch (error) {
            console.error('Error marking conversation as read:', error);
        }
    };
    // Add reaction to message - memoized with useCallback
    const addReaction = (0,react.useCallback)(async (messageId, emoji) => {
        try {
            await messagingService/* MessagingService */.U.addMessageReaction(messageId, currentUserId, currentUserName, emoji);
        }
        catch (error) {
            console.error('Error adding reaction:', error);
            setError('Failed to add reaction. Please try again.');
        }
    }, [currentUserId, currentUserName]);
    // Create memoized reaction handlers to prevent re-renders
    const createReactionHandler = (0,react.useCallback)((messageId, emoji) => {
        return () => addReaction(messageId, emoji);
    }, [addReaction]);
    // Create stable reaction handlers map to prevent re-renders
    const reactionHandlersRef = (0,react.useRef)(new Map());
    const getReactionHandler = (0,react.useCallback)((messageId, emoji) => {
        const key = `${messageId}-${emoji}`;
        if (!reactionHandlersRef.current.has(key)) {
            reactionHandlersRef.current.set(key, () => addReaction(messageId, emoji));
        }
        return reactionHandlersRef.current.get(key);
    }, [addReaction]);
    // Scroll to bottom
    const scrollToBottom = (0,react.useCallback)(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    // Show notification
    const showNotification = (0,react.useCallback)((type, message) => {
        setNotification({ type, message });
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    }, []);
    // Check if a file URL is valid for display
    const isValidFileUrl = (0,react.useCallback)((url) => {
        if (!url)
            return false;
        // Check for invalid/placeholder URLs
        const invalidPatterns = [
            'FILE_TOO_LARGE:',
            'UPLOAD_FAILED:',
            'data:application/octet-stream;base64,FILE_TOO_LARGE'
        ];
        return !invalidPatterns.some(pattern => url.startsWith(pattern));
    }, []);
    // Utility functions
    const formatTime = (date) => {
        // Handle undefined, null, or invalid dates
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
    };
    const getReactionCount = (reactions = [], emoji) => {
        return reactions.filter(r => r.emoji === emoji).length;
    };
    const hasUserReacted = (reactions = [], emoji) => {
        return reactions.some(r => r.userId === currentUserId && r.emoji === emoji);
    };
    // Cleanup
    const cleanup = () => {
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
            messagingService/* MessagingService */.U.cleanup();
            // Clean up any broken image placeholders
            const placeholders = document.querySelectorAll('.upload-failed-message');
            placeholders.forEach(placeholder => {
                if (placeholder.parentElement) {
                    placeholder.remove();
                }
            });
        }
        catch (error) {
            console.error('Error during cleanup:', error);
        }
    };
    // Search for users to start new chat
    const searchUsers = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            // Search only in crewProfiles collection (single source of truth)
            // Use a simpler query to avoid complex index requirements
            const crewQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* where */._M)('isPublished', '==', true), (0,index_esm/* limit */.AB)(20));
            const crewSnapshot = await (0,index_esm/* getDocs */.GG)(crewQuery);
            const results = [];
            // Filter crew members by name in memory
            crewSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const name = data.name || data.displayName || data.firstName || '';
                if (doc.id !== currentUserId && // Don't show current user
                    name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        id: doc.id,
                        name: name || `Crew Member ${doc.id.slice(-4)}`,
                        avatar: data.profileImageUrl || data.avatarUrl,
                        role: data.jobTitles?.[0]?.title || data.role,
                        company: data.company,
                        location: data.residences?.[0]?.city || data.location,
                        type: 'crew'
                    });
                }
            });
            // Remove duplicates and limit results
            const uniqueResults = results.filter((result, index, self) => index === self.findIndex(r => r.id === result.id)).slice(0, 10);
            setSearchResults(uniqueResults);
        }
        catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        }
        finally {
            setIsSearching(false);
        }
    };
    // Start new conversation
    const startNewConversation = async (userId, userName) => {
        setSelectedUser(userId);
        setShowNewChat(false);
        setNewChatSearchQuery('');
        setSearchResults([]);
        // MessageInput component will handle its own focus
    };
    // Handle new chat search input
    const handleNewChatSearch = (e) => {
        const query = e.target.value;
        setNewChatSearchQuery(query);
        // Debounce search
        if (query.trim()) {
            setTimeout(() => searchUsers(query), 300);
        }
        else {
            setSearchResults([]);
        }
    };
    // Helper to get user info for conversations/messages
    const getUserInfo = (userId) => {
        // Try to find in conversations (from Firestore)
        const conv = conversations.find(c => c.userId === userId);
        if (conv && conv.userName) {
            return { name: conv.userName, avatar: conv.userAvatar };
        }
        // Try demo users
        if (demoUsers[userId]) {
            return { name: demoUsers[userId].displayName, avatar: demoUsers[userId].avatar };
        }
        // Try to get from SocialService
        try {
            // This would need to be async, but for now we'll use a fallback
            return { name: `User ${userId.slice(-6)}`, avatar: undefined };
        }
        catch (error) {
            console.error('[getUserInfo] Error fetching user info:', error);
            return { name: `User ${userId.slice(-6)}`, avatar: undefined };
        }
    };
    // Send message function - memoized with useCallback
    const sendMessage = (0,react.useCallback)(async (messageContent, messageType = 'text', file) => {
        if (!selectedUser || sending)
            return;
        console.log('[SendMessage] Starting to send message:', { messageContent, messageType, file: file?.name, fileType: file?.type });
        setSending(true);
        try {
            let content = messageContent;
            let type = messageType;
            let fileUrl = undefined;
            // Handle file uploads
            if (file) {
                console.log('[SendMessage] Processing file:', file.name, file.type, file.size);
                if (file.type.startsWith('image/')) {
                    type = 'image';
                    content = `📷 ${file.name}`;
                    // Upload image file to Firebase Storage
                    fileUrl = await messagingService/* MessagingService */.U.uploadFileToStorage(file, 'chat-images');
                    console.log('[SendMessage] Uploaded image file, got URL:', fileUrl);
                }
                else if (file.type.startsWith('audio/')) {
                    type = 'voice';
                    content = `Voice Message (${(file.size / 1024).toFixed(1)} KB)`;
                    console.log('[SendMessage] Detected voice message:', content);
                    // Upload audio file to Firebase Storage
                    fileUrl = await messagingService/* MessagingService */.U.uploadFileToStorage(file, 'chat-audio');
                    console.log('[SendMessage] Uploaded audio file, got URL:', fileUrl);
                }
                else if (file.type.startsWith('video/')) {
                    type = 'file';
                    content = `🎥 ${file.name}`;
                    // Optionally upload video here in future
                }
                else {
                    type = 'file';
                    content = `📎 ${file.name}`;
                    // Optionally upload file here in future
                }
                // For non-audio/image, fallback to local preview for now
                if (!fileUrl)
                    fileUrl = URL.createObjectURL(file);
            }
            console.log('[SendMessage] Final message data:', { content, type, fileUrl });
            // Optimistically add message to UI
            const optimisticMessage = {
                id: `temp_${Date.now()}`,
                senderId: currentUserId,
                receiverId: selectedUser,
                content,
                timestamp: new Date(),
                isRead: false,
                messageType: type,
                status: 'sending',
                fileUrl,
                fileName: file?.name,
                fileSize: file?.size,
                fileType: file?.type
            };
            setMessages(prev => [...prev, optimisticMessage]);
            // Send actual message
            console.log('[SendMessage] Calling MessagingService.sendDirectMessage with:', { currentUserId, selectedUser, content, type, fileUrl });
            await messagingService/* MessagingService */.U.sendDirectMessage(currentUserId, selectedUser, content, type, undefined, fileUrl);
            // Update optimistic message status
            setMessages(prev => prev.map(msg => msg.id === optimisticMessage.id
                ? { ...msg, status: 'sent' }
                : msg));
            // Stop typing indicator
            messagingService/* MessagingService */.U.setTypingStatus(currentUserId, selectedUser, false);
        }
        catch (error) {
            console.error('[SendMessage] Error sending message:', error);
            // Provide specific error messages for file size issues
            if (error instanceof Error) {
                if (error.message.includes('exceeds maximum allowed size')) {
                    showNotification('error', 'File is too large. Please choose a file smaller than 5MB.');
                }
                else if (error.message.includes('Cannot send message')) {
                    showNotification('error', 'Cannot send message to this user. They may not allow messages from non-followers.');
                }
                else {
                    showNotification('error', 'Failed to send message. Please try again.');
                }
            }
            else {
                showNotification('error', 'Failed to send message. Please try again.');
            }
            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
        }
        finally {
            setSending(false);
        }
    }, [selectedUser, sending, currentUserId]);
    // Set up MessageInput communication - moved after sendMessage is defined
    (0,react.useEffect)(() => {
        if (messageInputRef.current) {
            messageInputRef.current.setCurrentUser(currentUserId);
            messageInputRef.current.setSendCallback(sendMessage);
        }
    }, [currentUserId, sendMessage]);
    // Update MessageInput when selectedUser changes
    (0,react.useEffect)(() => {
        if (messageInputRef.current) {
            messageInputRef.current.setSelectedUser(selectedUser);
        }
    }, [selectedUser]);
    // Update MessageInput sending state
    (0,react.useEffect)(() => {
        if (messageInputRef.current) {
            messageInputRef.current.setSendingState(sending);
        }
    }, [sending]);
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "chat-interface", children: (0,jsx_runtime.jsx)("div", { className: "chat-container", children: (0,jsx_runtime.jsxs)("div", { className: "loading-state", children: [(0,jsx_runtime.jsx)("div", { className: "loading-spinner" }), (0,jsx_runtime.jsx)("p", { children: "Loading conversations..." })] }) }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "chat-interface", children: [notification && ((0,jsx_runtime.jsx)("div", { className: `notification notification-${notification.type}`, children: (0,jsx_runtime.jsxs)("div", { className: "notification-content", children: [(0,jsx_runtime.jsxs)("span", { className: "notification-icon", children: [notification.type === 'error' && '❌', notification.type === 'success' && '✅', notification.type === 'warning' && '⚠️'] }), (0,jsx_runtime.jsx)("span", { className: "notification-message", children: notification.message }), (0,jsx_runtime.jsx)("button", { className: "notification-close", onClick: () => setNotification(null), children: "\u00D7" })] }) })), (0,jsx_runtime.jsxs)("div", { className: "chat-container", children: [(0,jsx_runtime.jsxs)("div", { className: "chat-sidebar", children: [(0,jsx_runtime.jsxs)("div", { className: "sidebar-header", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-light text-gray-900 tracking-wide", children: "Messages" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [(0,jsx_runtime.jsx)("button", { onClick: () => setShowNewChat(!showNewChat), className: "new-chat-button", title: "New Chat", children: "\u2795" }), (0,jsx_runtime.jsx)("button", { onClick: () => setShowSettings(!showSettings), className: "settings-button", title: "Chat Settings", children: "\u2699\uFE0F" })] })] }), showNewChat && ((0,jsx_runtime.jsxs)("div", { className: "new-chat-section", children: [(0,jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-gray-900 mb-3", children: "Start New Chat" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search users to chat with...", value: newChatSearchQuery, onChange: handleNewChatSearch, className: "w-full text-sm border border-gray-200 rounded px-3 py-2" }), isSearching && ((0,jsx_runtime.jsx)("div", { className: "absolute right-3 top-2.5", children: (0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" }) }))] }), searchResults.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "search-results max-h-48 overflow-y-auto space-y-2", children: searchResults.map((user) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3 p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all", onClick: () => startNewConversation(user.id, user.name), children: [(0,jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: user.avatar ? ((0,jsx_runtime.jsx)("img", { src: user.avatar, alt: user.name, className: "w-8 h-8 rounded-full object-cover" })) : ((0,jsx_runtime.jsx)("div", { className: "w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center", children: (0,jsx_runtime.jsx)("span", { className: "text-xs font-medium text-gray-600", children: user.name.charAt(0).toUpperCase() }) })) }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,jsx_runtime.jsx)("h4", { className: "text-sm font-medium text-gray-900 truncate", children: user.name }), user.role && ((0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-600 truncate", children: user.role })), user.company && ((0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 truncate", children: user.company }))] }), (0,jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: (0,jsx_runtime.jsx)("span", { className: "text-xs text-blue-600", children: "\uD83D\uDCAC" }) })] }, user.id))) })), newChatSearchQuery && searchResults.length === 0 && !isSearching && ((0,jsx_runtime.jsx)("div", { className: "text-xs text-gray-500 text-center py-2", children: "No users found. Try a different search term." })), (0,jsx_runtime.jsx)("div", { className: "text-xs text-gray-500", children: "Find users by name, role, or company" })] })] })), (0,jsx_runtime.jsx)("div", { className: "search-container", children: (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search conversations...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }) }), showSettings && ((0,jsx_runtime.jsxs)("div", { className: "settings-panel", children: [(0,jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-gray-900 mb-3", children: "Chat Settings" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "text-xs text-gray-600", children: "Allow messages from:" }), (0,jsx_runtime.jsxs)("select", { value: chatSettings?.allowMessagesFrom || 'everyone', onChange: (e) => {
                                                            const newSettings = {
                                                                userId: currentUserId,
                                                                allowMessagesFrom: e.target.value,
                                                                showOnlineStatus: chatSettings?.showOnlineStatus ?? true,
                                                                showLastSeen: chatSettings?.showLastSeen ?? true,
                                                                autoReply: chatSettings?.autoReply || '',
                                                                isAway: chatSettings?.isAway ?? false,
                                                                awayMessage: chatSettings?.awayMessage || ''
                                                            };
                                                            setChatSettings(newSettings);
                                                            messagingService/* MessagingService */.U.updateChatSettings(currentUserId, newSettings);
                                                        }, className: "w-full text-sm border border-gray-200 rounded px-2 py-1", children: [(0,jsx_runtime.jsx)("option", { value: "everyone", children: "Everyone" }), (0,jsx_runtime.jsx)("option", { value: "followers", children: "Followers Only" }), (0,jsx_runtime.jsx)("option", { value: "none", children: "No One" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", id: "showOnline", checked: chatSettings?.showOnlineStatus || false, onChange: (e) => {
                                                            const newSettings = {
                                                                userId: currentUserId,
                                                                allowMessagesFrom: chatSettings?.allowMessagesFrom || 'everyone',
                                                                showOnlineStatus: e.target.checked,
                                                                showLastSeen: chatSettings?.showLastSeen ?? true,
                                                                autoReply: chatSettings?.autoReply || '',
                                                                isAway: chatSettings?.isAway ?? false,
                                                                awayMessage: chatSettings?.awayMessage || ''
                                                            };
                                                            setChatSettings(newSettings);
                                                            messagingService/* MessagingService */.U.updateChatSettings(currentUserId, newSettings);
                                                        } }), (0,jsx_runtime.jsx)("label", { htmlFor: "showOnline", className: "text-xs text-gray-600", children: "Show online status" })] })] })] })), (0,jsx_runtime.jsx)("div", { className: "conversations-list", children: filteredConversations.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "empty-state", children: [(0,jsx_runtime.jsx)("div", { className: "text-4xl mb-2", children: "\uD83D\uDCAC" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: searchQuery ? 'No conversations found' : 'No conversations yet' }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-400", children: searchQuery ? 'Try a different search term' : 'Start messaging your connections' })] })) : (filteredConversations.map((conversation) => {
                                    const { name, avatar } = getUserInfo(conversation.userId);
                                    return ((0,jsx_runtime.jsxs)("div", { className: `conversation-item ${selectedUser === conversation.userId ? 'active' : ''}`, children: [(0,jsx_runtime.jsxs)("div", { className: "conversation-content", onClick: () => setSelectedUser(conversation.userId), children: [(0,jsx_runtime.jsxs)("div", { className: "user-avatar", children: [avatar ? ((0,jsx_runtime.jsx)("img", { src: avatar, alt: name, className: "w-10 h-10 rounded-full object-cover" })) : ((0,jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center", children: (0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-600", children: name.charAt(0).toUpperCase() }) })), conversation.isOnline && ((0,jsx_runtime.jsx)("div", { className: "online-indicator" }))] }), (0,jsx_runtime.jsxs)("div", { className: "conversation-info", children: [(0,jsx_runtime.jsxs)("div", { className: "conversation-header", children: [(0,jsx_runtime.jsx)("h4", { className: "user-name", children: name }), conversation.lastMessageTime && ((0,jsx_runtime.jsx)("span", { className: "message-time", children: formatTime(conversation.lastMessageTime) }))] }), (0,jsx_runtime.jsxs)("div", { className: "conversation-preview", children: [conversation.lastMessage && ((0,jsx_runtime.jsx)("p", { className: "last-message", children: conversation.lastMessage })), conversation.unreadCount > 0 && ((0,jsx_runtime.jsx)("span", { className: "unread-badge", children: conversation.unreadCount }))] })] })] }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                                    setProfileUser(conversation);
                                                    setShowUserProfile(true);
                                                }, className: "profile-button", title: "View Profile", children: "\uD83D\uDC64" })] }, conversation.userId));
                                })) })] }), (0,jsx_runtime.jsxs)("div", { className: "chat-area", children: [error && ((0,jsx_runtime.jsxs)("div", { className: "error-banner", children: [(0,jsx_runtime.jsx)("span", { children: error }), (0,jsx_runtime.jsx)("button", { onClick: () => setError(null), children: "\u00D7" })] })), selectedUser ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: "chat-header", children: (0,jsx_runtime.jsxs)("div", { className: "user-info", children: [selectedUser ? ((0,jsx_runtime.jsx)("img", { src: selectedUser ? getUserInfo(selectedUser).avatar : '', alt: selectedUser ? getUserInfo(selectedUser).name : '', className: "w-8 h-8 rounded-full object-cover" })) : ((0,jsx_runtime.jsx)("div", { className: "w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center", children: (0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-600", children: selectedUser ? getUserInfo(selectedUser).name.charAt(0).toUpperCase() : '' }) })), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "user-name", children: selectedUser ? getUserInfo(selectedUser).name : '' }), typingUsers.includes(selectedUser) && ((0,jsx_runtime.jsx)("p", { className: "typing-indicator", children: "typing..." }))] })] }) }), (0,jsx_runtime.jsxs)("div", { className: "messages-container", children: [messages.map((message) => ((0,jsx_runtime.jsx)("div", { className: `message ${message.senderId === currentUserId ? 'sent' : 'received'}`, style: { position: 'relative' }, children: (0,jsx_runtime.jsxs)("div", { className: "message-content", children: [['deleted_text', 'deleted_image', 'deleted_audio', 'deleted_file'].includes(message.messageType) ? ((0,jsx_runtime.jsxs)("div", { className: "deleted-message-placeholder", style: {
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
                                                            }, children: [(0,jsx_runtime.jsx)("span", { style: { fontSize: 15, opacity: 0.7, marginRight: 2 }, children: "\uD83D\uDDD1\uFE0F" }), message.content] })) : message.messageType === 'image' && message.fileUrl ? ((0,jsx_runtime.jsxs)("div", { className: "message-image", children: [!isValidFileUrl(message.fileUrl) ? (message.fileUrl.startsWith('UPLOAD_FAILED:') ? ((0,jsx_runtime.jsxs)("div", { className: "upload-failed-message", children: [(0,jsx_runtime.jsx)("div", { className: "upload-failed-icon", children: "\u26A0\uFE0F" }), (0,jsx_runtime.jsxs)("div", { className: "upload-failed-content", children: [(0,jsx_runtime.jsx)("div", { className: "upload-failed-title", children: "Upload Failed" }), (0,jsx_runtime.jsx)("div", { className: "upload-failed-name", children: message.fileName || 'Image' }), (0,jsx_runtime.jsx)("div", { className: "upload-failed-message-text", children: "The file couldn't be uploaded. This might be due to network issues or service problems. Please try again later." })] })] })) : ((0,jsx_runtime.jsxs)("div", { className: "file-too-large-message", children: [(0,jsx_runtime.jsx)("div", { className: "file-too-large-icon", children: "\uD83D\uDCF7" }), (0,jsx_runtime.jsxs)("div", { className: "file-too-large-content", children: [(0,jsx_runtime.jsx)("div", { className: "file-too-large-title", children: "File Too Large" }), (0,jsx_runtime.jsx)("div", { className: "file-too-large-name", children: message.fileName || 'Image' }), (0,jsx_runtime.jsx)("div", { className: "file-too-large-size", children: message.fileSize ? `${(message.fileSize / 1024 / 1024).toFixed(1)} MB` : 'Unknown size' }), (0,jsx_runtime.jsx)("div", { className: "file-too-large-message-text", children: "This file exceeds the 5MB size limit. Please compress the image or choose a smaller file." })] })] }))) : ((0,jsx_runtime.jsx)("img", { src: message.fileUrl, alt: message.fileName || 'Image', className: "message-image-content", onClick: () => window.open(message.fileUrl, '_blank'), onError: (e) => {
                                                                        console.warn('[ChatInterface] Image failed to load:', message.fileUrl);
                                                                        // Replace the broken image with a placeholder
                                                                        const target = e.target;
                                                                        target.style.display = 'none';
                                                                        const parent = target.parentElement;
                                                                        if (parent) {
                                                                            const placeholder = document.createElement('div');
                                                                            placeholder.className = 'upload-failed-message';
                                                                            placeholder.innerHTML = `
                                      <div class="upload-failed-icon">📷</div>
                                      <div class="upload-failed-content">
                                        <div class="upload-failed-title">Image Unavailable</div>
                                        <div class="upload-failed-name">${message.fileName || 'Image'}</div>
                                        <div class="upload-failed-message-text">
                                          This image could not be loaded. The file may have been deleted or is no longer available.
                                        </div>
                                      </div>
                                    `;
                                                                            parent.appendChild(placeholder);
                                                                        }
                                                                    } })), message.content && (0,jsx_runtime.jsx)("p", { className: "image-caption", children: message.content })] })) : message.messageType === 'file' && message.fileUrl ? ((0,jsx_runtime.jsxs)("div", { className: "message-file", children: [(0,jsx_runtime.jsxs)("div", { className: "file-info", children: [(0,jsx_runtime.jsx)("div", { className: "file-icon", children: "\uD83D\uDCCE" }), (0,jsx_runtime.jsxs)("div", { className: "file-details", children: [(0,jsx_runtime.jsx)("div", { className: "file-name", children: message.fileName || 'File' }), message.fileSize && ((0,jsx_runtime.jsxs)("div", { className: "file-size", children: [(message.fileSize / 1024 / 1024).toFixed(1), " MB"] }))] }), (0,jsx_runtime.jsx)("button", { className: "file-download", onClick: () => message.fileUrl && window.open(message.fileUrl, '_blank'), children: "\uD83D\uDCE5" })] }), message.content && (0,jsx_runtime.jsx)("p", { className: "file-caption", children: message.content })] })) : message.messageType === 'voice' && message.fileUrl ? ((0,jsx_runtime.jsxs)("div", { className: "message-voice", children: [(0,jsx_runtime.jsx)("audio", { controls: true, src: message.fileUrl, style: { width: '100%' } }), message.content && (0,jsx_runtime.jsx)("p", { className: "voice-caption", children: message.content })] })) : ((0,jsx_runtime.jsx)("p", { className: "message-text", children: message.content })), (0,jsx_runtime.jsxs)("div", { className: "message-meta", children: [(0,jsx_runtime.jsx)("span", { className: "message-time", children: formatTime(message.timestamp) }), message.senderId === currentUserId && ((0,jsx_runtime.jsxs)("span", { className: "message-status", children: [message.status === 'sending' && '⏳', message.status === 'sent' && '✓', message.status === 'delivered' && '✓✓', message.status === 'read' && '✓✓'] }))] }), message.reactions && message.reactions.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "message-reactions", children: ['👍', '❤️', '😊', '🎉'].map((emoji) => {
                                                                const count = getReactionCount(message.reactions, emoji);
                                                                if (count === 0)
                                                                    return null;
                                                                return ((0,jsx_runtime.jsxs)("button", { onClick: getReactionHandler(message.id, emoji), className: `reaction-button ${hasUserReacted(message.reactions, emoji) ? 'reacted' : ''}`, children: [(0,jsx_runtime.jsx)("span", { className: "emoji", children: emoji }), (0,jsx_runtime.jsx)("span", { className: "count", children: count })] }, emoji));
                                                            }) })), (0,jsx_runtime.jsx)("div", { className: "reaction-buttons", children: ['👍', '❤️', '😊', '🎉'].map((emoji) => ((0,jsx_runtime.jsx)("button", { onClick: getReactionHandler(message.id, emoji), className: "reaction-option", children: emoji }, emoji))) }), (0,jsx_runtime.jsx)("button", { title: message.senderId === currentUserId ? "Delete message for everyone" : "Delete message from your chat", className: `delete-message-button ${message.senderId === currentUserId ? 'sender-delete' : 'receiver-delete'}`, onClick: async () => {
                                                                const isSender = message.senderId === currentUserId;
                                                                const confirmMessage = isSender
                                                                    ? 'Delete this message for everyone?'
                                                                    : 'Delete this message from your chat? (The sender will still see it)';
                                                                if (window.confirm(confirmMessage)) {
                                                                    try {
                                                                        await messagingService/* MessagingService */.U.deleteMessage(message.id, message.fileUrl, message.messageType, currentUserId);
                                                                        showNotification('success', isSender ? 'Message deleted for everyone' : 'Message removed from your chat');
                                                                    }
                                                                    catch (error) {
                                                                        console.error('Error deleting message:', error);
                                                                        showNotification('error', 'Failed to delete message. Please try again.');
                                                                    }
                                                                }
                                                            }, children: (0,jsx_runtime.jsx)(fa/* FaTrash */.qbC, {}) })] }) }, message.id))), typingUsers.includes(selectedUser) && ((0,jsx_runtime.jsx)("div", { className: "typing-indicator-message", children: (0,jsx_runtime.jsxs)("div", { className: "typing-dots", children: [(0,jsx_runtime.jsx)("span", {}), (0,jsx_runtime.jsx)("span", {}), (0,jsx_runtime.jsx)("span", {})] }) })), (0,jsx_runtime.jsx)("div", { ref: messagesEndRef })] }), (0,jsx_runtime.jsx)(MessageInput, { ref: messageInputRef }, "stable-message-input")] })) : ((0,jsx_runtime.jsxs)("div", { className: "no-conversation", children: [(0,jsx_runtime.jsx)("div", { className: "text-4xl mb-3", children: "\uD83D\uDCAC" }), (0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-1", children: "Select a conversation" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-500 text-sm", children: "Choose a contact to start messaging" })] }))] })] }), showUserProfile && profileUser && ((0,jsx_runtime.jsx)("div", { className: "profile-modal-overlay", onClick: () => setShowUserProfile(false), children: (0,jsx_runtime.jsxs)("div", { className: "profile-modal", onClick: (e) => e.stopPropagation(), children: [(0,jsx_runtime.jsxs)("div", { className: "profile-header", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "User Profile" }), (0,jsx_runtime.jsx)("button", { onClick: () => setShowUserProfile(false), className: "close-button", children: "\u00D7" })] }), (0,jsx_runtime.jsxs)("div", { className: "profile-content", children: [(0,jsx_runtime.jsxs)("div", { className: "profile-avatar-section", children: [profileUser.userAvatar ? ((0,jsx_runtime.jsx)("img", { src: profileUser.userAvatar, alt: profileUser.userName, className: "w-20 h-20 rounded-full object-cover" })) : ((0,jsx_runtime.jsx)("div", { className: "w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center", children: (0,jsx_runtime.jsx)("span", { className: "text-2xl font-medium text-gray-600", children: profileUser.userName.charAt(0).toUpperCase() }) })), (0,jsx_runtime.jsx)("div", { className: "profile-status", children: profileUser.isOnline ? ((0,jsx_runtime.jsx)("span", { className: "online-status", children: "\uD83D\uDFE2 Online" })) : ((0,jsx_runtime.jsx)("span", { className: "offline-status", children: "\u26AB Offline" })) })] }), (0,jsx_runtime.jsxs)("div", { className: "profile-info", children: [(0,jsx_runtime.jsx)("h4", { className: "profile-name", children: profileUser.userName }), (0,jsx_runtime.jsx)("p", { className: "profile-role", children: profileUser.userRole || 'Film Industry Professional' }), (0,jsx_runtime.jsxs)("p", { className: "profile-location", children: ["Location: ", profileUser.userLocation || 'Not specified'] }), (0,jsx_runtime.jsxs)("p", { className: "profile-company", children: ["Company: ", profileUser.userCompany || 'Not specified'] })] }), (0,jsx_runtime.jsxs)("div", { className: "profile-actions", children: [(0,jsx_runtime.jsx)("button", { onClick: () => {
                                                setSelectedUser(profileUser.userId);
                                                setShowUserProfile(false);
                                            }, className: "start-chat-button", children: "\uD83D\uDCAC Start Chat" }), (0,jsx_runtime.jsx)("button", { className: "view-full-profile-button", children: "\uD83D\uDC41\uFE0F View Full Profile" })] })] })] }) }))] }));
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
        // Prefer photoURL, fallback to profileImageUrl, then avatarUrl
        const photoURL = data.photoURL || data.profileImageUrl || data.avatarUrl || undefined;
        const profileImageUrl = data.profileImageUrl || data.photoURL || data.avatarUrl || undefined;
        const user = {
            id,
            name: data.name || data.displayName,
            displayName: data.displayName || data.name || 'User',
            username: data.username,
            photoURL,
            profileImageUrl, // always set for compatibility
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
___CSS_LOADER_EXPORT___.push([module.id, `.chat-interface{height:100vh;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);display:flex;align-items:center;justify-content:center;padding:20px;font-family:"Inter",-apple-system,BlinkMacSystemFont,sans-serif;position:relative}.chat-interface .notification{position:fixed;top:20px;right:20px;z-index:1000;max-width:400px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);animation:slideInRight .3s ease}.chat-interface .notification.notification-error{background:#fef2f2;border:1px solid #fecaca;color:#991b1b}.chat-interface .notification.notification-success{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}.chat-interface .notification.notification-warning{background:#fffbeb;border:1px solid #fed7aa;color:#92400e}.chat-interface .notification .notification-content{display:flex;align-items:center;padding:12px 16px;gap:8px}.chat-interface .notification .notification-content .notification-icon{font-size:16px;flex-shrink:0}.chat-interface .notification .notification-content .notification-message{flex:1;font-size:14px;font-weight:500;line-height:1.4}.chat-interface .notification .notification-content .notification-close{background:none;border:none;font-size:18px;cursor:pointer;padding:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:background .2s ease}.chat-interface .notification .notification-content .notification-close:hover{background:rgba(0,0,0,.1)}@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}.chat-interface .chat-container{width:100%;max-width:1200px;height:100%;background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.1);display:flex;overflow:hidden;position:relative}.chat-interface .chat-container .loading-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#6b7280}.chat-interface .chat-container .loading-state .loading-spinner{width:40px;height:40px;border:3px solid #f3f4f6;border-top:3px solid #3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:16px}.chat-interface .chat-container .loading-state p{font-size:14px;font-weight:500}.chat-interface .chat-container .chat-sidebar{width:320px;background:#f8fafc;border-right:1px solid #e5e7eb;display:flex;flex-direction:column}.chat-interface .chat-container .chat-sidebar .sidebar-header{padding:24px 20px 16px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between}.chat-interface .chat-container .chat-sidebar .sidebar-header h2{font-size:20px;font-weight:600;color:#111827;margin:0}.chat-interface .chat-container .chat-sidebar .sidebar-header .settings-button{background:none;border:none;font-size:18px;cursor:pointer;padding:8px;border-radius:8px;transition:all .2s ease}.chat-interface .chat-container .chat-sidebar .sidebar-header .settings-button:hover{background:#e5e7eb;transform:scale(1.1)}.chat-interface .chat-container .chat-sidebar .sidebar-header .new-chat-button{background:none;border:none;font-size:18px;cursor:pointer;padding:8px;border-radius:8px;transition:all .2s ease;color:#3b82f6}.chat-interface .chat-container .chat-sidebar .sidebar-header .new-chat-button:hover{background:#dbeafe;transform:scale(1.1)}.chat-interface .chat-container .chat-sidebar .search-container{padding:16px 20px;border-bottom:1px solid #e5e7eb}.chat-interface .chat-container .chat-sidebar .search-container .search-input{width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:12px;font-size:14px;background:#fff;transition:all .2s ease}.chat-interface .chat-container .chat-sidebar .search-container .search-input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.chat-interface .chat-container .chat-sidebar .search-container .search-input::-moz-placeholder{color:#9ca3af}.chat-interface .chat-container .chat-sidebar .search-container .search-input::placeholder{color:#9ca3af}.chat-interface .chat-container .chat-sidebar .settings-panel{padding:20px;border-bottom:1px solid #e5e7eb;background:#fff;animation:slideDown .3s ease}.chat-interface .chat-container .chat-sidebar .settings-panel h3{font-size:14px;font-weight:600;color:#111827;margin:0 0 12px 0}.chat-interface .chat-container .chat-sidebar .settings-panel .space-y-3>*+*{margin-top:12px}.chat-interface .chat-container .chat-sidebar .settings-panel label{font-size:12px;font-weight:500;color:#6b7280;display:block;margin-bottom:4px}.chat-interface .chat-container .chat-sidebar .settings-panel select{width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;background:#fff;transition:all .2s ease}.chat-interface .chat-container .chat-sidebar .settings-panel select:focus{outline:none;border-color:#3b82f6}.chat-interface .chat-container .chat-sidebar .settings-panel input[type=checkbox]{margin-right:8px}.chat-interface .chat-container .chat-sidebar .new-chat-section{padding:20px;border-bottom:1px solid #e5e7eb;background:#fff;animation:slideDown .3s ease}.chat-interface .chat-container .chat-sidebar .new-chat-section h3{font-size:14px;font-weight:600;color:#111827;margin:0 0 12px 0}.chat-interface .chat-container .chat-sidebar .new-chat-section input{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;background:#fff;color:#111827;transition:all .2s ease}.chat-interface .chat-container .chat-sidebar .new-chat-section input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.chat-interface .chat-container .chat-sidebar .new-chat-section input::-moz-placeholder{color:#9ca3af}.chat-interface .chat-container .chat-sidebar .new-chat-section input::placeholder{color:#9ca3af}.chat-interface .chat-container .chat-sidebar .new-chat-section .text-xs{font-size:12px;color:#6b7280;margin-top:4px}.chat-interface .chat-container .chat-sidebar .conversations-list{flex:1;overflow-y:auto;padding:8px 0}.chat-interface .chat-container .chat-sidebar .conversations-list .empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:200px;color:#9ca3af;text-align:center}.chat-interface .chat-container .chat-sidebar .conversations-list .empty-state .text-4xl{font-size:48px;margin-bottom:8px}.chat-interface .chat-container .chat-sidebar .conversations-list .empty-state .text-sm{font-size:14px;font-weight:500;margin-bottom:4px}.chat-interface .chat-container .chat-sidebar .conversations-list .empty-state .text-xs{font-size:12px}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item{display:flex;align-items:center;padding:12px 20px;cursor:pointer;transition:all .2s ease;position:relative}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item:hover{background:#f3f4f6}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item.active{background:#eff6ff;border-right:3px solid #3b82f6}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item.active .user-name{color:#1d4ed8}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-content{display:flex;align-items:center;flex:1;cursor:pointer}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .profile-button{background:none;border:none;font-size:16px;cursor:pointer;padding:6px;border-radius:6px;transition:all .2s ease;opacity:0;margin-left:8px}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .profile-button:hover{background:#e5e7eb;transform:scale(1.1)}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item:hover .profile-button{opacity:1}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .user-avatar{position:relative;margin-right:12px}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .user-avatar .online-indicator{position:absolute;bottom:2px;right:2px;width:12px;height:12px;background:#10b981;border:2px solid #fff;border-radius:50%}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-info{flex:1;min-width:0}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-info .conversation-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-info .conversation-header .user-name{font-size:14px;font-weight:500;color:#374151;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-info .conversation-header .message-time{font-size:11px;color:#9ca3af;font-weight:500}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-info .conversation-preview{display:flex;align-items:center;justify-content:space-between}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-info .conversation-preview .last-message{font-size:13px;color:#6b7280;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}.chat-interface .chat-container .chat-sidebar .conversations-list .conversation-item .conversation-info .conversation-preview .unread-badge{background:#ef4444;color:#fff;font-size:11px;font-weight:600;padding:2px 6px;border-radius:10px;min-width:18px;text-align:center;margin-left:8px}.chat-interface .chat-container .chat-area{flex:1;display:flex;flex-direction:column;background:#fff}.chat-interface .chat-container .chat-area .error-banner{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:500}.chat-interface .chat-container .chat-area .error-banner button{background:none;border:none;color:#dc2626;font-size:18px;cursor:pointer;padding:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:4px}.chat-interface .chat-container .chat-area .error-banner button:hover{background:#fecaca}.chat-interface .chat-container .chat-area .chat-header{padding:20px 24px;border-bottom:1px solid #e5e7eb;background:#fff}.chat-interface .chat-container .chat-area .chat-header .user-info{display:flex;align-items:center}.chat-interface .chat-container .chat-area .chat-header .user-info .user-name{font-size:16px;font-weight:600;color:#111827;margin:0 0 2px 0}.chat-interface .chat-container .chat-area .chat-header .user-info .typing-indicator{font-size:12px;color:#6b7280;margin:0;font-style:italic}.chat-interface .chat-container .chat-area .messages-container{flex:1;overflow-y:auto;padding:20px 24px;background:#f8fafc}.chat-interface .chat-container .chat-area .messages-container .message{display:flex;margin-bottom:16px;position:relative}.chat-interface .chat-container .chat-area .messages-container .message.sent{justify-content:flex-end}.chat-interface .chat-container .chat-area .messages-container .message.sent .message-content{background:linear-gradient(135deg, #3b82f6, #1d4ed8);color:#fff;border-radius:18px 18px 4px 18px;margin-left:40px}.chat-interface .chat-container .chat-area .messages-container .message.sent .message-content .message-meta{justify-content:flex-end}.chat-interface .chat-container .chat-area .messages-container .message.sent .message-content .message-reactions{justify-content:flex-end}.chat-interface .chat-container .chat-area .messages-container .message.received{justify-content:flex-start}.chat-interface .chat-container .chat-area .messages-container .message.received .message-content{background:#fff;color:#1f2937;border-radius:18px 18px 18px 4px;margin-right:40px;border:1px solid #e5e7eb}.chat-interface .chat-container .chat-area .messages-container .message .message-content{max-width:70%;padding:12px 16px;position:relative;word-wrap:break-word}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-text{margin:0;line-height:1.4;font-size:14px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .message-image-content{max-width:100%;max-height:300px;border-radius:8px;cursor:pointer;transition:transform .2s ease}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .message-image-content:hover{transform:scale(1.02)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .image-caption{margin:8px 0 0 0;font-size:13px;opacity:.8}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .file-too-large-message{display:flex;align-items:center;gap:12px;padding:16px;background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;margin-bottom:8px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .file-too-large-message .file-too-large-icon{font-size:24px;opacity:.8}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .file-too-large-message .file-too-large-content{flex:1}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .file-too-large-message .file-too-large-content .file-too-large-title{font-weight:600;font-size:14px;color:#92400e;margin-bottom:4px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .file-too-large-message .file-too-large-content .file-too-large-name{font-weight:500;font-size:13px;color:#78350f;margin-bottom:2px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .file-too-large-message .file-too-large-content .file-too-large-size{font-size:11px;color:#92400e;opacity:.8;margin-bottom:4px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .file-too-large-message .file-too-large-content .file-too-large-message-text{font-size:12px;color:#92400e;opacity:.9;line-height:1.4}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .upload-failed-message{display:flex;align-items:center;gap:12px;padding:16px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin-bottom:8px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .upload-failed-message .upload-failed-icon{font-size:24px;opacity:.8}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .upload-failed-message .upload-failed-content{flex:1}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .upload-failed-message .upload-failed-content .upload-failed-title{font-weight:600;font-size:14px;color:#991b1b;margin-bottom:4px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .upload-failed-message .upload-failed-content .upload-failed-name{font-weight:500;font-size:13px;color:#7f1d1d;margin-bottom:4px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .upload-failed-message .upload-failed-content .upload-failed-message-text{font-size:12px;color:#991b1b;opacity:.9;line-height:1.4}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,.05);border-radius:8px;margin-bottom:8px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-icon{font-size:20px;opacity:.7}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-details{flex:1}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-details .file-name{font-weight:500;font-size:13px;margin-bottom:2px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-details .file-size{font-size:11px;opacity:.7}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-download{background:none;border:none;font-size:18px;cursor:pointer;padding:4px;border-radius:4px;transition:background .2s ease}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-download:hover{background:rgba(0,0,0,.1)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-caption{margin:8px 0 0 0;font-size:13px;opacity:.8}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,.05);border-radius:8px;margin-bottom:8px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .play-button{background:#3b82f6;color:#fff;border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:all .2s ease}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .play-button:hover{background:#1d4ed8;transform:scale(1.05)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform{display:flex;align-items:center;gap:2px;flex:1;height:32px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .waveform-bar{background:#3b82f6;width:3px;border-radius:2px;min-height:4px;transition:height .3s ease}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .voice-placeholder{display:flex;align-items:center;gap:2px;width:100%}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .voice-placeholder .waveform-bar{background:rgba(0,0,0,.3);height:20px;animation:voiceWave 2s ease-in-out infinite}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .voice-placeholder .waveform-bar:nth-child(odd){animation-delay:.1s}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .voice-placeholder .waveform-bar:nth-child(even){animation-delay:.2s}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-duration{font-size:12px;opacity:.7;font-weight:500;flex-shrink:0}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-caption{margin:8px 0 0 0;font-size:13px;opacity:.8}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-meta{display:flex;align-items:center;gap:8px;margin-top:4px;font-size:11px;opacity:.7}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-meta .message-time{font-weight:500}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-meta .message-status{font-size:12px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions{display:flex;gap:4px;margin-top:8px;flex-wrap:wrap}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button{background:rgba(0,0,0,.1);border:none;border-radius:12px;padding:4px 8px;font-size:12px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;gap:4px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button:hover{background:rgba(0,0,0,.15);transform:scale(1.05)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button.reacted{background:rgba(59,130,246,.2);color:#3b82f6}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button .emoji{font-size:14px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button .count{font-weight:500;font-size:11px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .reaction-buttons{position:absolute;top:50%;right:-32px;transform:translateY(-50%);display:flex;flex-direction:column;gap:2px;opacity:0;transition:opacity .2s ease;z-index:10}.chat-interface .chat-container .chat-area .messages-container .message .message-content .reaction-buttons .reaction-option{background:#fff;border:1px solid #e5e7eb;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;transition:all .2s ease;box-shadow:0 2px 8px rgba(0,0,0,.1)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .reaction-buttons .reaction-option:hover{transform:scale(1.1);box-shadow:0 4px 12px rgba(0,0,0,.15)}.chat-interface .chat-container .chat-area .messages-container .message .message-content:hover .reaction-buttons{opacity:1}.chat-interface .chat-container .chat-area .messages-container .message .message-content .delete-message-button{position:absolute;top:50%;transform:translateY(-50%);background:#fff;border:1px solid #e5e7eb;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;transition:all .2s ease;box-shadow:0 2px 8px rgba(0,0,0,.1);opacity:0;z-index:10;color:#9ca3af}.chat-interface .chat-container .chat-area .messages-container .message .message-content .delete-message-button:hover{transform:translateY(-50%) scale(1.1);box-shadow:0 4px 12px rgba(0,0,0,.15);color:#ef4444;background:#fef2f2;border-color:#fecaca}.chat-interface .chat-container .chat-area .messages-container .message .message-content .delete-message-button.sender-delete{color:#ef4444}.chat-interface .chat-container .chat-area .messages-container .message .message-content .delete-message-button.sender-delete:hover{color:#dc2626;background:#fef2f2;border-color:#fecaca}.chat-interface .chat-container .chat-area .messages-container .message .message-content:hover .delete-message-button{opacity:1}.chat-interface .chat-container .chat-area .messages-container .message.received .message-content{margin-right:60px}.chat-interface .chat-container .chat-area .messages-container .message.received .message-content .reaction-buttons{right:-32px;left:auto}.chat-interface .chat-container .chat-area .messages-container .message.received .message-content .delete-message-button{right:-60px;left:auto}.chat-interface .chat-container .chat-area .messages-container .message.sent .message-content{margin-left:60px}.chat-interface .chat-container .chat-area .messages-container .message.sent .message-content .reaction-buttons{right:auto;left:-32px}.chat-interface .chat-container .chat-area .messages-container .message.sent .message-content .delete-message-button{right:auto;left:-60px}.chat-interface .chat-container .chat-area .messages-container .message .message-content{max-width:70%;padding:12px 16px;position:relative;word-wrap:break-word}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-text{margin:0;line-height:1.4;font-size:14px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .message-image-content{max-width:100%;max-height:300px;border-radius:8px;cursor:pointer;transition:transform .2s ease}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .message-image-content:hover{transform:scale(1.02)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-image .image-caption{margin:8px 0 0 0;font-size:13px;opacity:.8}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,.05);border-radius:8px;margin-bottom:8px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-icon{font-size:20px;opacity:.7}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-details{flex:1}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-details .file-name{font-weight:500;font-size:13px;margin-bottom:2px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-details .file-size{font-size:11px;opacity:.7}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-download{background:none;border:none;font-size:18px;cursor:pointer;padding:4px;border-radius:4px;transition:background .2s ease}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-info .file-download:hover{background:rgba(0,0,0,.1)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-file .file-caption{margin:8px 0 0 0;font-size:13px;opacity:.8}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,.05);border-radius:8px;margin-bottom:8px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .play-button{background:#3b82f6;color:#fff;border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:all .2s ease}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .play-button:hover{background:#1d4ed8;transform:scale(1.05)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform{display:flex;align-items:center;gap:2px;flex:1;height:32px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .waveform-bar{background:#3b82f6;width:3px;border-radius:2px;min-height:4px;transition:height .3s ease}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .voice-placeholder{display:flex;align-items:center;gap:2px;width:100%}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .voice-placeholder .waveform-bar{background:rgba(0,0,0,.3);height:20px;animation:voiceWave 2s ease-in-out infinite}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .voice-placeholder .waveform-bar:nth-child(odd){animation-delay:.1s}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-waveform .voice-placeholder .waveform-bar:nth-child(even){animation-delay:.2s}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-player .voice-duration{font-size:12px;opacity:.7;font-weight:500;flex-shrink:0}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-voice .voice-caption{margin:8px 0 0 0;font-size:13px;opacity:.8}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-meta{display:flex;align-items:center;gap:8px;margin-top:4px;font-size:11px;opacity:.7}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-meta .message-time{font-weight:500}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-meta .message-status{font-size:12px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions{display:flex;gap:4px;margin-top:8px;flex-wrap:wrap}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button{background:rgba(0,0,0,.1);border:none;border-radius:12px;padding:4px 8px;font-size:12px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;gap:4px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button:hover{background:rgba(0,0,0,.15);transform:scale(1.05)}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button.reacted{background:rgba(59,130,246,.2);color:#3b82f6}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button .emoji{font-size:14px}.chat-interface .chat-container .chat-area .messages-container .message .message-content .message-reactions .reaction-button .count{font-weight:500;font-size:11px}.chat-interface .chat-container .chat-area .messages-container .message .reaction-buttons{position:absolute;right:-35px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:2px;opacity:0;transition:opacity .2s ease;z-index:10}.chat-interface .chat-container .chat-area .messages-container .message .reaction-buttons .reaction-option{background:#fff;border:1px solid #e5e7eb;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;transition:all .2s ease;box-shadow:0 2px 8px rgba(0,0,0,.1)}.chat-interface .chat-container .chat-area .messages-container .message .reaction-buttons .reaction-option:hover{transform:scale(1.1);box-shadow:0 4px 12px rgba(0,0,0,.15)}.chat-interface .chat-container .chat-area .messages-container .message:hover .reaction-buttons{opacity:1}.chat-interface .chat-container .chat-area .messages-container .typing-indicator-message{display:flex;align-items:center;margin-bottom:16px}.chat-interface .chat-container .chat-area .messages-container .typing-indicator-message .typing-dots{display:flex;gap:4px;padding:12px 16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px rgba(0,0,0,.1)}.chat-interface .chat-container .chat-area .messages-container .typing-indicator-message .typing-dots span{width:8px;height:8px;background:#9ca3af;border-radius:50%;animation:typingBounce 1.4s infinite ease-in-out}.chat-interface .chat-container .chat-area .messages-container .typing-indicator-message .typing-dots span:nth-child(1){animation-delay:-0.32s}.chat-interface .chat-container .chat-area .messages-container .typing-indicator-message .typing-dots span:nth-child(2){animation-delay:-0.16s}.chat-interface .chat-container .chat-area .message-input{padding:20px 24px;border-top:1px solid #e5e7eb;background:#fff;position:relative}.chat-interface .chat-container .chat-area .message-input.drag-over .drag-overlay{display:flex}.chat-interface .chat-container .chat-area .message-input .drag-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(59,130,246,.1);border:2px dashed #3b82f6;border-radius:12px;display:none;align-items:center;justify-content:center;z-index:10}.chat-interface .chat-container .chat-area .message-input .drag-overlay .drag-message{background:#fff;padding:16px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);font-weight:500;color:#3b82f6}.chat-interface .chat-container .chat-area .message-input .emoji-picker{position:absolute;bottom:100%;left:20px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.15);padding:12px;display:grid;grid-template-columns:repeat(8, 1fr);gap:8px;z-index:20;margin-bottom:8px}.chat-interface .chat-container .chat-area .message-input .emoji-picker .emoji-button{background:none;border:none;font-size:20px;padding:8px;border-radius:6px;cursor:pointer;transition:all .2s ease}.chat-interface .chat-container .chat-area .message-input .emoji-picker .emoji-button:hover{background:#f3f4f6;transform:scale(1.1)}.chat-interface .chat-container .chat-area .message-input .input-toolbar{display:flex;align-items:center;gap:8px;margin-bottom:12px}.chat-interface .chat-container .chat-area .message-input .input-toolbar .toolbar-button{background:none;border:none;font-size:18px;padding:8px;border-radius:8px;cursor:pointer;transition:all .2s ease;color:#6b7280}.chat-interface .chat-container .chat-area .message-input .input-toolbar .toolbar-button:hover{background:#f3f4f6;color:#3b82f6;transform:scale(1.05)}.chat-interface .chat-container .chat-area .message-input .input-toolbar .toolbar-button.emoji-button{font-size:16px}.chat-interface .chat-container .chat-area .message-input .input-toolbar .toolbar-button.voice-button{margin-left:16px;background:#3b82f6;color:#fff;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,.15);width:40px;height:40px;display:flex;align-items:center;justify-content:center;position:relative;font-size:22px;padding:0}.chat-interface .chat-container .chat-area .message-input .input-toolbar .toolbar-button.voice-button:hover{background:#2563eb;color:#fff;box-shadow:0 4px 16px rgba(59,130,246,.25);transform:scale(1.08)}.chat-interface .chat-container .chat-area .message-input .input-toolbar .toolbar-button.voice-button.recording{background:#ef4444;color:#fff;animation:pulse 1s infinite;box-shadow:0 0 0 4px rgba(239,68,68,.15)}.chat-interface .chat-container .chat-area .message-input .input-toolbar .toolbar-button.voice-button .voice-tooltip{visibility:hidden;opacity:0;background:#222;color:#fff;text-align:center;border-radius:6px;padding:4px 10px;position:absolute;z-index:20;bottom:120%;left:50%;transform:translateX(-50%);font-size:12px;white-space:nowrap;pointer-events:none;transition:opacity .2s}.chat-interface .chat-container .chat-area .message-input .input-toolbar .toolbar-button.voice-button:hover .voice-tooltip{visibility:visible;opacity:1}.chat-interface .chat-container .chat-area .message-input .recording-indicator{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin-bottom:8px;animation:pulse 2s infinite}.chat-interface .chat-container .chat-area .message-input .recording-indicator .recording-dot{width:8px;height:8px;background:#ef4444;border-radius:50%;animation:blink 1s infinite}.chat-interface .chat-container .chat-area .message-input .recording-indicator span{color:#dc2626;font-size:14px;font-weight:500}.chat-interface .chat-container .chat-area .message-input .recording-indicator .audio-level-meter{flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;min-width:60px}.chat-interface .chat-container .chat-area .message-input .recording-indicator .audio-level-meter .audio-level-bar{height:100%;background:linear-gradient(90deg, #10b981, #059669);border-radius:4px;transition:width .1s ease}.chat-interface .chat-container .chat-area .message-input .recording-indicator .stop-recording{background:#dc2626;color:#fff;border:none;padding:4px 12px;border-radius:4px;font-size:12px;cursor:pointer;transition:background .2s ease}.chat-interface .chat-container .chat-area .message-input .recording-indicator .stop-recording:hover{background:#b91c1c}.chat-interface .chat-container .chat-area .message-input .recording-error{display:flex;align-items:flex-start;gap:8px;padding:12px;background:#fef3cd;border:1px solid #fde68a;border-radius:8px;margin-bottom:8px;animation:slideIn .3s ease}.chat-interface .chat-container .chat-area .message-input .recording-error .error-icon{font-size:16px;flex-shrink:0}.chat-interface .chat-container .chat-area .message-input .recording-error .error-message{flex:1;font-size:14px;color:#92400e;line-height:1.4}.chat-interface .chat-container .chat-area .message-input .recording-error .error-close{background:none;border:none;font-size:18px;color:#92400e;cursor:pointer;padding:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background-color .2s ease}.chat-interface .chat-container .chat-area .message-input .recording-error .error-close:hover{background:rgba(146,64,14,.1)}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review{display:flex;align-items:center;justify-content:space-between;padding:12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;margin-bottom:8px;animation:slideIn .3s ease}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-info{display:flex;align-items:center;gap:8px;flex:1}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-info .audio-icon{font-size:20px;color:#0369a1}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-info .audio-details .audio-name{font-weight:500;color:#0c4a6e;font-size:14px}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-info .audio-details .audio-size{font-size:12px;color:#64748b;margin-top:2px}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-actions{display:flex;gap:8px}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-actions .send-audio-btn,.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-actions .cancel-audio-btn{padding:6px 12px;border:none;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;gap:4px}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-actions .send-audio-btn{background:#10b981;color:#fff}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-actions .send-audio-btn:hover{background:#059669;transform:translateY(-1px)}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-actions .cancel-audio-btn{background:#ef4444;color:#fff}.chat-interface .chat-container .chat-area .message-input .recorded-audio-review .audio-actions .cancel-audio-btn:hover{background:#dc2626;transform:translateY(-1px)}.chat-interface .chat-container .chat-area .message-input .input-container{display:flex;align-items:center;gap:12px}.chat-interface .chat-container .chat-area .message-input .input-container .message-input-field{flex:1;padding:12px 16px;border:1px solid #d1d5db;border-radius:12px;font-size:14px;background:#fff;color:#111827;transition:all .2s ease;resize:none;min-height:44px;max-height:120px}.chat-interface .chat-container .chat-area .message-input .input-container .message-input-field:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.chat-interface .chat-container .chat-area .message-input .input-container .message-input-field:disabled{background:#f9fafb;color:#9ca3af;cursor:not-allowed}.chat-interface .chat-container .chat-area .message-input .input-container .message-input-field::-moz-placeholder{color:#9ca3af}.chat-interface .chat-container .chat-area .message-input .input-container .message-input-field::placeholder{color:#9ca3af}.chat-interface .chat-container .chat-area .message-input .input-container .send-button{background:#3b82f6;color:#fff;border:none;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease;min-width:80px}.chat-interface .chat-container .chat-area .message-input .input-container .send-button:hover:not(:disabled){background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 12px rgba(59,130,246,.3)}.chat-interface .chat-container .chat-area .message-input .input-container .send-button:disabled{background:#9ca3af;cursor:not-allowed;transform:none;box-shadow:none}.chat-interface .chat-container .chat-area .no-conversation{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#9ca3af;text-align:center}.chat-interface .chat-container .chat-area .no-conversation .text-6xl{font-size:72px;margin-bottom:16px}.chat-interface .chat-container .chat-area .no-conversation h3{font-size:20px;font-weight:600;color:#6b7280;margin:0 0 8px 0}.chat-interface .chat-container .chat-area .no-conversation p{font-size:14px;margin:0}@keyframes messageSlideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes typingBounce{0%,80%,100%{transform:scale(0.8);opacity:.5}40%{transform:scale(1);opacity:1}}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:.3}}@keyframes voiceWave{0%,100%{height:20px}50%{height:40px}}@media(max-width: 768px){.chat-interface{padding:10px}.chat-interface .chat-container{border-radius:12px}.chat-interface .chat-container .chat-sidebar{width:280px}}@media(max-width: 640px){.chat-interface .chat-container{flex-direction:column}.chat-interface .chat-container .chat-sidebar{width:100%;height:40%;border-right:none;border-bottom:1px solid #e5e7eb}.chat-interface .chat-container .chat-area{height:60%}}.profile-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fadeIn .3s ease}.profile-modal-overlay .profile-modal{background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.2);width:90%;max-width:400px;max-height:80vh;overflow:hidden;animation:slideUp .3s ease}.profile-modal-overlay .profile-modal .profile-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #e5e7eb;background:#f8fafc}.profile-modal-overlay .profile-modal .profile-header h3{font-size:18px;font-weight:600;color:#111827;margin:0}.profile-modal-overlay .profile-modal .profile-header .close-button{background:none;border:none;font-size:24px;cursor:pointer;padding:4px;border-radius:4px;color:#6b7280;transition:all .2s ease}.profile-modal-overlay .profile-modal .profile-header .close-button:hover{background:#e5e7eb;color:#111827}.profile-modal-overlay .profile-modal .profile-content{padding:24px}.profile-modal-overlay .profile-modal .profile-content .profile-avatar-section{text-align:center;margin-bottom:20px}.profile-modal-overlay .profile-modal .profile-content .profile-avatar-section .profile-status{margin-top:8px;font-size:14px;font-weight:500}.profile-modal-overlay .profile-modal .profile-content .profile-avatar-section .profile-status .online-status{color:#059669}.profile-modal-overlay .profile-modal .profile-content .profile-avatar-section .profile-status .offline-status{color:#6b7280}.profile-modal-overlay .profile-modal .profile-content .profile-info{text-align:center;margin-bottom:24px}.profile-modal-overlay .profile-modal .profile-content .profile-info .profile-name{font-size:20px;font-weight:600;color:#111827;margin:0 0 8px 0}.profile-modal-overlay .profile-modal .profile-content .profile-info .profile-role{font-size:16px;color:#3b82f6;font-weight:500;margin:0 0 4px 0}.profile-modal-overlay .profile-modal .profile-content .profile-info .profile-location,.profile-modal-overlay .profile-modal .profile-content .profile-info .profile-company{font-size:14px;color:#6b7280;margin:0 0 2px 0}.profile-modal-overlay .profile-modal .profile-content .profile-actions{display:flex;flex-direction:column;gap:12px}.profile-modal-overlay .profile-modal .profile-content .profile-actions .start-chat-button,.profile-modal-overlay .profile-modal .profile-content .profile-actions .view-full-profile-button{width:100%;padding:12px 16px;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease}.profile-modal-overlay .profile-modal .profile-content .profile-actions .start-chat-button{background:#3b82f6;color:#fff}.profile-modal-overlay .profile-modal .profile-content .profile-actions .start-chat-button:hover{background:#2563eb;transform:translateY(-1px)}.profile-modal-overlay .profile-modal .profile-content .profile-actions .view-full-profile-button{background:#f3f4f6;color:#374151}.profile-modal-overlay .profile-modal .profile-content .profile-actions .view-full-profile-button:hover{background:#e5e7eb;transform:translateY(-1px)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}`, "",{"version":3,"sources":["webpack://./src/components/Chat/ChatInterface.scss"],"names":[],"mappings":"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","sourcesContent":[".chat-interface {\n  height: 100vh;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;\n  position: relative;\n\n  // Notification styles\n  .notification {\n    position: fixed;\n    top: 20px;\n    right: 20px;\n    z-index: 1000;\n    max-width: 400px;\n    border-radius: 8px;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n    animation: slideInRight 0.3s ease;\n\n    &.notification-error {\n      background: #fef2f2;\n      border: 1px solid #fecaca;\n      color: #991b1b;\n    }\n\n    &.notification-success {\n      background: #f0fdf4;\n      border: 1px solid #bbf7d0;\n      color: #166534;\n    }\n\n    &.notification-warning {\n      background: #fffbeb;\n      border: 1px solid #fed7aa;\n      color: #92400e;\n    }\n\n    .notification-content {\n      display: flex;\n      align-items: center;\n      padding: 12px 16px;\n      gap: 8px;\n\n      .notification-icon {\n        font-size: 16px;\n        flex-shrink: 0;\n      }\n\n      .notification-message {\n        flex: 1;\n        font-size: 14px;\n        font-weight: 500;\n        line-height: 1.4;\n      }\n\n      .notification-close {\n        background: none;\n        border: none;\n        font-size: 18px;\n        cursor: pointer;\n        padding: 0;\n        width: 20px;\n        height: 20px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        border-radius: 4px;\n        transition: background 0.2s ease;\n\n        &:hover {\n          background: rgba(0, 0, 0, 0.1);\n        }\n      }\n    }\n  }\n\n  @keyframes slideInRight {\n    from {\n      transform: translateX(100%);\n      opacity: 0;\n    }\n    to {\n      transform: translateX(0);\n      opacity: 1;\n    }\n  }\n\n  .chat-container {\n    width: 100%;\n    max-width: 1200px;\n    height: 100%;\n    background: white;\n    border-radius: 20px;\n    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);\n    display: flex;\n    overflow: hidden;\n    position: relative;\n\n    // Loading state\n    .loading-state {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      height: 100%;\n      color: #6b7280;\n\n      .loading-spinner {\n        width: 40px;\n        height: 40px;\n        border: 3px solid #f3f4f6;\n        border-top: 3px solid #3b82f6;\n        border-radius: 50%;\n        animation: spin 1s linear infinite;\n        margin-bottom: 16px;\n      }\n\n      p {\n        font-size: 14px;\n        font-weight: 500;\n      }\n    }\n\n    // Sidebar\n    .chat-sidebar {\n      width: 320px;\n      background: #f8fafc;\n      border-right: 1px solid #e5e7eb;\n      display: flex;\n      flex-direction: column;\n\n      .sidebar-header {\n        padding: 24px 20px 16px;\n        border-bottom: 1px solid #e5e7eb;\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n\n        h2 {\n          font-size: 20px;\n          font-weight: 600;\n          color: #111827;\n          margin: 0;\n        }\n\n        .settings-button {\n          background: none;\n          border: none;\n          font-size: 18px;\n          cursor: pointer;\n          padding: 8px;\n          border-radius: 8px;\n          transition: all 0.2s ease;\n\n          &:hover {\n            background: #e5e7eb;\n            transform: scale(1.1);\n          }\n        }\n\n        .new-chat-button {\n          background: none;\n          border: none;\n          font-size: 18px;\n          cursor: pointer;\n          padding: 8px;\n          border-radius: 8px;\n          transition: all 0.2s ease;\n          color: #3b82f6;\n\n          &:hover {\n            background: #dbeafe;\n            transform: scale(1.1);\n          }\n        }\n      }\n\n      .search-container {\n        padding: 16px 20px;\n        border-bottom: 1px solid #e5e7eb;\n\n        .search-input {\n          width: 100%;\n          padding: 12px 16px;\n          border: 1px solid #d1d5db;\n          border-radius: 12px;\n          font-size: 14px;\n          background: white;\n          transition: all 0.2s ease;\n\n          &:focus {\n            outline: none;\n            border-color: #3b82f6;\n            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n          }\n\n          &::placeholder {\n            color: #9ca3af;\n          }\n        }\n      }\n\n      .settings-panel {\n        padding: 20px;\n        border-bottom: 1px solid #e5e7eb;\n        background: white;\n        animation: slideDown 0.3s ease;\n\n        h3 {\n          font-size: 14px;\n          font-weight: 600;\n          color: #111827;\n          margin: 0 0 12px 0;\n        }\n\n        .space-y-3 > * + * {\n          margin-top: 12px;\n        }\n\n        label {\n          font-size: 12px;\n          font-weight: 500;\n          color: #6b7280;\n          display: block;\n          margin-bottom: 4px;\n        }\n\n        select {\n          width: 100%;\n          padding: 8px 12px;\n          border: 1px solid #d1d5db;\n          border-radius: 8px;\n          font-size: 14px;\n          background: white;\n          transition: all 0.2s ease;\n\n          &:focus {\n            outline: none;\n            border-color: #3b82f6;\n          }\n        }\n\n        input[type=\"checkbox\"] {\n          margin-right: 8px;\n        }\n      }\n\n      .new-chat-section {\n        padding: 20px;\n        border-bottom: 1px solid #e5e7eb;\n        background: white;\n        animation: slideDown 0.3s ease;\n\n        h3 {\n          font-size: 14px;\n          font-weight: 600;\n          color: #111827;\n          margin: 0 0 12px 0;\n        }\n\n        input {\n          width: 100%;\n          padding: 10px 12px;\n          border: 1px solid #d1d5db;\n          border-radius: 8px;\n          font-size: 14px;\n          background: white;\n          color: #111827;\n          transition: all 0.2s ease;\n\n          &:focus {\n            outline: none;\n            border-color: #3b82f6;\n            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n          }\n\n          &::placeholder {\n            color: #9ca3af;\n          }\n        }\n\n        .text-xs {\n          font-size: 12px;\n          color: #6b7280;\n          margin-top: 4px;\n        }\n      }\n\n      .conversations-list {\n        flex: 1;\n        overflow-y: auto;\n        padding: 8px 0;\n\n        .empty-state {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          height: 200px;\n          color: #9ca3af;\n          text-align: center;\n\n          .text-4xl {\n            font-size: 48px;\n            margin-bottom: 8px;\n          }\n\n          .text-sm {\n            font-size: 14px;\n            font-weight: 500;\n            margin-bottom: 4px;\n          }\n\n          .text-xs {\n            font-size: 12px;\n          }\n        }\n\n        .conversation-item {\n          display: flex;\n          align-items: center;\n          padding: 12px 20px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          position: relative;\n\n          &:hover {\n            background: #f3f4f6;\n          }\n\n          &.active {\n            background: #eff6ff;\n            border-right: 3px solid #3b82f6;\n\n            .user-name {\n              color: #1d4ed8;\n            }\n          }\n\n          .conversation-content {\n            display: flex;\n            align-items: center;\n            flex: 1;\n            cursor: pointer;\n          }\n\n          .profile-button {\n            background: none;\n            border: none;\n            font-size: 16px;\n            cursor: pointer;\n            padding: 6px;\n            border-radius: 6px;\n            transition: all 0.2s ease;\n            opacity: 0;\n            margin-left: 8px;\n\n            &:hover {\n              background: #e5e7eb;\n              transform: scale(1.1);\n            }\n          }\n\n          &:hover .profile-button {\n            opacity: 1;\n          }\n\n          .user-avatar {\n            position: relative;\n            margin-right: 12px;\n\n            .online-indicator {\n              position: absolute;\n              bottom: 2px;\n              right: 2px;\n              width: 12px;\n              height: 12px;\n              background: #10b981;\n              border: 2px solid white;\n              border-radius: 50%;\n            }\n          }\n\n          .conversation-info {\n            flex: 1;\n            min-width: 0;\n\n            .conversation-header {\n              display: flex;\n              align-items: center;\n              justify-content: space-between;\n              margin-bottom: 4px;\n\n              .user-name {\n                font-size: 14px;\n                font-weight: 500;\n                color: #374151;\n                margin: 0;\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n              }\n\n              .message-time {\n                font-size: 11px;\n                color: #9ca3af;\n                font-weight: 500;\n              }\n            }\n\n            .conversation-preview {\n              display: flex;\n              align-items: center;\n              justify-content: space-between;\n\n              .last-message {\n                font-size: 13px;\n                color: #6b7280;\n                margin: 0;\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n                flex: 1;\n              }\n\n              .unread-badge {\n                background: #ef4444;\n                color: white;\n                font-size: 11px;\n                font-weight: 600;\n                padding: 2px 6px;\n                border-radius: 10px;\n                min-width: 18px;\n                text-align: center;\n                margin-left: 8px;\n              }\n            }\n          }\n        }\n      }\n    }\n\n    // Chat area\n    .chat-area {\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      background: white;\n\n      .error-banner {\n        background: #fef2f2;\n        border: 1px solid #fecaca;\n        color: #dc2626;\n        padding: 12px 20px;\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        font-size: 14px;\n        font-weight: 500;\n\n        button {\n          background: none;\n          border: none;\n          color: #dc2626;\n          font-size: 18px;\n          cursor: pointer;\n          padding: 0;\n          width: 20px;\n          height: 20px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          border-radius: 4px;\n\n          &:hover {\n            background: #fecaca;\n          }\n        }\n      }\n\n      .chat-header {\n        padding: 20px 24px;\n        border-bottom: 1px solid #e5e7eb;\n        background: white;\n\n        .user-info {\n          display: flex;\n          align-items: center;\n\n          .user-name {\n            font-size: 16px;\n            font-weight: 600;\n            color: #111827;\n            margin: 0 0 2px 0;\n          }\n\n          .typing-indicator {\n            font-size: 12px;\n            color: #6b7280;\n            margin: 0;\n            font-style: italic;\n          }\n        }\n      }\n\n      .messages-container {\n        flex: 1;\n        overflow-y: auto;\n        padding: 20px 24px;\n        background: #f8fafc;\n\n        .message {\n          display: flex;\n          margin-bottom: 16px;\n          position: relative;\n\n          &.sent {\n            justify-content: flex-end;\n\n            .message-content {\n              background: linear-gradient(135deg, #3b82f6, #1d4ed8);\n              color: white;\n              border-radius: 18px 18px 4px 18px;\n              margin-left: 40px;\n\n              .message-meta {\n                justify-content: flex-end;\n              }\n\n              .message-reactions {\n                justify-content: flex-end;\n              }\n            }\n          }\n\n          &.received {\n            justify-content: flex-start;\n\n            .message-content {\n              background: white;\n              color: #1f2937;\n              border-radius: 18px 18px 18px 4px;\n              margin-right: 40px;\n              border: 1px solid #e5e7eb;\n            }\n          }\n\n          .message-content {\n            max-width: 70%;\n            padding: 12px 16px;\n            position: relative;\n            word-wrap: break-word;\n\n            // Message text\n            .message-text {\n              margin: 0;\n              line-height: 1.4;\n              font-size: 14px;\n            }\n\n            // Message image\n            .message-image {\n              .message-image-content {\n                max-width: 100%;\n                max-height: 300px;\n                border-radius: 8px;\n                cursor: pointer;\n                transition: transform 0.2s ease;\n\n                &:hover {\n                  transform: scale(1.02);\n                }\n              }\n\n              .image-caption {\n                margin: 8px 0 0 0;\n                font-size: 13px;\n                opacity: 0.8;\n              }\n\n              // File too large message\n              .file-too-large-message {\n                display: flex;\n                align-items: center;\n                gap: 12px;\n                padding: 16px;\n                background: #fef3c7;\n                border: 1px solid #f59e0b;\n                border-radius: 8px;\n                margin-bottom: 8px;\n\n                .file-too-large-icon {\n                  font-size: 24px;\n                  opacity: 0.8;\n                }\n\n                .file-too-large-content {\n                  flex: 1;\n\n                  .file-too-large-title {\n                    font-weight: 600;\n                    font-size: 14px;\n                    color: #92400e;\n                    margin-bottom: 4px;\n                  }\n\n                  .file-too-large-name {\n                    font-weight: 500;\n                    font-size: 13px;\n                    color: #78350f;\n                    margin-bottom: 2px;\n                  }\n\n                  .file-too-large-size {\n                    font-size: 11px;\n                    color: #92400e;\n                    opacity: 0.8;\n                    margin-bottom: 4px;\n                  }\n\n                  .file-too-large-message-text {\n                    font-size: 12px;\n                    color: #92400e;\n                    opacity: 0.9;\n                    line-height: 1.4;\n                  }\n                }\n              }\n\n              // Upload failed message\n              .upload-failed-message {\n                display: flex;\n                align-items: center;\n                gap: 12px;\n                padding: 16px;\n                background: #fef2f2;\n                border: 1px solid #fecaca;\n                border-radius: 8px;\n                margin-bottom: 8px;\n\n                .upload-failed-icon {\n                  font-size: 24px;\n                  opacity: 0.8;\n                }\n\n                .upload-failed-content {\n                  flex: 1;\n\n                  .upload-failed-title {\n                    font-weight: 600;\n                    font-size: 14px;\n                    color: #991b1b;\n                    margin-bottom: 4px;\n                  }\n\n                  .upload-failed-name {\n                    font-weight: 500;\n                    font-size: 13px;\n                    color: #7f1d1d;\n                    margin-bottom: 4px;\n                  }\n\n                  .upload-failed-message-text {\n                    font-size: 12px;\n                    color: #991b1b;\n                    opacity: 0.9;\n                    line-height: 1.4;\n                  }\n                }\n              }\n            }\n\n            // Message file\n            .message-file {\n              .file-info {\n                display: flex;\n                align-items: center;\n                gap: 12px;\n                padding: 12px;\n                background: rgba(0, 0, 0, 0.05);\n                border-radius: 8px;\n                margin-bottom: 8px;\n\n                .file-icon {\n                  font-size: 20px;\n                  opacity: 0.7;\n                }\n\n                .file-details {\n                  flex: 1;\n\n                  .file-name {\n                    font-weight: 500;\n                    font-size: 13px;\n                    margin-bottom: 2px;\n                  }\n\n                  .file-size {\n                    font-size: 11px;\n                    opacity: 0.7;\n                  }\n                }\n\n                .file-download {\n                  background: none;\n                  border: none;\n                  font-size: 18px;\n                  cursor: pointer;\n                  padding: 4px;\n                  border-radius: 4px;\n                  transition: background 0.2s ease;\n\n                  &:hover {\n                    background: rgba(0, 0, 0, 0.1);\n                  }\n                }\n              }\n\n              .file-caption {\n                margin: 8px 0 0 0;\n                font-size: 13px;\n                opacity: 0.8;\n              }\n            }\n\n            // Message voice\n            .message-voice {\n              .voice-player {\n                display: flex;\n                align-items: center;\n                gap: 12px;\n                padding: 12px;\n                background: rgba(0, 0, 0, 0.05);\n                border-radius: 8px;\n                margin-bottom: 8px;\n\n                .play-button {\n                  background: #3b82f6;\n                  color: white;\n                  border: none;\n                  border-radius: 50%;\n                  width: 32px;\n                  height: 32px;\n                  display: flex;\n                  align-items: center;\n                  justify-content: center;\n                  cursor: pointer;\n                  font-size: 14px;\n                  transition: all 0.2s ease;\n\n                  &:hover {\n                    background: #1d4ed8;\n                    transform: scale(1.05);\n                  }\n                }\n\n                .voice-waveform {\n                  display: flex;\n                  align-items: center;\n                  gap: 2px;\n                  flex: 1;\n                  height: 32px;\n\n                  .waveform-bar {\n                    background: #3b82f6;\n                    width: 3px;\n                    border-radius: 2px;\n                    min-height: 4px;\n                    transition: height 0.3s ease;\n                  }\n\n                  .voice-placeholder {\n                    display: flex;\n                    align-items: center;\n                    gap: 2px;\n                    width: 100%;\n\n                    .waveform-bar {\n                      background: rgba(0, 0, 0, 0.3);\n                      height: 20px;\n                      animation: voiceWave 2s ease-in-out infinite;\n                      \n                      &:nth-child(odd) {\n                        animation-delay: 0.1s;\n                      }\n                      \n                      &:nth-child(even) {\n                        animation-delay: 0.2s;\n                      }\n                    }\n                  }\n                }\n\n                .voice-duration {\n                  font-size: 12px;\n                  opacity: 0.7;\n                  font-weight: 500;\n                  flex-shrink: 0;\n                }\n              }\n\n              .voice-caption {\n                margin: 8px 0 0 0;\n                font-size: 13px;\n                opacity: 0.8;\n              }\n            }\n\n            // Message meta\n            .message-meta {\n              display: flex;\n              align-items: center;\n              gap: 8px;\n              margin-top: 4px;\n              font-size: 11px;\n              opacity: 0.7;\n\n              .message-time {\n                font-weight: 500;\n              }\n\n              .message-status {\n                font-size: 12px;\n              }\n            }\n\n            // Message reactions\n            .message-reactions {\n              display: flex;\n              gap: 4px;\n              margin-top: 8px;\n              flex-wrap: wrap;\n\n              .reaction-button {\n                background: rgba(0, 0, 0, 0.1);\n                border: none;\n                border-radius: 12px;\n                padding: 4px 8px;\n                font-size: 12px;\n                cursor: pointer;\n                transition: all 0.2s ease;\n                display: flex;\n                align-items: center;\n                gap: 4px;\n\n                &:hover {\n                  background: rgba(0, 0, 0, 0.15);\n                  transform: scale(1.05);\n                }\n\n                &.reacted {\n                  background: rgba(59, 130, 246, 0.2);\n                  color: #3b82f6;\n                }\n\n                .emoji {\n                  font-size: 14px;\n                }\n\n                .count {\n                  font-weight: 500;\n                  font-size: 11px;\n                }\n              }\n            }\n\n            .reaction-buttons {\n              position: absolute;\n              top: 50%;\n              right: -32px;\n              transform: translateY(-50%);\n              display: flex;\n              flex-direction: column;\n              gap: 2px;\n              opacity: 0;\n              transition: opacity 0.2s ease;\n              z-index: 10;\n              .reaction-option {\n                background: white;\n                border: 1px solid #e5e7eb;\n                border-radius: 50%;\n                width: 24px;\n                height: 24px;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                cursor: pointer;\n                font-size: 11px;\n                transition: all 0.2s ease;\n                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n                &:hover {\n                  transform: scale(1.1);\n                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n                }\n              }\n            }\n            &:hover .reaction-buttons {\n              opacity: 1;\n            }\n\n            // Delete message button\n            .delete-message-button {\n              position: absolute;\n              top: 50%;\n              transform: translateY(-50%);\n              background: white;\n              border: 1px solid #e5e7eb;\n              border-radius: 50%;\n              width: 20px;\n              height: 20px;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              cursor: pointer;\n              font-size: 10px;\n              transition: all 0.2s ease;\n              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n              opacity: 0;\n              z-index: 10;\n              color: #9ca3af;\n\n              &:hover {\n                transform: translateY(-50%) scale(1.1);\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n                color: #ef4444;\n                background: #fef2f2;\n                border-color: #fecaca;\n              }\n\n              &.sender-delete {\n                color: #ef4444;\n                &:hover {\n                  color: #dc2626;\n                  background: #fef2f2;\n                  border-color: #fecaca;\n                }\n              }\n            }\n\n            &:hover .delete-message-button {\n              opacity: 1;\n            }\n          }\n\n          &.received {\n            .message-content {\n              margin-right: 60px;\n              .reaction-buttons {\n                right: -32px;\n                left: auto;\n              }\n              .delete-message-button {\n                right: -60px;\n                left: auto;\n              }\n            }\n          }\n\n          &.sent {\n            .message-content {\n              margin-left: 60px;\n              .reaction-buttons {\n                right: auto;\n                left: -32px;\n              }\n              .delete-message-button {\n                right: auto;\n                left: -60px;\n              }\n            }\n          }\n\n          .message-content {\n            max-width: 70%;\n            padding: 12px 16px;\n            position: relative;\n            word-wrap: break-word;\n\n            // Message text\n            .message-text {\n              margin: 0;\n              line-height: 1.4;\n              font-size: 14px;\n            }\n\n            // Message image\n            .message-image {\n              .message-image-content {\n                max-width: 100%;\n                max-height: 300px;\n                border-radius: 8px;\n                cursor: pointer;\n                transition: transform 0.2s ease;\n\n                &:hover {\n                  transform: scale(1.02);\n                }\n              }\n\n              .image-caption {\n                margin: 8px 0 0 0;\n                font-size: 13px;\n                opacity: 0.8;\n              }\n            }\n\n            // Message file\n            .message-file {\n              .file-info {\n                display: flex;\n                align-items: center;\n                gap: 12px;\n                padding: 12px;\n                background: rgba(0, 0, 0, 0.05);\n                border-radius: 8px;\n                margin-bottom: 8px;\n\n                .file-icon {\n                  font-size: 20px;\n                  opacity: 0.7;\n                }\n\n                .file-details {\n                  flex: 1;\n\n                  .file-name {\n                    font-weight: 500;\n                    font-size: 13px;\n                    margin-bottom: 2px;\n                  }\n\n                  .file-size {\n                    font-size: 11px;\n                    opacity: 0.7;\n                  }\n                }\n\n                .file-download {\n                  background: none;\n                  border: none;\n                  font-size: 18px;\n                  cursor: pointer;\n                  padding: 4px;\n                  border-radius: 4px;\n                  transition: background 0.2s ease;\n\n                  &:hover {\n                    background: rgba(0, 0, 0, 0.1);\n                  }\n                }\n              }\n\n              .file-caption {\n                margin: 8px 0 0 0;\n                font-size: 13px;\n                opacity: 0.8;\n              }\n            }\n\n            // Message voice\n            .message-voice {\n              .voice-player {\n                display: flex;\n                align-items: center;\n                gap: 12px;\n                padding: 12px;\n                background: rgba(0, 0, 0, 0.05);\n                border-radius: 8px;\n                margin-bottom: 8px;\n\n                .play-button {\n                  background: #3b82f6;\n                  color: white;\n                  border: none;\n                  border-radius: 50%;\n                  width: 32px;\n                  height: 32px;\n                  display: flex;\n                  align-items: center;\n                  justify-content: center;\n                  cursor: pointer;\n                  font-size: 14px;\n                  transition: all 0.2s ease;\n\n                  &:hover {\n                    background: #1d4ed8;\n                    transform: scale(1.05);\n                  }\n                }\n\n                .voice-waveform {\n                  display: flex;\n                  align-items: center;\n                  gap: 2px;\n                  flex: 1;\n                  height: 32px;\n\n                  .waveform-bar {\n                    background: #3b82f6;\n                    width: 3px;\n                    border-radius: 2px;\n                    min-height: 4px;\n                    transition: height 0.3s ease;\n                  }\n\n                  .voice-placeholder {\n                    display: flex;\n                    align-items: center;\n                    gap: 2px;\n                    width: 100%;\n\n                    .waveform-bar {\n                      background: rgba(0, 0, 0, 0.3);\n                      height: 20px;\n                      animation: voiceWave 2s ease-in-out infinite;\n                      \n                      &:nth-child(odd) {\n                        animation-delay: 0.1s;\n                      }\n                      \n                      &:nth-child(even) {\n                        animation-delay: 0.2s;\n                      }\n                    }\n                  }\n                }\n\n                .voice-duration {\n                  font-size: 12px;\n                  opacity: 0.7;\n                  font-weight: 500;\n                  flex-shrink: 0;\n                }\n              }\n\n              .voice-caption {\n                margin: 8px 0 0 0;\n                font-size: 13px;\n                opacity: 0.8;\n              }\n            }\n\n            // Message meta\n            .message-meta {\n              display: flex;\n              align-items: center;\n              gap: 8px;\n              margin-top: 4px;\n              font-size: 11px;\n              opacity: 0.7;\n\n              .message-time {\n                font-weight: 500;\n              }\n\n              .message-status {\n                font-size: 12px;\n              }\n            }\n\n            // Message reactions\n            .message-reactions {\n              display: flex;\n              gap: 4px;\n              margin-top: 8px;\n              flex-wrap: wrap;\n\n              .reaction-button {\n                background: rgba(0, 0, 0, 0.1);\n                border: none;\n                border-radius: 12px;\n                padding: 4px 8px;\n                font-size: 12px;\n                cursor: pointer;\n                transition: all 0.2s ease;\n                display: flex;\n                align-items: center;\n                gap: 4px;\n\n                &:hover {\n                  background: rgba(0, 0, 0, 0.15);\n                  transform: scale(1.05);\n                }\n\n                &.reacted {\n                  background: rgba(59, 130, 246, 0.2);\n                  color: #3b82f6;\n                }\n\n                .emoji {\n                  font-size: 14px;\n                }\n\n                .count {\n                  font-weight: 500;\n                  font-size: 11px;\n                }\n              }\n            }\n          }\n\n          // Reaction buttons\n          .reaction-buttons {\n            position: absolute;\n            right: -35px;\n            top: 50%;\n            transform: translateY(-50%);\n            display: flex;\n            flex-direction: column;\n            gap: 2px;\n            opacity: 0;\n            transition: opacity 0.2s ease;\n            z-index: 10;\n\n            .reaction-option {\n              background: white;\n              border: 1px solid #e5e7eb;\n              border-radius: 50%;\n              width: 24px;\n              height: 24px;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              cursor: pointer;\n              font-size: 11px;\n              transition: all 0.2s ease;\n              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n\n              &:hover {\n                transform: scale(1.1);\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n              }\n            }\n          }\n\n          &:hover .reaction-buttons {\n            opacity: 1;\n          }\n        }\n\n        .typing-indicator-message {\n          display: flex;\n          align-items: center;\n          margin-bottom: 16px;\n\n          .typing-dots {\n            display: flex;\n            gap: 4px;\n            padding: 12px 16px;\n            background: white;\n            border-radius: 18px;\n            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n\n            span {\n              width: 8px;\n              height: 8px;\n              background: #9ca3af;\n              border-radius: 50%;\n              animation: typingBounce 1.4s infinite ease-in-out;\n\n              &:nth-child(1) { animation-delay: -0.32s; }\n              &:nth-child(2) { animation-delay: -0.16s; }\n            }\n          }\n        }\n      }\n\n      // Message Input\n      .message-input {\n        padding: 20px 24px;\n        border-top: 1px solid #e5e7eb;\n        background: white;\n        position: relative;\n\n        // Drag and drop overlay\n        &.drag-over {\n          .drag-overlay {\n            display: flex;\n          }\n        }\n\n        .drag-overlay {\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(59, 130, 246, 0.1);\n          border: 2px dashed #3b82f6;\n          border-radius: 12px;\n          display: none;\n          align-items: center;\n          justify-content: center;\n          z-index: 10;\n\n          .drag-message {\n            background: white;\n            padding: 16px 24px;\n            border-radius: 8px;\n            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n            font-weight: 500;\n            color: #3b82f6;\n          }\n        }\n\n        // Emoji picker\n        .emoji-picker {\n          position: absolute;\n          bottom: 100%;\n          left: 20px;\n          background: white;\n          border: 1px solid #e5e7eb;\n          border-radius: 12px;\n          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n          padding: 12px;\n          display: grid;\n          grid-template-columns: repeat(8, 1fr);\n          gap: 8px;\n          z-index: 20;\n          margin-bottom: 8px;\n\n          .emoji-button {\n            background: none;\n            border: none;\n            font-size: 20px;\n            padding: 8px;\n            border-radius: 6px;\n            cursor: pointer;\n            transition: all 0.2s ease;\n\n            &:hover {\n              background: #f3f4f6;\n              transform: scale(1.1);\n            }\n          }\n        }\n\n        // Input toolbar\n        .input-toolbar {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          margin-bottom: 12px;\n\n          .toolbar-button {\n            background: none;\n            border: none;\n            font-size: 18px;\n            padding: 8px;\n            border-radius: 8px;\n            cursor: pointer;\n            transition: all 0.2s ease;\n            color: #6b7280;\n\n            &:hover {\n              background: #f3f4f6;\n              color: #3b82f6;\n              transform: scale(1.05);\n            }\n\n            &.emoji-button {\n              font-size: 16px;\n            }\n\n            &.voice-button {\n              margin-left: 16px;\n              background: #3b82f6;\n              color: white;\n              border-radius: 50%;\n              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);\n              width: 40px;\n              height: 40px;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              position: relative;\n              font-size: 22px;\n              padding: 0;\n\n              &:hover {\n                background: #2563eb;\n                color: #fff;\n                box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);\n                transform: scale(1.08);\n              }\n\n              &.recording {\n                background: #ef4444;\n                color: white;\n                animation: pulse 1s infinite;\n                box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);\n              }\n\n              .voice-tooltip {\n                visibility: hidden;\n                opacity: 0;\n                background: #222;\n                color: #fff;\n                text-align: center;\n                border-radius: 6px;\n                padding: 4px 10px;\n                position: absolute;\n                z-index: 20;\n                bottom: 120%;\n                left: 50%;\n                transform: translateX(-50%);\n                font-size: 12px;\n                white-space: nowrap;\n                pointer-events: none;\n                transition: opacity 0.2s;\n              }\n\n              &:hover .voice-tooltip {\n                visibility: visible;\n                opacity: 1;\n              }\n            }\n          }\n        }\n\n        // Recording indicator\n        .recording-indicator {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 8px 12px;\n          background: #fef2f2;\n          border: 1px solid #fecaca;\n          border-radius: 8px;\n          margin-bottom: 8px;\n          animation: pulse 2s infinite;\n\n          .recording-dot {\n            width: 8px;\n            height: 8px;\n            background: #ef4444;\n            border-radius: 50%;\n            animation: blink 1s infinite;\n          }\n\n          span {\n            color: #dc2626;\n            font-size: 14px;\n            font-weight: 500;\n          }\n\n          .audio-level-meter {\n            flex: 1;\n            height: 8px;\n            background: #e5e7eb;\n            border-radius: 4px;\n            overflow: hidden;\n            min-width: 60px;\n\n            .audio-level-bar {\n              height: 100%;\n              background: linear-gradient(90deg, #10b981, #059669);\n              border-radius: 4px;\n              transition: width 0.1s ease;\n            }\n          }\n\n          .stop-recording {\n            background: #dc2626;\n            color: white;\n            border: none;\n            padding: 4px 12px;\n            border-radius: 4px;\n            font-size: 12px;\n            cursor: pointer;\n            transition: background 0.2s ease;\n\n            &:hover {\n              background: #b91c1c;\n            }\n          }\n        }\n\n        // Recording error\n        .recording-error {\n          display: flex;\n          align-items: flex-start;\n          gap: 8px;\n          padding: 12px;\n          background: #fef3cd;\n          border: 1px solid #fde68a;\n          border-radius: 8px;\n          margin-bottom: 8px;\n          animation: slideIn 0.3s ease;\n\n          .error-icon {\n            font-size: 16px;\n            flex-shrink: 0;\n          }\n\n          .error-message {\n            flex: 1;\n            font-size: 14px;\n            color: #92400e;\n            line-height: 1.4;\n          }\n\n          .error-close {\n            background: none;\n            border: none;\n            font-size: 18px;\n            color: #92400e;\n            cursor: pointer;\n            padding: 0;\n            width: 20px;\n            height: 20px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            border-radius: 50%;\n            transition: background-color 0.2s ease;\n\n            &:hover {\n              background: rgba(146, 64, 14, 0.1);\n            }\n          }\n        }\n\n        // Recorded audio review\n        .recorded-audio-review {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 12px;\n          background: #f0f9ff;\n          border: 1px solid #bae6fd;\n          border-radius: 8px;\n          margin-bottom: 8px;\n          animation: slideIn 0.3s ease;\n\n          .audio-info {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            flex: 1;\n\n            .audio-icon {\n              font-size: 20px;\n              color: #0369a1;\n            }\n\n            .audio-details {\n              .audio-name {\n                font-weight: 500;\n                color: #0c4a6e;\n                font-size: 14px;\n              }\n\n              .audio-size {\n                font-size: 12px;\n                color: #64748b;\n                margin-top: 2px;\n              }\n            }\n          }\n\n          .audio-actions {\n            display: flex;\n            gap: 8px;\n\n            .send-audio-btn,\n            .cancel-audio-btn {\n              padding: 6px 12px;\n              border: none;\n              border-radius: 6px;\n              font-size: 12px;\n              font-weight: 500;\n              cursor: pointer;\n              transition: all 0.2s ease;\n              display: flex;\n              align-items: center;\n              gap: 4px;\n            }\n\n            .send-audio-btn {\n              background: #10b981;\n              color: white;\n\n              &:hover {\n                background: #059669;\n                transform: translateY(-1px);\n              }\n            }\n\n            .cancel-audio-btn {\n              background: #ef4444;\n              color: white;\n\n              &:hover {\n                background: #dc2626;\n                transform: translateY(-1px);\n              }\n            }\n          }\n        }\n\n        // Input container\n        .input-container {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n\n          .message-input-field {\n            flex: 1;\n            padding: 12px 16px;\n            border: 1px solid #d1d5db;\n            border-radius: 12px;\n            font-size: 14px;\n            background: white;\n            color: #111827;\n            transition: all 0.2s ease;\n            resize: none;\n            min-height: 44px;\n            max-height: 120px;\n\n            &:focus {\n              outline: none;\n              border-color: #3b82f6;\n              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n            }\n\n            &:disabled {\n              background: #f9fafb;\n              color: #9ca3af;\n              cursor: not-allowed;\n            }\n\n            &::placeholder {\n              color: #9ca3af;\n            }\n          }\n\n          .send-button {\n            background: #3b82f6;\n            color: white;\n            border: none;\n            padding: 12px 20px;\n            border-radius: 12px;\n            font-size: 14px;\n            font-weight: 500;\n            cursor: pointer;\n            transition: all 0.2s ease;\n            min-width: 80px;\n\n            &:hover:not(:disabled) {\n              background: #2563eb;\n              transform: translateY(-1px);\n              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n            }\n\n            &:disabled {\n              background: #9ca3af;\n              cursor: not-allowed;\n              transform: none;\n              box-shadow: none;\n            }\n          }\n        }\n      }\n\n      .no-conversation {\n        flex: 1;\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        color: #9ca3af;\n        text-align: center;\n\n        .text-6xl {\n          font-size: 72px;\n          margin-bottom: 16px;\n        }\n\n        h3 {\n          font-size: 20px;\n          font-weight: 600;\n          color: #6b7280;\n          margin: 0 0 8px 0;\n        }\n\n        p {\n          font-size: 14px;\n          margin: 0;\n        }\n      }\n    }\n  }\n}\n\n// Animations\n@keyframes messageSlideIn {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes typingBounce {\n  0%, 80%, 100% {\n    transform: scale(0.8);\n    opacity: 0.5;\n  }\n  40% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n\n@keyframes blink {\n  0%, 50% {\n    opacity: 1;\n  }\n  51%, 100% {\n    opacity: 0.3;\n  }\n}\n\n@keyframes voiceWave {\n  0%, 100% {\n    height: 20px;\n  }\n  50% {\n    height: 40px;\n  }\n}\n\n// Responsive design\n@media (max-width: 768px) {\n  .chat-interface {\n    padding: 10px;\n    \n    .chat-container {\n      border-radius: 12px;\n      \n      .chat-sidebar {\n        width: 280px;\n      }\n    }\n  }\n}\n\n@media (max-width: 640px) {\n  .chat-interface {\n    .chat-container {\n      flex-direction: column;\n      \n      .chat-sidebar {\n        width: 100%;\n        height: 40%;\n        border-right: none;\n        border-bottom: 1px solid #e5e7eb;\n      }\n      \n      .chat-area {\n        height: 60%;\n      }\n    }\n  }\n}\n\n// User Profile Modal\n.profile-modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  animation: fadeIn 0.3s ease;\n\n  .profile-modal {\n    background: white;\n    border-radius: 16px;\n    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);\n    width: 90%;\n    max-width: 400px;\n    max-height: 80vh;\n    overflow: hidden;\n    animation: slideUp 0.3s ease;\n\n    .profile-header {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 20px 24px;\n      border-bottom: 1px solid #e5e7eb;\n      background: #f8fafc;\n\n      h3 {\n        font-size: 18px;\n        font-weight: 600;\n        color: #111827;\n        margin: 0;\n      }\n\n      .close-button {\n        background: none;\n        border: none;\n        font-size: 24px;\n        cursor: pointer;\n        padding: 4px;\n        border-radius: 4px;\n        color: #6b7280;\n        transition: all 0.2s ease;\n\n        &:hover {\n          background: #e5e7eb;\n          color: #111827;\n        }\n      }\n    }\n\n    .profile-content {\n      padding: 24px;\n\n      .profile-avatar-section {\n        text-align: center;\n        margin-bottom: 20px;\n\n        .profile-status {\n          margin-top: 8px;\n          font-size: 14px;\n          font-weight: 500;\n\n          .online-status {\n            color: #059669;\n          }\n\n          .offline-status {\n            color: #6b7280;\n          }\n        }\n      }\n\n      .profile-info {\n        text-align: center;\n        margin-bottom: 24px;\n\n        .profile-name {\n          font-size: 20px;\n          font-weight: 600;\n          color: #111827;\n          margin: 0 0 8px 0;\n        }\n\n        .profile-role {\n          font-size: 16px;\n          color: #3b82f6;\n          font-weight: 500;\n          margin: 0 0 4px 0;\n        }\n\n        .profile-location,\n        .profile-company {\n          font-size: 14px;\n          color: #6b7280;\n          margin: 0 0 2px 0;\n        }\n      }\n\n      .profile-actions {\n        display: flex;\n        flex-direction: column;\n        gap: 12px;\n\n        .start-chat-button,\n        .view-full-profile-button {\n          width: 100%;\n          padding: 12px 16px;\n          border: none;\n          border-radius: 8px;\n          font-size: 14px;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n\n        .start-chat-button {\n          background: #3b82f6;\n          color: white;\n\n          &:hover {\n            background: #2563eb;\n            transform: translateY(-1px);\n          }\n        }\n\n        .view-full-profile-button {\n          background: #f3f4f6;\n          color: #374151;\n\n          &:hover {\n            background: #e5e7eb;\n            transform: translateY(-1px);\n          }\n        }\n      }\n    }\n  }\n}\n\n// Animations\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n} "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

}]);
//# sourceMappingURL=336.chunk.js.map