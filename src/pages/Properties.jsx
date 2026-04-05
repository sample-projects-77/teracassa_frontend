import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import CountryDropdown from '../components/CountryDropdown';
import CityDropdown from '../components/CityDropdown';
import { useTranslation } from '../context/TranslationContext';
import { searchProperties } from '../services/propertyService';
import { getCountries } from '../services/countryService';
import './Properties.css';

const Properties = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [countries, setCountries] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [filters, setFilters] = useState({
    // Basic filters
    country: '',
    city: '',
    propertyType: '',
    minPriceCents: '',
    maxPriceCents: '',
    bedrooms: '',
    minAreaSqm: '',
    sort: 'newest',
    // Advanced - property details
    propertyAge: '',
    condition: '',
    minBathrooms: '',
    maxBathrooms: '',
    minLivingAreaSqm: '',
    maxLivingAreaSqm: '',
    cellar: '',
    minGarageSpaces: '',
    // Advanced - amenities
    furnishing: '',
    pool: '',
    seaLakeView: '',
    directWaterfront: '',
    beachAccess: '',
    security24h: '',
    maxDistanceToBeachMeters: '',
    // Advanced - boolean checkboxes
    hasGarden: false,
    hasParking: false,
    hasElevator: false,
    expatFriendly: false,
    digitalNomadFriendly: false,
    petFriendly: false,
    familyFriendly: false,
    airbnbReady: false,
    // Advanced - legal & investment
    foreignersCanBuy: '',
    availability: '',
    currentlyRented: '',
    propertyManagementAvailable: '',
    minExpectedYieldPercent: '',
    maxExpectedYieldPercent: '',
  });

  useEffect(() => {
    loadCountries();
    // Load default 6 properties on page load/refresh
    loadDefaultProperties();
    // Reset filters on page load/refresh
    setFilters({
      country: '', city: '', propertyType: '', minPriceCents: '', maxPriceCents: '',
      bedrooms: '', minAreaSqm: '', sort: 'newest',
      propertyAge: '', condition: '', minBathrooms: '', maxBathrooms: '',
      minLivingAreaSqm: '', maxLivingAreaSqm: '', cellar: '', minGarageSpaces: '',
      furnishing: '', pool: '', seaLakeView: '', directWaterfront: '', beachAccess: '',
      security24h: '', maxDistanceToBeachMeters: '',
      hasGarden: false, hasParking: false, hasElevator: false,
      expatFriendly: false, digitalNomadFriendly: false, petFriendly: false,
      familyFriendly: false, airbnbReady: false,
      foreignersCanBuy: '', availability: '', currentlyRented: '',
      propertyManagementAvailable: '', minExpectedYieldPercent: '', maxExpectedYieldPercent: '',
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

  // Load default 6 properties (page 1)
  const loadDefaultProperties = async () => {
    try {
      setLoading(true);
      console.log('Loading default properties (first 6)');
      const response = await searchProperties({ sort: 'newest' }, 1, 6);
      console.log('API Response:', response);
      
      // Extract data and pagination from response
      // Response is already processed by interceptor, so it should be the full object
      const propertiesData = response?.data || response || [];
      const pagination = response?.pagination || {};
      
      console.log('Properties received:', propertiesData);
      console.log('Pagination info:', pagination);
      
      setProperties(propertiesData);
      setCurrentPage(1);
      setHasNextPage(pagination.hasNextPage || false);
      setCurrentFilters({ sort: 'newest' });
      setHasSearched(true); // Show the section
    } catch (error) {
      console.error('Error loading default properties:', error);
      console.error('Error details:', error.message, error.response);
      setProperties([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async (searchFilters = {}, page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      console.log('Loading properties with filters:', searchFilters, 'page:', page);
      const response = await searchProperties(searchFilters, page, 6);
      console.log('API Response:', response);
      
      // Extract data and pagination from response
      // Response is already processed by interceptor, so it should be the full object
      const propertiesData = response?.data || response || [];
      const pagination = response?.pagination || {};
      
      console.log('Properties received:', propertiesData);
      console.log('Pagination info:', pagination);
      
      if (append) {
        // Append new properties to existing ones
        setProperties(prev => [...prev, ...propertiesData]);
      } else {
        // Replace properties with new search results
        setProperties(propertiesData);
      }
      
      setCurrentPage(page);
      setHasNextPage(pagination.hasNextPage || false);
      setCurrentFilters(searchFilters);
    } catch (error) {
      console.error('Error loading properties:', error);
      console.error('Error details:', error.message, error.response);
      if (!append) {
        setProperties([]);
      }
      setHasNextPage(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    await loadProperties(currentFilters, nextPage, true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Build active filters and convert price from euros to cents
    const activeFilters = {};
    
    // Ensure country is uppercase (backend expects uppercase)
    if (filters.country) {
      activeFilters.country = filters.country.toUpperCase().trim();
    }
    if (filters.city) {
      activeFilters.city = filters.city.trim();
    }
    if (filters.propertyType) {
      activeFilters.propertyType = filters.propertyType;
    }
    if (filters.sort) {
      activeFilters.sort = filters.sort;
    }
    
    // Convert price from euros to cents
    if (filters.minPriceCents) {
      activeFilters.minPriceCents = Math.round(parseFloat(filters.minPriceCents) * 100);
    }
    if (filters.maxPriceCents) {
      activeFilters.maxPriceCents = Math.round(parseFloat(filters.maxPriceCents) * 100);
    }
    
    if (filters.bedrooms) {
      activeFilters.minBedrooms = parseInt(filters.bedrooms);
    }
    if (filters.minAreaSqm) {
      activeFilters.minAreaSqm = parseInt(filters.minAreaSqm);
    }

    // Property age → minYearBuilt / maxYearBuilt
    if (filters.propertyAge) {
      const year = new Date().getFullYear();
      if (filters.propertyAge === '0-5') activeFilters.minYearBuilt = year - 5;
      else if (filters.propertyAge === '5-10') { activeFilters.minYearBuilt = year - 10; activeFilters.maxYearBuilt = year - 5; }
      else if (filters.propertyAge === '10-20') { activeFilters.minYearBuilt = year - 20; activeFilters.maxYearBuilt = year - 10; }
      else if (filters.propertyAge === '20+') activeFilters.maxYearBuilt = year - 20;
    }

    // Furnishing (API values: unfurnished, partially_furnished, fully_furnished)
    if (filters.furnishing) activeFilters.furnishing = filters.furnishing;

    // Property details
    if (filters.condition) activeFilters.condition = filters.condition;
    if (filters.minBathrooms) activeFilters.minBathrooms = parseInt(filters.minBathrooms);
    if (filters.maxBathrooms) activeFilters.maxBathrooms = parseInt(filters.maxBathrooms);
    if (filters.minLivingAreaSqm) activeFilters.minLivingAreaSqm = parseInt(filters.minLivingAreaSqm);
    if (filters.maxLivingAreaSqm) activeFilters.maxLivingAreaSqm = parseInt(filters.maxLivingAreaSqm);
    if (filters.cellar) activeFilters.cellar = filters.cellar;
    if (filters.minGarageSpaces) activeFilters.minGarageSpaces = parseInt(filters.minGarageSpaces);

    // Amenities
    if (filters.pool) activeFilters.pool = filters.pool;
    if (filters.seaLakeView) activeFilters.seaLakeView = filters.seaLakeView;
    if (filters.directWaterfront) activeFilters.directWaterfront = filters.directWaterfront;
    if (filters.beachAccess) activeFilters.beachAccess = filters.beachAccess;
    if (filters.security24h) activeFilters.security24h = filters.security24h;
    if (filters.maxDistanceToBeachMeters) activeFilters.maxDistanceToBeachMeters = parseFloat(filters.maxDistanceToBeachMeters);

    // Boolean checkbox filters → map to API booleans
    if (filters.expatFriendly) activeFilters.expatFriendly = true;
    if (filters.digitalNomadFriendly) activeFilters.digitalNomadFriendly = true;
    if (filters.petFriendly) activeFilters.petFriendly = true;
    if (filters.familyFriendly) activeFilters.familyFriendly = true;
    if (filters.airbnbReady) activeFilters.airbnbReady = true;

    // Features: build comma-separated list from checkboxes
    const featuresList = [];
    if (filters.hasGarden) featuresList.push('garden');
    if (filters.hasParking) featuresList.push('parking');
    if (filters.hasElevator) featuresList.push('elevator');
    if (featuresList.length > 0) activeFilters.features = featuresList.join(',');

    // Legal & investment
    if (filters.foreignersCanBuy) activeFilters.foreignersCanBuy = filters.foreignersCanBuy;
    if (filters.availability) activeFilters.availability = filters.availability;
    if (filters.currentlyRented) activeFilters.currentlyRented = filters.currentlyRented;
    if (filters.propertyManagementAvailable) activeFilters.propertyManagementAvailable = filters.propertyManagementAvailable;
    if (filters.minExpectedYieldPercent) activeFilters.minExpectedYieldPercent = parseFloat(filters.minExpectedYieldPercent);
    if (filters.maxExpectedYieldPercent) activeFilters.maxExpectedYieldPercent = parseFloat(filters.maxExpectedYieldPercent);

    console.log('Searching with filters:', activeFilters);
    setHasSearched(true);
    setCurrentPage(1); // Reset to page 1 for new search
    loadProperties(activeFilters, 1, false);
  };

  const formatPrice = (priceCents, currency = 'EUR') => {
    const amount = priceCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCountryName = (countryCode) => {
    const countryMap = {
      'TR': 'Turkey',
      'ES': 'Spain',
      'FR': 'France',
      'IT': 'Italy',
      'GR': 'Greece',
      'PT': 'Portugal',
      'HR': 'Croatia',
      'CY': 'Cyprus',
      'MT': 'Malta'
    };
    return countryMap[countryCode] || countryCode;
  };

  return (
    <div className="properties-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="properties-hero">
        <div className="properties-hero-content">
          <h1 className="properties-main-heading">
            {t('properties.heroTitle')}
          </h1>
          <p className="properties-description">
            {t('properties.heroDescription')}
          </p>
          <p className="properties-info">
            {t('properties.heroInfo')}
          </p>
        </div>
      </section>

      {/* Search/Filter Section */}
      <section className="properties-search-section">
        <div className="properties-search-container">
          {/* Tabs */}
          <div className="search-tabs">
            <button
              type="button"
              className={`search-tab ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              {t('properties.basicSearch')}
            </button>
            <button
              type="button"
              className={`search-tab ${activeTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced')}
            >
              {t('properties.advancedSearch')}
            </button>
          </div>

          <form onSubmit={handleSearch} className="properties-search-form">
            {/* First Row */}
            <div className="search-row">
              <div className="search-field">
                <CountryDropdown
                  id="country"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  countries={countries}
                  placeholder={t('properties.selectCountry')}
                />
              </div>
              
              <div className="search-field">
                <CityDropdown
                  id="city"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  countryCode={filters.country}
                  placeholder={t('properties.regionCity')}
                  allowFreeText={true}
                />
              </div>
              
              <div className="search-field">
                <select
                  id="propertyType"
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('properties.propertyType')}</option>
                  <option value="apartment">{t('properties.apartment')}</option>
                  <option value="house">{t('properties.house')}</option>
                  <option value="villa">{t('properties.villa')}</option>
                  <option value="land">{t('properties.land')}</option>
                  <option value="commercial">{t('properties.commercial')}</option>
                  <option value="other">{t('properties.other')}</option>
                </select>
              </div>
              
              <div className="search-field">
                <input
                  type="number"
                  id="minPriceCents"
                  name="minPriceCents"
                  placeholder={t('properties.priceFrom')}
                  value={filters.minPriceCents}
                  onChange={handleFilterChange}
                  min="0"
                  step="1000"
                />
              </div>
              
              <div className="search-field">
                <input
                  type="number"
                  id="maxPriceCents"
                  name="maxPriceCents"
                  placeholder={t('properties.priceTo')}
                  value={filters.maxPriceCents}
                  onChange={handleFilterChange}
                  min="0"
                  step="1000"
                />
              </div>
            </div>
            
            {/* Second Row */}
            <div className="search-row">
              <div className="search-field">
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('properties.bedrooms')}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>
              
              <div className="search-field">
                <input
                  type="number"
                  id="minAreaSqm"
                  name="minAreaSqm"
                  placeholder={t('properties.minLivingArea')}
                  value={filters.minAreaSqm}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
            </div>

            {/* Advanced Search Fields (shown when advanced tab is active) */}
            {activeTab === 'advanced' && (
              <>
                {/* Row: Sort, Property Age, Furnishing, Max Living Area */}
                <div className="search-row">
                  <div className="search-field">
                    <label htmlFor="sort">{t('properties.sort')}</label>
                    <select id="sort" name="sort" value={filters.sort} onChange={handleFilterChange}>
                      <option value="newest">{t('properties.newestFirst')}</option>
                      <option value="price_asc">{t('properties.priceAscending')}</option>
                      <option value="price_desc">{t('properties.priceDescending')}</option>
                      <option value="top">{t('properties.topOffers')}</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="propertyAge">{t('properties.propertyAge')}</label>
                    <select id="propertyAge" name="propertyAge" value={filters.propertyAge} onChange={handleFilterChange}>
                      <option value="">{t('properties.anyAge')}</option>
                      <option value="0-5">{t('properties.age0to5')}</option>
                      <option value="5-10">{t('properties.age5to10')}</option>
                      <option value="10-20">{t('properties.age10to20')}</option>
                      <option value="20+">{t('properties.age20Plus')}</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="furnishing">{t('properties.furnished')}</label>
                    <select id="furnishing" name="furnishing" value={filters.furnishing} onChange={handleFilterChange}>
                      <option value="">{t('properties.any')}</option>
                      <option value="fully_furnished">{t('properties.furnished')}</option>
                      <option value="partially_furnished">{t('properties.semiFurnished')}</option>
                      <option value="unfurnished">{t('properties.unfurnished')}</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="maxLivingAreaSqm">{t('properties.maxLivingArea')}</label>
                    <input
                      type="number"
                      id="maxLivingAreaSqm"
                      name="maxLivingAreaSqm"
                      placeholder={t('properties.maxAreaPlaceholder')}
                      value={filters.maxLivingAreaSqm}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>
                </div>

                {/* Row: Condition, Bathrooms, Cellar, Garage Spaces */}
                <div className="search-row">
                  <div className="search-field">
                    <label htmlFor="condition">Condition</label>
                    <select id="condition" name="condition" value={filters.condition} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="renovated">Renovated</option>
                      <option value="needs_renovation">Needs Renovation</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="minBathrooms">Min Bathrooms</label>
                    <input
                      type="number"
                      id="minBathrooms"
                      name="minBathrooms"
                      placeholder="Min bathrooms"
                      value={filters.minBathrooms}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>

                  <div className="search-field">
                    <label htmlFor="maxBathrooms">Max Bathrooms</label>
                    <input
                      type="number"
                      id="maxBathrooms"
                      name="maxBathrooms"
                      placeholder="Max bathrooms"
                      value={filters.maxBathrooms}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>

                  <div className="search-field">
                    <label htmlFor="cellar">Cellar</label>
                    <select id="cellar" name="cellar" value={filters.cellar} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="minGarageSpaces">Min Garage Spaces</label>
                    <input
                      type="number"
                      id="minGarageSpaces"
                      name="minGarageSpaces"
                      placeholder="Min garage spaces"
                      value={filters.minGarageSpaces}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>
                </div>

                {/* Row: Sea View, Pool, Direct Waterfront, Beach Access, Security 24h */}
                <div className="search-row">
                  <div className="search-field">
                    <label htmlFor="seaLakeView">Sea / Lake View</label>
                    <select id="seaLakeView" name="seaLakeView" value={filters.seaLakeView} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="pool">Pool</label>
                    <select id="pool" name="pool" value={filters.pool} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="private">Private</option>
                      <option value="shared">Shared</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="directWaterfront">Direct Waterfront</label>
                    <select id="directWaterfront" name="directWaterfront" value={filters.directWaterfront} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="beachAccess">Beach Access</label>
                    <select id="beachAccess" name="beachAccess" value={filters.beachAccess} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="private">Private</option>
                      <option value="public_beach">Public Beach</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="security24h">24h Security</label>
                    <select id="security24h" name="security24h" value={filters.security24h} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Row: Distance to Beach, Foreigners Can Buy, Availability, Currently Rented */}
                <div className="search-row">
                  <div className="search-field">
                    <label htmlFor="maxDistanceToBeachMeters">Max Distance to Beach (m)</label>
                    <input
                      type="number"
                      id="maxDistanceToBeachMeters"
                      name="maxDistanceToBeachMeters"
                      placeholder="e.g. 500"
                      value={filters.maxDistanceToBeachMeters}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>

                  <div className="search-field">
                    <label htmlFor="foreignersCanBuy">Foreigners Can Buy</label>
                    <select id="foreignersCanBuy" name="foreignersCanBuy" value={filters.foreignersCanBuy} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="difficult">Difficult</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="availability">Availability</label>
                    <select id="availability" name="availability" value={filters.availability} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="immediately">Immediately</option>
                      <option value="available_from">Available From Date</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="currentlyRented">Currently Rented</label>
                    <select id="currentlyRented" name="currentlyRented" value={filters.currentlyRented} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Row: Investment filters */}
                <div className="search-row">
                  <div className="search-field">
                    <label htmlFor="propertyManagementAvailable">Property Management</label>
                    <select id="propertyManagementAvailable" name="propertyManagementAvailable" value={filters.propertyManagementAvailable} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="yes">Available</option>
                      <option value="no">Not Available</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="minExpectedYieldPercent">Min Expected Yield (%)</label>
                    <input
                      type="number"
                      id="minExpectedYieldPercent"
                      name="minExpectedYieldPercent"
                      placeholder="e.g. 4"
                      value={filters.minExpectedYieldPercent}
                      onChange={handleFilterChange}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="search-field">
                    <label htmlFor="maxExpectedYieldPercent">Max Expected Yield (%)</label>
                    <input
                      type="number"
                      id="maxExpectedYieldPercent"
                      name="maxExpectedYieldPercent"
                      placeholder="e.g. 10"
                      value={filters.maxExpectedYieldPercent}
                      onChange={handleFilterChange}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Checkboxes row */}
                <div className="search-row">
                  {[
                    { key: 'hasGarden', label: t('properties.garden') },
                    { key: 'hasParking', label: t('properties.parking') },
                    { key: 'hasElevator', label: t('properties.elevator') },
                    { key: 'expatFriendly', label: 'Expat Friendly' },
                    { key: 'digitalNomadFriendly', label: 'Digital Nomad Friendly' },
                    { key: 'petFriendly', label: 'Pet Friendly' },
                    { key: 'familyFriendly', label: 'Family Friendly' },
                    { key: 'airbnbReady', label: 'Airbnb Ready' },
                  ].map(({ key, label }) => (
                    <div className="search-field" key={key}>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name={key}
                          checked={filters[key]}
                          onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                        />
                        <span>{label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* Search Button */}
            <div className="search-actions">
              <button type="submit" className="search-button">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('properties.searchProperties')}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Properties List Section */}
      {hasSearched && (
        <section className="properties-list-section">
          <div className="properties-list-container">
            {/* Section Header */}
            <div className="properties-section-header">
              <h2 className="properties-section-title">{t('properties.moreTopProperties')}</h2>
              <div className="properties-sort-wrapper">
                <label htmlFor="properties-sort" className="properties-sort-label">{t('properties.sortBy')}</label>
                <select
                  id="properties-sort"
                  className="properties-sort-select"
                  value={filters.sort}
                  onChange={(e) => {
                    const newSort = e.target.value;
                    setFilters(prev => ({ ...prev, sort: newSort }));
                    // Build active filters and convert price from euros to cents
                    const activeFilters = {};
                    
                    if (filters.country) activeFilters.country = filters.country;
                    if (filters.city) activeFilters.city = filters.city;
                    if (filters.propertyType) activeFilters.propertyType = filters.propertyType;
                    activeFilters.sort = newSort;
                    
                    // Convert price from euros to cents
                    if (filters.minPriceCents) {
                      activeFilters.minPriceCents = Math.round(parseFloat(filters.minPriceCents) * 100);
                    }
                    if (filters.maxPriceCents) {
                      activeFilters.maxPriceCents = Math.round(parseFloat(filters.maxPriceCents) * 100);
                    }
                    
                    if (filters.bedrooms) activeFilters.minBedrooms = parseInt(filters.bedrooms);
                    if (filters.minAreaSqm) activeFilters.minAreaSqm = parseInt(filters.minAreaSqm);
                    
                    loadProperties(activeFilters);
                  }}
                >
                  <option value="newest">Newest first</option>
                  <option value="price_asc">Price ascending</option>
                  <option value="price_desc">Price descending</option>
                  <option value="top">Top offers</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="properties-grid">
              {properties.map((property, index) => (
                <div 
                  key={property.id} 
                  className="property-card"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <div className="property-image-container">
                    {property.primaryImageUrl ? (
                      <img 
                        src={property.primaryImageUrl} 
                        alt={property.title}
                        className="property-image"
                        onError={(e) => {
                          // Hide the broken image and show placeholder instead
                          e.target.style.display = 'none';
                          const container = e.target.closest('.property-image-container');
                          const placeholder = container?.querySelector('.property-image-placeholder');
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className="property-image-placeholder"
                      style={{ display: property.primaryImageUrl ? 'none' : 'flex' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {/* Badge - Show "New" for first property, "Top" for others */}
                    {index === 0 && (
                      <div className="property-badge property-badge-new">{t('properties.new')}</div>
                    )}
                    {index === 2 && (
                      <div className="property-badge property-badge-top">{t('properties.top')}</div>
                    )}
                  </div>
                  <div className="property-content">
                    <h3 className="property-title">{property.title}</h3>
                    <div className="property-location">
                      {property.city}, {getCountryName(property.country)}
                    </div>
                    <div className="property-details-row">
                      <div className="property-detail-item">
                        <svg className="property-detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{property.bedrooms || '-'}</span>
                      </div>
                      <div className="property-detail-item">
                        <svg className="property-detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{property.bathrooms || '-'}</span>
                      </div>
                      <div className="property-detail-item">
                        <svg className="property-detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{property.areaSqm || '-'}m²</span>
                      </div>
                    </div>
                    <div className="property-price">
                      {formatPrice(property.priceCents, property.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasNextPage && !loading && (
              <div className="properties-load-more-container">
                <button 
                  type="button" 
                  className="properties-load-more-button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? t('properties.loading') : t('properties.loadMore')}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Loading and Empty States */}
      {loading && (
        <section className="properties-list-section">
          <div className="properties-list-container">
            <div className="loading-message">{t('properties.loadingProperties')}</div>
          </div>
        </section>
      )}

      {!loading && properties.length === 0 && hasSearched && (
        <section className="properties-list-section">
          <div className="properties-list-container">
            <EmptyState 
              type="properties"
              actionLabel={t('properties.searchProperties')}
              onAction={() => {
                // Scroll to search form
                document.querySelector('.properties-search-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Properties;

