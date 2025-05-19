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
  const [file, setFile] = useState<File | null>(null); // the raw file
  const [imageSrc, setImageSrc] = useState<string | null>(null); // object URL to show in <img>

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

    // Create an object URL for the image preview
    const objectURL = URL.createObjectURL(selectedFile);
    setImageSrc(objectURL);


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
          // Clean up the object URL after upload is complete (optional but good practice)
          URL.revokeObjectURL(objectURL);
        });
      }
    );
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
              <img src={imageSrc} alt="Image Preview" className="mt-2 max-w-full h-auto" />
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