import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { createProperty } from '../services/propertyService';
import { getCountries } from '../services/countryService';
import './PostAd.css';

const PostAd = () => {
  const { t, loading: translationsLoading, currentLanguage } = useTranslation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);

  // Form state - Basic Information
  const [formData, setFormData] = useState({
    // Basic fields
    title: '',
    description: '',
    country: '',
    city: '',
    district: '',
    propertyType: '',
    priceFrom: '',
    priceTo: '',
    
    // Property details
    bedrooms: '',
    areaSqm: '',
    plotAreaSqm: '',
    yearBuilt: '',
    condition: '',
    garageSpaces: '',
    cellar: '',
    balconyTerraceCount: '',
    pool: '',
    bathrooms: '',
    bathroomsWithToilet: '',
    separateToilets: '',
    energyCertificateClass: '',
    energyCertificateConsumption: '',
    availability: '',
    furnishing: '',
    security24h: '',
    accessible: '',
    elevator: '',
    allYearHabitable: '',
    airConditioningRooms: '',
    heatingType: '',
    solarSystem: '',
    seniorFriendly: false,
    caretakerService: false,
    
    // Location details
    seaLakeView: false,
    mountainView: false,
    directWaterfront: '',
    beachAccess: '',
    distanceToBeach: '',
    distanceToSki: '',
    distanceToMarina: '',
    distanceToGolf: '',
    distanceToTennis: '',
    distanceToAirport: '',
    distanceToSights: '',
    distanceToSightsMinutes: '',
    distanceToRestaurants: '',
    distanceToSupermarket: '',
    distanceToMall: '',
    distanceToDoctors: '',
    distanceToHospital: '',
    distanceToSchools: '',
    publicTransport: '',
    publicTransportMinutes: '',
    internetQuality: '',
    
    // Legal & Economic
    foreignersCanBuy: '',
    secondHomeAllowed: '',
    localAdvisorRecommended: '',
    taxBenefits: '',
    localFinancingOptions: '',
    
    // Audience
    popularWith: '',
    expatFriendly: false,
    digitalNomadFriendly: false,
    petFriendly: false,
    familyFriendly: false,
    
    // Investment
    currentlyRented: '',
    expectedYield: '',
    propertyManagementAvailable: '',
    airbnbReady: false,
    
    // Verification
    ownershipProofDocs: [],
    energyCertificateDocs: [],
    addressVerified: false,
    consentAccepted: false,
    premiumReviewPurchased: false
  });

  useEffect(() => {
    // Close modal if user becomes authenticated
    if (isAuthenticated) {
      setShowAuthModal(false);
      
      // Load countries only if authenticated
      const loadCountries = async () => {
        try {
          const response = await getCountries();
          setCountries(response.data || response);
        } catch (err) {
          console.error('Error loading countries:', err);
        }
      };
      loadCountries();
    } else if (!authLoading && !isAuthenticated) {
      // Show auth modal if not authenticated (after auth check is complete)
      setShowAuthModal(true);
    }
  }, [isAuthenticated, authLoading]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear general error when user makes changes
    if (error) {
      setError(null);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 20) {
      setError('Maximal 20 Bilder erlaubt');
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Helper function to extract first number from text (e.g., "200m oder 5 Gehminuten" -> 200)
  const extractNumber = (text) => {
    if (!text) return undefined;
    const match = text.match(/\d+/);
    return match ? parseFloat(match[0]) : undefined;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setFieldErrors({});
    
    // Basic validation
    const errors = {};
    if (!formData.title) errors.title = t('postAd.validation.titleRequired');
    if (!formData.description) errors.description = t('postAd.validation.descriptionRequired');
    if (!formData.country) errors.country = t('postAd.validation.countryRequired');
    if (!formData.city) errors.city = t('postAd.validation.cityRequired');
    if (!formData.propertyType) errors.propertyType = t('postAd.validation.propertyTypeRequired');
    if (!formData.priceFrom) errors.priceFrom = t('postAd.validation.priceRequired');
    if (!formData.bedrooms) errors.bedrooms = t('postAd.validation.bedroomsRequired');
    if (!formData.areaSqm) errors.areaSqm = t('postAd.validation.areaRequired');

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(t('postAd.validation.pleaseFillRequired'));
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Start loading
    setLoading(true);
    const startTime = Date.now();
    const minLoadingTime = 2500; // 2.5 seconds minimum
    
    // Safety timeout - ensure loading always clears after max 10 seconds
    const safetyTimeout = setTimeout(() => {
      console.warn('Loading timeout - forcing loading state to clear');
      setLoading(false);
      if (!success && !error) {
        setError(t('postAd.errors.timeout'));
      }
    }, 10000);

    try {
      // Build property data object matching API structure
      const propertyData = {
        title: formData.title,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        district: formData.district || undefined,
        propertyType: formData.propertyType,
        price: {
          amount: parseFloat(formData.priceFrom) || 0,
          currency: 'EUR'
        },
        priceCents: Math.round((parseFloat(formData.priceFrom) || 0) * 100),
        currency: 'EUR',
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        areaSqm: formData.areaSqm ? parseInt(formData.areaSqm) : undefined,
        plotAreaSqm: formData.plotAreaSqm ? parseInt(formData.plotAreaSqm) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        imageUrls: imageFiles.map(file => URL.createObjectURL(file)), // In production, upload to server first
        
        // Details object
        details: {
          landRegistryAreaSqm: formData.plotAreaSqm ? parseInt(formData.plotAreaSqm) : undefined,
          yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
          condition: formData.condition || undefined,
          garageSpaces: formData.garageSpaces ? parseInt(formData.garageSpaces) : undefined,
          cellar: formData.cellar || undefined,
          balconyTerraceCount: formData.balconyTerraceCount ? parseInt(formData.balconyTerraceCount) : undefined,
          pool: formData.pool || undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          bathroomsWithToilet: formData.bathroomsWithToilet ? parseInt(formData.bathroomsWithToilet) : undefined,
          separateToilets: formData.separateToilets ? parseInt(formData.separateToilets) : undefined,
          energyCertificate: (formData.energyCertificateClass || formData.energyCertificateConsumption) ? {
            class: formData.energyCertificateClass || undefined,
            consumptionKwhPerSqmA: formData.energyCertificateConsumption ? parseFloat(formData.energyCertificateConsumption) : undefined
          } : undefined,
          availability: formData.availability || undefined,
          furnishing: formData.furnishing || undefined,
          security24h: formData.security24h || undefined,
          accessible: formData.accessible || undefined,
          allYearHabitable: formData.allYearHabitable === 'yes' ? true : (formData.allYearHabitable === 'no' ? false : undefined),
          airConditioningRooms: formData.airConditioningRooms ? parseInt(formData.airConditioningRooms) : undefined,
          heatingType: formData.heatingType || undefined,
          solarSystem: formData.solarSystem || undefined,
          seniorFriendly: formData.seniorFriendly || undefined,
          caretakerService: formData.caretakerService || undefined
        },
        
        // Location details
        locationDetails: {
          seaLakeView: formData.seaLakeView ? 'yes' : 'no',
          directWaterfront: formData.directWaterfront || undefined,
          beachAccess: formData.beachAccess || undefined,
          distanceToBeachMeters: extractNumber(formData.distanceToBeach),
          distanceToSkiKm: extractNumber(formData.distanceToSki),
          infrastructure: {
            distanceToMarinaKm: extractNumber(formData.distanceToMarina),
            distanceToGolfKm: extractNumber(formData.distanceToGolf),
            distanceToTennisKm: extractNumber(formData.distanceToTennis),
            distanceToAirportMinutes: extractNumber(formData.distanceToAirport),
            distanceToSightsMinutes: extractNumber(formData.distanceToSightsMinutes),
            distanceToRestaurantsMinutes: extractNumber(formData.distanceToRestaurants),
            distanceToSupermarketMinutes: extractNumber(formData.distanceToSupermarket),
            distanceToMallMinutes: extractNumber(formData.distanceToMall),
            distanceToDoctorsMinutes: extractNumber(formData.distanceToDoctors),
            distanceToHospitalMinutes: extractNumber(formData.distanceToHospital),
            distanceToSchoolsMinutes: extractNumber(formData.distanceToSchools),
            publicTransport: formData.publicTransport && formData.publicTransportMinutes 
              ? `${formData.publicTransport}, ${formData.publicTransportMinutes}`
              : (formData.publicTransport || undefined),
            internetQuality: formData.internetQuality || undefined
          }
        },
        
        // Legal & Economic
        legalEconomic: {
          foreignersCanBuy: formData.foreignersCanBuy || undefined,
          secondHomeAllowed: formData.secondHomeAllowed || undefined,
          localAdvisorRecommended: formData.localAdvisorRecommended || undefined,
          taxBenefits: formData.taxBenefits || undefined,
          localFinancingOptions: formData.localFinancingOptions || undefined
        },
        
        // Audience
        audience: {
          popularWith: formData.popularWith || undefined,
          expatFriendly: formData.expatFriendly || undefined,
          digitalNomadFriendly: formData.digitalNomadFriendly || undefined,
          petFriendly: formData.petFriendly || undefined,
          familyFriendly: formData.familyFriendly || undefined,
          seniorFriendly: formData.seniorFriendly || undefined
        },
        
        // Investment
        investment: {
          currentlyRented: formData.currentlyRented || undefined,
          expectedYieldPercent: formData.expectedYield ? parseFloat(formData.expectedYield) : undefined,
          propertyManagementAvailable: formData.propertyManagementAvailable || undefined,
          airbnbReady: formData.airbnbReady || undefined
        },
        
        // Verification
        verification: {
          ownershipProofDocs: formData.ownershipProofDocs,
          energyCertificateDocs: formData.energyCertificateDocs,
          addressVerified: formData.addressVerified,
          consentAccepted: formData.consentAccepted,
          premiumReviewPurchased: formData.premiumReviewPurchased
        }
      };

      // Remove undefined values
      const cleanData = JSON.parse(JSON.stringify(propertyData));
      
      const response = await createProperty(cleanData);
      
      // Calculate remaining time to meet minimum loading duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      // Wait for minimum loading time, then show success
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // Clear safety timeout
      clearTimeout(safetyTimeout);
      
      // Check response - handle both direct data and nested data structure
      const responseData = response.data || response;
      
      console.log('Property creation response:', response);
      console.log('Response data:', responseData);
      
      if (responseData && (responseData.id || responseData.status || response)) {
        setLoading(false);
        setSuccess(true);
        setError(null);
      } else {
        // If response doesn't have expected structure, still show success
        console.warn('Unexpected response structure:', response);
        setLoading(false);
        setSuccess(true);
        setError(null);
      }
    } catch (err) {
      // Clear safety timeout
      clearTimeout(safetyTimeout);
      
      console.error('Error creating property:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Calculate remaining time to meet minimum loading duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      // Wait for minimum loading time even on error
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // Handle API validation errors
      if (err.response?.data?.error) {
        const errorMessage = err.response.data.error;
        setError(errorMessage);
        
        // Try to extract field-specific errors if available
        if (err.response.data.errors) {
          const apiFieldErrors = {};
          err.response.data.errors.forEach(error => {
            if (error.field) {
              apiFieldErrors[error.field] = error.message;
            }
          });
          if (Object.keys(apiFieldErrors).length > 0) {
            setFieldErrors(apiFieldErrors);
          }
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(t('postAd.errors.createFailed'));
      }
      
      setLoading(false);
    }
  };

  // Debug: Log translation state
  useEffect(() => {
    if (!translationsLoading) {
      const translationValue = t('postAd.heroTitle');
      console.log('Current language:', currentLanguage);
      console.log('Translation key result:', translationValue);
      if (translationValue === 'postAd.heroTitle') {
        console.warn('Translation not found for postAd.heroTitle');
      }
    }
  }, [translationsLoading, currentLanguage, t]);

  if (translationsLoading || authLoading) {
    return (
      <div className="post-ad-container">
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="post-ad-container">
      <Navbar />
      
      {/* Authentication Required Modal */}
      {showAuthModal && (
        <div className="auth-required-modal-overlay">
          <div className="auth-required-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-icon">🔒</div>
            <h2>{t('postAd.authRequired.title')}</h2>
            <p>{t('postAd.authRequired.message')}</p>
            <div className="auth-modal-buttons">
              <button 
                className="auth-modal-btn auth-modal-btn-primary"
                onClick={() => navigate('/login')}
              >
                {t('postAd.authRequired.login')}
              </button>
              <button 
                className="auth-modal-btn auth-modal-btn-secondary"
                onClick={() => navigate('/register')}
              >
                {t('postAd.authRequired.register')}
              </button>
            </div>
            <button 
              className="auth-modal-close"
              onClick={() => navigate('/')}
            >
              {t('postAd.authRequired.goBack')}
            </button>
          </div>
        </div>
      )}
      
      {/* Only show form if authenticated */}
      {!isAuthenticated ? null : (
        <>
      
      {/* Hero Banner - Only show if authenticated */}
      {isAuthenticated && (
        <>
          <div className="post-ad-hero">
            <div className="hero-content">
              <h1 className="hero-title">{t('postAd.heroTitle')}</h1>
              <p className="hero-description">{t('postAd.heroDescription')}</p>
            </div>
          </div>

          <div className="post-ad-content">
        <form onSubmit={handleSubmit} className="post-ad-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🏠</div>
              <h2 className="section-title">{t('postAd.basicInformation')}</h2>
            </div>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="title">{t('postAd.adTitle')} *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t('postAd.adTitlePlaceholder')}
                  className={fieldErrors.title ? 'error-field' : ''}
                  required
                />
                {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">{t('postAd.description')} *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t('postAd.descriptionPlaceholder')}
                  rows="4"
                  className={fieldErrors.description ? 'error-field' : ''}
                  required
                />
                {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="country">{t('postAd.country')} *</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={fieldErrors.country ? 'error-field' : ''}
                  required
                >
                  <option value="">{t('postAd.selectCountry')}</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.country && <span className="field-error">{fieldErrors.country}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="city">{t('postAd.cityRegion')} *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder={t('postAd.cityPlaceholder')}
                  className={fieldErrors.city ? 'error-field' : ''}
                  required
                />
                {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="propertyType">{t('postAd.propertyType')} *</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className={fieldErrors.propertyType ? 'error-field' : ''}
                  required
                >
                  <option value="">{t('postAd.selectType')}</option>
                  <option value="apartment">{t('postAd.apartment')}</option>
                  <option value="house">{t('postAd.house')}</option>
                  <option value="villa">{t('postAd.villa')}</option>
                  <option value="land">{t('postAd.land')}</option>
                  <option value="commercial">{t('postAd.commercial')}</option>
                  <option value="other">{t('postAd.other')}</option>
                </select>
                {fieldErrors.propertyType && <span className="field-error">{fieldErrors.propertyType}</span>}
              </div>

              <div className="form-group">
                <label>{t('postAd.priceRange')} (€) *</label>
                <div className="price-range">
                  <input
                    type="number"
                    name="priceFrom"
                    id="priceFrom"
                    value={formData.priceFrom}
                    onChange={handleInputChange}
                    placeholder={t('postAd.priceFrom')}
                    className={fieldErrors.priceFrom ? 'error-field' : ''}
                    required
                  />
                  <input
                    type="number"
                    name="priceTo"
                    value={formData.priceTo}
                    onChange={handleInputChange}
                    placeholder={t('postAd.priceTo')}
                  />
                </div>
                {fieldErrors.priceFrom && <span className="field-error">{fieldErrors.priceFrom}</span>}
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bedrooms">{t('postAd.bedrooms')} *</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="z.B. 3"
                  className={fieldErrors.bedrooms ? 'error-field' : ''}
                  required
                />
                {fieldErrors.bedrooms && <span className="field-error">{fieldErrors.bedrooms}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="areaSqm">{t('postAd.area')} (m²) *</label>
                <input
                  type="number"
                  id="areaSqm"
                  name="areaSqm"
                  value={formData.areaSqm}
                  onChange={handleInputChange}
                  placeholder="z.B. 150"
                  className={fieldErrors.areaSqm ? 'error-field' : ''}
                  required
                />
                {fieldErrors.areaSqm && <span className="field-error">{fieldErrors.areaSqm}</span>}
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">📷</div>
              <h2 className="section-title">{t('postAd.uploadPhotos')}</h2>
            </div>
            
            <div className="photo-upload-area">
              <input
                type="file"
                id="imageUpload"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="imageUpload" className="upload-label">
                <div className="upload-icon">↑</div>
                <p>{t('postAd.clickOrDragPhotos')}</p>
                <p className="upload-hint">{t('postAd.photoRequirements')}</p>
              </label>
              
              {imageFiles.length > 0 && (
                <div className="image-preview-grid">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Property Information */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">ℹ️</div>
              <h2 className="section-title">{t('postAd.additionalInfo')}</h2>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="plotAreaSqm">{t('postAd.plotSize')} (m²)</label>
                <input
                  type="number"
                  id="plotAreaSqm"
                  name="plotAreaSqm"
                  value={formData.plotAreaSqm}
                  onChange={handleInputChange}
                  placeholder="z.B. 500"
                />
              </div>

              <div className="form-group">
                <label htmlFor="yearBuilt">{t('postAd.yearBuilt')}</label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  placeholder="z.B. 2020"
                />
              </div>

              <div className="form-group">
                <label htmlFor="condition">{t('postAd.condition')}</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.selectCondition')}</option>
                  <option value="new">{t('postAd.new')}</option>
                  <option value="good">{t('postAd.good')}</option>
                  <option value="renovated">{t('postAd.renovated')}</option>
                  <option value="needs_renovation">{t('postAd.needsRenovation')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="garageSpaces">{t('postAd.garageParking')}</label>
                <input
                  type="number"
                  id="garageSpaces"
                  name="garageSpaces"
                  value={formData.garageSpaces}
                  onChange={handleInputChange}
                  placeholder="z.B. 2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cellar">{t('postAd.cellar')}</label>
                <select
                  id="cellar"
                  name="cellar"
                  value={formData.cellar}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                  <option value="unknown">{t('postAd.unknown')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="balconyTerraceCount">{t('postAd.balconyTerrace')}</label>
                <input
                  type="number"
                  id="balconyTerraceCount"
                  name="balconyTerraceCount"
                  value={formData.balconyTerraceCount}
                  onChange={handleInputChange}
                  placeholder="z.B. 1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pool">{t('postAd.pool')}</label>
                <select
                  id="pool"
                  name="pool"
                  value={formData.pool}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="none">{t('postAd.none')}</option>
                  <option value="private">{t('postAd.private')}</option>
                  <option value="shared">{t('postAd.shared')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bathroom Details */}
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bathrooms">{t('postAd.numberBathrooms')}</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="z.B. 2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathroomsWithToilet">{t('postAd.bathroomShowerToilet')}</label>
                <input
                  type="number"
                  id="bathroomsWithToilet"
                  name="bathroomsWithToilet"
                  value={formData.bathroomsWithToilet}
                  onChange={handleInputChange}
                  placeholder="z.B. 2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="separateToilets">{t('postAd.separateToilet')}</label>
                <input
                  type="number"
                  id="separateToilets"
                  name="separateToilets"
                  value={formData.separateToilets}
                  onChange={handleInputChange}
                  placeholder="z.B. 1"
                />
              </div>
            </div>
          </div>

          {/* Energy Certificate & Availability */}
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>{t('postAd.energyCertificate')}</label>
                <div className="energy-cert-grid">
                  <select
                    name="energyCertificateClass"
                    value={formData.energyCertificateClass}
                    onChange={handleInputChange}
                  >
                    <option value="">{t('postAd.class')}</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                  </select>
                  <input
                    type="number"
                    name="energyCertificateConsumption"
                    value={formData.energyCertificateConsumption}
                    onChange={handleInputChange}
                    placeholder={t('postAd.consumption')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="availability">{t('postAd.availability')}</label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.selectAvailability')}</option>
                  <option value="immediately">{t('postAd.immediately')}</option>
                  <option value="available_from">{t('postAd.availableFrom')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="furnishing">{t('postAd.furnishing')}</label>
                <select
                  id="furnishing"
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.selectFurnishing')}</option>
                  <option value="unfurnished">{t('postAd.unfurnished')}</option>
                  <option value="partially_furnished">{t('postAd.partiallyFurnished')}</option>
                  <option value="fully_furnished">{t('postAd.fullyFurnished')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="security24h">{t('postAd.security24h')}</label>
                <select
                  id="security24h"
                  name="security24h"
                  value={formData.security24h}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accessibility & Features */}
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>{t('postAd.accessibility')}</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="accessible"
                      value="yes"
                      checked={formData.accessible === 'yes'}
                      onChange={handleInputChange}
                    />
                    {t('postAd.barrierFree')}
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="accessible"
                      value="no"
                      checked={formData.accessible === 'no'}
                      onChange={handleInputChange}
                    />
                    {t('postAd.elevator')}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>{t('postAd.additionalOptions')}</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="checkbox"
                      name="seniorFriendly"
                      checked={formData.seniorFriendly}
                      onChange={handleInputChange}
                    />
                    {t('postAd.seniorFriendly')}
                  </label>
                  <label className="radio-label">
                    <input
                      type="checkbox"
                      name="caretakerService"
                      checked={formData.caretakerService}
                      onChange={handleInputChange}
                    />
                    {t('postAd.caretakerService')}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="allYearHabitable">{t('postAd.allYearHabitable')}</label>
                <select
                  id="allYearHabitable"
                  name="allYearHabitable"
                  value={formData.allYearHabitable}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="airConditioningRooms">{t('postAd.airConditioning')}</label>
                <select
                  id="airConditioningRooms"
                  name="airConditioningRooms"
                  value={formData.airConditioningRooms}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.selectRooms')}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="heatingType">{t('postAd.heating')}</label>
                <select
                  id="heatingType"
                  name="heatingType"
                  value={formData.heatingType}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.selectHeatingType')}</option>
                  <option value="central">{t('postAd.central')}</option>
                  <option value="underfloor">{t('postAd.underfloor')}</option>
                  <option value="electric">{t('postAd.electric')}</option>
                  <option value="gas">{t('postAd.gas')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="solarSystem">{t('postAd.solarSystem')}</label>
                <select
                  id="solarSystem"
                  name="solarSystem"
                  value={formData.solarSystem}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">📍</div>
              <h2 className="section-title">{t('postAd.locationDetails')}</h2>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>{t('postAd.locationFeatures')}</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="seaLakeView"
                      checked={formData.seaLakeView}
                      onChange={handleInputChange}
                    />
                    {t('postAd.seaLakeView')}
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="mountainView"
                      checked={formData.mountainView}
                      onChange={handleInputChange}
                    />
                    {t('postAd.mountainView')}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="directWaterfront">{t('postAd.directWaterfront')}</label>
                <select
                  id="directWaterfront"
                  name="directWaterfront"
                  value={formData.directWaterfront}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="beachAccess">{t('postAd.beachAccess')}</label>
                <select
                  id="beachAccess"
                  name="beachAccess"
                  value={formData.beachAccess}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="private">{t('postAd.private')}</option>
                  <option value="public_beach">{t('postAd.publicBeach')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="distanceToBeach">{t('postAd.distanceToBeach')}</label>
                <input
                  type="text"
                  id="distanceToBeach"
                  name="distanceToBeach"
                  value={formData.distanceToBeach}
                  onChange={handleInputChange}
                  placeholder="z.B. 200m oder 5 Gehminuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToSki">{t('postAd.distanceToSki')}</label>
                <input
                  type="text"
                  id="distanceToSki"
                  name="distanceToSki"
                  value={formData.distanceToSki}
                  onChange={handleInputChange}
                  placeholder="z.B. 5km oder 10 Fahrminuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToMarina">{t('postAd.distanceToMarina')}</label>
                <input
                  type="text"
                  id="distanceToMarina"
                  name="distanceToMarina"
                  value={formData.distanceToMarina}
                  onChange={handleInputChange}
                  placeholder="z.B. 1km oder 10 Minuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToGolf">{t('postAd.distanceToGolf')}</label>
                <input
                  type="text"
                  id="distanceToGolf"
                  name="distanceToGolf"
                  value={formData.distanceToGolf}
                  onChange={handleInputChange}
                  placeholder="z.B. 2km oder 15 Minuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToTennis">{t('postAd.distanceToTennis')}</label>
                <input
                  type="text"
                  id="distanceToTennis"
                  name="distanceToTennis"
                  value={formData.distanceToTennis}
                  onChange={handleInputChange}
                  placeholder="z.B. 500m oder 5 Minuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToAirport">{t('postAd.distanceToAirport')}</label>
                <input
                  type="text"
                  id="distanceToAirport"
                  name="distanceToAirport"
                  value={formData.distanceToAirport}
                  onChange={handleInputChange}
                  placeholder="z.B. 30 Minuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToSights">{t('postAd.distanceToSights')}</label>
                <div className="two-inputs">
                  <input
                    type="text"
                    name="distanceToSights"
                    value={formData.distanceToSights}
                    onChange={handleInputChange}
                    placeholder="z.B. Altstadt"
                  />
                  <input
                    type="text"
                    name="distanceToSightsMinutes"
                    value={formData.distanceToSightsMinutes}
                    onChange={handleInputChange}
                    placeholder="z.B. 10 Minuten"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="distanceToRestaurants">{t('postAd.distanceToRestaurants')}</label>
                <input
                  type="text"
                  id="distanceToRestaurants"
                  name="distanceToRestaurants"
                  value={formData.distanceToRestaurants}
                  onChange={handleInputChange}
                  placeholder="z.B. 200m oder 3 Gehminuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToSupermarket">{t('postAd.distanceToSupermarket')}</label>
                <input
                  type="text"
                  id="distanceToSupermarket"
                  name="distanceToSupermarket"
                  value={formData.distanceToSupermarket}
                  onChange={handleInputChange}
                  placeholder="z.B. 500m oder 5 Gehminuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToMall">{t('postAd.distanceToMall')}</label>
                <input
                  type="text"
                  id="distanceToMall"
                  name="distanceToMall"
                  value={formData.distanceToMall}
                  onChange={handleInputChange}
                  placeholder="z.B. 2km oder 10 Fahrminuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToDoctors">{t('postAd.distanceToDoctors')}</label>
                <input
                  type="text"
                  id="distanceToDoctors"
                  name="distanceToDoctors"
                  value={formData.distanceToDoctors}
                  onChange={handleInputChange}
                  placeholder="z.B. 300m oder 3 Gehminuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToHospital">{t('postAd.distanceToHospital')}</label>
                <input
                  type="text"
                  id="distanceToHospital"
                  name="distanceToHospital"
                  value={formData.distanceToHospital}
                  onChange={handleInputChange}
                  placeholder="z.B. 5km oder 10 Fahrminuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="distanceToSchools">{t('postAd.distanceToSchools')}</label>
                <input
                  type="text"
                  id="distanceToSchools"
                  name="distanceToSchools"
                  value={formData.distanceToSchools}
                  onChange={handleInputChange}
                  placeholder="z.B. 1km oder 10 Gehminuten"
                />
              </div>

              <div className="form-group">
                <label htmlFor="publicTransport">{t('postAd.publicTransport')}</label>
                <input
                  type="text"
                  id="publicTransport"
                  name="publicTransport"
                  value={formData.publicTransport}
                  onChange={handleInputChange}
                  placeholder="z.B. U-Bahn"
                />
                <input
                  type="text"
                  name="publicTransportMinutes"
                  value={formData.publicTransportMinutes}
                  onChange={handleInputChange}
                  placeholder="z.B. 5 Gehminuten"
                  className="second-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="internetQuality">{t('postAd.internetQuality')}</label>
                <input
                  type="text"
                  id="internetQuality"
                  name="internetQuality"
                  value={formData.internetQuality}
                  onChange={handleInputChange}
                  placeholder="z.B. Glasfaser, 100 Mbit/s"
                />
              </div>
            </div>
          </div>

          {/* Legal & Economic Factors */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">✓</div>
              <h2 className="section-title">{t('postAd.legalEconomic')}</h2>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="foreignersCanBuy">{t('postAd.foreignersCanBuy')}</label>
                <select
                  id="foreignersCanBuy"
                  name="foreignersCanBuy"
                  value={formData.foreignersCanBuy}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="easy">{t('postAd.easy')}</option>
                  <option value="moderate">{t('postAd.moderate')}</option>
                  <option value="difficult">{t('postAd.difficult')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="secondHomeAllowed">{t('postAd.secondHomeAllowed')}</label>
                <select
                  id="secondHomeAllowed"
                  name="secondHomeAllowed"
                  value={formData.secondHomeAllowed}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="localAdvisorRecommended">{t('postAd.localAdvisorRecommended')}</label>
                <select
                  id="localAdvisorRecommended"
                  name="localAdvisorRecommended"
                  value={formData.localAdvisorRecommended}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="taxBenefits">{t('postAd.taxBenefits')}</label>
                <textarea
                  id="taxBenefits"
                  name="taxBenefits"
                  value={formData.taxBenefits}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder={t('postAd.taxBenefitsPlaceholder')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="localFinancingOptions">{t('postAd.localFinancingOptions')}</label>
                <textarea
                  id="localFinancingOptions"
                  name="localFinancingOptions"
                  value={formData.localFinancingOptions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder={t('postAd.localFinancingPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Audience Filters */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">✓</div>
              <h2 className="section-title">{t('postAd.audienceFilters')}</h2>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="popularWith">{t('postAd.popularWith')}</label>
                <input
                  type="text"
                  id="popularWith"
                  name="popularWith"
                  value={formData.popularWith}
                  onChange={handleInputChange}
                  placeholder="z.B. Deutsche, Schweizer, Skandinavier"
                />
              </div>

              <div className="form-group">
                <label>{t('postAd.additionalAudience')}</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="expatFriendly"
                      checked={formData.expatFriendly}
                      onChange={handleInputChange}
                    />
                    {t('postAd.expatFriendly')}
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="digitalNomadFriendly"
                      checked={formData.digitalNomadFriendly}
                      onChange={handleInputChange}
                    />
                    {t('postAd.digitalNomadFriendly')}
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="petFriendly"
                      checked={formData.petFriendly}
                      onChange={handleInputChange}
                    />
                    {t('postAd.petFriendly')}
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="familyFriendly"
                      checked={formData.familyFriendly}
                      onChange={handleInputChange}
                    />
                    {t('postAd.familyFriendly')}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Investment & Yield */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">✓</div>
              <h2 className="section-title">{t('postAd.investmentYield')}</h2>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="currentlyRented">{t('postAd.currentlyRented')}</label>
                <select
                  id="currentlyRented"
                  name="currentlyRented"
                  value={formData.currentlyRented}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="expectedYield">{t('postAd.expectedYield')}</label>
                <input
                  type="number"
                  step="0.1"
                  id="expectedYield"
                  name="expectedYield"
                  value={formData.expectedYield}
                  onChange={handleInputChange}
                  placeholder="z.B. 6.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="propertyManagementAvailable">{t('postAd.propertyManagementAvailable')}</label>
                <select
                  id="propertyManagementAvailable"
                  name="propertyManagementAvailable"
                  value={formData.propertyManagementAvailable}
                  onChange={handleInputChange}
                >
                  <option value="">{t('postAd.select')}</option>
                  <option value="yes">{t('postAd.yes')}</option>
                  <option value="no">{t('postAd.no')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="airbnbReady"
                    checked={formData.airbnbReady}
                    onChange={handleInputChange}
                  />
                  {t('postAd.airbnbReady')}
                </label>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="form-section verification-section">
            <div className="section-header">
              <div className="section-icon">🛡️</div>
              <h2 className="section-title">{t('postAd.verificationTrust')}</h2>
            </div>
            <p className="section-description">{t('postAd.verificationDescription')}</p>
            
            <div className="verification-cards">
              <div className="verification-card">
                <div className="card-icon">📄</div>
                <h3>{t('postAd.ownershipProof')}</h3>
                <p>{t('postAd.ownershipProofDesc')}</p>
                <button type="button" className="add-btn">
                  {t('postAd.add')}
                </button>
                <span className="recommended-badge">{t('postAd.recommended')}</span>
              </div>

              <div className="verification-card">
                <div className="card-icon">🛡️</div>
                <h3>{t('postAd.identityVerification')}</h3>
                <p>{t('postAd.identityVerificationDesc')}</p>
                <button type="button" className="add-btn">
                  {t('postAd.add')}
                </button>
                <span className="recommended-badge">{t('postAd.recommended')}</span>
              </div>

              <div className="verification-card">
                <div className="card-icon">📍</div>
                <h3>{t('postAd.addressVerification')}</h3>
                <p>{t('postAd.addressVerificationDesc')}</p>
                <button type="button" className="add-btn">
                  {t('postAd.add')}
                </button>
                <span className="recommended-badge">{t('postAd.recommended')}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <p className="required-note">* {t('postAd.requiredFields')}</p>
            <div className="action-buttons">
              <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
                {t('postAd.cancel')}
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? t('common.loading') : t('postAd.submitAd')}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </form>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>{t('postAd.loading.creating')}</p>
            </div>
          </div>
        )}

        {/* Success Popup Modal */}
        {success && (
          <div className="success-popup-overlay">
            <div className="success-popup" onClick={(e) => e.stopPropagation()}>
              <div className="success-popup-icon">✓</div>
              <h2>{t('postAd.success.title')}</h2>
              <p>{t('postAd.success.message')}</p>
              <button 
                className="success-popup-button"
                onClick={() => navigate('/')}
              >
                {t('postAd.success.goToHome')}
              </button>
            </div>
          </div>
        )}
        </>
      )}

        </>
      )}

      <Footer />
    </div>
  );
};

export default PostAd;

