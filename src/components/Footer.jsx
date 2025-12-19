import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Branding Section */}
          <div className="footer-section footer-branding">
            <h3 className="footer-logo">TerraCasa</h3>
            <p className="footer-tagline">
              Your platform for international real estate and worldwide lifestyles
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Discover Section */}
          <div className="footer-section">
            <h4 className="footer-heading">Discover</h4>
            <ul className="footer-links">
              <li><Link to="/countries">Countries</Link></li>
              <li><Link to="/properties">Properties</Link></li>
              <li><Link to="/network">Network</Link></li>
              <li><Link to="/become-partner">Become a Partner</Link></li>
            </ul>
          </div>

          {/* Help & Support Section */}
          <div className="footer-section">
            <h4 className="footer-heading">Help & Support</h4>
            <ul className="footer-links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Data Protection</Link></li>
              <li><Link to="/terms">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section footer-newsletter">
            <h4 className="footer-heading">Newsletter</h4>
            <p className="newsletter-description">
              Stay informed about new properties and market trends
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your E-Mail"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button" aria-label="Subscribe">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <div className="footer-separator"></div>
          <p className="footer-copyright">
            © 2025 TerraCasa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

