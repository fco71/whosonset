import React, { useRef, useState, useCallback } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from '../firebase';
import './ImageUploader.scss';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  aspectRatio?: number; // Optional aspect ratio for cropping
  maxWidth?: number;
  maxHeight?: number;
  cropEnabled?: boolean;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  aspectRatio,
  maxWidth = 800,
  maxHeight = 600,
  cropEnabled = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [objectURLToRevoke, setObjectURLToRevoke] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

    // Clean up previous object URL
    if (objectURLToRevoke) {
      URL.revokeObjectURL(objectURLToRevoke);
    }

    // Safely create object URL
    try {
      const objectURL = URL.createObjectURL(selectedFile);
      setImageSrc(objectURL);
      setObjectURLToRevoke(objectURL);
      
      if (cropEnabled) {
        setShowCrop(true);
        // Initialize crop area when image loads
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // Set canvas size
              const maxCanvasSize = 600;
              const scale = Math.min(maxCanvasSize / img.width, maxCanvasSize / img.height);
              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
              
              // Draw image
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              // Initialize crop area
              const cropSize = Math.min(canvas.width, canvas.height) * 0.8;
              setCropArea({
                x: (canvas.width - cropSize) / 2,
                y: (canvas.height - cropSize) / 2,
                width: cropSize,
                height: cropSize
              });
            }
          }
        };
        img.src = objectURL;
      }
    } catch (err) {
      console.error('Failed to create preview URL:', err);
      setImageSrc(null);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropEnabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is within crop area
    if (x >= cropArea.x && x <= cropArea.x + cropArea.width &&
        y >= cropArea.y && y <= cropArea.y + cropArea.height) {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
      e.preventDefault();
    }
  }, [cropArea, cropEnabled]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !cropEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newX = Math.max(0, Math.min(canvas.width - cropArea.width, x - dragStart.x));
    const newY = Math.max(0, Math.min(canvas.height - cropArea.height, y - dragStart.y));

    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    e.preventDefault();
  }, [isDragging, cropArea, dragStart, cropEnabled]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.preventDefault();
    }
  }, [isDragging]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleCropResize = useCallback((direction: string, delta: number) => {
    if (!cropEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const newCropArea = { ...cropArea };
    const minSize = 50;

    switch (direction) {
      case 'nw':
        newCropArea.x = Math.max(0, newCropArea.x + delta);
        newCropArea.y = Math.max(0, newCropArea.y + delta);
        newCropArea.width = Math.max(minSize, newCropArea.width - delta);
        newCropArea.height = Math.max(minSize, newCropArea.height - delta);
        break;
      case 'ne':
        newCropArea.y = Math.max(0, newCropArea.y + delta);
        newCropArea.width = Math.max(minSize, newCropArea.width + delta);
        newCropArea.height = Math.max(minSize, newCropArea.height - delta);
        break;
      case 'sw':
        newCropArea.x = Math.max(0, newCropArea.x + delta);
        newCropArea.width = Math.max(minSize, newCropArea.width - delta);
        newCropArea.height = Math.max(minSize, newCropArea.height + delta);
        break;
      case 'se':
        newCropArea.width = Math.max(minSize, newCropArea.width + delta);
        newCropArea.height = Math.max(minSize, newCropArea.height + delta);
        break;
    }

    // Ensure crop area stays within canvas bounds
    newCropArea.x = Math.min(newCropArea.x, canvas.width - newCropArea.width);
    newCropArea.y = Math.min(newCropArea.y, canvas.height - newCropArea.height);

    setCropArea(newCropArea);
  }, [cropArea, cropEnabled]);

  const applyCrop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;

    croppedCanvas.width = cropArea.width;
    croppedCanvas.height = cropArea.height;

    // Draw the cropped portion
    croppedCtx.drawImage(
      canvas,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, cropArea.width, cropArea.height
    );

    // Convert to blob and upload
    croppedCanvas.toBlob(async (blob) => {
      if (!blob) return;

      const croppedFile = new File([blob], file.name, { type: file.type });
      await uploadImage(croppedFile);
      setShowCrop(false);
    }, file.type);
  }, [cropArea, file]);

  const uploadImage = async (imageFile: File) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `project-images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setUploading(true);

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
    // Safe to revoke after image loaded
    if (objectURLToRevoke) {
      URL.revokeObjectURL(objectURLToRevoke);
      setObjectURLToRevoke(null);
    }
  };

  const cancelCrop = () => {
    setShowCrop(false);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="file-input"
      />

      {showCrop && imageSrc ? (
        <div className="crop-container">
          <h4>Crop Image</h4>
          <div className="crop-canvas-wrapper">
            <canvas
              ref={canvasRef}
              className="crop-canvas"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
            {cropArea.width > 0 && (
              <div
                className="crop-overlay"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height
                }}
              >
                <div className="crop-handle nw" onMouseDown={() => handleCropResize('nw', -10)} />
                <div className="crop-handle ne" onMouseDown={() => handleCropResize('ne', 10)} />
                <div className="crop-handle sw" onMouseDown={() => handleCropResize('sw', -10)} />
                <div className="crop-handle se" onMouseDown={() => handleCropResize('se', 10)} />
              </div>
            )}
          </div>
          <div className="crop-actions">
            <button onClick={applyCrop} className="crop-btn apply">
              Apply Crop
            </button>
            <button onClick={cancelCrop} className="crop-btn cancel">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-preview">
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p>Uploading... {uploadProgress}%</p>
            </div>
          ) : imageName ? (
            <>
              <p className="selected-file">Selected: {imageName}</p>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="Preview"
                  className="image-preview"
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    console.warn('Preview failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </>
          ) : (
            <p className="no-image">No image selected</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
