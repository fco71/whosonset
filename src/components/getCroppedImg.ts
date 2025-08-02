// getCroppedImg.ts
// Helper for react-image-crop to crop an image and return a Blob

import { PixelCrop } from 'react-image-crop';

const getCroppedImg = async (imageSrc: string, crop: PixelCrop, imageElement?: HTMLImageElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      console.log('[getCroppedImg] Starting crop process');
      console.log('[getCroppedImg] Image source:', imageSrc);
      console.log('[getCroppedImg] Crop dimensions:', crop);
      console.log('[getCroppedImg] Using provided image element:', !!imageElement);
      
      const image = new Image();
      
      // Set up image loading
      image.onload = () => {
        try {
          console.log('[getCroppedImg] Image loaded successfully');
          console.log('[getCroppedImg] Image dimensions:', image.width, 'x', image.height);
          console.log('[getCroppedImg] Natural image dimensions:', image.naturalWidth, 'x', image.naturalHeight);
          
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
          
          // If we have the actual image element from ReactCrop, use its natural dimensions
          // Otherwise, use the loaded image's natural dimensions
          const sourceImage = imageElement || image;
          const naturalWidth = sourceImage.naturalWidth;
          const naturalHeight = sourceImage.naturalHeight;
          
          console.log('[getCroppedImg] Using natural dimensions:', naturalWidth, 'x', naturalHeight);
          
          // ReactCrop provides coordinates relative to the displayed image
          // We need to scale these coordinates to match the natural image dimensions
          const displayedWidth = sourceImage.width;
          const displayedHeight = sourceImage.height;
          
          console.log('[getCroppedImg] Displayed dimensions:', displayedWidth, 'x', displayedHeight);
          
          // Validate that we have valid dimensions
          if (naturalWidth === 0 || naturalHeight === 0) {
            console.error('[getCroppedImg] Invalid natural dimensions');
            return reject(new Error('Image has invalid natural dimensions'));
          }
          
          if (displayedWidth === 0 || displayedHeight === 0) {
            console.error('[getCroppedImg] Invalid displayed dimensions');
            return reject(new Error('Image has invalid displayed dimensions'));
          }
          
          // Calculate scale factors
          const scaleX = naturalWidth / displayedWidth;
          const scaleY = naturalHeight / displayedHeight;
          
          console.log('[getCroppedImg] Scale factors:', { scaleX, scaleY });
          
          // Validate scale factors
          if (scaleX <= 0 || scaleY <= 0) {
            console.error('[getCroppedImg] Invalid scale factors');
            return reject(new Error('Invalid scale factors calculated'));
          }
          
          // Scale the crop coordinates to match the natural image dimensions
          const scaledCrop = {
            x: Math.round(crop.x * scaleX),
            y: Math.round(crop.y * scaleY),
            width: Math.round(crop.width * scaleX),
            height: Math.round(crop.height * scaleY)
          };
          
          console.log('[getCroppedImg] Scaled crop coordinates:', scaledCrop);
          
          // Ensure crop coordinates are within bounds of the natural image
          const safeX = Math.max(0, Math.min(scaledCrop.x, naturalWidth - scaledCrop.width));
          const safeY = Math.max(0, Math.min(scaledCrop.y, naturalHeight - scaledCrop.height));
          const safeWidth = Math.min(scaledCrop.width, naturalWidth - safeX);
          const safeHeight = Math.min(scaledCrop.height, naturalHeight - safeY);
          
          console.log('[getCroppedImg] Safe crop coordinates:', { x: safeX, y: safeY, width: safeWidth, height: safeHeight });
          
          // Validate that we have valid crop dimensions
          if (safeWidth <= 0 || safeHeight <= 0) {
            console.error('[getCroppedImg] Invalid crop dimensions after bounds checking');
            return reject(new Error('Invalid crop dimensions'));
          }
          
          // Draw the cropped portion of the image
          ctx.drawImage(
            image, // Use the loaded image (which has the correct natural dimensions)
            safeX,
            safeY,
            safeWidth,
            safeHeight,
            0,
            0,
            crop.width,
            crop.height
          );
          
          console.log('[getCroppedImg] Image drawn to canvas');
          
          // Verify the canvas has content by checking if it's not completely transparent
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const hasContent = imageData.data.some(pixel => pixel !== 0);
          
          if (!hasContent) {
            console.error('[getCroppedImg] Canvas appears to be empty after drawing');
            
            // Try fallback approach: use original crop coordinates directly
            console.log('[getCroppedImg] Trying fallback approach with original coordinates');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Use original crop coordinates without scaling
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
            
            // Check again
            const fallbackImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const fallbackHasContent = fallbackImageData.data.some(pixel => pixel !== 0);
            
            if (!fallbackHasContent) {
              console.error('[getCroppedImg] Fallback approach also failed');
              return reject(new Error('Cropped image appears to be empty even with fallback'));
            }
            
            console.log('[getCroppedImg] Fallback approach succeeded');
          }
          
          console.log('[getCroppedImg] Canvas has content, proceeding to blob conversion');
          
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