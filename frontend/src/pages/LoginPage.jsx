import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/login', { email, password });
      login(data.user);
      toast.success('Signed in successfully!');
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.role === 'manager') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
          <h1>Welcome Back</h1>
          <p>Fresh food delivered to your doorstep.</p>
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

          <div className="form-group">
            <label>Password</label>
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

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <span 
              onClick={() => navigate('/password/forgot')}
              style={{ color: '#ff4b2b', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="auth-btn">
            Sign In <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <span onClick={() => navigate('/signup')}>Create Account</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
