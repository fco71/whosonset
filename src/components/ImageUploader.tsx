import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from '../firebase';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from './getCroppedImg';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  cropEnabled?: boolean;
  placeholder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  aspectRatio = 16 / 9,
  maxWidth = 800,
  maxHeight = 600,
  cropEnabled = true,
  placeholder = "Upload Image"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropping, setCropping] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ESC key to cancel crop modal
  useEffect(() => {
    if (!showCrop) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCropCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showCrop]);

  // Cleanup blob URLs when component unmounts or when URLs change
  useEffect(() => {
    return () => {
      // Clean up imageSrc blob URL
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
      // Clean up previewUrl blob URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageSrc, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      // Clean up existing blob URLs
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
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

    // Clean up existing blob URLs before creating new ones
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectURL = URL.createObjectURL(selectedFile);
    setImageSrc(objectURL);
    
    if (cropEnabled) {
      setShowCrop(true);
    } else {
      // If cropping is disabled, upload directly
      uploadImage(selectedFile);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    setCropping(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: croppedBlob.type });
      
      // Create preview URL for the cropped image
      const previewURL = URL.createObjectURL(croppedBlob);
      setPreviewUrl(previewURL);
      
      await uploadImage(croppedFile);
      setShowCrop(false);
      
      // Clean up the original imageSrc blob URL after successful upload
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
      setImageSrc(null);
    } catch (err) {
      console.error('Crop failed:', err);
      alert('Failed to crop image. Please try again.');
    } finally {
      setCropping(false);
    }
  };

  const handleCropCancel = () => {
    setShowCrop(false);
    
    // Clean up object URLs
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setImageSrc(null);
    setPreviewUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const uploadImage = async (imageFile: File) => {
    const storage = getStorage(app);
    const timestamp = Date.now();
    const fileName = `image-${timestamp}-${Math.random().toString(36).substring(2)}.jpg`;
    const storageRef = ref(storage, `uploads/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setUploading(true);
    setUploadProgress(0);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        setUploading(false);
        setUploadProgress(null);
        alert('Upload failed. Please try again.');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onImageUploaded(downloadURL);
          setUploading(false);
          setUploadProgress(null);
        });
      }
    );
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={handleUploadClick}
        disabled={uploading}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : placeholder}
      </button>

      {/* Upload progress */}
      {uploading && uploadProgress !== null && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Image preview */}
      {previewUrl && !showCrop && (
        <div className="mt-4">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="rounded-lg shadow-md max-h-48 w-auto object-cover"
          />
        </div>
      )}

      {/* Cropper Modal */}
      {showCrop && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="heading-card text-center">
                Crop Image
              </h3>
              <p className="body-medium text-center text-gray-600 mt-2">
                Adjust the crop area and zoom to get the perfect image
              </p>
            </div>

            {/* Cropper Container */}
            <div className="relative flex-1 min-h-[240px] max-h-[45vh] bg-gray-100 overflow-auto flex items-center justify-center">
              <div className="w-full h-full max-w-full max-h-full">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="rect"
                  showGrid={true}
                  style={{
                    containerStyle: {
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f3f4f6',
                      maxHeight: '45vh',
                    }
                  }}
                />
              </div>
            </div>

            {/* Controls pinned to bottom */}
            <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0">
              {/* Zoom Control */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom: {Math.round(zoom * 100)}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleCropSave}
                  disabled={cropping}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cropping ? 'Saving...' : 'Save Crop'}
                </button>
                <button
                  type="button"
                  onClick={handleCropCancel}
                  disabled={cropping}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
