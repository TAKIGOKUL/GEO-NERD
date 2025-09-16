import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MobileGameMap.css';

const MobileGameMap = ({ 
  onGuess, 
  userGuess, 
  actualLocation, 
  distance, 
  isRevealed,
  onMapReady 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: true,
      tap: true,
      tapTolerance: 15
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Handle map clicks
    map.on('click', (e) => {
      if (!isRevealed) {
        onGuess(e.latlng.lat, e.latlng.lng);
      }
    });

    // Touch event handling for better mobile experience
    map.on('touchstart', (e) => {
      setTouchStart(e.originalEvent.touches[0]);
      setIsDragging(false);
    });

    map.on('touchmove', (e) => {
      if (touchStart) {
        const touch = e.originalEvent.touches[0];
        const distance = Math.sqrt(
          Math.pow(touch.clientX - touchStart.clientX, 2) +
          Math.pow(touch.clientY - touchStart.clientY, 2)
        );
        
        if (distance > 10) {
          setIsDragging(true);
        }
      }
    });

    map.on('touchend', (e) => {
      if (!isDragging && !isRevealed && e.originalEvent.changedTouches.length === 1) {
        const touch = e.originalEvent.changedTouches[0];
        const point = map.mouseEventToContainerPoint(touch);
        const latlng = map.containerPointToLatLng(point);
        onGuess(latlng.lat, latlng.lng);
      }
      setIsDragging(false);
      setTouchStart(null);
    });

    mapInstanceRef.current = map;
    setMapLoaded(true);
    
    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    const map = mapInstanceRef.current;
    
    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add user guess marker
    if (userGuess) {
      const userIcon = L.divIcon({
        className: 'mobile-user-marker',
        html: `
          <div class="mobile-marker-pin">
            <div class="marker-icon">🎯</div>
            <div class="marker-pulse"></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      L.marker([userGuess.lat, userGuess.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div class="mobile-popup">
            <h4>Your Guess</h4>
            <p>Lat: ${userGuess.lat.toFixed(4)}</p>
            <p>Lng: ${userGuess.lng.toFixed(4)}</p>
          </div>
        `);
    }

    // Add actual location marker when revealed
    if (isRevealed && actualLocation) {
      const actualIcon = L.divIcon({
        className: 'mobile-actual-marker',
        html: `
          <div class="mobile-marker-pin actual">
            <div class="marker-icon">📍</div>
            <div class="marker-pulse actual"></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      L.marker([actualLocation.lat, actualLocation.lng], { icon: actualIcon })
        .addTo(map)
        .bindPopup(`
          <div class="mobile-popup">
            <h4>Actual Location</h4>
            <p>${actualLocation.name || 'Unknown'}</p>
            <p>Lat: ${actualLocation.lat.toFixed(4)}</p>
            <p>Lng: ${actualLocation.lng.toFixed(4)}</p>
          </div>
        `);

      // Add distance line if both markers exist
      if (userGuess) {
        const polyline = L.polyline([
          [userGuess.lat, userGuess.lng],
          [actualLocation.lat, actualLocation.lng]
        ], {
          color: '#fe4a56',
          weight: 3,
          opacity: 0.8,
          dashArray: '5, 5'
        }).addTo(map);

        // Add distance label at midpoint
        const midLat = (userGuess.lat + actualLocation.lat) / 2;
        const midLng = (userGuess.lng + actualLocation.lng) / 2;
        
        L.marker([midLat, midLng], {
          icon: L.divIcon({
            className: 'mobile-distance-label',
            html: `
              <div class="distance-badge">
                <span class="distance-value">${distance} km</span>
              </div>
            `,
            iconSize: [80, 30],
            iconAnchor: [40, 15]
          })
        }).addTo(map);
      }
    }
  }, [userGuess, actualLocation, isRevealed, distance, mapLoaded]);

  // Center map on location when revealed
  useEffect(() => {
    if (mapInstanceRef.current && isRevealed && actualLocation) {
      mapInstanceRef.current.setView([actualLocation.lat, actualLocation.lng], 6, {
        animate: true,
        duration: 1
      });
    }
  }, [isRevealed, actualLocation]);

  return (
    <div className="mobile-map-container">
      <div className="map-header">
        <h3>🗺️ World Map</h3>
        <div className="map-instructions">
          {!isRevealed ? (
            <p>Tap anywhere on the map to make your guess</p>
          ) : (
            <p>Explore the location and see how close you were!</p>
          )}
        </div>
      </div>
      
      <div className="map-wrapper">
        <div 
          ref={mapRef} 
          className="mobile-map"
          style={{ height: '100%', width: '100%' }}
        />
        
        {/* Map Controls */}
        <div className="mobile-map-controls">
          <button 
            className="map-control-btn"
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([20, 0], 2, { animate: true });
              }
            }}
            aria-label="Reset map view"
          >
            🌍
          </button>
          
          <button 
            className="map-control-btn"
            onClick={() => {
              if (mapInstanceRef.current) {
                const currentZoom = mapInstanceRef.current.getZoom();
                mapInstanceRef.current.setZoom(currentZoom + 1, { animate: true });
              }
            }}
            aria-label="Zoom in"
          >
            ➕
          </button>
          
          <button 
            className="map-control-btn"
            onClick={() => {
              if (mapInstanceRef.current) {
                const currentZoom = mapInstanceRef.current.getZoom();
                mapInstanceRef.current.setZoom(currentZoom - 1, { animate: true });
              }
            }}
            aria-label="Zoom out"
          >
            ➖
          </button>
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-marker user"></div>
          <span>Your Guess</span>
        </div>
        {isRevealed && (
          <div className="legend-item">
            <div className="legend-marker actual"></div>
            <span>Actual Location</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileGameMap;
