import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/profileService';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    avatarUrl: '',
    companyName: '',
    roleTitle: '',
    baseCountry: '',
    baseCity: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        avatarUrl: user.avatarUrl || '',
        companyName: user.companyName || '',
        roleTitle: user.roleTitle || '',
        baseCountry: user.baseCountry || '',
        baseCity: user.baseCity || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-header">
        <h1>Edit Profile</h1>
        <p>Update your profile information</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="avatarUrl">Avatar URL</label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="roleTitle">Role Title</label>
          <input
            type="text"
            id="roleTitle"
            name="roleTitle"
            value={formData.roleTitle}
            onChange={handleChange}
            placeholder="e.g., Immobilienmaklerin"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="baseCountry">Base Country</label>
            <input
              type="text"
              id="baseCountry"
              name="baseCountry"
              value={formData.baseCountry}
              onChange={handleChange}
              placeholder="e.g., TR"
              maxLength="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="baseCity">Base City</label>
            <input
              type="text"
              id="baseCity"
              name="baseCity"
              value={formData.baseCity}
              onChange={handleChange}
              placeholder="City name"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;

