import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from 'firebase/storage';
import { app } from '../firebase';
var ImageUploader = function (_a) {
    var onImageUploaded = _a.onImageUploaded;
    var fileInputRef = useRef(null);
    var _b = useState(false), uploading = _b[0], setUploading = _b[1];
    var _c = useState(null), uploadProgress = _c[0], setUploadProgress = _c[1];
    var _d = useState(null), imageName = _d[0], setImageName = _d[1];
    var _e = useState(null), file = _e[0], setFile = _e[1];
    var _f = useState(null), imageSrc = _f[0], setImageSrc = _f[1];
    var _g = useState(null), objectURLToRevoke = _g[0], setObjectURLToRevoke = _g[1];
    var handleFileChange = function (e) {
        var _a;
        var selectedFile = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!selectedFile) {
            setFile(null);
            setImageSrc(null);
            setImageName(null);
            return;
        }
        setFile(selectedFile);
        setImageName(selectedFile.name);
        // Clean up previous object URL
        if (objectURLToRevoke) {
            URL.revokeObjectURL(objectURLToRevoke);
        }
        // Safely create object URL
        try {
            var objectURL = URL.createObjectURL(selectedFile);
            setImageSrc(objectURL);
            setObjectURLToRevoke(objectURL);
        }
        catch (err) {
            console.error('Failed to create preview URL:', err);
            setImageSrc(null);
        }
        // Upload to Firebase
        var storage = getStorage(app);
        var storageRef = ref(storage, "project-images/".concat(selectedFile.name));
        var uploadTask = uploadBytesResumable(storageRef, selectedFile);
        setUploading(true);
        uploadTask.on('state_changed', function (snapshot) {
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
        }, function (error) {
            console.error('Upload error:', error);
            setUploading(false);
        }, function () {
            getDownloadURL(uploadTask.snapshot.ref).then(function (downloadURL) {
                onImageUploaded(downloadURL);
                setUploading(false);
            });
        });
    };
    var handleImageLoad = function () {
        // Safe to revoke after image loaded
        if (objectURLToRevoke) {
            URL.revokeObjectURL(objectURLToRevoke);
            setObjectURLToRevoke(null);
        }
    };
    return (_jsxs("div", { className: "border border-gray-600 rounded-md p-4 bg-gray-800", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, ref: fileInputRef, className: "block w-full text-sm text-white" }), _jsx("div", { className: "mt-2", children: uploading ? (_jsxs("p", { className: "text-sm text-blue-300", children: ["Uploading... ", uploadProgress, "%"] })) : imageName ? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-sm text-white font-medium", children: ["Selected: ", imageName] }), imageSrc && (_jsx("img", { src: imageSrc, alt: "Preview", className: "mt-2 max-w-full h-auto rounded-md shadow", onLoad: handleImageLoad, onError: function (e) {
                                console.warn('Preview failed to load:', e);
                                e.currentTarget.style.display = 'none';
                            } }))] })) : (_jsx("p", { className: "text-sm text-gray-300 italic", children: "No image selected" })) })] }));
};
export default ImageUploader;
