import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import LanguageDropdown from './LanguageDropdown';
import {
  Home, MapPin, Building2, Users, PlusSquare, Info,
  User, LogOut, Menu, X
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/',           label: t('common.homepage'),   icon: Home },
    { to: '/properties', label: t('common.properties'), icon: Building2 },
    { to: '/countries',  label: t('common.countries'),  icon: MapPin },
    { to: '/network',    label: t('common.network'),    icon: Users },
    { to: '/post-ad',    label: t('common.postAd'),     icon: PlusSquare },
    { to: '/about',      label: t('common.aboutUs'),    icon: Info },
  ];

  return (
    <>
      {/* Logo — fixed independently so navbar height does not constrain it */}
      <Link
        to="/"
        className={`navbar__logo ${isHomePage ? 'navbar__logo--home' : 'navbar__logo--page'}`}
        aria-label="SunHouses home"
      >
        <img src={logoImg} alt="SunHouses" className="navbar__logo-img" />
      </Link>

      <header
        className={[
          'navbar',
          isHomePage ? 'navbar--home' : 'navbar--page',
          isScrolled ? 'navbar--scrolled' : '',
          menuOpen ? 'navbar--open' : '',
        ].filter(Boolean).join(' ')}
      >
        <div className="navbar__inner">
          {/* Desktop nav */}
          <nav className="navbar__nav" role="navigation" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`navbar__link ${isActive(to) ? 'navbar__link--active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Utils */}
          <div className="navbar__utils">
            <div className="navbar__lang">
              <LanguageDropdown />
            </div>

            {isAuthenticated ? (
              <div className="navbar__auth-group">
                <Link to="/profile" className="navbar__avatar-btn" title={t('common.profile')}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="navbar__avatar-img" />
                  ) : (
                    <span className="navbar__avatar-placeholder">
                      <User size={16} strokeWidth={1.8} />
                    </span>
                  )}
                </Link>
                <button onClick={logout} className="navbar__logout-btn" title={t('common.logout')}>
                  <LogOut size={16} strokeWidth={1.8} />
                  <span className="navbar__logout-text">{t('common.logout')}</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="navbar__cta">
                {t('common.login')}
              </Link>
            )}

            {/* Hamburger */}
            <button
              type="button"
              className="navbar__toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`} aria-hidden={!menuOpen}>
          <nav className="navbar__mobile-nav">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`navbar__mobile-link ${isActive(to) ? 'navbar__mobile-link--active' : ''}`}
              >
                <Icon size={18} strokeWidth={1.6} className="navbar__mobile-link-icon" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="navbar__mobile-footer">
            <LanguageDropdown />
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="navbar__overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
