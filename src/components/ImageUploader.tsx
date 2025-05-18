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

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File size must be less than 2MB");
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${uuidv4()}-${file.name}`);
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
          setPreview(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            onImageUploaded(downloadURL);
            setIsUploading(false);
            setUploadProgress(0);
          });
        }
      );
    } catch (error: any) {
      console.error("Unexpected upload error", error);
      setUploadError("Unexpected error occurred. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
      setPreview(null);
    }
  }, [onImageUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
        `}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop the image here..."
            : "Click or drag an image here to upload (max 2MB)"}
        </p>
      </div>

      {uploadError && (
        <p className="text-red-600 text-sm mt-2">{uploadError}</p>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-700">Uploading: {uploadProgress.toFixed(2)}%</p>
        </div>
      )}

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-xs mx-auto rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
