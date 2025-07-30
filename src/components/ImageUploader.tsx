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
import { imageErrorFallback } from '../utilities/imageErrorFallback';

interface ImageUploaderProps {
  // Called with the download URL after upload
  onImageUploaded: (url: string) => void;
  onCropStart?: () => void;
  onCropCancel?: () => void;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  cropEnabled?: boolean;
  placeholder?: string;
  projectName?: string; // For generating unique file names
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  onCropStart,
  onCropCancel,
  aspectRatio = 16 / 9,
  maxWidth = 800,
  maxHeight = 600,
  cropEnabled = true,
  placeholder = "Upload Image",
  projectName = "project"
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState<Crop>({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [cropping, setCropping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
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
    } else {
      // If cropping is disabled, upload immediately and pass download URL up
      // (Not implemented: legacy path expects crop)
    }
  };

  const onCropComplete = useCallback((crop: PixelCrop, percentageCrop: Crop) => {
    console.log('[ImageUploader] Crop complete - pixels:', crop, 'percentage:', percentageCrop);
    if (crop.width > 0 && crop.height > 0) {
      console.log('[ImageUploader] Setting cropped area pixels:', crop);
      setCroppedAreaPixels(crop);
    } else {
      console.log('[ImageUploader] Crop area too small or invalid, not setting');
    }
  }, []);

  const handleCropSave = async () => {
    if (!imageSrc) {
      alert('No image selected.');
      return;
    }
    
    console.log('[ImageUploader] Starting crop save process...');
    console.log('[ImageUploader] Image source:', imageSrc);
    console.log('[ImageUploader] Crop pixels:', croppedAreaPixels);
    
    // Only set cropping state if user actually selected a crop area
    const hasCropSelection = croppedAreaPixels && croppedAreaPixels.width > 0 && croppedAreaPixels.height > 0;
    
    if (hasCropSelection) {
      setCropping(true);
    }
    setUploading(false);
    setUploadProgress(0);
    setUploadSuccess(false);
    
    try {
      let croppedBlob: Blob;
      
      // If no crop area is selected, use the original file directly
      if (!hasCropSelection) {
        console.log('[ImageUploader] No crop selection, using original file');
        // Get the original file from the file input
        const fileInput = fileInputRef.current;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          croppedBlob = fileInput.files[0];
          console.log('[ImageUploader] Using original file:', croppedBlob.size, 'bytes');
        } else {
          // Fallback: convert blob URL back to blob
          console.log('[ImageUploader] Converting blob URL to blob');
          const response = await fetch(imageSrc);
          croppedBlob = await response.blob();
          console.log('[ImageUploader] Converted blob:', croppedBlob.size, 'bytes');
        }
      } else {
        // Only crop if user actually selected an area
        console.log('[ImageUploader] Cropping image with selection:', croppedAreaPixels);
        try {
          croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
          console.log('[ImageUploader] Cropped blob created:', croppedBlob.size, 'bytes');
        } catch (cropError) {
          console.error('[ImageUploader] Cropping failed, using original file:', cropError);
          // Fallback to original file if cropping fails
          const fileInput = fileInputRef.current;
          if (fileInput && fileInput.files && fileInput.files[0]) {
            croppedBlob = fileInput.files[0];
            console.log('[ImageUploader] Using original file as fallback:', croppedBlob.size, 'bytes');
          } else {
            throw cropError;
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
      const storage = getStorage(app);
      const storagePath = `project-images/${fileName}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, croppedFile);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('[ImageUploader] Upload progress:', progress.toFixed(1) + '%');
        },
        (error) => {
          console.error('[ImageUploader] Upload error:', error);
          setUploading(false);
          setCropping(false);
          setShowCrop(false);
          alert('Image upload failed: ' + error.message);
        },
        async () => {
          console.log('[ImageUploader] Upload completed successfully');
          setUploading(false);
          setUploadSuccess(true);
          try {
            const url = await getDownloadURL(storageRef);
            console.log('[ImageUploader] Got download URL:', url);
            onImageUploaded(url);
          } catch (err) {
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
        }
      );
    } catch (err) {
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
    if (onCropStart) onCropStart();
    fileInputRef.current?.click();
  };

  const handleCropCancelInternal = () => {
    if (typeof onCropCancel === 'function') onCropCancel();
    handleCropCancel();
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
        className="btn-primary"
      >
        {placeholder}
      </button>

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
            onError={imageErrorFallback}
          />
        </div>
      )}

      {/* Crop modal */}
      {showCrop && imageSrc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={e => e.stopPropagation()} // Prevent overlay click from bubbling
          onKeyDown={e => e.stopPropagation()} // Prevent ESC from bubbling
        >
          <div
            className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()} // Prevent modal content click from bubbling
            onKeyDown={e => e.stopPropagation()} // Prevent ESC from bubbling
            tabIndex={-1}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCropCancelInternal}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={cropping || uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={cropping || uploading}
                >
                  {cropping ? 'Cropping...' : uploading ? 'Uploading...' : uploadSuccess ? 'Uploaded!' : 'Save Crop'}
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
                aspect={undefined}
                minWidth={50}
                minHeight={50}
                keepSelection
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
            {(uploading || uploadSuccess) && (
              <div className="mt-4 flex flex-col items-center">
                {uploading && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">Uploading: {uploadProgress.toFixed(0)}%</span>
                  </>
                )}
                {uploadSuccess && (
                  <span className="text-green-600 font-semibold mt-2">✓ Upload complete!</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
