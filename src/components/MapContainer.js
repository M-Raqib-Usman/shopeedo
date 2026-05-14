import React, { useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to recenter map when location changes
function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined && lat !== null && lng !== null) {
      map.setView([lat, lng]);
    }
  }, [lat, lng, map]);
  return null;
}

// Component to locate user on the map
function LocateControl({ setLocation }) {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  useEffect(() => {
    const onLocationFound = (e) => {
      if (setLocation) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    };
    
    map.on('locationfound', onLocationFound);
    return () => map.off('locationfound', onLocationFound);
  }, [map, setLocation]);

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <div className="leaflet-bar leaflet-control">
        <button 
          onClick={handleLocate}
          title="Detect my exact location"
          style={{
            backgroundColor: 'white',
            width: '34px',
            height: '34px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          🎯
        </button>
      </div>
    </div>
  );
}

// Component to handle map clicks and update location
function LocationMarker({ location, setLocation, interactive }) {
  const map = useMap();

  useEffect(() => {
    if (!interactive) return;
    const onClick = (e) => {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, interactive, setLocation]);

  return location && location.lat !== undefined ? (
    <Marker 
      position={[location.lat, location.lng]}
      draggable={interactive}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setLocation({ lat: position.lat, lng: position.lng });
        },
      }}
    >
      <Popup>Selected Location (Drag to adjust)</Popup>
    </Marker>
  ) : null;
}

// Custom Icons using DivIcon for a modern look
const createCustomIcon = (color, label) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 10px;
          text-align: center;
        ">${label}</div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const icons = {
  customer: createCustomIcon('#FF5722', 'YOU'),
  rider: createCustomIcon('#2196F3', '🏍️'),
  restaurant: createCustomIcon('#4CAF50', '🍴'),
  default: createCustomIcon('#9E9E9E', '📍')
};

const MapContainer = ({ 
  location = { lat: 30.6682, lng: 73.1114 }, // Default to Sahiwal
  setLocation, 
  interactive = false,
  height = "300px",
  markers = [], // Array of { lat, lng, popup, type: 'customer'|'rider'|'restaurant' }
  showRouting = false
}) => {
  // Ensure location has valid lat/lng for the initial center
  const safeLocation = (location && location.lat !== undefined) ? location : { lat: 30.2982, lng: 71.9333 };

  return (
    <div style={{ 
      height, 
      minHeight: height,
      width: '100%', 
      borderRadius: '0.75rem', 
      overflow: 'hidden', 
      zIndex: 1, 
      background: '#eee',
      position: 'relative' 
    }}>
      <LeafletMap center={[safeLocation.lat, safeLocation.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically lat={location?.lat} lng={location?.lng} />
        {interactive && <LocateControl setLocation={setLocation} />}
        
        {interactive ? (
          <LocationMarker location={location} setLocation={setLocation} interactive={interactive} />
        ) : (
          location.lat !== undefined && !markers.length && (
            <Marker position={[location.lat, location.lng]} icon={icons.customer}>
              <Popup>Destination</Popup>
            </Marker>
          )
        )}

        {/* Render additional markers if provided */}
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.lat, marker.lng]}
            icon={icons[marker.type] || icons.default}
          >
            <Popup>{marker.popup}</Popup>
          </Marker>
        ))}

        {/* Simple straight line routing if requested and markers exist */}
        {showRouting && markers.length >= 2 && (
          <Polyline 
            positions={markers.map(m => [m.lat, m.lng])} 
            color="#f97316" 
            dashArray="10, 10"
            weight={3}
          />
        )}
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
