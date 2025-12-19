import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
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
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Homepage</Link>
            <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>Properties</Link>
            <Link to="/countries" className={`nav-link ${isActive('/countries') ? 'active' : ''}`}>Countries</Link>
            <Link to="/network" className={`nav-link ${isActive('/network') ? 'active' : ''}`}>Network</Link>
            <Link to="/post-ad" className={`nav-link ${isActive('/post-ad') ? 'active' : ''}`}>Post Ad</Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
          </nav>

          <div className="navbar-utils">
            <div className="currency-selector">
              <span>$ € EUR</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="language-selector">
              <span>A EN English (EN)</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <button className="icon-button" title="Favorites">
              <span className="icon">♡</span>
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="icon-button" title="Profile">
                  <span className="icon">👤</span>
                </Link>
                <button onClick={logout} className="navbar-login-btn">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar-login-btn">Login</Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

