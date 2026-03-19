import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  MapPin, 
  Phone,
  Loader2,
  ChefHat
} from 'lucide-react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';
import RatingModal from '../components/RatingModal';
import AnimatedRouteMap from '../components/AnimatedRouteMap';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const statuses = [
    { id: 'Order Placed', icon: <Package size={24} />, label: 'Order Confirmed' },
    { id: 'Preparing', icon: <ChefHat size={24} />, label: 'Preparing Food' },
    { id: 'Out for Delivery', icon: <Truck size={24} />, label: 'On the Way' },
    { id: 'Delivered', icon: <CheckCircle2 size={24} />, label: 'Delivered' }
  ];

  const getStatusIndex = (status) => {
    return statuses.findIndex(s => s.id === status);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/order/${id}`);
        setOrder(data.order);
      } catch (error) {
        toast.error('Order not found');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Socket.IO for real-time tracking
    const socket = io('http://localhost:4000');
    
    socket.emit('join chat', id); 
    
    socket.on(`orderUpdate-${id}`, (update) => {
      setOrder(prev => ({ ...prev, orderStatus: update.status }));
      toast.success(`Order status updated to: ${update.status}`, { icon: '🚚' });
    });

    return () => socket.disconnect();
  }, [id, navigate]);

  useEffect(() => {
    if (order?.orderStatus === 'Delivered' && !order.isRated) {
      const timer = setTimeout(() => setShowRatingModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [order?.orderStatus, order?.isRated]);

  if (loading) {
    return (
      <div style={fullPageLoadingStyle}>
        <Loader2 className="animate-spin" size={48} color="#ff4b2b" />
        <p style={{ marginTop: '20px', color: '#636e72', fontWeight: 600 }}>Locating your order...</p>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order?.orderStatus);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <button onClick={() => navigate('/home')} style={backBtnStyle}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div style={orderHeaderInfoStyle}>
             <h1 style={titleStyle}>Track Order</h1>
             <span style={orderIdTagStyle}>ID: #{order?._id.slice(-6)}</span>
          </div>
        </header>

        <div style={mainContentStyle}>
          {/* Progress Tracker Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={cardStyle}
          >
            <div style={trackerContainerStyle}>
              {statuses.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={step.id} style={stepWrapperStyle}>
                    <div style={stepLineContainerStyle}>
                      {index !== 0 && (
                        <div style={{
                          ...lineStyle,
                          background: index <= currentStatusIndex ? '#ff4b2b' : '#edf2f7'
                        }} />
                      )}
                      <div style={{
                        ...iconCircleStyle,
                        background: isActive ? '#ff4b2b' : '#fff',
                        borderColor: isActive ? '#ff4b2b' : '#edf2f7',
                        color: isActive ? '#fff' : '#b2bec3',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(255, 75, 43, 0.2)' : 'none'
                      }}>
                        {step.icon}
                      </div>
                    </div>
                    <span style={{
                      ...stepLabelStyle,
                      color: isActive ? '#2d3436' : '#b2bec3',
                      fontWeight: isActive ? 800 : 500
                    }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Order Details Grid */}
          <div style={detailsGridStyle}>
            {/* Delivery Info */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               style={cardStyle}
            >
              <h3 style={cardTitleStyle}>Delivery Details</h3>
              <div style={infoRowStyle}>
                <MapPin size={20} color="#ff4b2b" />
                <div>
                  <p style={infoLabelStyle}>Address</p>
                  <p style={infoValueStyle}>{order?.shippingInfo.address}, {order?.shippingInfo.city}</p>
                </div>
              </div>
              <div style={infoRowStyle}>
                <Phone size={20} color="#ff4b2b" />
                <div>
                  <p style={infoLabelStyle}>Phone</p>
                  <p style={infoValueStyle}>{order?.shippingInfo.phoneNo}</p>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               style={cardStyle}
            >
              <h3 style={cardTitleStyle}>Order Summary</h3>
              <div style={itemsListStyle}>
                {order?.orderItems.map((item, i) => (
                  <div key={i} style={itemRowStyle}>
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={dividerStyle} />
              <div style={totalRowStyle}>
                <span>Total Amount</span>
                <span>₹{order?.totalPrice.toFixed(2)}</span>
              </div>
            </motion.div>
          </div>

          {/* Map Tracking Section */}
          {order?.orderStatus === 'Out for Delivery' && order?.orderItems[0]?.restaurant && order?.shippingInfo?.location && (
            <AnimatedRouteMap 
              restaurantLocation={order.orderItems[0].restaurant.location} // Important: requires populate on backend!
              deliveryLocation={order.shippingInfo.location}
              restaurantName={order.orderItems[0].restaurant.name}
            />
          )}
        </div>
      </div>

      <RatingModal 
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        restaurantId={order?.orderItems[0]?.restaurant}
        orderId={id}
        onSuccess={() => setOrder(prev => ({ ...prev, isRated: true }))}
      />
    </div>
  );
};

// Styles
const pageStyle = { minHeight: '100vh', background: '#f8fafd', padding: '120px 20px 60px' };
const containerStyle = { maxWidth: '1000px', margin: '0 auto' };
const fullPageLoadingStyle = { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' };
const headerStyle = { marginBottom: '40px' };
const backBtnStyle = { background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#636e72', fontWeight: 600, cursor: 'pointer', marginBottom: '15px' };
const orderHeaderInfoStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' };
const titleStyle = { fontSize: '2.5rem', fontWeight: 800, color: '#2d3436', margin: 0 };
const orderIdTagStyle = { background: '#fff', padding: '8px 16px', borderRadius: '12px', color: '#ff4b2b', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' };
const mainContentStyle = { display: 'flex', flexDirection: 'column', gap: '30px' };
const cardStyle = { background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f2f6' };
const trackerContainerStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 0' };
const stepWrapperStyle = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', position: 'relative' };
const stepLineContainerStyle = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const lineStyle = { position: 'absolute', right: '50%', width: '100%', height: '4px', zIndex: 0 };
const iconCircleStyle = { width: '60px', height: '60px', borderRadius: '50%', border: '4px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' };
const stepLabelStyle = { fontSize: '0.9rem', textAlign: 'center' };
const detailsGridStyle = { display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '30px' };
const cardTitleStyle = { fontSize: '1.2rem', fontWeight: 800, marginBottom: '25px', color: '#2d3436' };
const infoRowStyle = { display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-start' };
const infoLabelStyle = { margin: 0, fontSize: '0.8rem', color: '#636e72', textTransform: 'uppercase', fontWeight: 700 };
const infoValueStyle = { margin: '4px 0 0 0', fontWeight: 600, color: '#2d3436' };
const itemsListStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const itemRowStyle = { display: 'flex', justifyContent: 'space-between', color: '#636e72', fontWeight: 500 };
const dividerStyle = { height: '1px', background: '#f1f2f6', margin: '20px 0' };
const totalRowStyle = { display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#2d3436' };

export default OrderTracking;
