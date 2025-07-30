// getCroppedImg.ts
// Helper for react-image-crop to crop an image and return a Blob

import { PixelCrop } from 'react-image-crop';

const getCroppedImg = async (imageSrc: string, crop: PixelCrop): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      console.log('[getCroppedImg] Starting crop process');
      console.log('[getCroppedImg] Image source:', imageSrc);
      console.log('[getCroppedImg] Crop dimensions:', crop);
      
      const image = new Image();
      
      // Set up image loading
      image.onload = () => {
        try {
          console.log('[getCroppedImg] Image loaded successfully');
          console.log('[getCroppedImg] Original image dimensions:', image.width, 'x', image.height);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            console.error('[getCroppedImg] No 2d context available');
            return reject(new Error('No 2d context'));
          }
          
          // Set canvas dimensions to crop size
          canvas.width = crop.width;
          canvas.height = crop.height;
          
          console.log('[getCroppedImg] Canvas created with dimensions:', canvas.width, 'x', canvas.height);
          
          // Clear canvas and set background to white (in case of transparency issues)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the cropped portion of the image
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
          
          console.log('[getCroppedImg] Image drawn to canvas');
          
          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('[getCroppedImg] Cropped image created successfully:', blob.size, 'bytes');
              resolve(blob);
            } else {
              console.error('[getCroppedImg] Canvas toBlob returned null');
              reject(new Error('Failed to create blob from canvas'));
            }
          }, 'image/jpeg', 0.9);
          
        } catch (err) {
          console.error('[getCroppedImg] Error in canvas drawing:', err);
          reject(new Error('Failed to crop image: ' + (err instanceof Error ? err.message : String(err))));
        }
      };
      
      image.onerror = (err) => {
        console.error('[getCroppedImg] Error loading image for cropping:', err);
        reject(new Error('Failed to load image for cropping'));
      };
      
      // Set the image source AFTER setting up the event handlers
      image.src = imageSrc;
      
    } catch (err) {
      console.error('[getCroppedImg] Unexpected error in getCroppedImg:', err);
      reject(new Error('Unexpected error in getCroppedImg: ' + (err instanceof Error ? err.message : String(err))));
    }
  });
};

export default getCroppedImg; 