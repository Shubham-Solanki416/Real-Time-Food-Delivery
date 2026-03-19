import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await api.put(`/password/reset/${token}`, { password, confirmPassword });
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'rgba(255, 75, 43, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <ShieldCheck size={32} color="#ff4b2b" />
          </div>
          <h1>Reset Password</h1>
          <p>Create a secure new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: '#636e72' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                style={{ paddingLeft: '40px', paddingRight: '40px', width: '100%' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', cursor: 'pointer', color: '#636e72', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: '#636e72' }} />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                style={{ paddingLeft: '40px', paddingRight: '40px', width: '100%' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '12px', cursor: 'pointer', color: '#636e72', display: 'flex', alignItems: 'center' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Set New Password'} 
            <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </button>
        </form>

        <div className="auth-footer">
          Remember your password? <span onClick={() => navigate('/login')}>Sign In</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
