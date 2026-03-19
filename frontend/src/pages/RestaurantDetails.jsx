import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Info, ChevronLeft, Plus, Minus, Loader2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RestaurantMap from '../components/RestaurantMap';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, totalItems } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resData, menuData] = await Promise.all([
          api.get(`/restaurant/${id}`),
          api.get(`/restaurant/${id}/menu`)
        ]);
        setRestaurant(resData.data.restaurant);
        setMenu(menuData.data.foods);
      } catch (error) {
        toast.error('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = (item) => {
    addToCart(item, id); // id is the restaurantId from useParams
    toast.success(`${item.name} added to cart!`, {
      icon: '🍕',
      position: 'bottom-right'
    });
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="#ff4b2b" />
    </div>
  );

  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafd' }}>
      {/* Header Info */}
      <div style={headerSectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: '30px', left: '40px', right: '40px' }}>
          <motion.button 
            whileHover={{ x: -5 }}
            onClick={() => navigate('/home')} 
            style={backBtnStyle}
          >
            <ChevronLeft size={20} /> Back to Search
          </motion.button>

          {isAuthenticated && user?.role === 'manager' && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/dashboard')}
              style={managerDashboardBtnStyle}
            >
              Manager Dashboard
            </motion.button>
          )}
        </div>

        <div style={headerContainerStyle}>
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={restaurant.images[0]?.url} 
            alt={restaurant.name} 
            style={heroImageStyle}
          />
          <div style={heroContentStyle}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              {restaurant.cuisine.map(c => (
                <span key={c} style={cuisineBadgeStyle}>{c}</span>
              ))}
            </div>
            <h1 style={restaurantNameStyle}>{restaurant.name}</h1>
            <p style={descriptionStyle}>{restaurant.description}</p>
            
            <div style={statsRowStyle}>
              <div style={statItemStyle}>
                <Star size={18} fill="#f1c40f" color="#f1c40f" />
                <span>{restaurant.ratings} ({restaurant.numOfReviews} Reviews)</span>
              </div>
              <div style={statDividerStyle} />
              <div style={statItemStyle}>
                <Clock size={18} color="#27ae60" />
                <span>{restaurant.deliveryTime} mins</span>
              </div>
              <div style={statDividerStyle} />
              <div style={statItemStyle}>
                <span style={{ fontWeight: 700, color: '#2d3436' }}>₹{restaurant.avgPrice}</span>
                <span>Avg. Price</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <main style={mainContentStyle}>
        <div style={menuHeaderStyle}>
          <h2>Popular Dishes</h2>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cart')}
            style={{ ...cartSummaryStyle, cursor: 'pointer' }}
          >
             <ShoppingBag size={20} />
             <span>{totalItems} Items</span>
          </motion.div>
        </div>

        <div style={menuGridStyle}>
          <AnimatePresence>
            {menu.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  ...menuCardStyle,
                  opacity: item.isAvailable ? 1 : 0.7,
                  filter: item.isAvailable ? 'none' : 'grayscale(0.5)'
                }}
              >
                {!item.isAvailable && (
                  <div style={soldOutBadgeStyle}>SOLD OUT</div>
                )}
                <div style={menuCardContentStyle}>
                  <div style={foodInfoStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{
                        ...foodNameStyle,
                        color: item.isAvailable ? '#2d3436' : '#b2bec3',
                        marginBottom: 0
                      }}>{item.name}</h3>
                      {item.isVeg && (
                        <div style={vegBadgeStyle}>
                          <div style={vegDotStyle} />
                        </div>
                      )}
                    </div>
                    <p style={foodDescStyle}>{item.description}</p>
                    <span style={foodPriceStyle}>₹{item.price}</span>
                  </div>
                  <div style={foodImageContainerStyle}>
                    <img 
                      src={item.images[0]?.url} 
                      alt={item.name} 
                      style={{
                        ...foodImgStyle,
                        opacity: item.isAvailable ? 1 : 0.6
                      }} 
                    />
                    <motion.button 
                      whileTap={item.isAvailable ? { scale: 0.95 } : {}}
                      onClick={() => item.isAvailable && handleAddToCart(item)}
                      disabled={!item.isAvailable}
                      style={{
                        ...addBtnStyle,
                        color: item.isAvailable ? '#27ae60' : '#b2bec3',
                        cursor: item.isAvailable ? 'pointer' : 'not-allowed',
                        background: item.isAvailable ? '#fff' : '#f8f9fa'
                      }}
                    >
                      {item.isAvailable ? 'ADD' : 'SOLD OUT'} {item.isAvailable && <Plus size={14} />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {menu.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#636e72' }}>
              No menu items available for this restaurant yet.
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div style={reviewsSectionStyle}>
          <div style={menuHeaderStyle}>
            <h2>Customer Reviews</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1c40f', fontWeight: 800 }}>
              <Star size={20} fill="#f1c40f" />
              <span>{restaurant.ratings.toFixed(1)} Average</span>
            </div>
          </div>

          <div style={reviewsGridStyle}>
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={reviewCardStyle}
                >
                  <div style={reviewHeaderStyle}>
                    <div style={userInitialCircleStyle}>
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={reviewUserNameStyle}>{review.name}</h4>
                      <p style={reviewDateStyle}>{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={reviewRatingStyle}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          fill={star <= review.rating ? "#f1c40f" : "none"} 
                          color={star <= review.rating ? "#f1c40f" : "#d1d8e0"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p style={reviewCommentStyle}>{review.comment}</p>
                </motion.div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#636e72', gridColumn: '1/-1' }}>
                No reviews yet. Be the first to rate your order!
              </div>
            )}
          </div>
        </div>

        {/* Location Map Section */}
        <div style={reviewsSectionStyle}>
          <RestaurantMap 
            location={restaurant.location} 
            name={restaurant.name} 
            address={`${restaurant.category} • ${restaurant.cuisine.join(', ')}`}
          />
        </div>
      </main>
    </div>
  );
};

