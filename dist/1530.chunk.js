"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[1530],{

/***/ 676:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ imageErrorFallback)
/* harmony export */ });
// Utility for robust <img> error fallback
function imageErrorFallback(e, fallback = '/default-avatar.svg') {
    const target = e.target;
    if (!target.src.endsWith(fallback)) {
        target.src = fallback;
    }
}


/***/ }),

/***/ 1530:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ components_AddProject)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./node_modules/react-firebase-hooks/auth/dist/index.esm.js
var dist_index_esm = __webpack_require__(6354);
// EXTERNAL MODULE: ./node_modules/firebase/storage/dist/esm/index.esm.js + 1 modules
var esm_index_esm = __webpack_require__(2539);
// EXTERNAL MODULE: ./node_modules/react-image-crop/dist/ReactCrop.css
var ReactCrop = __webpack_require__(3972);
// EXTERNAL MODULE: ./node_modules/react-image-crop/dist/index.js
var react_image_crop_dist = __webpack_require__(2869);
;// ./src/components/getCroppedImg.ts
// getCroppedImg.ts
// Helper for react-image-crop to crop an image and return a Blob
const getCroppedImg = async (imageSrc, crop, imageElement) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('[getCroppedImg] Starting crop process');
            console.log('[getCroppedImg] Image source:', imageSrc);
            console.log('[getCroppedImg] Crop dimensions:', crop);
            console.log('[getCroppedImg] Using provided image element:', !!imageElement);
            const image = new Image();
            // Set up image loading
            image.onload = () => {
                try {
                    console.log('[getCroppedImg] Image loaded successfully');
                    console.log('[getCroppedImg] Image dimensions:', image.width, 'x', image.height);
                    console.log('[getCroppedImg] Natural image dimensions:', image.naturalWidth, 'x', image.naturalHeight);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        console.error('[getCroppedImg] No 2d context available');
                        return reject(new Error('No 2d context'));
                    }
                    // Set canvas dimensions to crop size
                    canvas.width = crop.width;
                    canvas.height = crop.height;
                    console.log('[getCroppedImg] Canvas created with dimensions:', canvas.width, 'x', canvas.height);
                    // Clear canvas and set background to white (in case of transparency issues)
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // If we have the actual image element from ReactCrop, use its natural dimensions
                    // Otherwise, use the loaded image's natural dimensions
                    const sourceImage = imageElement || image;
                    const naturalWidth = sourceImage.naturalWidth;
                    const naturalHeight = sourceImage.naturalHeight;
                    console.log('[getCroppedImg] Using natural dimensions:', naturalWidth, 'x', naturalHeight);
                    // ReactCrop provides coordinates relative to the displayed image
                    // We need to scale these coordinates to match the natural image dimensions
                    const displayedWidth = sourceImage.width;
                    const displayedHeight = sourceImage.height;
                    console.log('[getCroppedImg] Displayed dimensions:', displayedWidth, 'x', displayedHeight);
                    // Validate that we have valid dimensions
                    if (naturalWidth === 0 || naturalHeight === 0) {
                        console.error('[getCroppedImg] Invalid natural dimensions');
                        return reject(new Error('Image has invalid natural dimensions'));
                    }
                    if (displayedWidth === 0 || displayedHeight === 0) {
                        console.error('[getCroppedImg] Invalid displayed dimensions');
                        return reject(new Error('Image has invalid displayed dimensions'));
                    }
                    // Calculate scale factors
                    const scaleX = naturalWidth / displayedWidth;
                    const scaleY = naturalHeight / displayedHeight;
                    console.log('[getCroppedImg] Scale factors:', { scaleX, scaleY });
                    // Validate scale factors
                    if (scaleX <= 0 || scaleY <= 0) {
                        console.error('[getCroppedImg] Invalid scale factors');
                        return reject(new Error('Invalid scale factors calculated'));
                    }
                    // Scale the crop coordinates to match the natural image dimensions
                    const scaledCrop = {
                        x: Math.round(crop.x * scaleX),
                        y: Math.round(crop.y * scaleY),
                        width: Math.round(crop.width * scaleX),
                        height: Math.round(crop.height * scaleY)
                    };
                    console.log('[getCroppedImg] Scaled crop coordinates:', scaledCrop);
                    // Ensure crop coordinates are within bounds of the natural image
                    const safeX = Math.max(0, Math.min(scaledCrop.x, naturalWidth - scaledCrop.width));
                    const safeY = Math.max(0, Math.min(scaledCrop.y, naturalHeight - scaledCrop.height));
                    const safeWidth = Math.min(scaledCrop.width, naturalWidth - safeX);
                    const safeHeight = Math.min(scaledCrop.height, naturalHeight - safeY);
                    console.log('[getCroppedImg] Safe crop coordinates:', { x: safeX, y: safeY, width: safeWidth, height: safeHeight });
                    // Validate that we have valid crop dimensions
                    if (safeWidth <= 0 || safeHeight <= 0) {
                        console.error('[getCroppedImg] Invalid crop dimensions after bounds checking');
                        return reject(new Error('Invalid crop dimensions'));
                    }
                    // Draw the cropped portion of the image
                    ctx.drawImage(image, // Use the loaded image (which has the correct natural dimensions)
                    safeX, safeY, safeWidth, safeHeight, 0, 0, crop.width, crop.height);
                    console.log('[getCroppedImg] Image drawn to canvas');
                    // Verify the canvas has content by checking if it's not completely transparent
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const hasContent = imageData.data.some(pixel => pixel !== 0);
                    if (!hasContent) {
                        console.error('[getCroppedImg] Canvas appears to be empty after drawing');
                        // Try fallback approach: use original crop coordinates directly
                        console.log('[getCroppedImg] Trying fallback approach with original coordinates');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        // Use original crop coordinates without scaling
                        ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
                        // Check again
                        const fallbackImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const fallbackHasContent = fallbackImageData.data.some(pixel => pixel !== 0);
                        if (!fallbackHasContent) {
                            console.error('[getCroppedImg] Fallback approach also failed');
                            return reject(new Error('Cropped image appears to be empty even with fallback'));
                        }
                        console.log('[getCroppedImg] Fallback approach succeeded');
                    }
                    console.log('[getCroppedImg] Canvas has content, proceeding to blob conversion');
                    // Convert to blob
                    canvas.toBlob((blob) => {
                        if (blob) {
                            console.log('[getCroppedImg] Cropped image created successfully:', blob.size, 'bytes');
                            resolve(blob);
                        }
                        else {
                            console.error('[getCroppedImg] Canvas toBlob returned null');
                            reject(new Error('Failed to create blob from canvas'));
                        }
                    }, 'image/jpeg', 0.9);
                }
                catch (err) {
                    console.error('[getCroppedImg] Error in canvas drawing:', err);
                    reject(new Error('Failed to crop image: ' + (err instanceof Error ? err.message : String(err))));
                }
            };
            image.onerror = (err) => {
                console.error('[getCroppedImg] Error loading image for cropping:', err);
                reject(new Error('Failed to load image for cropping'));
            };
            // Set the image source AFTER setting up the event handlers
            image.src = imageSrc;
        }
        catch (err) {
            console.error('[getCroppedImg] Unexpected error in getCroppedImg:', err);
            reject(new Error('Unexpected error in getCroppedImg: ' + (err instanceof Error ? err.message : String(err))));
        }
    });
};
/* harmony default export */ const components_getCroppedImg = (getCroppedImg);

// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
;// ./src/components/ImageUploader.tsx








const ImageUploader = ({ onImageUploaded, onCropStart, onCropCancel, aspectRatio = 16 / 9, maxWidth = 800, maxHeight = 600, cropEnabled = true, placeholder = "Upload Image", projectName = "project" }) => {
    const [imageSrc, setImageSrc] = (0,react.useState)(null);
    const [previewUrl, setPreviewUrl] = (0,react.useState)(null);
    const [showCrop, setShowCrop] = (0,react.useState)(false);
    const [crop, setCrop] = (0,react.useState)({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
    const [zoom, setZoom] = (0,react.useState)(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = (0,react.useState)(null);
    const [cropping, setCropping] = (0,react.useState)(false);
    const [uploading, setUploading] = (0,react.useState)(false);
    const [uploadProgress, setUploadProgress] = (0,react.useState)(0);
    const [uploadSuccess, setUploadSuccess] = (0,react.useState)(false);
    const fileInputRef = (0,react.useRef)(null);
    const imageRef = (0,react.useRef)(null);
    // Track blob URLs with refs to avoid premature revocation
    const currentImageBlobRef = (0,react.useRef)(null);
    const currentPreviewBlobRef = (0,react.useRef)(null);
    // Track previous preview URL for safe revocation
    const previousPreviewUrlRef = (0,react.useRef)(null);
    // ESC key to cancel crop modal
    (0,react.useEffect)(() => {
        if (!showCrop)
            return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                handleCropCancel();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showCrop]);
    // Cleanup blob URLs when component unmounts
    (0,react.useEffect)(() => {
        return () => {
            if (currentImageBlobRef.current) {
                URL.revokeObjectURL(currentImageBlobRef.current);
            }
            if (currentPreviewBlobRef.current) {
                URL.revokeObjectURL(currentPreviewBlobRef.current);
            }
        };
    }, []);
    const revokeBlobUrl = (blobUrl) => {
        if (blobUrl && blobUrl.startsWith('blob:')) {
            URL.revokeObjectURL(blobUrl);
        }
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) {
            // Clean up existing blob URLs
            if (currentImageBlobRef.current) {
                revokeBlobUrl(currentImageBlobRef.current);
                currentImageBlobRef.current = null;
            }
            if (currentPreviewBlobRef.current) {
                revokeBlobUrl(currentPreviewBlobRef.current);
                currentPreviewBlobRef.current = null;
            }
            setImageSrc(null);
            setPreviewUrl(null);
            return;
        }
        // Validate file type
        if (!selectedFile.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        // Validate file size (5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        console.log('[ImageUploader] File selected:', selectedFile.name, selectedFile.size, 'bytes');
        // Clean up existing blob URLs before creating new ones
        if (currentImageBlobRef.current) {
            revokeBlobUrl(currentImageBlobRef.current);
        }
        if (currentPreviewBlobRef.current) {
            revokeBlobUrl(currentPreviewBlobRef.current);
        }
        const objectURL = URL.createObjectURL(selectedFile);
        currentImageBlobRef.current = objectURL;
        setImageSrc(objectURL);
        console.log('[ImageUploader] Created blob URL:', objectURL);
        if (cropEnabled) {
            setShowCrop(true);
        }
        else {
            // If cropping is disabled, upload immediately and pass download URL up
            // (Not implemented: legacy path expects crop)
        }
    };
    const onCropComplete = (0,react.useCallback)((crop, percentageCrop) => {
        console.log('[ImageUploader] Crop complete - pixels:', crop, 'percentage:', percentageCrop);
        console.log('[ImageUploader] Current zoom level:', zoom);
        console.log('[ImageUploader] Image ref dimensions:', imageRef.current?.width, 'x', imageRef.current?.height);
        console.log('[ImageUploader] Image natural dimensions:', imageRef.current?.naturalWidth, 'x', imageRef.current?.naturalHeight);
        if (crop.width > 0 && crop.height > 0) {
            console.log('[ImageUploader] Setting cropped area pixels:', crop);
            setCroppedAreaPixels(crop);
        }
        else {
            console.log('[ImageUploader] Crop area too small or invalid, not setting');
        }
    }, [zoom]);
    const handleCropSave = async () => {
        if (!imageSrc) {
            alert('No image selected.');
            return;
        }
        // Validate that the image is properly loaded
        if (!imageRef.current || !imageRef.current.complete) {
            alert('Image is still loading. Please wait a moment and try again.');
            return;
        }
        // Additional validation for image dimensions
        if (!imageRef.current.naturalWidth || !imageRef.current.naturalHeight) {
            alert('Image failed to load properly. Please try selecting the image again.');
            return;
        }
        // Validate crop selection
        if (croppedAreaPixels && (croppedAreaPixels.width <= 0 || croppedAreaPixels.height <= 0)) {
            alert('Invalid crop selection. Please select a valid area to crop.');
            return;
        }
        console.log('[ImageUploader] Starting crop save process...');
        console.log('[ImageUploader] Image source:', imageSrc);
        console.log('[ImageUploader] Crop pixels:', croppedAreaPixels);
        console.log('[ImageUploader] Current zoom level:', zoom);
        console.log('[ImageUploader] Image ref available:', !!imageRef.current);
        if (imageRef.current) {
            console.log('[ImageUploader] Image ref dimensions:', imageRef.current.width, 'x', imageRef.current.height);
            console.log('[ImageUploader] Image natural dimensions:', imageRef.current.naturalWidth, 'x', imageRef.current.naturalHeight);
            console.log('[ImageUploader] Image complete:', imageRef.current.complete);
            console.log('[ImageUploader] Image currentSrc:', imageRef.current.currentSrc);
        }
        // Only set cropping state if user actually selected a crop area
        const hasCropSelection = croppedAreaPixels && croppedAreaPixels.width > 0 && croppedAreaPixels.height > 0;
        if (hasCropSelection) {
            setCropping(true);
        }
        setUploading(false);
        setUploadProgress(0);
        setUploadSuccess(false);
        try {
            let croppedBlob;
            // If no crop area is selected, use the original file directly
            if (!hasCropSelection) {
                console.log('[ImageUploader] No crop selection, using original file');
                // Get the original file from the file input
                const fileInput = fileInputRef.current;
                if (fileInput && fileInput.files && fileInput.files[0]) {
                    croppedBlob = fileInput.files[0];
                    console.log('[ImageUploader] Using original file:', croppedBlob.size, 'bytes');
                }
                else {
                    // Fallback: convert blob URL back to blob
                    console.log('[ImageUploader] Converting blob URL to blob');
                    const response = await fetch(imageSrc);
                    croppedBlob = await response.blob();
                    console.log('[ImageUploader] Converted blob:', croppedBlob.size, 'bytes');
                }
            }
            else {
                // Only crop if user actually selected an area
                console.log('[ImageUploader] Cropping image with selection:', croppedAreaPixels);
                try {
                    croppedBlob = await components_getCroppedImg(imageSrc, croppedAreaPixels, imageRef.current);
                    console.log('[ImageUploader] Cropped blob created:', croppedBlob.size, 'bytes');
                    // Verify the blob has content
                    if (croppedBlob.size === 0) {
                        throw new Error('Cropped blob is empty');
                    }
                }
                catch (cropError) {
                    console.error('[ImageUploader] Cropping failed, using original file:', cropError);
                    // Fallback to original file if cropping fails
                    const fileInput = fileInputRef.current;
                    if (fileInput && fileInput.files && fileInput.files[0]) {
                        croppedBlob = fileInput.files[0];
                        console.log('[ImageUploader] Using original file as fallback:', croppedBlob.size, 'bytes');
                    }
                    else {
                        // Last resort: convert blob URL back to blob
                        console.log('[ImageUploader] Converting blob URL to blob as last resort');
                        const response = await fetch(imageSrc);
                        croppedBlob = await response.blob();
                        console.log('[ImageUploader] Converted blob as fallback:', croppedBlob.size, 'bytes');
                    }
                }
            }
            // Generate unique filename based on project name and timestamp
            const timestamp = Date.now();
            const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const fileName = `${sanitizedProjectName}-cover-${timestamp}.jpg`;
            const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });
            console.log('[ImageUploader] Created file:', fileName, croppedFile.size, 'bytes');
            // Create preview URL for the cropped image
            const previewURL = URL.createObjectURL(croppedBlob);
            currentPreviewBlobRef.current = previewURL;
            setPreviewUrl(previewURL);
            console.log('[ImageUploader] Created preview URL:', previewURL);
            // Upload to Firebase Storage
            setUploading(true);
            const storage = (0,esm_index_esm/* getStorage */.c7)(firebase/* app */.yA);
            const storagePath = `project-images/${fileName}`;
            const storageRef = (0,esm_index_esm/* ref */.KR)(storage, storagePath);
            const uploadTask = (0,esm_index_esm/* uploadBytesResumable */.bp)(storageRef, croppedFile);
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
                console.log('[ImageUploader] Upload progress:', progress.toFixed(1) + '%');
            }, (error) => {
                console.error('[ImageUploader] Upload error:', error);
                setUploading(false);
                setCropping(false);
                setShowCrop(false);
                alert('Image upload failed: ' + error.message);
            }, async () => {
                console.log('[ImageUploader] Upload completed successfully');
                setUploading(false);
                setUploadSuccess(true);
                try {
                    const url = await (0,esm_index_esm/* getDownloadURL */.qk)(storageRef);
                    console.log('[ImageUploader] Got download URL:', url);
                    onImageUploaded(url);
                }
                catch (err) {
                    console.error('[ImageUploader] Failed to get download URL:', err);
                    alert('Failed to get download URL.');
                }
                setShowCrop(false);
                setCropping(false);
                // Clean up the original imageSrc blob URL after successful upload
                if (currentImageBlobRef.current) {
                    revokeBlobUrl(currentImageBlobRef.current);
                    currentImageBlobRef.current = null;
                }
                setImageSrc(null);
            });
        }
        catch (err) {
            console.error('[ImageUploader] Error in crop save:', err);
            setCropping(false);
            setUploading(false);
            setShowCrop(false);
            alert('Failed to crop image. Please try again.');
        }
    };
    const handleCropCancel = () => {
        setShowCrop(false);
        // Clean up object URLs
        if (currentImageBlobRef.current) {
            revokeBlobUrl(currentImageBlobRef.current);
            currentImageBlobRef.current = null;
        }
        if (currentPreviewBlobRef.current) {
            revokeBlobUrl(currentPreviewBlobRef.current);
            currentPreviewBlobRef.current = null;
        }
        setImageSrc(null);
        setPreviewUrl(null);
        setCrop({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };
    // Removed uploadImage logic; parent handles upload after project creation
    const handleUploadClick = () => {
        if (onCropStart)
            onCropStart();
        fileInputRef.current?.click();
    };
    const handleCropCancelInternal = () => {
        if (typeof onCropCancel === 'function')
            onCropCancel();
        handleCropCancel();
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "image-uploader", children: [(0,jsx_runtime.jsx)("input", { type: "file", accept: "image/*", ref: fileInputRef, onChange: handleFileChange, style: { display: 'none' } }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: handleUploadClick, className: "btn-primary", children: placeholder }), previewUrl && !showCrop && ((0,jsx_runtime.jsx)("div", { className: "mt-4", children: (0,jsx_runtime.jsx)("img", { src: previewUrl, alt: "Preview", className: "max-w-full h-auto rounded shadow", style: { maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` }, onLoad: () => {
                        // Only revoke the previous blob URL after the new one is loaded
                        if (previousPreviewUrlRef.current && previousPreviewUrlRef.current !== previewUrl && previousPreviewUrlRef.current.startsWith('blob:')) {
                            URL.revokeObjectURL(previousPreviewUrlRef.current);
                        }
                        previousPreviewUrlRef.current = previewUrl;
                    }, onError: imageErrorFallback/* imageErrorFallback */.i }) })), showCrop && imageSrc && ((0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", onClick: e => e.stopPropagation(), onKeyDown: e => e.stopPropagation(), children: (0,jsx_runtime.jsxs)("div", { className: "bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto", onClick: e => e.stopPropagation(), onKeyDown: e => e.stopPropagation(), tabIndex: -1, children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold", children: "Crop Image" }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsx)("button", { onClick: handleCropCancelInternal, className: "px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600", disabled: cropping || uploading, children: "Cancel" }), (0,jsx_runtime.jsx)("button", { onClick: handleCropSave, className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50", disabled: cropping || uploading, children: cropping ? 'Cropping...' : uploading ? 'Uploading...' : uploadSuccess ? 'Uploaded!' : 'Save Crop' })] })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-4", children: [(0,jsx_runtime.jsxs)("label", { className: "block text-sm font-medium mb-2", children: ["Zoom: ", zoom.toFixed(2), "x"] }), (0,jsx_runtime.jsx)("input", { type: "range", min: "1", max: "3", step: "0.1", value: zoom, onChange: (e) => setZoom(Number(e.target.value)), className: "w-full" })] }), (0,jsx_runtime.jsx)("div", { className: "flex justify-center", children: (0,jsx_runtime.jsx)(react_image_crop_dist/* default */.Ay, { crop: crop, onChange: (c) => setCrop(c), onComplete: onCropComplete, aspect: undefined, minWidth: 50, minHeight: 50, keepSelection: true, children: (0,jsx_runtime.jsx)("img", { ref: imageRef, src: imageSrc, alt: "Crop", style: {
                                        maxWidth: '100%',
                                        height: 'auto',
                                        transform: `scale(${zoom})`,
                                        transformOrigin: 'center'
                                    }, className: "max-w-full h-auto", onLoad: () => {
                                        console.log('[ImageUploader] Crop image loaded');
                                        console.log('[ImageUploader] Image dimensions:', imageRef.current?.width, 'x', imageRef.current?.height);
                                        console.log('[ImageUploader] Natural dimensions:', imageRef.current?.naturalWidth, 'x', imageRef.current?.naturalHeight);
                                    }, onError: (e) => {
                                        console.error('[ImageUploader] Crop image failed to load:', e);
                                        (0,imageErrorFallback/* imageErrorFallback */.i)(e);
                                    } }) }) }), (uploading || uploadSuccess) && ((0,jsx_runtime.jsxs)("div", { className: "mt-4 flex flex-col items-center", children: [uploading && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700", children: (0,jsx_runtime.jsx)("div", { className: "bg-blue-600 h-2.5 rounded-full", style: { width: `${uploadProgress}%` } }) }), (0,jsx_runtime.jsxs)("span", { className: "text-xs text-gray-600 mt-2", children: ["Uploading: ", uploadProgress.toFixed(0), "%"] })] })), uploadSuccess && ((0,jsx_runtime.jsx)("span", { className: "text-green-600 font-semibold mt-2", children: "\u2713 Upload complete!" }))] }))] }) }))] }));
};
/* harmony default export */ const components_ImageUploader = (ImageUploader);

// EXTERNAL MODULE: ./node_modules/clsx/dist/clsx.mjs
var dist_clsx = __webpack_require__(4164);
;// ./src/components/ui/Form.tsx



const FormInput = (0,react.forwardRef)(({ label, error, helperText, leftIcon, rightIcon, variant = 'default', size = 'md', fullWidth = true, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const inputClasses = (0,dist_clsx/* default */.A)('form-input', 'transition-all duration-200', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2', {
        'w-full': fullWidth,
        'pl-10': leftIcon,
        'pr-10': rightIcon,
        'border-red-300 focus:border-red-500 focus:ring-red-500': error,
        'border-gray-300 focus:border-blue-500': !error,
        'bg-gray-50 border-gray-200': variant === 'filled',
        'bg-white border-gray-300': variant === 'default',
        'bg-transparent border-2 border-gray-300': variant === 'outline',
        'h-8 px-3 text-sm': size === 'sm',
        'h-10 px-4 text-base': size === 'md',
        'h-12 px-4 text-lg': size === 'lg',
    }, className);
    return ((0,jsx_runtime.jsxs)("div", { className: (0,dist_clsx/* default */.A)('space-y-1', { 'w-full': fullWidth }, 'relative z-10'), children: [label && ((0,jsx_runtime.jsxs)("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 mb-1", children: [label, props.required && (0,jsx_runtime.jsx)("span", { className: "text-red-500 ml-1", children: "*" })] })), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [leftIcon && ((0,jsx_runtime.jsx)("div", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", children: leftIcon })), (0,jsx_runtime.jsx)("input", { ref: ref, id: inputId, className: inputClasses, ...props }), rightIcon && ((0,jsx_runtime.jsx)("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400", children: rightIcon }))] }), (error || helperText) && ((0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-2", children: [error && ((0,jsx_runtime.jsxs)("p", { className: "text-sm text-red-600 flex items-center", children: [(0,jsx_runtime.jsx)("span", { className: "w-1 h-1 bg-red-600 rounded-full mr-2" }), error] })), helperText && !error && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: helperText }))] }))] }));
});
FormInput.displayName = 'FormInput';
const FormTextarea = (0,react.forwardRef)(({ label, error, helperText, variant = 'default', size = 'md', fullWidth = true, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const textareaClasses = (0,dist_clsx/* default */.A)('form-textarea', 'transition-all duration-200', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2', 'resize-vertical', {
        'w-full': fullWidth,
        'border-red-300 focus:border-red-500 focus:ring-red-500': error,
        'border-gray-300 focus:border-blue-500': !error,
        'bg-gray-50 border-gray-200': variant === 'filled',
        'bg-white border-gray-300': variant === 'default',
        'bg-transparent border-2 border-gray-300': variant === 'outline',
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-3 text-base': size === 'md',
        'px-4 py-4 text-lg': size === 'lg',
    }, className);
    return ((0,jsx_runtime.jsxs)("div", { className: (0,dist_clsx/* default */.A)('space-y-1', { 'w-full': fullWidth }), children: [label && ((0,jsx_runtime.jsx)("label", { htmlFor: textareaId, className: "block text-sm font-medium text-gray-700 mb-1", children: label })), (0,jsx_runtime.jsx)("textarea", { ref: ref, id: textareaId, rows: rows, className: textareaClasses, ...props }), (error || helperText) && ((0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-2", children: [error && ((0,jsx_runtime.jsxs)("p", { className: "text-sm text-red-600 flex items-center", children: [(0,jsx_runtime.jsx)("span", { className: "w-1 h-1 bg-red-600 rounded-full mr-2" }), error] })), helperText && !error && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: helperText }))] }))] }));
});
FormTextarea.displayName = 'FormTextarea';
const FormSelect = (0,react.forwardRef)(({ label, error, helperText, options, variant = 'default', size = 'md', fullWidth = true, className, id, onChange, placeholder, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const selectClasses = (0,dist_clsx/* default */.A)('form-select', 'transition-all duration-200', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2', 'cursor-pointer', {
        'w-full': fullWidth,
        'border-red-300 focus:border-red-500 focus:ring-red-500': error,
        'border-gray-300 focus:border-blue-500': !error,
        'bg-gray-50 border-gray-200': variant === 'filled',
        'bg-white border-gray-300': variant === 'default',
        'bg-transparent border-2 border-gray-300': variant === 'outline',
        'h-8 px-3 text-sm': size === 'sm',
        'h-10 px-4 text-base': size === 'md',
        'h-12 px-4 text-lg': size === 'lg',
    }, className);
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };
    return ((0,jsx_runtime.jsxs)("div", { className: (0,dist_clsx/* default */.A)('space-y-1', { 'w-full': fullWidth }), children: [label && ((0,jsx_runtime.jsx)("label", { htmlFor: selectId, className: "block text-sm font-medium text-gray-700 mb-1", children: label })), (0,jsx_runtime.jsx)("div", { className: "relative", children: (0,jsx_runtime.jsxs)("select", { ref: ref, id: selectId, className: "w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all !pr-3", style: {
                        paddingRight: '0.75rem !important',
                        backgroundImage: 'none !important'
                    }, onChange: handleChange, ...props, children: [placeholder && ((0,jsx_runtime.jsx)("option", { value: "", disabled: true, children: placeholder })), options.map((option) => ((0,jsx_runtime.jsx)("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)))] }) }), (error || helperText) && ((0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-2", children: [error && ((0,jsx_runtime.jsxs)("p", { className: "text-sm text-red-600 flex items-center", children: [(0,jsx_runtime.jsx)("span", { className: "w-1 h-1 bg-red-600 rounded-full mr-2" }), error] })), helperText && !error && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: helperText }))] }))] }));
});
FormSelect.displayName = 'FormSelect';
const FormCheckbox = (0,react.forwardRef)(({ label, error, helperText, size = 'md', className, id, onChange, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const checkboxClasses = (0,dist_clsx/* default */.A)('form-checkbox', 'rounded border-gray-300 text-blue-600', 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2', 'transition-all duration-200', {
        'border-red-300 focus:ring-red-500': error,
        'h-4 w-4': size === 'sm',
        'h-5 w-5': size === 'md',
        'h-6 w-6': size === 'lg',
    }, className);
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "space-y-1", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-3", children: [(0,jsx_runtime.jsx)("input", { ref: ref, type: "checkbox", id: checkboxId, className: checkboxClasses, onChange: handleChange, ...props }), label && ((0,jsx_runtime.jsx)("label", { htmlFor: checkboxId, className: "text-sm font-medium text-gray-700 cursor-pointer select-none", children: label }))] }), (error || helperText) && ((0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-2 ml-8", children: [error && ((0,jsx_runtime.jsxs)("p", { className: "text-sm text-red-600 flex items-center", children: [(0,jsx_runtime.jsx)("span", { className: "w-1 h-1 bg-red-600 rounded-full mr-2" }), error] })), helperText && !error && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: helperText }))] }))] }));
});
FormCheckbox.displayName = 'FormCheckbox';
const FormRadio = (0,react.forwardRef)(({ label, error, helperText, size = 'md', className, id, onChange, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const radioClasses = (0,dist_clsx/* default */.A)('form-radio', 'border-gray-300 text-blue-600', 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2', 'transition-all duration-200', {
        'border-red-300 focus:ring-red-500': error,
        'h-4 w-4': size === 'sm',
        'h-5 w-5': size === 'md',
        'h-6 w-6': size === 'lg',
    }, className);
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "space-y-1", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-3", children: [(0,jsx_runtime.jsx)("input", { ref: ref, type: "radio", id: radioId, className: radioClasses, onChange: handleChange, ...props }), label && ((0,jsx_runtime.jsx)("label", { htmlFor: radioId, className: "text-sm font-medium text-gray-700 cursor-pointer select-none", children: label }))] }), (error || helperText) && ((0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-2 ml-8", children: [error && ((0,jsx_runtime.jsxs)("p", { className: "text-sm text-red-600 flex items-center", children: [(0,jsx_runtime.jsx)("span", { className: "w-1 h-1 bg-red-600 rounded-full mr-2" }), error] })), helperText && !error && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: helperText }))] }))] }));
});
FormRadio.displayName = 'FormRadio';
const FormFieldGroup = ({ children, title, description, className }) => {
    return ((0,jsx_runtime.jsxs)("div", { className: (0,dist_clsx/* default */.A)('space-y-4', className), children: [(title || description) && ((0,jsx_runtime.jsxs)("div", { className: "space-y-1", children: [title && ((0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: title })), description && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: description }))] })), (0,jsx_runtime.jsx)("div", { className: "space-y-4", children: children })] }));
};
const Form = ({ children, onSubmit, className, ...props }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };
    return (_jsx("form", { onSubmit: handleSubmit, className: clsx('space-y-6', className), ...props, children: children }));
};
// Export all components


;// ./src/components/ProjectForm.tsx



const ProjectForm = (props) => {
    const statusOptions = [
        { value: "Development", label: "Development" },
        { value: "Pre-Production", label: "Pre-Production" },
        { value: "Filming", label: "Filming" },
        { value: "Post-Production", label: "Post-Production" },
        { value: "Completed", label: "Completed" },
        { value: "Canceled", label: "Canceled" }
    ];
    return ((0,jsx_runtime.jsxs)("div", { className: "space-y-8", children: [(0,jsx_runtime.jsx)(FormFieldGroup, { title: "General Information", description: "Basic project details and company information", children: (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0,jsx_runtime.jsx)(FormInput, { label: "Project Name", value: props.projectName, onChange: (e) => props.setProjectName(e.target.value), placeholder: "Enter project name", required: true }), (0,jsx_runtime.jsx)(FormInput, { label: "Production Company", value: props.productionCompany, onChange: (e) => props.setProductionCompany(e.target.value), placeholder: "Enter production company", required: true }), (0,jsx_runtime.jsx)(FormSelect, { label: "Status", value: props.status, onChange: props.setStatus, options: statusOptions, placeholder: "Select project status", required: true })] }) }), (0,jsx_runtime.jsx)(FormFieldGroup, { title: "Creative Information", description: "Story details and creative team", children: (0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsx)(FormTextarea, { label: "Logline", value: props.logline, onChange: (e) => props.setLogline(e.target.value), placeholder: "Brief one-sentence summary of the project", rows: 3, helperText: "A concise summary that captures the essence of your project" }), (0,jsx_runtime.jsx)(FormTextarea, { label: "Synopsis", value: props.synopsis, onChange: (e) => props.setSynopsis(e.target.value), placeholder: "Detailed project description", rows: 6, helperText: "A comprehensive overview of your project's story and vision" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0,jsx_runtime.jsx)(FormInput, { label: "Genre", value: props.genre, onChange: (e) => props.setGenre(e.target.value), placeholder: "e.g., Drama, Comedy, Action" }), (0,jsx_runtime.jsx)(FormInput, { label: "Director", value: props.director, onChange: (e) => props.setDirector(e.target.value), placeholder: "Director's name" }), (0,jsx_runtime.jsx)(FormInput, { label: "Producer", value: props.producer, onChange: (e) => props.setProducer(e.target.value), placeholder: "Producer's name" })] })] }) }), (0,jsx_runtime.jsx)(FormFieldGroup, { title: "Schedule", description: "Project timeline and important dates", children: (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0,jsx_runtime.jsx)(FormInput, { label: "Start Date", type: "date", value: props.startDate, onChange: (e) => props.setStartDate(e.target.value), helperText: "When production is scheduled to begin" }), (0,jsx_runtime.jsx)(FormInput, { label: "End Date", type: "date", value: props.endDate, onChange: (e) => props.setEndDate(e.target.value), helperText: "Expected completion date" })] }) }), (0,jsx_runtime.jsx)(FormFieldGroup, { title: "Media & Assets", description: "Visual content and project materials", children: (0,jsx_runtime.jsx)("div", { className: "space-y-4", children: (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cover Image" }), (0,jsx_runtime.jsx)(components_ImageUploader, { onImageUploaded: props.setCoverImageUrl, onCropStart: props.onImageCropStart, onCropCancel: props.onImageCropCancel, projectName: props.projectName }), props.coverImageUrl && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-green-600 mt-2", children: "\u2713 Cover image uploaded successfully" }))] }) }) }), (0,jsx_runtime.jsx)(FormFieldGroup, { title: "Contact & Additional Information", description: "Project website and contact details", children: (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0,jsx_runtime.jsx)(FormInput, { label: "Project Website", value: props.projectWebsite, onChange: (e) => props.setProjectWebsite(e.target.value), placeholder: "https://project-website.com", helperText: "Official project website or social media" }), (0,jsx_runtime.jsx)(FormInput, { label: "Production Budget", value: props.productionBudget, onChange: (e) => props.setProductionBudget(e.target.value), placeholder: "e.g., $1M - $5M", helperText: "Budget range or estimated cost" }), (0,jsx_runtime.jsx)(FormInput, { label: "Company Contact", value: props.productionCompanyContact, onChange: (e) => props.setProductionCompanyContact(e.target.value), placeholder: "contact@company.com", helperText: "Primary contact email for inquiries" })] }) })] }));
};
/* harmony default export */ const components_ProjectForm = (ProjectForm);

;// ./src/components/AddProject.tsx







const COUNTRIES = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium',
    'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Ireland', 'Portugal', 'Greece',
    'Poland', 'Czech Republic', 'Hungary', 'Slovakia', 'Slovenia', 'Croatia', 'Serbia', 'Bulgaria', 'Romania', 'Ukraine',
    'Russia', 'Belarus', 'Latvia', 'Lithuania', 'Estonia', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan',
    'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia', 'China', 'Japan', 'South Korea', 'North Korea',
    'Taiwan', 'Hong Kong', 'Macau', 'Vietnam', 'Laos', 'Cambodia', 'Thailand', 'Myanmar', 'Malaysia', 'Singapore',
    'Indonesia', 'Philippines', 'Brunei', 'East Timor', 'Papua New Guinea', 'Fiji', 'New Zealand', 'India', 'Pakistan',
    'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives', 'Afghanistan', 'Iran', 'Iraq', 'Syria', 'Lebanon',
    'Jordan', 'Israel', 'Palestine', 'Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Qatar', 'Bahrain',
    'Kuwait', 'Egypt', 'Sudan', 'South Sudan', 'Ethiopia', 'Eritrea', 'Djibouti', 'Somalia', 'Kenya', 'Uganda',
    'Tanzania', 'Rwanda', 'Burundi', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Gabon', 'Equatorial Guinea',
    'Cameroon', 'Central African Republic', 'Chad', 'Niger', 'Nigeria', 'Benin', 'Togo', 'Ghana', 'Ivory Coast',
    'Liberia', 'Sierra Leone', 'Guinea', 'Guinea-Bissau', 'Senegal', 'The Gambia', 'Mauritania', 'Mali', 'Burkina Faso', 'Algeria',
    'Tunisia', 'Libya', 'Morocco', 'Western Sahara', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'South Africa',
    'Lesotho', 'Eswatini', 'Mozambique', 'Madagascar', 'Comoros', 'Mauritius', 'Seychelles', 'Mexico',
    'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Colombia', 'Venezuela',
    'Guyana', 'Suriname', 'French Guiana', 'Brazil', 'Ecuador', 'Peru', 'Bolivia', 'Paraguay', 'Uruguay', 'Argentina',
    'Chile', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Bahamas', 'Trinidad and Tobago',
    'Barbados', 'Grenada', 'Saint Vincent and the Grenadines', 'Saint Lucia', 'Dominica', 'Antigua and Barbuda',
    'Saint Kitts and Nevis', 'Cape Verde', 'São Tomé and Príncipe'
];
const CITIES = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
    'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
    'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania'],
    'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'],
    'Belgium': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'],
    'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Toluca', 'León', 'Juárez', 'Torreón', 'Querétaro'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
    'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Tucumán', 'Salta', 'Santa Fe', 'San Juan', 'Santiago del Estero']
};
const AddProject = () => {
    const [projectName, setProjectName] = (0,react.useState)('');
    const [productionLocations, setProductionLocations] = (0,react.useState)([]);
    const [selectedCountry, setSelectedCountry] = (0,react.useState)('');
    const [cityInput, setCityInput] = (0,react.useState)('');
    const [productionCompany, setProductionCompany] = (0,react.useState)('');
    const [status, setStatus] = (0,react.useState)('Pre-Production');
    const [logline, setLogline] = (0,react.useState)('');
    const [synopsis, setSynopsis] = (0,react.useState)('');
    const [startDate, setStartDate] = (0,react.useState)('');
    const [endDate, setEndDate] = (0,react.useState)('');
    const [genre, setGenre] = (0,react.useState)('');
    const [director, setDirector] = (0,react.useState)('');
    const [producer, setProducer] = (0,react.useState)('');
    const [coverImageUrl, setCoverImageUrl] = (0,react.useState)('');
    const [imageUploading, setImageUploading] = (0,react.useState)(false);
    const [isCropping, setIsCropping] = (0,react.useState)(false);
    const [projectWebsite, setProjectWebsite] = (0,react.useState)('');
    const [productionBudget, setProductionBudget] = (0,react.useState)('');
    const [productionCompanyContact, setProductionCompanyContact] = (0,react.useState)('');
    const [imageUploadComplete, setImageUploadComplete] = (0,react.useState)(false);
    const navigate = (0,dist/* useNavigate */.Zp)();
    const [user, loading, error] = (0,dist_index_esm/* useAuthState */.hD)(firebase/* auth */.j2);
    const addLocation = () => {
        if (selectedCountry && !productionLocations.find(loc => loc.country === selectedCountry)) {
            setProductionLocations([...productionLocations, { country: selectedCountry, city: cityInput || undefined }]);
            setSelectedCountry('');
            setCityInput('');
        }
    };
    const removeLocation = (country) => {
        setProductionLocations(productionLocations.filter(loc => loc.country !== country));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (isCropping || imageUploading) {
            e.preventDefault();
            return; // Prevent submission during image operations
        }
        try {
            const legacyProjectId = projectName.trim().replace(/\s+/g, '_');
            const projectRef = (0,index_esm.doc)(firebase.db, 'Projects', legacyProjectId);
            await (0,index_esm/* setDoc */.BN)(projectRef, {
                projectName,
                productionLocations,
                productionCompany,
                status,
                logline,
                synopsis,
                startDate,
                endDate,
                genre,
                director,
                producer,
                projectWebsite,
                productionBudget,
                productionCompanyContact,
                owner_uid: user.uid,
                createdAt: (0,index_esm/* serverTimestamp */.O5)(),
            });
            if (coverImageUrl) {
                await (0,index_esm/* updateDoc */.mZ)(projectRef, { coverImageUrl });
            }
            setIsCropping(false);
            navigate('/projects');
        }
        catch {
            setImageUploading(false);
            setIsCropping(false);
        }
    };
    if (loading)
        return (0,jsx_runtime.jsx)("p", { children: "Loading..." });
    if (error)
        return (0,jsx_runtime.jsxs)("p", { children: ["Error: ", error.message] });
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0,jsx_runtime.jsx)("div", { className: "section-gradient border-b border-gray-100" }), (0,jsx_runtime.jsx)("div", { className: "section-light", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding", children: (0,jsx_runtime.jsx)("div", { className: "card-base max-w-4xl mx-auto", children: (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-8", children: [(0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2", children: "Production Locations" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,jsx_runtime.jsxs)("div", { className: "md:col-span-2", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Country" }), (0,jsx_runtime.jsxs)("select", { value: selectedCountry, onChange: (e) => {
                                                                setSelectedCountry(e.target.value);
                                                                setCityInput(''); // Clear city when country changes
                                                            }, className: "w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select a country..." }), COUNTRIES.map(country => ((0,jsx_runtime.jsx)("option", { value: country, children: country }, country)))] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "City (Optional)" }), selectedCountry && CITIES[selectedCountry] ? ((0,jsx_runtime.jsxs)("select", { value: cityInput, onChange: (e) => setCityInput(e.target.value), className: "w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select a city..." }), CITIES[selectedCountry].map(city => ((0,jsx_runtime.jsx)("option", { value: city, children: city }, city)))] })) : ((0,jsx_runtime.jsx)("input", { type: "text", value: cityInput, onChange: (e) => setCityInput(e.target.value), placeholder: "Enter city", className: "w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" }))] })] }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: addLocation, disabled: !selectedCountry, className: "btn-secondary disabled:opacity-50 disabled:cursor-not-allowed", children: "Add Location" }), productionLocations.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Selected Locations:" }), (0,jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: productionLocations.map((location, index) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm", children: [(0,jsx_runtime.jsxs)("span", { children: [location.country, location.city && `, ${location.city}`] }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => removeLocation(location.country), className: "text-blue-600 hover:text-blue-800 font-bold", children: "\u00D7" })] }, index))) })] }))] }), (0,jsx_runtime.jsx)(components_ProjectForm, { projectName: projectName, setProjectName: setProjectName, productionCompany: productionCompany, setProductionCompany: setProductionCompany, status: status, setStatus: setStatus, logline: logline, setLogline: setLogline, synopsis: synopsis, setSynopsis: setSynopsis, startDate: startDate, setStartDate: setStartDate, endDate: endDate, setEndDate: setEndDate, genre: genre, setGenre: setGenre, director: director, setDirector: setDirector, producer: producer, setProducer: setProducer, coverImageUrl: coverImageUrl, setCoverImageUrl: (url) => {
                                        setCoverImageUrl(url);
                                        setImageUploadComplete(true);
                                        setIsCropping(false);
                                        // Add a small delay to prevent any race conditions
                                        setTimeout(() => setImageUploadComplete(false), 100);
                                    }, projectWebsite: projectWebsite, setProjectWebsite: setProjectWebsite, productionBudget: productionBudget, setProductionBudget: setProductionBudget, productionCompanyContact: productionCompanyContact, setProductionCompanyContact: setProductionCompanyContact, onImageCropStart: () => setIsCropping(true), onImageCropCancel: () => {
                                        setIsCropping(false);
                                        setImageUploadComplete(false);
                                    } }), (0,jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200", children: [(0,jsx_runtime.jsx)("button", { type: "button", onClick: () => navigate('/'), className: "btn-secondary", children: "Cancel" }), (0,jsx_runtime.jsx)("button", { type: "submit", className: "btn-primary", disabled: isCropping || imageUploading || imageUploadComplete, title: isCropping ? 'Please finish cropping the image' : imageUploading ? 'Please wait for image upload to complete' : imageUploadComplete ? 'Please wait...' : '', children: isCropping ? 'Cropping Image...' : imageUploading ? 'Uploading Image...' : imageUploadComplete ? 'Processing...' : 'Add Project' })] }), (imageUploading || isCropping) && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 mt-4 text-blue-600", children: [(0,jsx_runtime.jsxs)("svg", { className: "animate-spin h-5 w-5 text-blue-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0,jsx_runtime.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0,jsx_runtime.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" })] }), (0,jsx_runtime.jsx)("span", { children: imageUploading ? 'Uploading image, please wait...' : 'Cropping image, please wait...' })] }))] }) }) }) })] }));
};
/* harmony default export */ const components_AddProject = (AddProject);


/***/ })

}]);
//# sourceMappingURL=1530.chunk.js.map