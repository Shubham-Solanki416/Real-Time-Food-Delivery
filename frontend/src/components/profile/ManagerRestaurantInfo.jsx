import React, { useState, useEffect } from 'react';
import { Store, MapPin, Clock, Info, Phone, Utensils } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManagerRestaurantInfo = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRestaurant = async () => {
      try {
        const { data } = await api.get('/manager/my-restaurant');
        setRestaurant(data.restaurant);
      } catch (error) {
        toast.error('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };
    fetchMyRestaurant();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #ff4b2b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!restaurant) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#636e72' }}>No restaurant associated with this account.</div>;
  }

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#2d3436' }}>Restaurant Details</h3>
      
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ marginBottom: '24px' }}>
            <img 
              src={restaurant.images[0]?.url} 
              alt={restaurant.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={infoItemStyle}>
              <Store size={20} color="#ff4b2b" />
              <div>
                <p style={labelStyle}>Restaurant Name</p>
                <p style={valueStyle}>{restaurant.name}</p>
              </div>
            </div>

            <div style={infoItemStyle}>
              <Utensils size={20} color="#ff4b2b" />
              <div>
                <p style={labelStyle}>Category & Cuisine</p>
                <p style={valueStyle}>{restaurant.category} • {restaurant.cuisine.join(', ')}</p>
              </div>
            </div>

            <div style={infoItemStyle}>
              <Info size={20} color="#ff4b2b" />
              <div>
                <p style={labelStyle}>Description</p>
                <p style={valueStyle}>{restaurant.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={infoItemStyle}>
              <MapPin size={20} color="#ff4b2b" />
              <div>
                <p style={labelStyle}>Location</p>
                <p style={valueStyle}>{restaurant.location?.address}, {restaurant.location?.city}</p>
              </div>
            </div>

            <div style={infoItemStyle}>
              <Clock size={20} color="#ff4b2b" />
              <div>
                <p style={labelStyle}>Delivery Time</p>
                <p style={valueStyle}>{restaurant.deliveryTime} mins (approx)</p>
              </div>
            </div>

            <div style={infoItemStyle}>
              <Phone size={20} color="#ff4b2b" />
              <div>
                <p style={labelStyle}>Status</p>
                <span style={{ 
                  display: 'inline-block',
                  padding: '4px 12px', 
                  borderRadius: '50px', 
                  fontSize: '0.8rem', 
                  fontWeight: 700,
                  backgroundColor: restaurant.status === 'approved' ? '#eafaf1' : '#fff5f5',
                  color: restaurant.status === 'approved' ? '#2ecc71' : '#ff4b2b',
                  textTransform: 'capitalize'
                }}>
                  {restaurant.status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '16px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#636e72' }}>Need to update restaurant info?</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#2d3436' }}>Please use the <strong>Manager Dashboard</strong> to manage your menu and restaurant settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const infoItemStyle = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start'
};

const labelStyle = {
  margin: 0,
  fontSize: '0.8rem',
  color: '#636e72',
  fontWeight: 600
};

const valueStyle = {
  margin: '2px 0 0 0',
  fontSize: '1rem',
  color: '#2d3436',
  fontWeight: 500
};

export default ManagerRestaurantInfo;
