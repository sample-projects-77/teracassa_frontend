import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import {
  MapPin, Building2, Users, UserPlus,
  HelpCircle, Mail, Shield, FileText,
  Globe, Share2, ExternalLink, AtSign,
  ArrowRight
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      {/* Top accent */}
      <div className="footer__accent" />

      <div className="footer__body">
        <div className="footer__container">
          <div className="footer__grid">

            {/* Branding */}
            <div className="footer__brand">
              <div className="footer__logo">
                <img src={logoImg} alt="SunHouses" className="footer__logo-img" />
              </div>
              <p className="footer__tagline">{t('footer.tagline')}</p>

              <div className="footer__socials">
                <a href="#" className="footer__social" aria-label="Instagram" rel="noopener noreferrer">
                  <Globe size={18} strokeWidth={1.6} />
                </a>
                <a href="#" className="footer__social" aria-label="Facebook" rel="noopener noreferrer">
                  <Share2 size={18} strokeWidth={1.6} />
                </a>
                <a href="#" className="footer__social" aria-label="LinkedIn" rel="noopener noreferrer">
                  <ExternalLink size={18} strokeWidth={1.6} />
                </a>
                <a href="#" className="footer__social" aria-label="Twitter / X" rel="noopener noreferrer">
                  <AtSign size={18} strokeWidth={1.6} />
                </a>
              </div>
            </div>

            {/* Discover */}
            <div className="footer__column">
              <h4 className="footer__heading">{t('footer.discover')}</h4>
              <ul className="footer__links">
                <li>
                  <Link to="/countries" className="footer__link">
                    <MapPin size={14} strokeWidth={1.6} />
                    {t('common.countries')}
                  </Link>
                </li>
                <li>
                  <Link to="/properties" className="footer__link">
                    <Building2 size={14} strokeWidth={1.6} />
                    {t('common.properties')}
                  </Link>
                </li>
                <li>
                  <Link to="/network" className="footer__link">
                    <Users size={14} strokeWidth={1.6} />
                    {t('common.network')}
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="footer__link">
                    <UserPlus size={14} strokeWidth={1.6} />
                    {t('footer.becomeAPartner')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div className="footer__column">
              <h4 className="footer__heading">{t('footer.helpSupport')}</h4>
              <ul className="footer__links">
                <li>
                  <Link to="/faq" className="footer__link">
                    <HelpCircle size={14} strokeWidth={1.6} />
                    {t('footer.faq')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer__link">
                    <Mail size={14} strokeWidth={1.6} />
                    {t('footer.contact')}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="footer__link">
                    <Shield size={14} strokeWidth={1.6} />
                    {t('footer.dataProtection')}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="footer__link">
                    <FileText size={14} strokeWidth={1.6} />
                    {t('footer.termsAndConditions')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer__newsletter">
              <h4 className="footer__heading">{t('footer.newsletter')}</h4>
              <p className="footer__newsletter-desc">{t('footer.newsletterDescription')}</p>
              <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder={t('footer.yourEmail')}
                  className="footer__newsletter-input"
                  required
                  aria-label={t('footer.yourEmail')}
                />
                <button
                  type="submit"
                  className="footer__newsletter-btn"
                  aria-label={t('footer.subscribe')}
                >
                  <ArrowRight size={18} strokeWidth={2} />
                </button>
              </form>
              <p className="footer__newsletter-note">
                {t('footer.newsletterNote') || 'Mediterranean lifestyle & property insights.'}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__container footer__bottom-inner">
          <p className="footer__copyright">{t('footer.copyright')}</p>
          <div className="footer__bottom-links">
            <Link to="/privacy" className="footer__bottom-link">{t('footer.dataProtection')}</Link>
            <span className="footer__bottom-sep">·</span>
            <Link to="/terms" className="footer__bottom-link">{t('footer.termsAndConditions')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
