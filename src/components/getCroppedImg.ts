// getCroppedImg.ts
// Helper for react-image-crop to crop an image and return a Blob

import { PixelCrop } from 'react-image-crop';

const getCroppedImg = async (imageSrc: string, crop: PixelCrop): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      console.log('[getCroppedImg] Starting crop process');
      console.log('[getCroppedImg] Image source:', imageSrc);
      console.log('[getCroppedImg] Crop dimensions:', crop);
      
      const image = new window.Image();
      // Remove crossOrigin to prevent black images
      // image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      
      image.onload = () => {
        try {
          console.log('[getCroppedImg] Image loaded, dimensions:', image.width, 'x', image.height);
          
          const canvas = document.createElement('canvas');
          canvas.width = crop.width;
          canvas.height = crop.height;
          
          console.log('[getCroppedImg] Canvas created with dimensions:', canvas.width, 'x', canvas.height);
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('[getCroppedImg] No 2d context available');
            return reject(new Error('No 2d context'));
          }
          
          // Clear the canvas first
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set composite operation to ensure proper drawing
          ctx.globalCompositeOperation = 'source-over';
          
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
          
          console.log('[getCroppedImg] Image drawn to canvas');
          
          // Verify canvas has content
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const hasContent = imageData.data.some(pixel => pixel !== 0);
          
          if (!hasContent) {
            console.error('[getCroppedImg] Canvas appears to be empty (all pixels are 0)');
            return reject(new Error('Canvas is empty - no image content detected'));
          }
          
          console.log('[getCroppedImg] Canvas has content, creating blob...');
          
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('[getCroppedImg] Cropped image created successfully:', blob.size, 'bytes');
              resolve(blob);
            } else {
              console.error('[getCroppedImg] Canvas is empty');
              reject(new Error('Canvas is empty'));
            }
          }, 'image/jpeg', 0.9); // Add quality parameter
        } catch (err) {
          console.error('[getCroppedImg] Error in canvas drawing:', err);
          reject(new Error('Failed to crop image: ' + (err instanceof Error ? err.message : String(err))));
        }
      };
      
      image.onerror = (err) => {
        console.error('[getCroppedImg] Error loading image for cropping:', err);
        reject(new Error('Failed to load image for cropping: ' + (err instanceof Error ? err.message : String(err))));
      };
    } catch (err) {
      console.error('[getCroppedImg] Unexpected error in getCroppedImg:', err);
      reject(new Error('Unexpected error in getCroppedImg: ' + (err instanceof Error ? err.message : String(err))));
    }
  });
};

export default getCroppedImg; 