// Styles
const headerSectionStyle = {
  background: '#fff',
  padding: '100px 40px 60px',
  position: 'relative',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
};

const backBtnStyle = {
  position: 'absolute',
  top: '30px',
  left: '40px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  background: 'none',
  border: 'none',
  color: '#636e72',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem'
};

const managerDashboardBtnStyle = {
  background: '#fff',
  color: '#ff4b2b',
  border: '1px solid #ff4b2b',
  padding: '8px 20px',
  borderRadius: '10px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: '0.9rem',
  boxShadow: '0 4px 10px rgba(255, 75, 43, 0.1)'
};

const headerContainerStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'flex',
  gap: '50px',
  alignItems: 'center',
  flexWrap: 'wrap'
};

const heroImageStyle = {
  width: '350px',
  height: '250px',
  borderRadius: '25px',
  objectFit: 'cover',
  boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
};

const heroContentStyle = {
  flex: 1,
  minWidth: '300px'
};

const cuisineBadgeStyle = {
  background: '#fff5f5',
  color: '#ff4b2b',
  padding: '6px 15px',
  borderRadius: '50px',
  fontSize: '0.85rem',
  fontWeight: 600
};

const restaurantNameStyle = {
  fontSize: '2.8rem',
  fontWeight: 800,
  color: '#2d3436',
  margin: '0 0 10px 0'
};

const descriptionStyle = {
  fontSize: '1.1rem',
  color: '#636e72',
  lineHeight: 1.6,
  marginBottom: '25px'
};

const statsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '25px',
  flexWrap: 'wrap'
};

const statItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.95rem',
  color: '#636e72',
  fontWeight: 500
};

const statDividerStyle = {
  width: '1px',
  height: '20px',
  background: '#eee'
};

const mainContentStyle = {
  maxWidth: '100%',
  padding: '60px 0',
  background: '#f4f7f9', // Updated background for contrast
  borderTop: '1px solid #edf2f7'
};

const menuHeaderStyle = {
  maxWidth: '1100px',
  margin: '0 auto 30px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 40px 15px',
  borderBottom: '2px solid #e2e8f0'
};

const cartSummaryStyle = {
  background: '#ff4b2b',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: 600,
  boxShadow: '0 5px 15px rgba(255, 75, 43, 0.3)'
};

const menuGridStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 40px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
  gap: '25px'
};

const menuCardStyle = {
  background: '#fff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  border: '1px solid #e2e8f0', // Slightly darker border for distinction
  transition: 'all 0.3s'
};

const menuCardContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '20px'
};

const foodInfoStyle = {
  flex: 1
};

const foodNameStyle = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#2d3436',
  marginBottom: '8px'
};

const foodDescStyle = {
  fontSize: '0.9rem',
  color: '#636e72',
  lineHeight: 1.5,
  marginBottom: '15px'
};

const foodPriceStyle = {
  fontSize: '1.1rem',
  fontWeight: 800,
  color: '#2d3436'
};

const foodImageContainerStyle = {
  position: 'relative',
  width: '130px',
  height: '130px'
};

const foodImgStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '15px',
  objectFit: 'cover'
};

const addBtnStyle = {
  position: 'absolute',
  bottom: '-10px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#fff',
  color: '#27ae60',
  border: '1px solid #eee',
  padding: '6px 18px',
  borderRadius: '8px',
  fontWeight: 800,
  fontSize: '0.8rem',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

const vegBadgeStyle = {
  width: '18px',
  height: '18px',
  border: '2px solid #27ae60',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '2px',
  flexShrink: 0
};

const vegDotStyle = {
  width: '10px',
  height: '10px',
  background: '#27ae60',
  borderRadius: '50%'
};

const soldOutBadgeStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: '#e74c3c',
  color: '#fff',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: 800,
  zIndex: 2,
  letterSpacing: '0.5px'
};

const reviewsSectionStyle = {
  maxWidth: '1100px',
  margin: '60px auto 0',
  padding: '0 40px'
};

const reviewsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '30px'
};

const reviewCardStyle = {
  background: '#fff',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
  border: '1px solid #edf2f7'
};

const reviewHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '15px',
  position: 'relative'
};

const userInitialCircleStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: '#ff4b2b',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: '1.1rem'
};

const reviewUserNameStyle = {
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: '#2d3436'
};

const reviewDateStyle = {
  margin: 0,
  fontSize: '0.8rem',
  color: '#95a5a6'
};

const reviewRatingStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  gap: '2px'
};

const reviewCommentStyle = {
  margin: 0,
  fontSize: '0.95rem',
  color: '#636e72',
  lineHeight: 1.6,
  fontStyle: 'italic'
};

export default RestaurantDetails;
