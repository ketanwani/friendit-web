import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const LocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isOpen, setIsOpen] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
    setIsOpen(false);
  }, [onLocationSelect]);

  const MapComponent = () => {
    const onMapLoad = useCallback((map) => {
      mapInstanceRef.current = map;
      
      // Add click listener to map
      map.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        
        // Add new marker
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          draggable: true
        });
        
        // Get address from coordinates
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            handleLocationSelect({
              lat,
              lng,
              address,
              name: results[0].name || address
            });
          } else {
            handleLocationSelect({
              lat,
              lng,
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              name: 'Selected Location'
            });
          }
        });
      });
      
      // Set initial location if provided
      if (selectedLocation) {
        map.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
        markerRef.current = new window.google.maps.Marker({
          position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
          map: map,
          draggable: true
        });
      }
    }, [selectedLocation, handleLocationSelect]);

    return (
      <div
        ref={mapRef}
        style={{ height: '400px', width: '100%' }}
        id="map"
      />
    );
  };

  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading map...</span>
          </div>
        );
      case Status.FAILURE:
        return (
          <div className="flex items-center justify-center h-64 bg-red-100 rounded-lg">
            <div className="text-red-600">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-center">Failed to load map</p>
              <p className="text-sm text-center text-gray-600">Please check your internet connection</p>
            </div>
          </div>
        );
      default:
        return <MapComponent />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Display */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Event Location
        </label>
        
        {selectedLocation ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-green-900">{selectedLocation.name}</p>
                <p className="text-sm text-green-700">{selectedLocation.address}</p>
                <p className="text-xs text-green-600 mt-1">
                  Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                {isOpen ? 'Hide Map' : 'Change Location'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-gray-600">No location selected</p>
                <p className="text-sm text-gray-500">Click "Select Location" to choose from map</p>
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Select Location
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Event Location</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Click anywhere on the map to select the event location
              </p>
            </div>
            
            <div className="p-4">
              <Wrapper
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                render={render}
                libraries={['places']}
              />
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                {selectedLocation && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  >
                    Use Selected Location
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
