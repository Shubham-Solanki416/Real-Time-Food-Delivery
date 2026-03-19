import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddressPickerMap = ({ onAddressSelect, initialPosition = { lat: 28.6139, lng: 77.2090 } }) => {
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState('Fetching address...');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  // Custom icon for the delivery pin
  const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const getAddressFromCoords = async (lat, lng) => {
    setLoading(true);
    try {
      // Free reverse geocoding via Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
        onAddressSelect({ lat, lng, address: data.display_name });
      } else {
        setAddress('Address not found');
        onAddressSelect({ lat, lng, address: 'Address not found' });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setAddress('Error fetching address');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getAddressFromCoords(position.lat, position.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        getAddressFromCoords(e.latlng.lat, e.latlng.lng);
      },
      dragend(e) {
        // If we make the marker draggable
      }
    });

    return position === null ? null : (
      <Marker 
        position={position} 
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const newPos = marker.getLatLng();
            setPosition(newPos);
            getAddressFromCoords(newPos.lat, newPos.lng);
          },
        }}
      />
    );
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(newPos);
          if (mapRef.current) {
            mapRef.current.flyTo(newPos, 16);
          }
          getAddressFromCoords(newPos.lat, newPos.lng);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLoading(false);
          alert("Could not get your location. Please check browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h3 style={titleStyle}>Delivery Location</h3>
          <p style={subtitleStyle}>Drag the pin or click on the map to set your address</p>
        </div>
        <button onClick={handleLocateMe} style={locateBtnStyle} type="button">
          <Navigation size={16} /> Locate Me
        </button>
      </div>

      <div style={mapContainerStyle}>
        <MapContainer 
          center={position} 
          zoom={13} 
          style={{ height: '300px', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={addressBoxStyle}
      >
        <div style={iconWrapperStyle}>
          {loading ? (
            <Loader2 size={24} className="animate-spin" color="#ff4b2b" />
          ) : (
            <MapPin size={24} color="#ff4b2b" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <p style={addressLabelStyle}>Selected Address</p>
          <p style={addressValueStyle}>{address}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Styles
const containerStyle = {
  background: '#fff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
  border: '1px solid #edf2f7',
  marginBottom: '30px'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '20px'
};

const titleStyle = {
  margin: '0 0 5px 0',
  fontSize: '1.2rem',
  fontWeight: 800,
  color: '#2d3436'
};

const subtitleStyle = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#636e72'
};

const locateBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: '#fff5f5',
  color: '#ff4b2b',
  border: '1px solid #ff4b2b',
  padding: '8px 16px',
  borderRadius: '10px',
  fontWeight: 700,
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s'
};

const mapContainerStyle = {
  borderRadius: '16px',
  overflow: 'hidden',
  marginBottom: '20px',
  border: '1px solid #e2e8f0',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
};

const addressBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  background: '#f8fafd',
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0'
};

const iconWrapperStyle = {
  width: '45px',
  height: '45px',
  background: '#fff',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};

const addressLabelStyle = {
  margin: '0 0 4px 0',
  fontSize: '0.8rem',
  color: '#95a5a6',
  textTransform: 'uppercase',
  fontWeight: 700,
  letterSpacing: '0.5px'
};

const addressValueStyle = {
  margin: 0,
  fontSize: '1rem',
  color: '#2d3436',
  fontWeight: 600,
  lineHeight: 1.4
};

export default AddressPickerMap;
