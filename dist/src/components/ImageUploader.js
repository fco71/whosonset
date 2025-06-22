import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from 'firebase/storage';
import { app } from '../firebase';
const ImageUploader = ({ onImageUploaded }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [imageName, setImageName] = useState(null);
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [objectURLToRevoke, setObjectURLToRevoke] = useState(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
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
            const objectURL = URL.createObjectURL(selectedFile);
            setImageSrc(objectURL);
            setObjectURLToRevoke(objectURL);
        }
        catch (err) {
            console.error('Failed to create preview URL:', err);
            setImageSrc(null);
        }
        // Upload to Firebase
        const storage = getStorage(app);
        const storageRef = ref(storage, `project-images/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        setUploading(true);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
        }, (error) => {
            console.error('Upload error:', error);
            setUploading(false);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                onImageUploaded(downloadURL);
                setUploading(false);
            });
        });
    };
    const handleImageLoad = () => {
        // Safe to revoke after image loaded
        if (objectURLToRevoke) {
            URL.revokeObjectURL(objectURLToRevoke);
            setObjectURLToRevoke(null);
        }
    };
    return (_jsxs("div", { className: "border border-gray-600 rounded-md p-4 bg-gray-800", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, ref: fileInputRef, className: "block w-full text-sm text-white" }), _jsx("div", { className: "mt-2", children: uploading ? (_jsxs("p", { className: "text-sm text-blue-300", children: ["Uploading... ", uploadProgress, "%"] })) : imageName ? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-sm text-white font-medium", children: ["Selected: ", imageName] }), imageSrc && (_jsx("img", { src: imageSrc, alt: "Preview", className: "mt-2 max-w-full h-auto rounded-md shadow", onLoad: handleImageLoad, onError: (e) => {
                                console.warn('Preview failed to load:', e);
                                e.currentTarget.style.display = 'none';
                            } }))] })) : (_jsx("p", { className: "text-sm text-gray-300 italic", children: "No image selected" })) })] }));
};
export default ImageUploader;
