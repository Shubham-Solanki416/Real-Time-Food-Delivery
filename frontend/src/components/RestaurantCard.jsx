import React, { useState, useEffect } from 'react';
import { Star, Clock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (user && user.favoriteRestaurants) {
      setIsFavorite(user.favoriteRestaurants.includes(restaurant._id));
    }
  }, [user, restaurant._id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // prevent card click
    if (!user) {
      toast.error("Please login to save favorites");
      return navigate('/login');
    }
    
    setIsLiking(true);
    try {
      const { data } = await api.put(`/me/favorites/${restaurant._id}`);
      
      // Update local context manually to avoid full re-fetch if possible 
      // or we just rely on the API response to update state.
      // Since context doesn't easily partial update without a fetchMe, 
      // we'll just toggle local state for instant feedback.
      setIsFavorite(!isFavorite);
      
      // Optionally update user context if your AuthProvider supports it
      login({ ...user, favoriteRestaurants: data.favoriteRestaurants });
      
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error("Failed to update favorites");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8, boxShadow: '0 12px 25px rgba(0,0,0,0.1)' }}
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      style={{
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: '1px solid #f1f3f5',
        position: 'relative'
      }}
    >
        <div style={{ position: 'relative', height: '180px' }}>
          <img 
            src={restaurant.images[0]?.url} 
            alt={restaurant.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Heart Icon Toggle */}
          <motion.div 
            whileTap={{ scale: 0.8 }}
            onClick={handleFavoriteClick}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 10
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isFavorite ? 'filled' : 'outline'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Heart 
                  size={20} 
                  fill={isFavorite ? "#ff4b2b" : "transparent"} 
                  color={isFavorite ? "#ff4b2b" : "#636e72"} 
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            background: 'rgba(255,255,255,0.9)', 
            padding: '4px 8px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}>
            <Star size={14} color="#ffb800" fill="#ffb800" />
            {restaurant.ratings}
          </div>
        </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 700 }}>{restaurant.name}</h3>
        <p style={{ margin: '0 0 12px 0', color: '#636e72', fontSize: '0.9rem' }}>
          {restaurant.cuisine.join(', ')}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#2d3436' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Clock size={16} color="#ff4b2b" />
            <span>{restaurant.deliveryTime} mins</span>
          </div>
          <div style={{ fontWeight: 600, color: '#ff4b2b' }}>
            ₹{restaurant.avgPrice} for two
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
