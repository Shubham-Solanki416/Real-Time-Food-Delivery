import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
// Note: leaflet-routing-machine doesn't work perfectly well out of the box with React StrictMode / react-leaflet v4+
// so we use a custom hook/component to attach it to the map instance.
import 'leaflet-routing-machine';

// Custom Icons
const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle the routing logic within the MapContainer context
const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    // Use L.Routing.control to calculate and draw the route
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      lineOptions: {
        styles: [
          {
            color: '#3498db',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10', // Animated look
            className: 'animated-route-path'
          }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false, // Don't show the text itinerary
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: function() { return null; } // We render our own markers
    }).addTo(map);

    // CSS animation for the path (added dynamically)
    const style = document.createElement('style');
    style.innerHTML = `
      .animated-route-path {
        animation: dash 20s linear infinite;
      }
      @keyframes dash {
        to {
          stroke-dashoffset: -1000;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Clean up on unmount
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
      document.head.removeChild(style);
    };
  }, [map, start, end]);

  return null;
};

const AnimatedRouteMap = ({ restaurantLocation, deliveryLocation, restaurantName }) => {
  
  if (!restaurantLocation || !deliveryLocation) {
    return (
      <div style={placeholderStyle}>
        <p>Location data unavailable for map tracking.</p>
      </div>
    );
  }

  // Calculate center between the two points for initial view
  const centerLat = (restaurantLocation.lat + deliveryLocation.lat) / 2;
  const centerLng = (restaurantLocation.lng + deliveryLocation.lng) / 2;

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Live Order Tracking</h3>
      <div style={mapWrapperStyle}>
        <MapContainer 
          center={[centerLat, centerLng]} 
          zoom={13} 
          style={{ height: '350px', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon}>
            <Popup><strong>{restaurantName}</strong><br/>Preparing your food</Popup>
          </Marker>

          <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={customerIcon}>
            <Popup><strong>Delivery Address</strong><br/>Waiting for food</Popup>
          </Marker>

          <RoutingMachine start={restaurantLocation} end={deliveryLocation} />
        </MapContainer>
      </div>
      
      <div style={legendStyle}>
        <div style={legendItemStyle}>
          <div style={{...dotStyle, background: '#e74c3c'}} /> Restaurant
        </div>
        <div style={{ flex: 1, borderTop: '2px dashed #95a5a6', margin: '0 15px' }} />
        <div style={legendItemStyle}>
          <div style={{...dotStyle, background: '#2ecc71'}} /> You
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  background: '#fff',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
  border: '1px solid #edf2f7',
  marginTop: '20px'
};

const titleStyle = {
  margin: '0 0 15px 0',
  fontSize: '1.2rem',
  fontWeight: 800,
  color: '#2d3436'
};

const mapWrapperStyle = {
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #e2e8f0'
};

const placeholderStyle = {
  background: '#f8fafd',
  borderRadius: '16px',
  padding: '40px',
  textAlign: 'center',
  color: '#95a5a6',
  border: '1px dashed #ced6e0'
};

const legendStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  padding: '15px 20px',
  background: '#f8fafd',
  borderRadius: '12px'
};

const legendItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: 600,
  fontSize: '0.9rem',
  color: '#2d3436'
};

const dotStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%'
};

export default AnimatedRouteMap;
