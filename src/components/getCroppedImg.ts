// getCroppedImg.ts
// Helper for react-image-crop to crop an image and return a Blob

import { PixelCrop } from 'react-image-crop';

const getCroppedImg = async (imageSrc: string, crop: PixelCrop): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const image = new window.Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = crop.width;
          canvas.height = crop.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('No 2d context'));
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
            if (blob) resolve(blob);
            else reject(new Error('Canvas is empty'));
          }, 'image/jpeg');
        } catch (err) {
          reject(new Error('Failed to crop image: ' + (err instanceof Error ? err.message : String(err))));
        }
      };
      image.onerror = (err) => reject(new Error('Failed to load image for cropping: ' + (err instanceof Error ? err.message : String(err))));
    } catch (err) {
      reject(new Error('Unexpected error in getCroppedImg: ' + (err instanceof Error ? err.message : String(err))));
    }
  });
};

export default getCroppedImg; 