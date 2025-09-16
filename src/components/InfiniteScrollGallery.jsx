import React, { useState, useEffect, useRef } from 'react';

const InfiniteScrollGallery = ({ images, onImageClick }) => {
  const [visibleImages, setVisibleImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();

  useEffect(() => {
    // Load initial images
    setVisibleImages(images.slice(0, 10));
  }, [images]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisibleImages(prev => [
              ...prev,
              ...images.slice(prev.length, prev.length + 10)
            ]);
            setLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [images, loading]);

  return (
    <div className="infinite-scroll-gallery">
      <div className="gallery-grid">
        {visibleImages.map((image, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => onImageClick && onImageClick(image)}
          >
            <img src={image.url} alt={image.alt || `Gallery image ${index + 1}`} />
          </div>
        ))}
      </div>
      {loading && <div className="loading-indicator">Loading more images...</div>}
    </div>
  );
};

export default InfiniteScrollGallery;
