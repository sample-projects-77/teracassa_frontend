import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/authService';
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
    avatarUrl: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(loginData.email, loginData.password);
      
      if (response.user && response.token) {
        authLogin(response.user, response.token);
        navigate('/dashboard');
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
      const response = await register(registerData);
      
      if (response.user && response.token) {
        authLogin(response.user, response.token);
        navigate('/dashboard');
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

                <div className="divider">
                  <span>OR CONTINUE WITH</span>
                </div>

                <button type="button" className="auth-button google-button">
                  <span className="google-icon">G</span>
                  Google
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
                  <input
                    type="text"
                    id="register-roleTitle"
                    name="roleTitle"
                    value={registerData.roleTitle}
                    onChange={handleRegisterChange}
                    placeholder="e.g., Real Estate Agent (optional)"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="register-baseCountry">Base Country</label>
                    <input
                      type="text"
                      id="register-baseCountry"
                      name="baseCountry"
                      value={registerData.baseCountry}
                      onChange={handleRegisterChange}
                      placeholder="e.g., TR, ES (optional)"
                      maxLength="2"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-baseCity">Base City</label>
                    <input
                      type="text"
                      id="register-baseCity"
                      name="baseCity"
                      value={registerData.baseCity}
                      onChange={handleRegisterChange}
                      placeholder="City name (optional)"
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
                  <label htmlFor="register-avatarUrl">Avatar URL</label>
                  <input
                    type="url"
                    id="register-avatarUrl"
                    name="avatarUrl"
                    value={registerData.avatarUrl}
                    onChange={handleRegisterChange}
                    placeholder="Profile image URL (optional)"
                  />
                </div>

                <button type="submit" className="auth-button primary" disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </button>

                <div className="divider">
                  <span>OR CONTINUE WITH</span>
                </div>

                <button type="button" className="auth-button google-button">
                  <span className="google-icon">G</span>
                  Google
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

