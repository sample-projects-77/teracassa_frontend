import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import LanguageDropdown from './LanguageDropdown';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Main navigation bar */}
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            TerraCasa
          </Link>
          
          <nav className="navbar-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>{t('common.homepage')}</Link>
            <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>{t('common.properties')}</Link>
            <Link to="/countries" className={`nav-link ${isActive('/countries') ? 'active' : ''}`}>{t('common.countries')}</Link>
            <Link to="/network" className={`nav-link ${isActive('/network') ? 'active' : ''}`}>{t('common.network')}</Link>
            <Link to="/post-ad" className={`nav-link ${isActive('/post-ad') ? 'active' : ''}`}>{t('common.postAd')}</Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>{t('common.aboutUs')}</Link>
          </nav>

          <div className="navbar-utils">
            <LanguageDropdown />
            <button 
              className="icon-button" 
              title={t('common.favorites')}
              onClick={() => {
                if (isAuthenticated) {
                  // Navigate to favourites page (assuming /favorites route exists)
                  // If not, we can create a properties page with favourites filter
                  navigate('/properties?favorites=true');
                } else {
                  navigate('/login');
                }
              }}
            >
              <span className="icon">♡</span>
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="icon-button" title={t('common.profile')}>
                  <span className="icon">👤</span>
                </Link>
                <button onClick={logout} className="navbar-login-btn">
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar-login-btn">{t('common.login')}</Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

