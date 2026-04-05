import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import {
  Building2, MapPin, FileEdit, Users,
  BookOpen, CheckSquare, Video, Calendar,
  ArrowRight, Shield, Search, Globe,
  ChevronDown
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.classList.add('home-page');
    return () => document.body.classList.remove('home-page');
  }, []);

  const featureCards = [
    {
      icon: Building2,
      title: t('home.searchHolidayProperty'),
      desc: t('home.searchHolidayPropertyDesc'),
      to: '/properties',
      color: 'blue',
    },
    {
      icon: MapPin,
      title: t('home.getToKnowCountry'),
      desc: t('home.getToKnowCountryDesc'),
      to: '/countries',
      color: 'gold',
    },
    {
      icon: FileEdit,
      title: t('home.postAd'),
      desc: t('home.postAdDesc'),
      to: '/post-ad',
      color: 'sage',
    },
    {
      icon: Users,
      title: t('home.buildNetwork'),
      desc: t('home.buildNetworkDesc'),
      to: '/network',
      color: 'teal',
    },
  ];

  const trustPoints = [
    { icon: Shield,   label: t('home.verifiedSecurity'),   desc: t('home.verifiedSecurityDesc') },
    { icon: Search,   label: t('home.intelligentSearch'),  desc: t('home.intelligentSearchDesc') },
    { icon: Users,    label: t('home.expertNetwork'),      desc: t('home.expertNetworkDesc') },
    { icon: Globe,    label: t('home.learnLifestyle'),     desc: t('home.learnLifestyleDesc') },
  ];

  const resourceCards = [
    { icon: BookOpen,    title: t('home.guideArticles'),  desc: t('home.guideArticlesDesc') },
    { icon: CheckSquare, title: t('home.checklists'),     desc: t('home.checklistsDesc') },
    { icon: Video,       title: t('home.virtualTours'),   desc: t('home.virtualToursDesc') },
    { icon: Calendar,    title: t('home.webinarsQa'),     desc: t('home.webinarsQaDesc') },
  ];

  return (
    <div className="home">
      <Navbar />

      {/* ---- HERO ---- */}
      <section className="home__hero">
        <div className="home__hero-bg" />
        <div className="home__hero-overlay" />

        <div className="home__hero-inner">
          {/* Label */}
          <div className="home__hero-label">
            <span className="home__hero-label-dot" />
            {t('home.heroLabel') || 'Mediterranean Real Estate'}
            <span className="home__hero-label-dot" />
          </div>

          {/* Title */}
          <h1 className="home__hero-title">{t('home.heroTitle')}</h1>
          <p className="home__hero-subtitle">{t('home.heroSubtitle')}</p>

          {/* CTAs */}
          <div className="home__hero-ctas">
            <Link to="/properties" className="home__hero-btn home__hero-btn--primary">
              <Building2 size={18} strokeWidth={1.8} />
              {t('home.searchHolidayProperty')}
            </Link>
            <Link to="/network" className="home__hero-btn home__hero-btn--outline">
              <Users size={18} strokeWidth={1.8} />
              {t('common.network')}
            </Link>
          </div>

          {/* Trust stats */}
          <div className="home__hero-stats">
            <div className="home__hero-stat">
              <span className="home__hero-stat-number">10K+</span>
              <span className="home__hero-stat-label">{t('home.statProperties') || 'Properties'}</span>
            </div>
            <div className="home__hero-stat-divider" />
            <div className="home__hero-stat">
              <span className="home__hero-stat-number">50+</span>
              <span className="home__hero-stat-label">{t('home.statCountries') || 'Countries'}</span>
            </div>
            <div className="home__hero-stat-divider" />
            <div className="home__hero-stat">
              <span className="home__hero-stat-number">2K+</span>
              <span className="home__hero-stat-label">{t('home.statExperts') || 'Verified Experts'}</span>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="home__hero-scroll">
            <ChevronDown size={22} strokeWidth={1.5} />
          </div>
        </div>

        {/* Feature cards — overlap bottom of hero */}
        <div className="home__feature-cards-wrap">
          <div className="home__feature-cards">
            {featureCards.map(({ icon: Icon, title, desc, to, color }) => (
              <Link key={to} to={to} className={`home__feature-card home__feature-card--${color}`}>
                <div className="home__feature-card-icon">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="home__feature-card-title">{title}</h3>
                <p className="home__feature-card-desc">{desc}</p>
                <div className="home__feature-card-arrow">
                  <ArrowRight size={16} strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- WHY SUNHOUSES ---- */}
      <section className="home__why">
        <div className="home__container">
          <div className="home__section-head">
            <span className="section-label">{t('home.whyUnique') || 'Why SunHouses'}</span>
            <h2 className="home__section-title">{t('home.buyingAbroad')}</h2>
            <p className="home__section-subtitle">
              {t('home.heroSubtitle')}
            </p>
          </div>

          <div className="home__trust-grid">
            {trustPoints.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="home__trust-card">
                <div className="home__trust-icon">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h4 className="home__trust-title">{label}</h4>
                <p className="home__trust-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- EDITORIAL SPLIT: Mediterranean Lifestyle ---- */}
      <section className="home__lifestyle">
        <div className="home__lifestyle-image">
          <img
            src="https://images.unsplash.com/photo-1582610116397-edb318620f90?w=900&q=85&auto=format&fit=crop"
            alt="Mediterranean coastal villa"
            loading="lazy"
          />
          <div className="home__lifestyle-image-badge">
            <Shield size={14} strokeWidth={2} />
            {t('home.verifiedSecurity') || 'Verified & Secure'}
          </div>
        </div>
        <div className="home__lifestyle-content">
          <span className="section-label">{t('home.journeyBegins') || 'Your Journey'}</span>
          <h2 className="home__lifestyle-title">{t('home.journeyBegins')}</h2>
          <p className="home__lifestyle-text">
            {t('home.heroSubtitle')}
          </p>
          <div className="home__lifestyle-items">
            {trustPoints.slice(0, 3).map(({ icon: Icon, label }) => (
              <div key={label} className="home__lifestyle-item">
                <Icon size={16} strokeWidth={1.8} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <Link to="/properties" className="btn btn-primary btn-lg">
            {t('home.searchHolidayProperty')}
            <ArrowRight size={18} strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* ---- RESOURCES / TIPS ---- */}
      <section className="home__resources">
        <div className="home__container">
          <div className="home__section-head home__section-head--center">
            <span className="section-label">{t('home.tipsGuides')}</span>
            <h2 className="home__section-title">{t('home.tipsGuides')}</h2>
            <p className="home__section-subtitle home__section-subtitle--center">
              {t('home.tipsSubtitle')}
            </p>
          </div>

          <div className="home__resource-grid">
            {resourceCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="home__resource-card">
                <div className="home__resource-icon">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="home__resource-title">{title}</h3>
                <p className="home__resource-desc">{desc}</p>
                <button className="home__resource-link">
                  {t('common.learnMore') || 'Learn more'}
                  <ArrowRight size={14} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section className="home__cta-banner">
        <div className="home__cta-banner-inner">
          <div className="home__cta-banner-content">
            <h2 className="home__cta-banner-title">{t('home.journeyBegins')}</h2>
            <p className="home__cta-banner-subtitle">{t('home.tipsSubtitle')}</p>
          </div>
          <div className="home__cta-banner-actions">
            <Link to="/properties" className="btn btn-gold btn-lg">
              {t('common.properties')}
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg home__cta-banner-ghost">
              {t('footer.becomeAPartner')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
