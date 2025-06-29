// getCroppedImg.ts
// Helper for react-image-crop to crop an image and return a Blob

import { PixelCrop } from 'react-image-crop';

const getCroppedImg = async (imageSrc: string, crop: PixelCrop): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
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
    };
    image.onerror = (err) => reject(err);
  });
};

export default getCroppedImg; 