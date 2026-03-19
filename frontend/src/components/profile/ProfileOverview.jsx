import React, { useState } from 'react';
import { Camera, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ProfileOverview = ({ user }) => {
  const { login } = useAuth(); // To update user context locally
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || '');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image size must be less than 2MB");
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = { ...formData };
      if (avatar) dataToSubmit.avatar = avatar;

      const { data } = await api.put('/me/update', dataToSubmit);
      toast.success('Profile updated successfully');
      login(data.user); // update the context with new data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#2d3436' }}>Profile Overview</h3>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f1f2f6', border: '3px solid #ff4b2b' }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a4b0be', fontSize: '2rem', fontWeight: 'bold' }}>
                {formData.name.charAt(0)}
              </div>
            )}
            <label style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
              <Camera size={16} color="white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Profile Photo</h4>
            <p style={{ margin: 0, color: '#636e72', fontSize: '0.9rem' }}>Upload a new photo (max 2MB)</p>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Full Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem' }}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem', backgroundColor: '#f8f9fa' }}
            readOnly // Make readOnly if you don't allow changing email, or remove readOnly if allowed.
          />
        </div>

        <div className="form-group" style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#ff4b2b', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileOverview;
