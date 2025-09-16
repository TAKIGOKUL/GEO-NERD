import React, { useState } from 'react';
import { getReliableImageUrl, getBackupImageUrl } from '../data/reliableImages';

interface ReliableImageProps {
  src: string;
  alt: string;
  className?: string;
  locationId?: number;
  onError?: () => void;
  onLoad?: () => void;
}

export const ReliableImage: React.FC<ReliableImageProps> = ({
  src,
  alt,
  className = '',
  locationId,
  onError,
  onLoad
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.warn('Image failed to load:', currentSrc);
    
    if (retryCount === 0 && locationId) {
      // Try reliable mapping first
      const reliableUrl = getReliableImageUrl(locationId);
      if (reliableUrl && reliableUrl !== currentSrc) {
        setCurrentSrc(reliableUrl);
        setRetryCount(1);
        return;
      }
    }
    
    if (retryCount === 1 && locationId) {
      // Try backup URL
      const backupUrl = getBackupImageUrl(locationId);
      if (backupUrl && backupUrl !== currentSrc) {
        setCurrentSrc(backupUrl);
        setRetryCount(2);
        return;
      }
    }
    
    // Final fallback
    setCurrentSrc('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80');
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
