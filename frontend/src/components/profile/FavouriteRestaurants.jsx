import React, { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const FavouriteRestaurants = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Here we could fetch the populated favorites if the /me endpoint didn't populate them. 
        // For now, let's fetch all restaurants and filter based on user.favoriteRestaurants IDs, 
        // or theoretically use a dedicated endpoint. Let's do a simple approach:
        const { data } = await api.get('/restaurants');
        const userFavSet = new Set(user?.favoriteRestaurants || []);
        const favoriteData = data.restaurants.filter(r => userFavSet.has(r._id));
        setFavorites(favoriteData);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="loader"></div></div>;
  }

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#2d3436' }}>Favourite Restaurants</h3>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#636e72' }}>
          <Heart size={48} color="#dfe6e9" style={{ marginBottom: '16px' }} />
          <p>You haven't liked any restaurants yet.<br/>Explore our restaurants and tap the heart icon to save them here!</p>
          <button 
            onClick={() => navigate('/home')}
            style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: '#ff4b2b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            Explore Restaurants
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {favorites.map((restaurant) => (
            <div 
              key={restaurant._id}
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              style={{
                borderRadius: '16px', overflow: 'hidden', border: '1px solid #dfe6e9', cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s', backgroundColor: 'white'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
               <div style={{ position: 'relative', height: '160px' }}>
                <img 
                  src={restaurant.images[0]?.url || 'https://via.placeholder.com/400x300'} 
                  alt={restaurant.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  <Heart size={18} fill="#ff4b2b" color="#ff4b2b" />
                </div>
              </div>
              
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#2d3436' }}>{restaurant.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fff8e1', padding: '4px 8px', borderRadius: '8px', color: '#f39c12', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Star size={14} fill="#f39c12" /> {restaurant.ratings.toFixed(1)}
                  </div>
                </div>
                
                <p style={{ margin: '0 0 12px 0', color: '#636e72', fontSize: '0.95rem' }}>
                  {restaurant.cuisine.join(', ')}
                </p>
                
                <div style={{ display: 'flex', gap: '16px', color: '#636e72', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {restaurant.deliveryTime} min
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {restaurant.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteRestaurants;
