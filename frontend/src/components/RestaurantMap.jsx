import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

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

const RestaurantMap = ({ location, name, address }) => {
  const position = [location?.lat || 28.6139, location?.lng || 77.2090]; // Default to Delhi if no location provided

  const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <MapPin size={20} color="#ff4b2b" />
        <h3 style={titleStyle}>Restaurant Location</h3>
      </div>
      
      <div style={mapWrapperStyle}>
        <MapContainer 
          center={position} 
          zoom={15} 
          scrollWheelZoom={false}
          style={{ height: '300px', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              <strong>{name}</strong>
              <br/>
              {address}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      {address && (
        <div style={addressBannerStyle}>
          <p style={addressTextStyle}>{address}</p>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  background: '#fff',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  border: '1px solid #edf2f7',
  marginTop: '30px'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px'
};

const titleStyle = {
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: 800,
  color: '#2d3436'
};

const mapWrapperStyle = {
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #e2e8f0',
  position: 'relative'
};

const addressBannerStyle = {
  background: '#f8fafd',
  padding: '16px',
  borderRadius: '12px',
  marginTop: '16px',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #eff2f5'
};

const addressTextStyle = {
  margin: 0,
  color: '#636e72',
  fontSize: '0.95rem',
  fontWeight: 500
};

export default RestaurantMap;
