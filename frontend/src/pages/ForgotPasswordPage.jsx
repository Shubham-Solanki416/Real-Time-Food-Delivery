import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/password/forgot', { email });
      toast.success('Reset link sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h1>Forgot Password?</h1>
          <p>Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} style={{ position: 'absolute', left: '12px', color: '#636e72' }} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'} 
            {!loading && <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />}
          </button>
        </form>

        <div className="auth-footer">
          <span onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={16} style={{ marginRight: '5px' }} /> Back to Login
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
