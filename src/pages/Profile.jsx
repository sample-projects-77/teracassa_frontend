import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/profileService';
import { getCountries } from '../services/countryService';
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
  const [countries, setCountries] = useState([]);

  // Role title options
  const roleTitleOptions = [
    'Real Estate Agent',
    'Lawyer',
    'Appraiser',
    'Contractor',
    'Translator',
    'Architect',
    'Moving Company'
  ];

  // Cities by country code
  const citiesByCountry = {
    'TR': ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bodrum', 'Alanya', 'Fethiye', 'Marmaris'],
    'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Marbella', 'Mallorca', 'Malaga', 'Alicante'],
    'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Florence', 'Bologna'],
    'GR': ['Athens', 'Thessaloniki', 'Crete', 'Rhodes', 'Santorini', 'Mykonos', 'Corfu', 'Patras'],
    'PT': ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Algarve', 'Madeira', 'Aveiro'],
    'HR': ['Zagreb', 'Split', 'Dubrovnik', 'Rijeka', 'Zadar', 'Pula', 'Osijek', 'Istria'],
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux'],
    'DE': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund']
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    }
  };

  const getCitiesForCountry = (countryCode) => {
    if (!countryCode) return [];
    return citiesByCountry[countryCode.toUpperCase()] || [];
  };

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
          <select
            id="roleTitle"
            name="roleTitle"
            value={formData.roleTitle}
            onChange={handleChange}
          >
            <option value="">Select role (optional)</option>
            {roleTitleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="baseCountry">Base Country</label>
            <select
              id="baseCountry"
              name="baseCountry"
              value={formData.baseCountry}
              onChange={(e) => {
                handleChange(e);
                // Reset city when country changes
                setFormData({
                  ...formData,
                  baseCountry: e.target.value,
                  baseCity: ''
                });
              }}
            >
              <option value="">Select country (optional)</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} - {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="baseCity">Base City</label>
            <select
              id="baseCity"
              name="baseCity"
              value={formData.baseCity}
              onChange={handleChange}
              disabled={!formData.baseCountry}
            >
              <option value="">Select city (optional)</option>
              {getCitiesForCountry(formData.baseCountry).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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

