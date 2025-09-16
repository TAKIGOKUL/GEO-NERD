import React, { useState } from 'react';

const ReliableImage = ({ 
  src, 
  alt, 
  className = '', 
  locationId, 
  onError, 
  onLoad,
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.warn(`Image failed to load (attempt ${retryCount + 1}):`, currentSrc);
    
    if (retryCount === 0) {
      // Try with different parameters
      const fallbackUrl = src.includes('unsplash.com') 
        ? src.replace('w=1000', 'w=800').replace('q=80', 'q=75')
        : 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=' + encodeURIComponent(alt || 'Image');
      
      setCurrentSrc(fallbackUrl);
      setRetryCount(1);
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  return (
    <div className="relative">
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-70' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
        loading="lazy"
        decoding="async"
        crossOrigin="anonymous"
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div>Image unavailable</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReliableImage;