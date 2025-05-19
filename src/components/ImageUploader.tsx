import React, { useRef, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [objectURLToRevoke, setObjectURLToRevoke] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      setImageSrc(null);
      setImageName(null);
      return;
    }

    setFile(selectedFile);
    setImageName(selectedFile.name);

    // Clean up old object URL
    if (objectURLToRevoke) {
      URL.revokeObjectURL(objectURLToRevoke);
    }

    // Create preview URL
    const objectURL = URL.createObjectURL(selectedFile);
    setImageSrc(objectURL);
    setObjectURLToRevoke(objectURL);

    // Upload to Firebase
    const storage = getStorage(app);
    const storageRef = ref(storage, `project-images/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onImageUploaded(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  const handleImageLoad = () => {
    // Safe to revoke after image has loaded
    if (objectURLToRevoke) {
      URL.revokeObjectURL(objectURLToRevoke);
      setObjectURLToRevoke(null);
    }
  };

  return (
    <div className="border border-gray-600 rounded-md p-4 bg-gray-800">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-white"
      />

      <div className="mt-2">
        {uploading ? (
          <p className="text-sm text-blue-300">Uploading... {uploadProgress}%</p>
        ) : imageName ? (
          <>
            <p className="text-sm text-white font-medium">Selected: {imageName}</p>
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Image Preview"
                className="mt-2 max-w-full h-auto rounded-md shadow"
                onLoad={handleImageLoad}
                onError={(e) => {
                  console.warn('Preview failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </>
        ) : (
          <p className="text-sm text-gray-200 italic">No image selected</p>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
