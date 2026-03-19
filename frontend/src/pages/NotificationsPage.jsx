import React from 'react';
import { Bell, Check, Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = useNotifications();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafd', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate(-1)}
          style={backBtnStyle}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <header style={headerStyle}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>Notifications</h1>
            <p style={{ color: '#636e72', margin: 0 }}>Stay updated with your order status</p>
          </div>
          {notifications.length > 0 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={markAllAsRead}
                style={markAllBtnStyle}
              >
                Mark all as read
              </button>
              <button 
                onClick={deleteAllNotifications}
                style={{ ...markAllBtnStyle, color: '#ff4b2b' }}
              >
                Clear all
              </button>
            </div>
          )}
        </header>

        <div style={listContainerStyle}>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={notif._id}
                style={{
                  ...notificationCardStyle,
                  borderLeft: notif.isRead ? '4px solid transparent' : '4px solid #ff4b2b',
                  backgroundColor: notif.isRead ? '#fff' : '#f0f3ff'
                }}
              >
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/order/track/${notif.order}`)}>
                  <p style={messageStyle}>{notif.message}</p>
                  <div style={metaStyle}>
                    <span style={timeStyle}>
                      <Calendar size={12} style={{ marginRight: '4px' }} />
                      {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                <div style={actionsStyle}>
                  {!notif.isRead && (
                    <button 
                      onClick={() => markAsRead(notif._id)}
                      style={actionIconStyle}
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif._id)}
                    style={{ ...actionIconStyle, color: '#ff4b2b' }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>
                <Bell size={48} color="#b2bec3" />
              </div>
              <h3>No notifications yet</h3>
              <p>When you place an order, status updates will appear here.</p>
              <button 
                onClick={() => navigate('/home')}
                style={browseBtnStyle}
              >
                Start Ordering
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const backBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#636e72',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  marginBottom: '24px',
  fontWeight: 600,
  fontSize: '1rem',
  padding: 0
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '32px'
};

const markAllBtnStyle = {
  background: 'white',
  border: '1px solid #edf2f7',
  color: '#ff4b2b',
  padding: '8px 16px',
  borderRadius: '10px',
  fontWeight: 600,
  fontSize: '0.9rem',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
};

const listContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const notificationCardStyle = {
  padding: '20px 24px',
  borderRadius: '16px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  transition: 'transform 0.2s'
};

const messageStyle = {
  margin: '0 0 8px 0',
  fontSize: '1.05rem',
  color: '#2d3436',
  fontWeight: 500,
  lineHeight: 1.5
};

const metaStyle = {
  display: 'flex',
  gap: '16px',
  alignItems: 'center'
};

const timeStyle = {
  fontSize: '0.85rem',
  color: '#b2bec3',
  display: 'flex',
  alignItems: 'center'
};

const actionsStyle = {
  display: 'flex',
  gap: '12px'
};

const actionIconStyle = {
  background: '#f8fafd',
  border: 'none',
  color: '#b2bec3',
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '80px 20px',
  background: 'white',
  borderRadius: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
};

const emptyIconStyle = {
  width: '100px',
  height: '100px',
  background: '#f8fafd',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px auto'
};

const browseBtnStyle = {
  marginTop: '24px',
  background: '#ff4b2b',
  color: 'white',
  border: 'none',
  padding: '12px 32px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: '1rem'
};

export default NotificationsPage;
