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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storage = getStorage(app);
    const storageRef = ref(storage, `project-images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setImageName(file.name);

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

  return (
    <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-gray-700"
      />

      <div className="mt-2">
        {uploading ? (
          <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
        ) : imageName ? (
          <p className="text-sm text-gray-700">Selected: {imageName}</p>
        ) : (
          <p className="text-sm text-gray-700 mt-2">No image selected</p>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
