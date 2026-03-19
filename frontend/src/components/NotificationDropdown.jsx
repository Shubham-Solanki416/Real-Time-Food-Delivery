import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id, orderId) => {
    markAsRead(id);
    navigate(`/order/track/${orderId}`);
    setIsOpen(false);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <div 
        style={iconCircleStyle} 
        onClick={toggleDropdown}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={badgeStyle}>{unreadCount}</span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={dropdownStyle}
          >
            <div style={headerStyle}>
              <h4 style={{ margin: 0 }}>Notifications</h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    style={actionBtnStyle}
                  >
                    Mark read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={deleteAllNotifications}
                    style={{ ...actionBtnStyle, color: '#ff4b2b' }}
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div style={listStyle}>
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    style={{
                      ...itemStyle,
                      backgroundColor: notif.isRead ? 'transparent' : '#f0f3ff'
                    }}
                  >
                    <div 
                      style={{ flex: 1, cursor: 'pointer' }}
                      onClick={() => handleNotificationClick(notif._id, notif.order)}
                    >
                      <p style={messageStyle}>{notif.message}</p>
                      <p style={timeStyle}>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div style={actionsStyle}>
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif._id)}
                          style={actionIconStyle}
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif._id)}
                        style={{ ...actionIconStyle, color: '#ff4b2b' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={emptyStyle}>
                  <p>You're all caught up! 🔔</p>
                </div>
              )}
            </div>

            <div style={footerStyle}>
              <button 
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
                style={viewAllBtnStyle}
              >
                View all notifications <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s'
};

const badgeStyle = {
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  background: '#ff4b2b',
  color: '#fff',
  fontSize: '10px',
  fontWeight: 'bold',
  minWidth: '18px',
  height: '18px',
  borderRadius: '9px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
  border: '2px solid #fff'
};

const dropdownStyle = {
  position: 'absolute',
  top: '50px',
  right: 0,
  width: '320px',
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  zIndex: 1000,
  overflow: 'hidden',
  border: '1px solid #edf2f7'
};

const headerStyle = {
  padding: '16px',
  borderBottom: '1px solid #edf2f7',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const actionBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#636e72',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0
};

const listStyle = {
  maxHeight: '350px',
  overflowY: 'auto'
};

const itemStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #f8fafd',
  display: 'flex',
  gap: '12px',
  transition: 'background-color 0.2s'
};

const messageStyle = {
  margin: '0 0 4px 0',
  fontSize: '0.9rem',
  color: '#2d3436',
  fontWeight: 500,
  lineHeight: 1.4
};

const timeStyle = {
  margin: 0,
  fontSize: '0.75rem',
  color: '#b2bec3'
};

const actionsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const actionIconStyle = {
  background: 'none',
  border: 'none',
  color: '#b2bec3',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const emptyStyle = {
  padding: '40px 20px',
  textAlign: 'center',
  color: '#636e72'
};

const footerStyle = {
  padding: '12px',
  borderTop: '1px solid #edf2f7',
  textAlign: 'center',
  background: '#fcfdfe'
};

const viewAllBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#636e72',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  width: '100%'
};

export default NotificationDropdown;
