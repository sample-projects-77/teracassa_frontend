import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import ContactModal from '../components/ContactModal';
import CountryDropdown from '../components/CountryDropdown';
import CityDropdown from '../components/CityDropdown';
import { useTranslation } from '../context/TranslationContext';
import { searchPartners } from '../services/partnerService';
import { getCountries } from '../services/countryService';
import './Network.css';

const Network = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    serviceCategory: '',
    language: ''
  });
  const [additionalFilters, setAdditionalFilters] = useState({
    verifiedOnly: false,
    ratingMin: false,
    immediatelyAvailable: false,
    available247: false
  });
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    loadCountries();
    // Load default partners with rating >= 4.5 on initial load
    loadDefaultPartners();
    // Reset filters on page load/refresh
    setFilters({
      country: '',
      city: '',
      serviceCategory: '',
      language: ''
    });
    setAdditionalFilters({
      verifiedOnly: false,
      ratingMin: false,
      immediatelyAvailable: false,
      available247: false
    });
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

  // Load default partners with rating >= 4.5
  const loadDefaultPartners = async () => {
    try {
      setLoading(true);
      console.log('Loading default partners (rating >= 4.5)');
      const data = await searchPartners({});
      console.log('All partners received:', data);
      
      // Filter for rating >= 4.5
      const filteredData = (data || []).filter(p => p.ratingAverage >= 4.5);
      console.log('Filtered partners (rating >= 4.5):', filteredData);
      
      setPartners(filteredData);
      setHasSearched(true); // Show the section
    } catch (error) {
      console.error('Error loading default partners:', error);
      console.error('Error details:', error.message, error.response);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPartners = async (searchFilters = {}) => {
    try {
      setLoading(true);
      console.log('Loading partners with filters:', searchFilters);
      const data = await searchPartners(searchFilters);
      console.log('Partners received:', data);
      
      // Apply additional filters on frontend
      let filteredData = data || [];
      
      if (additionalFilters.ratingMin) {
        filteredData = filteredData.filter(p => p.ratingAverage >= 4.5);
      }
      
      if (additionalFilters.verifiedOnly) {
        filteredData = filteredData.filter(p => p.isVerified);
      }
      
      if (additionalFilters.immediatelyAvailable) {
        filteredData = filteredData.filter(p => p.isImmediatelyAvailable);
      }
      
      if (additionalFilters.available247) {
        filteredData = filteredData.filter(p => p.isAvailable247);
      }
      
      setPartners(filteredData);
    } catch (error) {
      console.error('Error loading partners:', error);
      console.error('Error details:', error.message, error.response);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdditionalFilterToggle = (filterName) => {
    setAdditionalFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Build active filters
    const activeFilters = {};
    
    // Ensure country is uppercase (backend expects uppercase)
    if (filters.country) {
      activeFilters.country = filters.country.toUpperCase().trim();
    }
    if (filters.city) {
      activeFilters.city = filters.city.trim();
    }
    if (filters.serviceCategory) {
      activeFilters.serviceCategory = filters.serviceCategory.trim();
    }
    // Note: language filter would need backend support
    
    console.log('Searching with filters:', activeFilters);
    setHasSearched(true);
    loadPartners(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      country: '',
      city: '',
      serviceCategory: '',
      language: ''
    });
    setAdditionalFilters({
      verifiedOnly: false,
      ratingMin: false,
      immediatelyAvailable: false,
      available247: false
    });
    // Reload default partners with rating >= 4.5
    loadDefaultPartners();
  };

  // Service categories (common partner roles) - keep original English values for backend
  const serviceCategories = [
    'Real Estate Agent',
    'Architect',
    'Lawyer',
    'Notary',
    'Tax Advisor',
    'Financial Advisor',
    'Appraiser',
    'Construction Company'
  ];
  
  const getServiceCategoryLabel = (service) => {
    const serviceMap = {
      'Real Estate Agent': t('network.realEstateAgent'),
      'Architect': t('network.architect'),
      'Lawyer': t('network.lawyer'),
      'Notary': t('network.notary'),
      'Tax Advisor': t('network.taxAdvisor'),
      'Financial Advisor': t('network.financialAdvisor'),
      'Appraiser': t('network.appraiser'),
      'Construction Company': t('network.constructionCompany')
    };
    return serviceMap[service] || service;
  };

  // Languages
  const languages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' }
  ];

  const getCountryName = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  return (
    <div className="network-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="network-hero">
        <div className="network-hero-content">
          <h1 className="network-main-heading">
            {t('network.heroTitle')}
          </h1>
          <p className="network-description">
            {t('network.heroDescription')}
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="network-search-section">
        <div className="network-search-container">
          <h2 className="network-search-title">{t('network.searchTitle')}</h2>
          <p className="network-search-instructions">
            {t('network.searchInstructions')}
          </p>

          <form onSubmit={handleSearch} className="network-search-form">
            {/* Main Filters */}
            <div className="network-filters-row">
              <div className="network-filter-field">
                <CountryDropdown
                  id="country"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  countries={countries}
                  placeholder={t('network.selectCountry')}
                />
              </div>
              
              <div className="network-filter-field">
                <CityDropdown
                  id="city"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  countryCode={filters.country}
                  placeholder={t('network.regionCity')}
                  allowFreeText={true}
                />
              </div>
              
              <div className="network-filter-field">
                <select
                  id="serviceCategory"
                  name="serviceCategory"
                  value={filters.serviceCategory}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('network.service')}</option>
                  {serviceCategories.map((service) => (
                    <option key={service} value={service}>
                      {getServiceCategoryLabel(service)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="network-filter-field">
                <select
                  id="language"
                  name="language"
                  value={filters.language}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('network.language')}</option>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="network-additional-filters">
              <span className="additional-filters-label">{t('network.additionalFilters')}</span>
              <div className="filter-tags">
                <button
                  type="button"
                  className={`filter-tag ${additionalFilters.verifiedOnly ? 'active' : ''}`}
                  onClick={() => handleAdditionalFilterToggle('verifiedOnly')}
                >
                  {t('network.onlyVerifiedPartners')}
                </button>
                <button
                  type="button"
                  className={`filter-tag ${additionalFilters.ratingMin ? 'active' : ''}`}
                  onClick={() => handleAdditionalFilterToggle('ratingMin')}
                >
                  {t('network.rating45Plus')}
                </button>
                <button
                  type="button"
                  className={`filter-tag ${additionalFilters.immediatelyAvailable ? 'active' : ''}`}
                  onClick={() => handleAdditionalFilterToggle('immediatelyAvailable')}
                >
                  {t('network.immediatelyAvailable')}
                </button>
                <button
                  type="button"
                  className={`filter-tag ${additionalFilters.available247 ? 'active' : ''}`}
                  onClick={() => handleAdditionalFilterToggle('available247')}
                >
                  {t('network.reachable247')}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="network-search-actions">
              <button type="submit" className="network-search-button">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('network.searchPartners')}
              </button>
              <button 
                type="button" 
                className="network-reset-button"
                onClick={handleReset}
              >
                <svg className="reset-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('network.reset')}
              </button>
            </div>

            {/* Partner Count */}
            {hasSearched && (
              <div className="network-partner-count">
                {t('network.verifiedPartnersAvailable', {
                  count: partners.length,
                  plural: partners.length !== 1 ? 's' : '',
                  countries: new Set(partners.map(p => p.baseCountry).filter(Boolean)).size,
                  countryPlural: new Set(partners.map(p => p.baseCountry).filter(Boolean)).size !== 1 ? 'ies' : 'y'
                })}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Partners List Section */}
      {hasSearched && (
        <section className="network-partners-section">
          <div className="network-partners-container">
            {/* Section Header */}
            <div className="partners-section-header">
              <h2 className="partners-section-title">{t('network.selectedPartners')}</h2>
              <p className="partners-section-subtitle">
                {t('network.partnersVetted')}
              </p>
            </div>

            {loading ? (
              <div className="loading-message">{t('network.loadingPartners')}</div>
            ) : partners.length > 0 ? (
              <div className="partners-grid">
                {partners.map((partner) => {
                  // Generate specialties/tags based on roleTitle
                  const getSpecialties = (roleTitle) => {
                    if (!roleTitle) return [];
                    const role = roleTitle.toLowerCase();
                    const specialtiesMap = {
                      'makler': ['Luxury Properties', 'Holiday Properties'],
                      'immobilienmakler': ['Luxury Properties', 'Holiday Properties'],
                      'immobilienmaklerin': ['Luxury Properties', 'Holiday Properties'],
                      'anwalt': ['Contract Law', 'Tax Law'],
                      'lawyer': ['Contract Law', 'Tax Law'],
                      'architekt': ['Architecture', 'Design'],
                      'architect': ['Architecture', 'Design'],
                      'gutachter': ['Appraisal', 'Quality Inspection'],
                      'appraiser': ['Appraisal', 'Quality Inspection'],
                      'notar': ['Notarization', 'Legal Services'],
                      'notary': ['Notarization', 'Legal Services'],
                      'steuerberater': ['Tax Consulting', 'Financial Planning'],
                      'accountant': ['Tax Consulting', 'Financial Planning']
                    };
                    
                    for (const [key, tags] of Object.entries(specialtiesMap)) {
                      if (role.includes(key)) {
                        return tags;
                      }
                    }
                    // Default tags
                    return ['Professional Service', 'Expert Consultation'];
                  };

                  const specialties = getSpecialties(partner.roleTitle);
                  const isVerified = partner.isVerified || partner.ratingCount > 0;

                  return (
                    <div key={partner.id} className="partner-card">
                      <div className="partner-avatar-container">
                        {partner.avatarUrl ? (
                          <img 
                            src={partner.avatarUrl} 
                            alt={partner.displayName}
                            className="partner-avatar"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const placeholder = e.target.nextElementSibling;
                              if (placeholder) {
                                placeholder.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="partner-avatar-placeholder"
                          style={{ display: partner.avatarUrl ? 'none' : 'flex' }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div className="partner-content">
                        <div className="partner-name-row">
                          <h3 className="partner-name">{partner.displayName}</h3>
                          {isVerified && (
                            <svg className="verified-checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                          )}
                        </div>
                        <div className="partner-role">{partner.roleTitle}</div>
                        <div className="partner-location">
                          <svg className="location-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {partner.baseCity && `${partner.baseCity}, `}
                          {partner.baseCountry ? getCountryName(partner.baseCountry) : partner.baseCountry}
                        </div>
                        <div className="partner-rating">
                          <svg className="rating-star-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
                          </svg>
                          <span className="rating-value">
                            {partner.ratingAverage > 0 ? partner.ratingAverage.toFixed(1) : '0.0'}
                          </span>
                          <span className="rating-count">
                            ({partner.ratingCount} {partner.ratingCount === 1 ? t('network.review') : t('network.reviews')})
                          </span>
                        </div>
                        {specialties.length > 0 && (
                          <div className="partner-specialties">
                            {specialties.map((specialty, index) => (
                              <span key={index} className="specialty-tag">{specialty}</span>
                            ))}
                          </div>
                        )}
                        {(partner.isAvailable247 || partner.isImmediatelyAvailable) && (
                          <div className="partner-availability-indicators">
                            {partner.isAvailable247 && (
                              <span className="availability-indicator indicator-247" title={t('network.reachable247')}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                24/7
                              </span>
                            )}
                            {partner.isImmediatelyAvailable && (
                              <span className="availability-indicator indicator-immediate" title={t('network.immediatelyAvailable')}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {t('network.immediatelyAvailable')}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="partner-actions">
                          <button 
                            className="partner-contact-button"
                            onClick={() => {
                              setSelectedPartner(partner);
                              setShowContactModal(true);
                            }}
                          >
                            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="L22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {t('network.contact')}
                          </button>
                          <button 
                            className="partner-view-profile-button"
                            onClick={() => {
                              // Scroll to top before navigation for smooth transition
                              window.scrollTo({ top: 0, behavior: 'instant' });
                              navigate(`/partners/${partner.id}`);
                            }}
                          >
                            {t('network.viewProfile')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState 
                type="partners"
                actionLabel={t('network.searchPartners')}
                onAction={() => {
                  // Scroll to search form
                  document.querySelector('.network-search-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}
          </div>
        </section>
      )}

      <Footer />
      
      <ContactModal
        show={showContactModal}
        onClose={() => {
          setShowContactModal(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
      />
    </div>
  );
};

export default Network;

