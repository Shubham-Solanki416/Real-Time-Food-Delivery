import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  ShoppingBag, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Loader2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/me');
        setOrders(data.orders.reverse());
      } catch (error) {
        toast.error('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      'Order Placed': { bg: '#fff5f5', color: '#ff4b2b' },
      'Preparing': { bg: '#ebf5ff', color: '#3498db' },
      'Out for Delivery': { bg: '#fff9db', color: '#f1c40f' },
      'Delivered': { bg: '#eafaf1', color: '#2ecc71' }
    };
    return styles[status] || styles['Order Placed'];
  };

  if (loading) {
    return (
      <div style={fullPageStatusStyle}>
        <Loader2 className="animate-spin" size={48} color="#ff4b2b" />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <button onClick={() => navigate('/home')} style={backBtnStyle}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <h1 style={titleStyle}>Order History</h1>
          <p style={subtitleStyle}>Review and track your previous delicious meals.</p>
        </header>

        <div style={ordersListStyle}>
          <AnimatePresence>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={orderCardStyle}
                  onClick={() => navigate(`/order/track/${order._id}`)}
                >
                  <div style={orderHeaderStyle}>
                    <div style={orderMainInfoStyle}>
                      <div style={orderIconWrapperStyle}>
                        <ShoppingBag size={24} color="#ff4b2b" />
                      </div>
                      <div>
                        <h4 style={orderIdStyle}>Order #{order._id.slice(-6).toUpperCase()}</h4>
                        <div style={orderMetaRowStyle}>
                          <Calendar size={14} />
                          <span>{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span style={dotStyle}>•</span>
                          <Clock size={14} />
                          <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      ...statusBadgeStyle,
                      background: getStatusStyle(order.orderStatus).bg,
                      color: getStatusStyle(order.orderStatus).color
                    }}>
                      {order.orderStatus}
                    </div>
                  </div>

                  <div style={orderContentStyle}>
                    <div style={itemsPreviewStyle}>
                      {order.orderItems.map((item, i) => (
                        <span key={i} style={itemTagStyle}>
                          {item.quantity}x {item.name} {item.isVeg && <span style={{ color: '#27ae60', fontWeight: 'bold' }}>•</span>}
                        </span>
                      ))}
                    </div>
                    <div style={priceContainerStyle}>
                      <span style={priceLabelStyle}>Total Paid</span>
                      <span style={priceValueStyle}>₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={orderFooterStyle}>
                    <span style={trackLinkStyle}>
                      View Status & Details <ChevronRight size={16} />
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={emptyStateStyle}
              >
                <div style={emptyIconCircleStyle}>
                  <ShoppingBag size={48} color="#dfe6e9" />
                </div>
                <h3>No orders yet</h3>
                <p>Hungry? Start exploring restaurants and place your first order!</p>
                <button onClick={() => navigate('/home')} style={browseBtnStyle}>
                  Browse Restaurants
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Styles
const pageStyle = { minHeight: '100vh', background: '#f8fafd', padding: '120px 20px 60px' };
const containerStyle = { maxWidth: '800px', margin: '0 auto' };
const fullPageStatusStyle = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' };
const headerStyle = { marginBottom: '40px' };
const backBtnStyle = { background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#636e72', fontWeight: 600, cursor: 'pointer', marginBottom: '15px' };
const titleStyle = { fontSize: '2.5rem', fontWeight: 800, color: '#2d3436', margin: 0 };
const subtitleStyle = { color: '#636e72', marginTop: '5px', fontSize: '1.1rem' };
const ordersListStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };

const orderCardStyle = {
  background: '#fff',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
  border: '1px solid #f1f2f6',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  ':hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }
};

const orderHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' };
const orderMainInfoStyle = { display: 'flex', gap: '16px', alignItems: 'center' };
const orderIconWrapperStyle = { width: '50px', height: '50px', background: '#fff5f5', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const orderIdStyle = { margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#2d3436' };
const orderMetaRowStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: '#95a5a6', fontSize: '0.85rem', marginTop: '4px' };
const dotStyle = { fontSize: '1.2rem', lineHeight: 0 };

const statusBadgeStyle = { padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' };

const orderContentStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '15px 0', borderTop: '1px solid #f8f9fa', borderBottom: '1px solid #f8f9fa' };
const itemsPreviewStyle = { flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px' };
const itemTagStyle = { background: '#f8fafd', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#636e72', fontWeight: 500 };

const priceContainerStyle = { textAlign: 'right', minWidth: '100px' };
const priceLabelStyle = { display: 'block', fontSize: '0.75rem', color: '#b2bec3', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' };
const priceValueStyle = { fontSize: '1.2rem', fontWeight: 800, color: '#2d3436' };

const orderFooterStyle = { marginTop: '15px', display: 'flex', justifyContent: 'flex-end' };
const trackLinkStyle = { color: '#ff4b2b', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' };

const emptyStateStyle = { textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' };
const emptyIconCircleStyle = { width: '100px', height: '100px', background: '#f8fafd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' };
const browseBtnStyle = { marginTop: '25px', background: '#ff4b2b', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 5px 15px rgba(255, 75, 43, 0.3)' };

export default OrderHistory;
