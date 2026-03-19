import React, { useState } from 'react';
import { Mail, Lock, User, UserCircle, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/register', { name, email, password, role });
      login(data.user);
      toast.success('Account created successfully!');
      if (data.user.role === 'manager') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          <h1>Get Started</h1>
          <p>Join the community of food lovers.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} style={{ position: 'absolute', left: '12px', color: '#636e72' }} />
              <input 
                type="text" 
                placeholder="John Doe" 
                style={{ paddingLeft: '40px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                placeholder="Min 8 characters" 
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
            <label>Join as</label>
            <div className="input-wrapper">
              {role === 'customer' ? (
                <UserCircle size={18} style={{ position: 'absolute', left: '12px', color: '#636e72' }} />
              ) : (
                <Briefcase size={18} style={{ position: 'absolute', left: '12px', color: '#636e72' }} />
              )}
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ paddingLeft: '40px' }}
              >
                <option value="customer">I'm a Customer</option>
                <option value="manager">I'm a Restaurant Manager</option>
              </select>
            </div>
          </div>

          <button type="submit" className="auth-btn">
            Sign Up <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <span onClick={() => navigate('/login')}>Sign In</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
