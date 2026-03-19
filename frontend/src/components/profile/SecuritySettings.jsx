import React, { useState } from 'react';
import { Shield, Key, AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SecuritySettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setLoading(true);
    try {
      await api.put('/password/update', passwords);
      toast.success('Password updated successfully');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your data."
    );

    if (!isConfirmed) return;

    setDeleteLoading(true);
    try {
      await api.delete('/me/delete');
      toast.success('Account deleted successfully');
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#2d3436' }}>Security Settings</h3>

      <div style={{ maxWidth: '500px', marginBottom: '48px' }}>
        <h4 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#2d3436' }}>
          <Key size={20} color="#ff4b2b" /> Change Password
        </h4>
        
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Current Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showOldPassword ? "text" : "password"} 
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: '1px solid #f1f3f5', background: '#f8fafd', fontSize: '0.95rem' }}
                required
              />
              <div 
                onClick={() => setShowOldPassword(!showOldPassword)}
                style={{ position: 'absolute', right: '12px', cursor: 'pointer', color: '#636e72', display: 'flex', alignItems: 'center' }}
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>New Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showNewPassword ? "text" : "password"} 
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: '1px solid #f1f3f5', background: '#f8fafd', fontSize: '0.95rem' }}
                minLength={8}
                required
              />
              <div 
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ position: 'absolute', right: '12px', cursor: 'pointer', color: '#636e72', display: 'flex', alignItems: 'center' }}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Confirm New Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: '1px solid #f1f3f5', background: '#f8fafd', fontSize: '0.95rem' }}
                minLength={8}
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

          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '12px 24px', backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading && <Loader2 size={16} className="spin" />}
            Update Password
          </button>
        </form>
      </div>

      <div style={{ maxWidth: '500px', padding: '24px', border: '1px solid #ff7675', borderRadius: '12px', backgroundColor: 'rgba(214, 48, 49, 0.05)' }}>
        <h4 style={{ fontSize: '1.2rem', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#d63031' }}>
          <AlertTriangle size={20} /> Delete Account
        </h4>
        <p style={{ margin: '0 0 20px 0', color: '#636e72', lineHeight: 1.5 }}>
          Once you delete your account, there is no going back. Please be certain. All your data, orders, and saved addresses will be permanently removed.
        </p>
        <button 
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          style={{ padding: '12px 24px', backgroundColor: '#d63031', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {deleteLoading && <Loader2 size={16} className="spin" />}
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
