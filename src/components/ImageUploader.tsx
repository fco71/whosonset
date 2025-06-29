import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from '../firebase';
import { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop from 'react-image-crop';
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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState<Crop>({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [cropping, setCropping] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Track blob URLs with refs to avoid premature revocation
  const currentImageBlobRef = useRef<string | null>(null);
  const currentPreviewBlobRef = useRef<string | null>(null);

  // Track previous preview URL for safe revocation
  const previousPreviewUrlRef = useRef<string | null>(null);

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

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (currentImageBlobRef.current) {
        URL.revokeObjectURL(currentImageBlobRef.current);
      }
      if (currentPreviewBlobRef.current) {
        URL.revokeObjectURL(currentPreviewBlobRef.current);
      }
    };
  }, []);

  const revokeBlobUrl = (blobUrl: string | null) => {
    if (blobUrl && blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (cropEnabled) {
      setShowCrop(true);
    } else {
      // If cropping is disabled, upload directly
      uploadImage(selectedFile);
    }
  };

  const onCropComplete = useCallback((crop: PixelCrop, percentageCrop: Crop) => {
    setCroppedAreaPixels(crop);
  }, []);

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    setCropping(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: croppedBlob.type });
      
      // Create preview URL for the cropped image
      const previewURL = URL.createObjectURL(croppedBlob);
      currentPreviewBlobRef.current = previewURL;
      setPreviewUrl(previewURL);
      
      await uploadImage(croppedFile);
      setShowCrop(false);
      
      // Clean up the original imageSrc blob URL after successful upload
      if (currentImageBlobRef.current) {
        revokeBlobUrl(currentImageBlobRef.current);
        currentImageBlobRef.current = null;
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
          
          // Clean up blob URLs after successful upload
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
            className="max-w-full h-auto rounded shadow"
            style={{ maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` }}
            onLoad={() => {
              // Only revoke the previous blob URL after the new one is loaded
              if (previousPreviewUrlRef.current && previousPreviewUrlRef.current !== previewUrl && previousPreviewUrlRef.current.startsWith('blob:')) {
                URL.revokeObjectURL(previousPreviewUrlRef.current);
              }
              previousPreviewUrlRef.current = previewUrl;
            }}
          />
        </div>
      )}

      {/* Crop modal */}
      {showCrop && imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCropCancel}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={cropping}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={cropping}
                >
                  {cropping ? 'Saving...' : 'Save Crop'}
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Zoom: {zoom.toFixed(2)}x</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={onCropComplete}
                aspect={aspectRatio}
                minWidth={100}
                minHeight={100}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop"
                  style={{ transform: `scale(${zoom})` }}
                  className="max-w-full h-auto"
                />
              </ReactCrop>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
