import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import AddressPickerMap from '../components/AddressPickerMap';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated, loadUser } = useAuth();
  const navigate = useNavigate();
  const [deliveryLocation, setDeliveryLocation] = React.useState(null);

  const tax = totalAmount * 0.05;
  const deliveryFee = cart.length > 0 ? 40 : 0;
  const grandTotal = totalAmount + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    if (!deliveryLocation) {
      toast.error('Please select a delivery address on the map');
      return;
    }

    const orderData = {
      shippingInfo: {
        address: deliveryLocation.address,
        city: "City details attached to address", // Simplified as Nominatim full address often contains city
        phoneNo: 1234567890,
        location: {
          lat: deliveryLocation.lat,
          lng: deliveryLocation.lng
        }
      },
      orderItems: cart.map(item => ({
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.images?.[0]?.url || item.image,
        food: item._id, 
        restaurant: item.restaurantId || item.restaurant 
      })),
      paymentInfo: {
        id: "COD_PAYMENT",
        status: "Succeeded"
      },
      itemsPrice: totalAmount,
      taxPrice: tax,
      deliveryPrice: deliveryFee,
      totalPrice: grandTotal
    };

    try {
      const { data } = await api.post('/order/new', orderData);
      
      toast.success('Order placed successfully!', {
        icon: '🎉',
        duration: 5000
      });

      clearCart();
      navigate(`/order/track/${data.order._id}`);
    } catch (error) {
      console.error("Order error:", error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please Logout and Login again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <button onClick={() => navigate(-1)} style={backBtnStyle}>
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
          <h1 style={titleStyle}>Your Food Basket</h1>
        </header>

        <div style={contentStyle}>
          {/* Cart Items List */}
          <div style={itemsSectionStyle}>
            {cart.length > 0 && (
              <AddressPickerMap onAddressSelect={setDeliveryLocation} />
            )}
            <AnimatePresence>
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={emptyStateStyle}
                >
                  <ShoppingCart size={64} color="#dfe6e9" />
                  <h3>Your cart is empty</h3>
                  <p>Browse restaurants and add some delicious food!</p>
                  <button onClick={() => navigate('/home')} style={browseBtnStyle}>
                    Browse Restaurants
                  </button>
                </motion.div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    key={item.cartItemId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={cartItemStyle}
                  >
                    <img src={item.images?.[0]?.url || item.image} alt={item.name} style={itemImgStyle} />
                    <div style={itemInfoStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={itemNameStyle}>{item.name}</h4>
                        {item.isVeg && (
                          <div style={vegBadgeStyle}>
                            <div style={vegDotStyle} />
                          </div>
                        )}
                      </div>
                      <p style={itemPriceStyle}>₹{item.price}</p>
                    </div>
                    
                    <div style={quantityControlStyle}>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        style={qtyBtnStyle}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={qtyValueStyle}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        style={qtyBtnStyle}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={itemTotalStyle}>
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      style={removeBtnStyle}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div style={summarySectionStyle}>
            <div style={summaryCardStyle}>
              <h3 style={summaryTitleStyle}>Order Summary</h3>
              
              <div style={summaryRowStyle}>
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <div style={summaryRowStyle}>
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              
              <div style={summaryRowStyle}>
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div style={dividerStyle} />

              <div style={{ ...summaryRowStyle, fontWeight: 800, fontSize: '1.2rem', color: '#2d3436' }}>
                <span>Total Amount</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                style={checkoutBtnStyle}
                disabled={cart.length === 0}
              >
                <CreditCard size={20} />
                Confirm Order
              </motion.button>
              
              <p style={noticeStyle}>
                By confirming, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const pageStyle = {
  minHeight: '100vh',
  background: '#f8fafd',
  padding: '120px 20px 60px'
};

const containerStyle = {
  maxWidth: '1100px',
  margin: '0 auto'
};

const headerStyle = {
  marginBottom: '40px'
};

const backBtnStyle = {
  background: 'none',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#636e72',
  fontWeight: 600,
  cursor: 'pointer',
  marginBottom: '15px'
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: 800,
  color: '#2d3436',
  margin: 0
};

const contentStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 380px',
  gap: '40px',
  alignItems: 'start'
};

const itemsSectionStyle = {
  background: '#fff',
  borderRadius: '24px',
  padding: '30px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
  minHeight: '400px'
};

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '340px',
  textAlign: 'center',
  color: '#636e72'
};

const browseBtnStyle = {
  marginTop: '20px',
  background: '#ff4b2b',
  color: '#fff',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(255, 75, 43, 0.3)'
};

const cartItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '20px 0',
  borderBottom: '1px solid #f1f2f6',
  gap: '20px'
};

const itemImgStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '16px',
  objectFit: 'cover'
};

const itemInfoStyle = {
  flex: 1
};

const itemNameStyle = {
  margin: '0 0 5px 0',
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#2d3436'
};

const itemPriceStyle = {
  margin: 0,
  color: '#636e72',
  fontWeight: 600
};

const quantityControlStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#f8f9fa',
  borderRadius: '10px',
  padding: '5px'
};

const qtyBtnStyle = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: '#fff',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#ff4b2b',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};

const qtyValueStyle = {
  margin: '0 15px',
  fontWeight: 700,
  fontSize: '1rem',
  minWidth: '20px',
  textAlign: 'center'
};

const itemTotalStyle = {
  fontSize: '1.1rem',
  fontWeight: 800,
  color: '#2d3436',
  minWidth: '80px',
  textAlign: 'right'
};

const removeBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fab1a0',
  cursor: 'pointer',
  padding: '8px',
  transition: 'color 0.2s',
  ':hover': { color: '#ff7675' }
};

const summarySectionStyle = {
  position: 'sticky',
  top: '120px'
};

const summaryCardStyle = {
  background: '#fff',
  borderRadius: '24px',
  padding: '30px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
  border: '1px solid #f1f2f6'
};

const summaryTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 800,
  marginBottom: '25px',
  color: '#2d3436'
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '15px',
  color: '#636e72',
  fontWeight: 500
};

const dividerStyle = {
  height: '1px',
  background: '#f1f2f6',
  margin: '20px 0'
};

const checkoutBtnStyle = {
  width: '100%',
  background: 'linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)',
  color: '#fff',
  border: 'none',
  padding: '18px',
  borderRadius: '16px',
  fontSize: '1.1rem',
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginTop: '25px',
  boxShadow: '0 10px 20px rgba(255, 75, 43, 0.25)',
  transition: 'transform 0.2s'
};

const noticeStyle = {
  fontSize: '0.8rem',
  color: '#b2bec3',
  textAlign: 'center',
  marginTop: '20px',
  padding: '0 10px'
};

const vegBadgeStyle = {
  width: '14px',
  height: '14px',
  border: '1.5px solid #27ae60',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '2px',
  flexShrink: 0
};

const vegDotStyle = {
  width: '7px',
  height: '7px',
  background: '#27ae60',
  borderRadius: '50%'
};

export default Cart;
