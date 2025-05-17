import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface ImageUploaderProps {
    onImageUploaded: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Check file size (limit to 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setUploadError("File size must be less than 2MB");
            return;
        }

        setUploadError(null); // Clear any previous errors
        setIsUploading(true);
        setPreview(URL.createObjectURL(file)); // Create a local preview

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `images/${uuidv4()}-${file.name}`); // Unique file name

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Upload error", error);
                    setUploadError("Error uploading file. Please try again.");
                    setIsUploading(false);
                    setUploadProgress(0);
                    setPreview(null); // Clear preview on error
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        onImageUploaded(downloadURL);
                        setIsUploading(false);
                        setUploadProgress(0);
                    });
                }
            );
        } catch (error: any) {
            console.error("Error during upload", error);
            setUploadError("Unexpected error occurred. Please try again.");
            setIsUploading(false);
            setUploadProgress(0);
            setPreview(null); // Clear preview on error
        }
    }, [onImageUploaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 1 // Only allow one file
    });

    return (
        <div>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>

            {uploadError && <p className="error-message">{uploadError}</p>}

            {isUploading && (
                <div>
                    <progress value={uploadProgress} max="100">{uploadProgress}%</progress>
                    <p>Uploading: {uploadProgress.toFixed(2)}%</p>
                </div>
            )}

            {preview && <img src={preview} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
        </div>
    );
};

export default ImageUploader;