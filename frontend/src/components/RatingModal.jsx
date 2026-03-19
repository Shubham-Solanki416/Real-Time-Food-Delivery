import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const RatingModal = ({ isOpen, onClose, restaurantId, orderId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      await api.put('/review', {
        rating,
        comment,
        restaurantId,
        orderId
      });
      toast.success('Thank you for your review!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={overlayStyle}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={modalStyle}
          >
            <button onClick={onClose} style={closeBtnStyle}>
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={titleStyle}>Rate your order</h2>
              <p style={subtitleStyle}>How was your experience with the food?</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={starsContainerStyle}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={starButtonStyle}
                  >
                    <Star 
                      size={40} 
                      fill={(hover || rating) >= star ? "#f1c40f" : "none"} 
                      color={(hover || rating) >= star ? "#f1c40f" : "#d1d8e0"} 
                      strokeWidth={1.5}
                    />
                  </motion.button>
                ))}
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={labelStyle}>Write a comment (optional)</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about the food..."
                  style={textareaStyle}
                  rows={4}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  ...submitBtnStyle,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px'
};

const modalStyle = {
  background: '#fff',
  width: '100%',
  maxWidth: '450px',
  borderRadius: '24px',
  padding: '40px',
  position: 'relative',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

const closeBtnStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: '#f8f9fa',
  border: 'none',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#636e72'
};

const titleStyle = {
  fontSize: '1.8rem',
  fontWeight: 800,
  color: '#2d3436',
  margin: '0 0 8px 0'
};

const subtitleStyle = {
  color: '#636e72',
  fontSize: '1rem',
  margin: 0
};

const starsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '35px'
};

const starButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0
};

const labelStyle = {
  display: 'block',
  fontSize: '0.9rem',
  fontWeight: 700,
  color: '#2d3436',
  marginBottom: '10px'
};

const textareaStyle = {
  width: '100%',
  padding: '15px',
  borderRadius: '16px',
  border: '1px solid #edf2f7',
  background: '#f8fafd',
  outline: 'none',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  resize: 'none',
  transition: 'all 0.3s'
};

const submitBtnStyle = {
  width: '100%',
  background: 'linear-gradient(to right, #ff4b2b, #ff416c)',
  color: '#fff',
  padding: '14px',
  borderRadius: '16px',
  border: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: 'all 0.3s',
  boxShadow: '0 10px 15px -3px rgba(255, 75, 43, 0.3)'
};

export default RatingModal;
