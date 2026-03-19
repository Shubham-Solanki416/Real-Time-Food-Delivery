import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, MapPin, Heart, Shield, LogOut, Menu, X, ArrowLeft, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileOverview from '../components/profile/ProfileOverview';
import SavedAddresses from '../components/profile/SavedAddresses';
import FavouriteRestaurants from '../components/profile/FavouriteRestaurants';
import SecuritySettings from '../components/profile/SecuritySettings';
import ManagerRestaurantInfo from '../components/profile/ManagerRestaurantInfo';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  let tabs = [];
  if (user?.role === 'admin') {
    tabs = [
      { id: 'overview', label: 'Profile Overview', icon: UserIcon },
      { id: 'security', label: 'Security Settings', icon: Shield },
    ];
  } else if (user?.role === 'manager') {
    tabs = [
      { id: 'overview', label: 'Profile Overview', icon: UserIcon },
      { id: 'restaurant', label: 'Restaurant Details', icon: Store },
      { id: 'security', label: 'Security Settings', icon: Shield },
    ];
  } else {
    tabs = [
      { id: 'overview', label: 'Profile Overview', icon: UserIcon },
      { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
      { id: 'favourites', label: 'Favourite Restaurants', icon: Heart },
      { id: 'security', label: 'Security Settings', icon: Shield },
    ];
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview user={user} />;
      case 'addresses':
        return <SavedAddresses user={user} />;
      case 'favourites':
        return <FavouriteRestaurants user={user} />;
      case 'restaurant':
        return <ManagerRestaurantInfo />;
      case 'security':
        return <SecuritySettings />;
      default:
        return <ProfileOverview user={user} />;
    }
  };

  return (
    <div className="profile-page-container" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px' }}>
      <div className="profile-layout" style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', gap: '2rem', padding: '0 20px' }}>
        
        {/* Desktop Sidebar */}
        <aside className="profile-sidebar" style={{ width: '280px', flexShrink: 0, display: window.innerWidth > 768 ? 'block' : 'none' }}>
          <div className="sidebar-card" style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div className="sidebar-header" style={{ marginBottom: '32px' }}>
              <button 
                onClick={() => navigate('/home')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#636e72', fontSize: '0.9rem', marginBottom: '16px', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <ArrowLeft size={16} /> Back to Home
              </button>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>My Account</h2>
            </div>
            
            <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                      backgroundColor: isActive ? 'rgba(255, 75, 43, 0.1)' : 'transparent',
                      color: isActive ? '#ff4b2b' : '#2d3436',
                      border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: isActive ? 600 : 500,
                      transition: 'all 0.2s', textAlign: 'left'
                    }}
                  >
                    <Icon size={20} color={isActive ? '#ff4b2b' : '#636e72'} />
                    {tab.label}
                  </button>
                );
              })}
              
              <div style={{ height: '1px', backgroundColor: '#eee', margin: '16px 0' }} />
              
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                  backgroundColor: 'transparent', color: '#d63031', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, textAlign: 'left'
                }}
              >
                <LogOut size={20} color="#d63031" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Mobile Navbar Alternative could go here or within main app layout handling */}

        {/* Main Content Area */}
        <main className="profile-content" style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', minHeight: '600px' }}>
                {renderContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-layout {
            flex-direction: column !important;
          }
          .profile-sidebar {
            display: none !important;
          }
          /* Add mobile tab bar logic via CSS or state above */
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
