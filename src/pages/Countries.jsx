import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCountries, getCountryOverview, getCountrySections } from '../services/countryService';
import { useTranslation } from '../context/TranslationContext';
import './Countries.css';

const Countries = () => {
  const { countryCode } = useParams();
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [countryOverview, setCountryOverview] = useState(null);
  const [countrySections, setCountrySections] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (countryCode) {
      loadCountryData(countryCode);
    }
  }, [countryCode]);

  // Set selectedCountry when countries load and countryCode is in URL
  useEffect(() => {
    if (countryCode && countries.length > 0 && !selectedCountry) {
      const country = countries.find(c => c.code === countryCode.toUpperCase());
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [countries, countryCode, selectedCountry]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const data = await getCountries();
      setCountries(data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCountryData = async (code) => {
    try {
      setDataLoading(true);
      const [overview, sections] = await Promise.all([
        getCountryOverview(code),
        getCountrySections(code)
      ]);
      setCountryOverview(overview);
      setCountrySections(sections);
      
      // Set selected country from overview data or countries list
      if (overview) {
        const country = countries.find(c => c.code === code?.toUpperCase()) || {
          code: overview.code,
          name: overview.name
        };
        setSelectedCountry(country);
      }
    } catch (error) {
      console.error('Error loading country data:', error);
      setCountryOverview(null);
      setCountrySections(null);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    if (country && country.code) {
      navigate(`/countries/${country.code}`);
      loadCountryData(country.code);
    }
  };

  // Icon mapping function
  const getIconSVG = (iconName) => {
    const icons = {
      'growth': (
        <svg className="why-invest-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21L12 3L21 21H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'location': (
        <svg className="why-invest-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'shield': (
        <svg className="why-invest-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'lifestyle': (
        <svg className="info-card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'market': (
        <svg className="info-card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 10H18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'law': (
        <svg className="info-card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 14H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="16" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 10L4 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 10L20 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName?.toLowerCase()] || icons['growth'];
  };

  const getDisplayText = () => {
    if (selectedCountry) {
      return `${selectedCountry.code} ${selectedCountry.name}`;
    }
    return t('common.selectCountry');
  };

  // Helper function to get section by key
  const getSectionByKey = (key) => {
    if (!countrySections || !countrySections.sections) return null;
    return countrySections.sections.find(section => section.key === key);
  };

  // Get sections for the three info cards
  const lifestyleSection = getSectionByKey('lifestyle');
  const propertyMarketSection = getSectionByKey('property_market');
  const lawTaxSection = getSectionByKey('law_tax');

  return (
    <div className="countries-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="countries-hero">
        <div className="countries-hero-content">
          <h1 className="countries-main-heading">
            {t('countries.heroTitle')}
          </h1>
          <p className="countries-description">
            {t('countries.heroDescription')}
          </p>
        </div>
      </section>

      {/* Country Selection Section */}
      <section className="country-selection-section">
        <div className="country-selection-container">
          <h2 className="country-selection-heading">{t('countries.selectDesiredCountry')}</h2>
          <div className="country-dropdown-wrapper" ref={dropdownRef}>
            <div 
              className="country-dropdown-input"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={selectedCountry ? 'country-dropdown-text' : 'country-dropdown-placeholder'}>
                {getDisplayText()}
              </span>
              <svg 
                className={`country-dropdown-arrow ${isOpen ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path d="M6 9L1 4h10z" fill="currentColor"/>
              </svg>
            </div>
            
            {isOpen && (
              <div className="country-dropdown-list">
                {loading ? (
                  <div className="country-dropdown-item">{t('common.loading')}</div>
                ) : countries.length > 0 ? (
                  countries.map((country) => (
                    <div
                      key={country.code}
                      className={`country-dropdown-item ${
                        selectedCountry?.code === country.code ? 'selected' : ''
                      }`}
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country.code} {country.name}
                    </div>
                  ))
                ) : (
                  <div className="country-dropdown-item">No countries available</div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Invest Section */}
      {countryOverview && countryOverview.investmentHighlights && countryOverview.investmentHighlights.length > 0 && (
        <section className="why-invest-section">
          <div className="why-invest-container">
            <h2 className="why-invest-heading">
              {t('countries.whyInvest', { country: countryOverview.name })}
            </h2>
            {dataLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>{t('common.loading')}</div>
            ) : (
              <div className="why-invest-cards">
                {countryOverview.investmentHighlights.map((highlight, index) => (
                  <div key={index} className="why-invest-card">
                    <div className="why-invest-icon-wrapper">
                      {getIconSVG(highlight.icon)}
                    </div>
                    <h3 className="why-invest-card-title">{highlight.title}</h3>
                    <p className="why-invest-card-description">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Information Cards Section */}
      {countrySections && countrySections.sections && countrySections.sections.length > 0 && (
        <section className="info-cards-section">
          <div className="info-cards-container">
            {/* Land & Lifestyle Card */}
            {lifestyleSection && (
              <div className="info-card">
                <div className="info-card-icon-wrapper">
                  {getIconSVG('lifestyle')}
                </div>
                <h3 className="info-card-title">{lifestyleSection.title}</h3>
                <ul className="info-card-list">
                  {lifestyleSection.bulletPoints && lifestyleSection.bulletPoints.length > 0 ? (
                    lifestyleSection.bulletPoints.map((point, index) => (
                      <li key={index} className="info-card-item">
                        <svg className="checkmark-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="info-card-item">{t('common.noDataAvailable')}</li>
                  )}
                </ul>
                <a 
                  href={lifestyleSection.slug ? `#${lifestyleSection.slug}` : '#'} 
                  className="info-card-link"
                >
                  {lifestyleSection.ctaLabel || t('common.learnMore')}
                </a>
              </div>
            )}

            {/* Real Estate Market Card */}
            {propertyMarketSection && (
              <div className="info-card">
                <div className="info-card-icon-wrapper">
                  {getIconSVG('market')}
                </div>
                <h3 className="info-card-title">{propertyMarketSection.title}</h3>
                <ul className="info-card-list">
                  {propertyMarketSection.bulletPoints && propertyMarketSection.bulletPoints.length > 0 ? (
                    propertyMarketSection.bulletPoints.map((point, index) => (
                      <li key={index} className="info-card-item">
                        <svg className="checkmark-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="info-card-item">{t('common.noDataAvailable')}</li>
                  )}
                </ul>
                <a 
                  href={propertyMarketSection.slug ? `#${propertyMarketSection.slug}` : '#'} 
                  className="info-card-link"
                >
                  {propertyMarketSection.ctaLabel || t('common.learnMore')}
                </a>
              </div>
            )}

            {/* Law & Taxes Card */}
            {lawTaxSection && (
              <div className="info-card">
                <div className="info-card-icon-wrapper">
                  {getIconSVG('law')}
                </div>
                <h3 className="info-card-title">{lawTaxSection.title}</h3>
                <ul className="info-card-list">
                  {lawTaxSection.bulletPoints && lawTaxSection.bulletPoints.length > 0 ? (
                    lawTaxSection.bulletPoints.map((point, index) => (
                      <li key={index} className="info-card-item">
                        <svg className="checkmark-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="info-card-item">{t('common.noDataAvailable')}</li>
                  )}
                </ul>
                <a 
                  href={lawTaxSection.slug ? `#${lawTaxSection.slug}` : '#'} 
                  className="info-card-link"
                >
                  {lawTaxSection.ctaLabel || t('common.learnMore')}
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Advantages Section */}
      <section className="advantages-section">
        <div className="advantages-container">
          <h2 className="advantages-heading">{t('countries.advantagesTitle')}</h2>
          <div className="advantages-cards">
            <div className="advantage-card">
              <div className="advantage-icon-wrapper">
                <svg className="advantage-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="advantage-card-title">{t('countries.verifiedOffers')}</h3>
              <p className="advantage-card-description">
                {t('countries.verifiedOffersDesc')}
              </p>
            </div>

            <div className="advantage-card">
              <div className="advantage-icon-wrapper">
                <svg className="advantage-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="advantage-card-title">{t('countries.expertNetwork')}</h3>
              <p className="advantage-card-description">
                {t('countries.expertNetworkDesc')}
              </p>
            </div>

            <div className="advantage-card">
              <div className="advantage-icon-wrapper">
                <svg className="advantage-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 14H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 10L4 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 10L20 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="advantage-card-title">{t('countries.legalCertainty')}</h3>
              <p className="advantage-card-description">
                {t('countries.legalCertaintyDesc')}
              </p>
            </div>

            <div className="advantage-card">
              <div className="advantage-icon-wrapper">
                <svg className="advantage-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="advantage-card-title">{t('countries.allRoundService')}</h3>
              <p className="advantage-card-description">
                {t('countries.allRoundServiceDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section className="top-destinations-section">
        <div className="top-destinations-container">
          <h2 className="top-destinations-heading">{t('countries.topDestinations')}</h2>
          <p className="top-destinations-subtitle">
            {t('countries.topDestinationsSubtitle')}
          </p>
          <div className="top-destinations-cards">
            {/* Turkey Card */}
            <div className="destination-card">
              <div className="destination-header">
                <span className="destination-code">TR</span>
                <span className="destination-name">Turkey</span>
              </div>
              <p className="destination-description">
                Mediterranean climate, cultural diversity, and attractive real estate prices
              </p>
              <div className="destination-divider"></div>
              <div className="destination-stats">
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">€ 1.200/m²</div>
                  <div className="stat-label">Avg. Price</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">+8.5%</div>
                  <div className="stat-label">Growth</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">85M</div>
                  <div className="stat-label">Inhabitants</div>
                </div>
              </div>
              <div className="destination-divider"></div>
              <div className="destination-regions">
                <div className="regions-label">{t('countries.topRegions')}</div>
                <div className="regions-tags">
                  <span className="region-tag">Istanbul</span>
                  <span className="region-tag">Bodrum</span>
                  <span className="region-tag">Antalya</span>
                  <span className="region-tag">Alanya</span>
                </div>
              </div>
              <button className="destination-button">{t('common.learnMore')}</button>
            </div>

            {/* Spain Card */}
            <div className="destination-card">
              <div className="destination-header">
                <span className="destination-code">ES</span>
                <span className="destination-name">Spain</span>
              </div>
              <p className="destination-description">
                Quality of life, sun, and stable real estate markets on the coast
              </p>
              <div className="destination-divider"></div>
              <div className="destination-stats">
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">€ 1.800/m²</div>
                  <div className="stat-label">Avg. Price</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">+5.2%</div>
                  <div className="stat-label">Growth</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">47M</div>
                  <div className="stat-label">Inhabitants</div>
                </div>
              </div>
              <div className="destination-divider"></div>
              <div className="destination-regions">
                <div className="regions-label">{t('countries.topRegions')}</div>
                <div className="regions-tags">
                  <span className="region-tag">Barcelona</span>
                  <span className="region-tag">Marbella</span>
                  <span className="region-tag">Valencia</span>
                  <span className="region-tag">Mallorca</span>
                </div>
              </div>
              <button className="destination-button">{t('common.learnMore')}</button>
            </div>

            {/* Italy Card */}
            <div className="destination-card">
              <div className="destination-header">
                <span className="destination-code">IT</span>
                <span className="destination-name">Italy</span>
              </div>
              <p className="destination-description">
                Culture, culinary, and picturesque coastal regions
              </p>
              <div className="destination-divider"></div>
              <div className="destination-stats">
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">€ 2.100/m²</div>
                  <div className="stat-label">Avg. Price</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">+4.8%</div>
                  <div className="stat-label">Growth</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">60M</div>
                  <div className="stat-label">Inhabitants</div>
                </div>
              </div>
              <div className="destination-divider"></div>
              <div className="destination-regions">
                <div className="regions-label">{t('countries.topRegions')}</div>
                <div className="regions-tags">
                  <span className="region-tag">Tuscany</span>
                  <span className="region-tag">Apulia</span>
                  <span className="region-tag">Sardinia</span>
                  <span className="region-tag">Calabria</span>
                </div>
              </div>
              <button className="destination-button">{t('common.learnMore')}</button>
            </div>

            {/* Greece Card */}
            <div className="destination-card">
              <div className="destination-header">
                <span className="destination-code">GR</span>
                <span className="destination-name">Greece</span>
              </div>
              <p className="destination-description">
                Dreamy islands, history, and growing real estate market
              </p>
              <div className="destination-divider"></div>
              <div className="destination-stats">
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">€ 1.500/m²</div>
                  <div className="stat-label">Avg. Price</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">+6.3%</div>
                  <div className="stat-label">Growth</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">10M</div>
                  <div className="stat-label">Inhabitants</div>
                </div>
              </div>
              <div className="destination-divider"></div>
              <div className="destination-regions">
                <div className="regions-label">{t('countries.topRegions')}</div>
                <div className="regions-tags">
                  <span className="region-tag">Crete</span>
                  <span className="region-tag">Rhodes</span>
                  <span className="region-tag">Santorini</span>
                  <span className="region-tag">Athens</span>
                </div>
              </div>
              <button className="destination-button">{t('common.learnMore')}</button>
            </div>

            {/* Portugal Card */}
            <div className="destination-card">
              <div className="destination-header">
                <span className="destination-code">PT</span>
                <span className="destination-name">Portugal</span>
              </div>
              <p className="destination-description">
                Mild winters, friendly people, and increasing popularity
              </p>
              <div className="destination-divider"></div>
              <div className="destination-stats">
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">€ 1.600/m²</div>
                  <div className="stat-label">Avg. Price</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">+7.1%</div>
                  <div className="stat-label">Growth</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">10M</div>
                  <div className="stat-label">Inhabitants</div>
                </div>
              </div>
              <div className="destination-divider"></div>
              <div className="destination-regions">
                <div className="regions-label">{t('countries.topRegions')}</div>
                <div className="regions-tags">
                  <span className="region-tag">Lisbon</span>
                  <span className="region-tag">Algarve</span>
                  <span className="region-tag">Porto</span>
                  <span className="region-tag">Madeira</span>
                </div>
              </div>
              <button className="destination-button">{t('common.learnMore')}</button>
            </div>

            {/* Croatia Card */}
            <div className="destination-card">
              <div className="destination-header">
                <span className="destination-code">HR</span>
                <span className="destination-name">Croatia</span>
              </div>
              <p className="destination-description">
                Adriatic coast, EU member, and emerging real estate market
              </p>
              <div className="destination-divider"></div>
              <div className="destination-stats">
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">€ 2.000/m²</div>
                  <div className="stat-label">Avg. Price</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">+9.2%</div>
                  <div className="stat-label">Growth</div>
                </div>
                <div className="destination-stat">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="stat-value">4M</div>
                  <div className="stat-label">Inhabitants</div>
                </div>
              </div>
              <div className="destination-divider"></div>
              <div className="destination-regions">
                <div className="regions-label">{t('countries.topRegions')}</div>
                <div className="regions-tags">
                  <span className="region-tag">Dubrovnik</span>
                  <span className="region-tag">Split</span>
                  <span className="region-tag">Istria</span>
                  <span className="region-tag">Zadar</span>
                </div>
              </div>
              <button className="destination-button">{t('common.learnMore')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-heading">{t('countries.readyForAdventure')}</h2>
          <p className="cta-subtitle">{t('countries.findPropertiesNow')}</p>
          <button className="cta-button">
            {t('countries.discoverProperties')}
            <svg className="cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Countries;
