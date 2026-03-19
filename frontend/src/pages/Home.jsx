import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Loader2, LogOut, User, Bell, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import RestaurantCard from '../components/RestaurantCard';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/NotificationDropdown';

const Home = () => {
  const { user, isAuthenticated, logout: contextLogout } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();

  // Simple Debounce
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/restaurants?keyword=${debouncedKeyword}`;
      if (activeFilter) url += `&cuisine=${activeFilter}`;
      
      const { data } = await api.get(url);
      
      // Client-side sorting
      let sortedData = [...data.restaurants];
      if (sortBy === 'ratings') sortedData.sort((a, b) => b.ratings - a.ratings);
      if (sortBy === 'deliveryTime') sortedData.sort((a, b) => a.deliveryTime - b.deliveryTime);
      if (sortBy === 'avgPrice') sortedData.sort((a, b) => a.avgPrice - b.avgPrice);

      setRestaurants(sortedData);
    } catch (error) {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, activeFilter, sortBy]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleLogout = async () => {
    try {
      await api.get('/logout');
      contextLogout();
      toast.success('Logged out');
      navigate('/'); // Redirect to welcome page on logout
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafd' }}>
      {/* Premium Navbar */}
      <nav style={navStyle}>
        <div style={navContentStyle}>
          <h2 style={{...logoStyle, cursor: 'pointer'}} onClick={() => navigate('/home')}>Food Express</h2>
          
          <div style={searchContainerStyle}>
            <Search size={18} color="#95a5a6" style={{ position: 'absolute', left: '15px' }} />
            <input 
              type="text" 
              placeholder="Search for 'Pizza', 'Burger'..." 
              style={searchInputStyle}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                {user?.role === 'manager' && (
                  <button 
                    onClick={() => navigate('/dashboard')}
                    style={{...logoutBtnStyle, background: '#f8fafd', color: '#2d3436', border: '1px solid #eee'}}
                  >
                    Dashboard
                  </button>
                )}
                <button 
                  onClick={() => navigate('/orders')}
                  style={{...logoutBtnStyle, background: '#f8fafd', color: '#2d3436', border: '1px solid #eee'}}
                >
                  <ShoppingBag size={16} /> My Orders
                </button>
                <NotificationDropdown />
                <div style={iconCircleStyle} onClick={() => navigate('/profile')} title="My Profile"><User size={20} /></div>
                <button onClick={handleLogout} style={logoutBtnStyle}><LogOut size={16} /> Logout</button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  style={{...logoutBtnStyle, background: 'transparent', color: '#2d3436', border: '1px solid #eee'}}
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  style={logoutBtnStyle}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '1250px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Explore Restaurants</h1>
          <p style={{ color: '#636e72' }}>Discover the best food & drinks in your area.</p>
        </header>

        <FilterBar 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={48} color="#ff4b2b" />
          </div>
        ) : (
          <div style={gridStyle}>
            {restaurants.length > 0 ? (
              restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))
            ) : (
              <div style={noResultsStyle}>
                <h3>No restaurants found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Styles
const navStyle = {
  background: '#fff',
  padding: '15px 0',
  boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
  position: 'sticky',
  top: 0,
  zIndex: 100
};

const navContentStyle = {
  maxWidth: '1250px',
  margin: '0 auto',
  padding: '0 40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '30px'
};

const logoStyle = {
  background: 'linear-gradient(to right, #ff4b2b, #ff416c)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '1.6rem',
  fontWeight: 800,
  margin: 0,
  whiteSpace: 'nowrap'
};

const searchContainerStyle = {
  flex: 1,
  maxWidth: '500px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const searchInputStyle = {
  width: '100%',
  padding: '12px 20px 12px 45px',
  borderRadius: '12px',
  border: '1px solid #f1f3f5',
  background: '#f8fafd',
  outline: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s'
};

const iconCircleStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: '#f8fafd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#636e72',
  cursor: 'pointer'
};

const logoutBtnStyle = {
  background: '#ff4b2b',
  color: '#fff',
  padding: '10px 18px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '30px'
};

const noResultsStyle = {
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '60px',
  background: '#fff',
  borderRadius: '20px',
  color: '#636e72'
};

export default Home;
