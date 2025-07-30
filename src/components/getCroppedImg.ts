// getCroppedImg.ts
// Helper for react-image-crop to crop an image and return a Blob

import { PixelCrop } from 'react-image-crop';

const getCroppedImg = async (imageSrc: string, crop: PixelCrop): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const image = new window.Image();
      // Remove crossOrigin to prevent black images
      // image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = crop.width;
          canvas.height = crop.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('No 2d context'));
          
          // Ensure we're drawing with proper dimensions
          ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
          );
          
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('Cropped image created successfully:', blob.size, 'bytes');
              resolve(blob);
            } else {
              reject(new Error('Canvas is empty'));
            }
          }, 'image/jpeg', 0.9); // Add quality parameter
        } catch (err) {
          console.error('Error in canvas drawing:', err);
          reject(new Error('Failed to crop image: ' + (err instanceof Error ? err.message : String(err))));
        }
      };
      image.onerror = (err) => {
        console.error('Error loading image for cropping:', err);
        reject(new Error('Failed to load image for cropping: ' + (err instanceof Error ? err.message : String(err))));
      };
    } catch (err) {
      console.error('Unexpected error in getCroppedImg:', err);
      reject(new Error('Unexpected error in getCroppedImg: ' + (err instanceof Error ? err.message : String(err))));
    }
  });
};

export default getCroppedImg; 