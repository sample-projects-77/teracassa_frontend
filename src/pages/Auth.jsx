import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/authService';
import { getCountries } from '../services/countryService';
import CountryDropdown from '../components/CountryDropdown';
import CityDropdown from '../components/CityDropdown';
import RoleDropdown from '../components/RoleDropdown';
import './Auth.css';

const Auth = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/register' ? 'register' : 'login'
  );

  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('register');
    } else if (location.pathname === '/login') {
      setActiveTab('login');
    }
  }, [location.pathname]);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    roleTitle: '',
    baseCountry: '',
    baseCity: '',
    phone: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const { login: authLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
    setError('');
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
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    // Reset file input
    const fileInput = document.getElementById('register-avatar');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(loginData.email, loginData.password);
      
      if (response.user && response.token) {
        authLogin(response.user, response.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('email', registerData.email);
      formData.append('password', registerData.password);
      formData.append('firstName', registerData.firstName);
      formData.append('lastName', registerData.lastName);
      if (registerData.companyName) {
        formData.append('companyName', registerData.companyName);
      }
      if (registerData.roleTitle) {
        formData.append('roleTitle', registerData.roleTitle);
      }
      if (registerData.baseCountry) {
        formData.append('baseCountry', registerData.baseCountry);
      }
      if (registerData.baseCity) {
        formData.append('baseCity', registerData.baseCity);
      }
      if (registerData.phone) {
        formData.append('phone', registerData.phone);
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await register(formData);
      
      if (response.user && response.token) {
        authLogin(response.user, response.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Header Navigation */}
      <header className="auth-header">
        <div className="header-container">
          <Link to="/" className="logo">
            TerraCasa
          </Link>
          
          <nav className="header-nav">
            <Link to="/">Homepage</Link>
            <Link to="/properties">Properties</Link>
            <Link to="/countries">Countries</Link>
            <Link to="/network">Network</Link>
            <Link to="/post-ad">Post Ad</Link>
            <Link to="/about">About Us</Link>
          </nav>

          <div className="header-utils">
            <div className="currency-selector">
              <span>$ € EUR</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="language-selector">
              <span>A EN English (EN)</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <button className="icon-button">
              <span className="icon">♡</span>
            </button>
            <button className="icon-button">
              <span className="icon">👤</span>
            </button>
            {!isAuthenticated && (
              <Link to="/login" className="header-login-btn">Login</Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="auth-main-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to TerraCasa</h1>
          <p className="welcome-subtitle">Your access to international real estate</p>
        </div>

        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setError('');
                navigate('/login', { replace: true });
              }}
            >
              Login
            </button>
            <button
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setError('');
                navigate('/register', { replace: true });
              }}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="auth-form-container">
              <h2 className="form-title">Login</h2>
              <p className="form-subtitle">Log in with your account</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="login-email">E-Mail</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>

                <button type="submit" className="auth-button primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="auth-form-container">
              <h2 className="form-title">Register</h2>
              <p className="form-subtitle">Create your account to get started</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="register-firstName">First Name</label>
                    <input
                      type="text"
                      id="register-firstName"
                      name="firstName"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      placeholder="First name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-lastName">Last Name</label>
                    <input
                      type="text"
                      id="register-lastName"
                      name="lastName"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">E-Mail *</label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Password *</label>
                    <input
                      type="password"
                      id="register-password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      placeholder="Create a password"
                      minLength="6"
                    />
                </div>

                <div className="form-group">
                  <label htmlFor="register-companyName">Company Name</label>
                  <input
                    type="text"
                    id="register-companyName"
                    name="companyName"
                    value={registerData.companyName}
                    onChange={handleRegisterChange}
                    placeholder="Company name (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-roleTitle">Role Title</label>
                  <RoleDropdown
                    id="register-roleTitle"
                    name="roleTitle"
                    value={registerData.roleTitle}
                    onChange={handleRegisterChange}
                    placeholder="Select role (optional)"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="register-baseCountry">Base Country</label>
                    <CountryDropdown
                      id="register-baseCountry"
                      name="baseCountry"
                      value={registerData.baseCountry}
                      onChange={(e) => {
                        handleRegisterChange(e);
                        // Reset city when country changes
                        setRegisterData({
                          ...registerData,
                          baseCountry: e.target.value,
                          baseCity: ''
                        });
                      }}
                      countries={countries}
                      placeholder="Select country (optional)"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-baseCity">Base City</label>
                    <CityDropdown
                      id="register-baseCity"
                      name="baseCity"
                      value={registerData.baseCity}
                      onChange={handleRegisterChange}
                      countryCode={registerData.baseCountry}
                      placeholder="Select city (optional)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-phone">Phone</label>
                  <input
                    type="tel"
                    id="register-phone"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="Phone number (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-avatar">Avatar Image</label>
                  <input
                    type="file"
                    id="register-avatar"
                    name="avatar"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label
                      htmlFor="register-avatar"
                      style={{
                        padding: '10px 15px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        backgroundColor: '#f9f9f9',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                    >
                      {avatarFile ? 'Change Avatar Image' : 'Choose Avatar Image (optional)'}
                    </label>
                    {avatarPreview && (
                      <div style={{ position: 'relative', display: 'inline-block', maxWidth: '150px' }}>
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '4px',
                            maxHeight: '150px',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={removeAvatar}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'rgba(255, 0, 0, 0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            lineHeight: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Supported formats: PNG, JPEG, JPG, GIF, WEBP (max 5MB)
                  </p>
                </div>

                <button type="submit" className="auth-button primary" disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

