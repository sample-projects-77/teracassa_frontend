import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Add class to body to identify home page
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      
      {/* Main Hero Section with Background Image */}
      <div className="home-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">{t('home.heroTitle')}</h1>
            <p className="hero-subtitle">
              {t('home.heroSubtitle')}
            </p>

            <div className="hero-features">
              <h2 className="features-title">{t('home.whyUnique')}</h2>
              
              <div className="features-list">
                <p className="feature-intro">
                  <strong>{t('home.buyingAbroad')}</strong>
                </p>

                <p className="feature-text">
                  <strong>{t('home.verifiedSecurity')}</strong> {t('home.verifiedSecurityDesc')}
                </p>

                <p className="feature-text">
                  <strong>{t('home.intelligentSearch')}</strong> {t('home.intelligentSearchDesc')}
                </p>

                <p className="feature-text">
                  <strong>{t('home.expertNetwork')}</strong> {t('home.expertNetworkDesc')}
                </p>

                <p className="feature-text">
                  <strong>{t('home.learnLifestyle')}</strong> {t('home.learnLifestyleDesc')}
                </p>
              </div>

              <h2 className="hero-cta">{t('home.journeyBegins')}</h2>
            </div>

            {/* Cards Section - Positioned over hero background */}
            <div className="home-cards">
              <div className="card">
                <div className="card-icon">🏠</div>
                <h3 className="card-title">{t('home.searchHolidayProperty')}</h3>
                <p className="card-description">{t('home.searchHolidayPropertyDesc')}</p>
              </div>

              <div className="card">
                <div className="card-icon">🌍</div>
                <h3 className="card-title">{t('home.getToKnowCountry')}</h3>
                <p className="card-description">{t('home.getToKnowCountryDesc')}</p>
              </div>

              <div className="card">
                <div className="card-icon">📄</div>
                <h3 className="card-title">{t('home.postAd')}</h3>
                <p className="card-description">{t('home.postAdDesc')}</p>
              </div>

              <div className="card">
                <div className="card-icon">🤝</div>
                <h3 className="card-title">{t('home.buildNetwork')}</h3>
                <p className="card-description">{t('home.buildNetworkDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips & Guides Section */}
      <section className="tips-section">
        <div className="tips-container">
          <h2 className="tips-heading">{t('home.tipsGuides')}</h2>
          <p className="tips-subtitle">
            {t('home.tipsSubtitle')}
          </p>

          <div className="tips-cards">
            <div className="tip-card">
              <div className="tip-icon-wrapper">
                <div className="tip-icon">📖</div>
              </div>
              <h3 className="tip-card-title">{t('home.guideArticles')}</h3>
              <p className="tip-card-description">
                {t('home.guideArticlesDesc')}
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon-wrapper">
                <div className="tip-icon">✓</div>
              </div>
              <h3 className="tip-card-title">{t('home.checklists')}</h3>
              <p className="tip-card-description">
                {t('home.checklistsDesc')}
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon-wrapper">
                <div className="tip-icon">🎥</div>
              </div>
              <h3 className="tip-card-title">{t('home.virtualTours')}</h3>
              <p className="tip-card-description">
                {t('home.virtualToursDesc')}
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon-wrapper">
                <div className="tip-icon">📅</div>
              </div>
              <h3 className="tip-card-title">{t('home.webinarsQa')}</h3>
              <p className="tip-card-description">
                {t('home.webinarsQaDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

