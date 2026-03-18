import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/authService';
import { getCountries } from '../services/countryService';
import Navbar from '../components/Navbar';
import CountryDropdown from '../components/CountryDropdown';
import CityDropdown from '../components/CityDropdown';
import RoleDropdown from '../components/RoleDropdown';
import { useTranslation } from '../context/TranslationContext';
import './Auth.css';

const Auth = () => {
  const { t } = useTranslation();
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
  const [verificationDocFiles, setVerificationDocFiles] = useState([]);
  const [verificationDocPreviews, setVerificationDocPreviews] = useState([]);
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

  const MAX_VERIFICATION_DOCS = 10;
  const handleVerificationDocsChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const valid = [];
    const invalid = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        invalid.push(file.name + ' (not an image)');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        invalid.push(file.name + ' (max 5MB)');
        continue;
      }
      valid.push(file);
    }
    if (invalid.length > 0) {
      setError('Some files were skipped: ' + invalid.join(', '));
    }
    setVerificationDocFiles((prev) => [...prev, ...valid].slice(0, MAX_VERIFICATION_DOCS));
    if (valid.length > 0) setError('');
    e.target.value = '';
  };

  useEffect(() => {
    if (verificationDocFiles.length === 0) {
      setVerificationDocPreviews([]);
      return;
    }
    let cancelled = false;
    const readers = verificationDocFiles.map((file) =>
      new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(file);
      })
    );
    Promise.all(readers).then((results) => {
      if (!cancelled) setVerificationDocPreviews(results);
    });
    return () => { cancelled = true; };
  }, [verificationDocFiles]);

  const removeVerificationDoc = (index) => {
    setVerificationDocFiles((prev) => prev.filter((_, i) => i !== index));
    const fileInput = document.getElementById('register-verification-docs');
    if (fileInput) fileInput.value = '';
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
      setError(err.message || t('auth.loginFailed'));
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
      verificationDocFiles.forEach((file) => {
        formData.append('verificationDocs', file);
      });

      const response = await register(formData);
      
      if (response.user && response.token) {
        authLogin(response.user, response.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      {/* Main Content */}
      <div className="auth-main-content">
        <div className="welcome-section">
          <h1 className="welcome-title">{t('auth.welcomeTitle')}</h1>
          <p className="welcome-subtitle">{t('auth.welcomeSubtitle')}</p>
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
              {t('auth.tabs.login')}
            </button>
            <button
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setError('');
                navigate('/register', { replace: true });
              }}
            >
              {t('auth.tabs.register')}
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="auth-form-container">
              <h2 className="form-title">{t('auth.loginTitle')}</h2>
              <p className="form-subtitle">{t('auth.loginSubtitle')}</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="login-email">{t('auth.fields.email')}</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    placeholder={t('auth.placeholders.email')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">{t('auth.fields.password')}</label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    placeholder={t('auth.placeholders.password')}
                  />
                </div>

                <Link to="/forgot-password" className="forgot-password-link">
                  {t('auth.forgotPassword')}
                </Link>

                <button type="submit" className="auth-button primary" disabled={loading}>
                  {loading ? t('auth.buttons.loggingIn') : t('auth.buttons.login')}
                </button>
              </form>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="auth-form-container">
              <h2 className="form-title">{t('auth.registerTitle')}</h2>
              <p className="form-subtitle">{t('auth.registerSubtitle')}</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="register-firstName">{t('auth.fields.firstName')}</label>
                    <input
                      type="text"
                      id="register-firstName"
                      name="firstName"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      placeholder={t('auth.placeholders.firstName')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-lastName">{t('auth.fields.lastName')}</label>
                    <input
                      type="text"
                      id="register-lastName"
                      name="lastName"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      placeholder={t('auth.placeholders.lastName')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">{t('auth.fields.emailRequired')}</label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    placeholder={t('auth.placeholders.email')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">{t('auth.fields.passwordRequired')}</label>
                    <input
                      type="password"
                      id="register-password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      placeholder={t('auth.placeholders.createPassword')}
                      minLength="6"
                    />
                </div>

                <div className="form-group">
                  <label htmlFor="register-companyName">{t('auth.fields.companyName')}</label>
                  <input
                    type="text"
                    id="register-companyName"
                    name="companyName"
                    value={registerData.companyName}
                    onChange={handleRegisterChange}
                    placeholder={t('auth.placeholders.companyName')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-roleTitle">{t('auth.fields.roleTitle')}</label>
                  <RoleDropdown
                    id="register-roleTitle"
                    name="roleTitle"
                    value={registerData.roleTitle}
                    onChange={handleRegisterChange}
                    placeholder={t('auth.placeholders.roleTitle')}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="register-baseCountry">{t('auth.fields.baseCountry')}</label>
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
                      placeholder={t('auth.placeholders.baseCountry')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-baseCity">{t('auth.fields.baseCity')}</label>
                    <CityDropdown
                      id="register-baseCity"
                      name="baseCity"
                      value={registerData.baseCity}
                      onChange={handleRegisterChange}
                      countryCode={registerData.baseCountry}
                      placeholder={t('auth.placeholders.baseCity')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-phone">{t('auth.fields.phone')}</label>
                  <input
                    type="tel"
                    id="register-phone"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder={t('auth.placeholders.phone')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-avatar">{t('auth.fields.avatar')}</label>
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
                      {avatarFile ? t('auth.buttons.changeAvatar') : t('auth.buttons.chooseAvatar')}
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
                    {t('auth.help.avatarFormats')}
                  </p>
                </div>

                <div className="form-group">
                  <label>{t('auth.fields.verificationDocs')}</label>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    {t('auth.help.verificationDocs', { max: MAX_VERIFICATION_DOCS })}
                  </p>
                  <input
                    type="file"
                    id="register-verification-docs"
                    name="verificationDocs"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    multiple
                    onChange={handleVerificationDocsChange}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="register-verification-docs"
                    style={{
                      padding: '10px 15px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      backgroundColor: '#f9f9f9',
                      display: 'inline-block',
                      marginBottom: '10px',
                    }}
                  >
                    {verificationDocFiles.length === 0
                      ? t('auth.buttons.chooseVerificationDocs')
                      : t('auth.buttons.addMoreDocs', { current: verificationDocFiles.length, max: MAX_VERIFICATION_DOCS })}
                  </label>
                  {verificationDocPreviews.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                      {verificationDocPreviews.map((src, i) => (
                        <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                          <img
                            src={src}
                            alt={`Doc ${i + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeVerificationDoc(i)}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              background: 'rgba(255,0,0,0.8)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              lineHeight: '1',
                              padding: 0,
                            }}
                            aria-label="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="auth-button primary" disabled={loading}>
                  {loading ? t('auth.buttons.creatingAccount') : t('auth.buttons.register')}
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

