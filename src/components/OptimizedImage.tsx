import React, { useState, useEffect, useRef } from 'react';
import { useImageLazyLoad } from '../utilities/performanceUtils';
import './OptimizedImage.scss';

interface OptimizedImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholder = '/placeholder-image.png',
  className = '',
  width,
  height,
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError
}) => {
  const { imageSrc, isLoading, error } = useImageLazyLoad(src, placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      // For priority images, start loading immediately
      setShowPlaceholder(false);
    }
  }, [priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setShowPlaceholder(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setShowPlaceholder(true);
    onError?.();
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6'
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0
  };

  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    opacity: showPlaceholder ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out'
  };

  return (
    <div className={`optimized-image ${className}`} style={containerStyle}>
      {/* Placeholder */}
      {showPlaceholder && (
        <div className="image-placeholder" style={placeholderStyle} />
      )}

      {/* Loading indicator */}
      {isLoading && !isLoaded && (
        <div className="image-loading">
          <div className="loading-spinner" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="image-error">
          <div className="error-icon">📷</div>
          <span>Failed to load image</span>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        style={imageStyle}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage; 