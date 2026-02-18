import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/profileService';
import { getCountries } from '../services/countryService';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, loading: authLoading, fetchUser } = useAuth();
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
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

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
    // Don't fetch user data here - it's already fetched by AuthContext on mount
    // Only fetch if user is missing and auth is not loading
  }, []); // Empty dependency array - only run once on mount

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
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // If we have user data, use it
    if (user) {
      const formDataToSet = {
        avatarUrl: user.avatarUrl || '',
        companyName: user.companyName || '',
        roleTitle: user.roleTitle || '',
        baseCountry: user.baseCountry || '',
        baseCity: user.baseCity || '',
        phone: user.phone || '',
      };
      setFormData(formDataToSet);
      
      // Set avatar preview if user has avatarUrl
      if (user.avatarUrl) {
        setAvatarPreview(user.avatarUrl);
      } else {
        setAvatarPreview(null);
      }
      setInitialLoad(false);
    } else {
      // If no user in context, try localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setFormData({
            avatarUrl: parsedUser.avatarUrl || '',
            companyName: parsedUser.companyName || '',
            roleTitle: parsedUser.roleTitle || '',
            baseCountry: parsedUser.baseCountry || '',
            baseCity: parsedUser.baseCity || '',
            phone: parsedUser.phone || '',
          });
          if (parsedUser.avatarUrl) {
            setAvatarPreview(parsedUser.avatarUrl);
          }
          setInitialLoad(false);
        } catch (e) {
          console.error('Error parsing stored user:', e);
          setInitialLoad(false);
        }
      } else {
        setInitialLoad(false);
      }
    }
  }, [user, authLoading]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData({
          ...formData,
          avatarUrl: reader.result, // Set preview as URL for now
        });
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormData({
      ...formData,
      avatarUrl: '',
    });
    // Reset file input
    const fileInput = document.getElementById('profile-avatar');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create FormData if avatar file is selected
      let dataToSend;
      if (avatarFile) {
        const formDataObj = new FormData();
        formDataObj.append('avatar', avatarFile);
        formDataObj.append('companyName', formData.companyName || '');
        formDataObj.append('roleTitle', formData.roleTitle || '');
        formDataObj.append('baseCountry', formData.baseCountry || '');
        formDataObj.append('baseCity', formData.baseCity || '');
        formDataObj.append('phone', formData.phone || '');
        dataToSend = formDataObj;
      } else {
        // Send all form data including avatarUrl if it exists
        dataToSend = {
          ...formData,
          // Preserve avatarUrl if it exists and no new file is being uploaded
          avatarUrl: formData.avatarUrl || user?.avatarUrl || ''
        };
      }

      const updatedUser = await updateProfile(dataToSend);
      updateUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setAvatarFile(null); // Clear file after successful update
      // Refresh user data to get latest from server
      if (fetchUser) {
        await fetchUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while user data is being fetched
  if (authLoading || (initialLoad && !user)) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="profile-header">
          <h1>Edit Profile</h1>
          <p>Update your profile information</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading profile data...</div>
      </div>
    );
  }

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
          <label htmlFor="profile-avatar">Profile Picture</label>
          <input
            type="file"
            id="profile-avatar"
            name="avatar"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {avatarPreview ? (
              <div style={{ position: 'relative', display: 'inline-block', maxWidth: '200px' }}>
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    border: '1px solid #e0e0e0'
                  }}
                />
                <button
                  type="button"
                  onClick={removeAvatar}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    lineHeight: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  ×
                </button>
              </div>
            ) : null}
            <label
              htmlFor="profile-avatar"
              style={{
                padding: '12px 20px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                transition: 'background-color 0.2s ease',
                display: 'inline-block',
                width: 'fit-content'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f9f9f9'}
            >
              {avatarPreview ? 'Change Picture' : 'Upload Picture'}
            </label>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Supported formats: PNG, JPEG, JPG, GIF, WEBP (max 5MB)
          </p>
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

