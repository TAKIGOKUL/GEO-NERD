import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Location } from '../data/locations';
import 'leaflet/dist/leaflet.css';
import './GameMap.css';

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface GameMapProps {
  location: Location;
  guesses: Array<{
    lat: number;
    lng: number;
    distance: number;
    score: number;
    hintLevel: number;
    timeBonus: number;
  }>;
  onGuess: (lat: number, lng: number) => void;
  showResults: boolean;
  showActualLocation: boolean;
  guessCount: number;
  isDisabled: boolean;
}

const GameMap: React.FC<GameMapProps> = ({
  location,
  guesses,
  onGuess,
  showResults,
  showActualLocation,
  guessCount,
  isDisabled
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const [minDistance, setMinDistance] = useState<number | null>(null);

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Ensure coordinates are valid numbers
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      console.error('Invalid coordinates provided to calculateDistance');
      return 0;
    }
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Ensure distance is reasonable (max ~20,000km for earth's half circumference)
    return Math.max(0, Math.min(distance, 20037));
  };

  // Function to find minimum distance from actual location
  const findMinDistance = useCallback((): number | null => {
    if (!location || guesses.length === 0) return null;
    
    let minDist = Infinity;
    guesses.forEach(guess => {
      const distance = calculateDistance(
        location.latitude, 
        location.longitude, 
        guess.lat, 
        guess.lng
      );
      if (distance < minDist) {
        minDist = distance;
      }
    });
    
    return minDist === Infinity ? null : minDist;
  }, [location, guesses]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with zoom restrictions and scroll limits
    const map = L.map(mapRef.current, {
      minZoom: 1,
      maxZoom: 18,
      maxBounds: [
        [-85, -180], // Southwest corner
        [85, 180]    // Northeast corner
      ],
      maxBoundsViscosity: 1.0 // Prevent scrolling beyond bounds
    }).setView([20, 0], 2);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Separate useEffect for click handler to update when state changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    // Remove existing click handlers
    map.off('click');
    
    // Add click handler for guesses - immediately submit when clicked
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (guessCount === 0 && !showResults && !showActualLocation && !isDisabled) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Validate coordinates are within reasonable bounds
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          // Add visual feedback for click
          const tempMarker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: '#ff6b6b',
            color: '#fff',
            weight: 2,
            fillOpacity: 0.8
          }).addTo(map);
          
          // Remove temp marker after a short delay
          setTimeout(() => {
            map.removeLayer(tempMarker);
          }, 300);
          
          onGuess(lat, lng);
        } else {
          console.warn('Invalid coordinates clicked:', lat, lng);
        }
      }
    };
    map.on('click', handleMapClick);
  }, [guessCount, showResults, showActualLocation, isDisabled, onGuess]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Add confirmed guess markers (always visible after submission)
    guesses.forEach((guess, index) => {
      // Validate guess coordinates before creating marker
      if (isNaN(guess.lat) || isNaN(guess.lng) || 
          guess.lat < -90 || guess.lat > 90 || 
          guess.lng < -180 || guess.lng > 180) {
        console.warn('Invalid guess coordinates:', guess);
        return;
      }
      
      const marker = L.marker([guess.lat, guess.lng], {
        icon: L.divIcon({
          className: 'user-guess-marker',
          html: `<div class="user-guess-pin">
                   <div class="guess-pin-head">📍</div>
                   <div class="guess-pin-circle"></div>
                 </div>`,
          iconSize: [40, 50],
          iconAnchor: [20, 50]
        })
      }).addTo(map);
      
      marker.bindPopup(`
        <div class="marker-popup">
          <strong>Your Guess #${index + 1}</strong><br>
          <em>Click to mark your location</em>
        </div>
      `);
      
      markersRef.current.push(marker);
    });

    // Add actual location marker and lines when revealed
    if (showActualLocation && location) {
      // Validate location coordinates
      if (isNaN(location.latitude) || isNaN(location.longitude) ||
          location.latitude < -90 || location.latitude > 90 ||
          location.longitude < -180 || location.longitude > 180) {
        console.error('Invalid location coordinates:', location);
        return;
      }
      
      // Add actual location marker (correct location)
      const actualMarker = L.marker([location.latitude, location.longitude], {
        icon: L.divIcon({
          className: 'actual-marker',
          html: `<div class="actual-pin">
                   <div class="actual-head">🎯</div>
                 </div>`,
          iconSize: [40, 50],
          iconAnchor: [20, 50]
        })
      }).addTo(map);
      
      actualMarker.bindPopup(`
        <div class="marker-popup">
          <strong>${location.name}</strong><br>
          ${location.city}, ${location.country}<br>
          Coordinates: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}<br>
          <em>Correct Location</em>
        </div>
      `);
      
      markersRef.current.push(actualMarker);

      // Draw distance line from guess to actual location
      if (guesses.length > 0) {
        const guess = guesses[0]; // Only one guess per round
        
        // Validate guess coordinates before drawing line
        if (!isNaN(guess.lat) && !isNaN(guess.lng) &&
            guess.lat >= -90 && guess.lat <= 90 &&
            guess.lng >= -180 && guess.lng <= 180) {
          
          // Recalculate distance to ensure accuracy
          const actualDistance = calculateDistance(
            location.latitude, location.longitude,
            guess.lat, guess.lng
          );
          
          const line = L.polyline([
            [guess.lat, guess.lng],
            [location.latitude, location.longitude]
          ], {
            color: actualDistance < 1000 ? '#28a745' : actualDistance < 5000 ? '#ffc107' : '#fe4a56',
            weight: 3,
            opacity: 0.8,
            dashArray: '8, 8'
          }).addTo(map);
          
          markersRef.current.push(line);

          // Add distance label at midpoint
          const midLat = (guess.lat + location.latitude) / 2;
          const midLng = (guess.lng + location.longitude) / 2;
          
          const distanceLabel = L.marker([midLat, midLng], {
            icon: L.divIcon({
              className: 'distance-label',
              html: `<div class="distance-badge" style="background-color: ${actualDistance < 1000 ? '#28a745' : actualDistance < 5000 ? '#ffc107' : '#fe4a56'}">${Math.round(actualDistance)}km</div>`,
              iconSize: [80, 30],
              iconAnchor: [40, 15]
            })
          }).addTo(map);
          
          markersRef.current.push(distanceLabel);
        }
      }

      // Fit map to show all markers with padding
      const markers = markersRef.current.filter(m => m instanceof L.Marker) as L.Marker[];
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.15));
      }
    }
  }, [guesses, showActualLocation, location]);

  // Update minimum distance when guesses change
  useEffect(() => {
    const newMinDistance = findMinDistance();
    setMinDistance(newMinDistance);
  }, [guesses, location, findMinDistance]);

  return (
    <div className="game-map">
      <div className="map-container">
        <div ref={mapRef} className="map" />
      </div>
      
      <div className="map-controls">
        <div className="map-info">
          {guessCount === 0 && !showResults && !showActualLocation && (
            <p className="map-instruction">
              Click on the map to make your guess
            </p>
          )}
          {showActualLocation && (
            <p className="map-result">
              ★ marks the actual location! Map is disabled until next round.
            </p>
          )}
          {minDistance !== null && showActualLocation && (
            <div className="min-distance-info">
              <p className="min-distance-label">Minimum Distance:</p>
              <p className="min-distance-value">{Math.round(minDistance)} km</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameMap;
