import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Branding Section */}
          <div className="footer-section footer-branding">
            <h3 className="footer-logo">TerraCasa</h3>
            <p className="footer-tagline">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Discover Section */}
          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.discover')}</h4>
            <ul className="footer-links">
              <li><Link to="/countries">{t('common.countries')}</Link></li>
              <li><Link to="/properties">{t('common.properties')}</Link></li>
              <li><Link to="/network">{t('common.network')}</Link></li>
              <li><Link to="/signup">{t('footer.becomeAPartner')}</Link></li>
            </ul>
          </div>

          {/* Help & Support Section */}
          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.helpSupport')}</h4>
            <ul className="footer-links">
              <li><Link to="/faq">{t('footer.faq')}</Link></li>
              <li><Link to="/contact">{t('footer.contact')}</Link></li>
              <li><Link to="/privacy">{t('footer.dataProtection')}</Link></li>
              <li><Link to="/terms">{t('footer.termsAndConditions')}</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section footer-newsletter">
            <h4 className="footer-heading">{t('footer.newsletter')}</h4>
            <p className="newsletter-description">
              {t('footer.newsletterDescription')}
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.yourEmail')}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button" aria-label={t('footer.subscribe')}>
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
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

