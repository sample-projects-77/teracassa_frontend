import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { searchProperties } from '../services/propertyService';
import { getCountries } from '../services/countryService';
import './Properties.css';

const Properties = () => {
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
    country: '',
    city: '',
    propertyType: '',
    minPriceCents: '',
    maxPriceCents: '',
    bedrooms: '',
    minAreaSqm: '',
    sort: 'newest'
  });

  useEffect(() => {
    loadCountries();
    // Load default 6 properties on page load/refresh
    loadDefaultProperties();
    // Reset filters on page load/refresh
    setFilters({
      country: '',
      city: '',
      propertyType: '',
      minPriceCents: '',
      maxPriceCents: '',
      bedrooms: '',
      minAreaSqm: '',
      sort: 'newest'
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
            Search precisely. Invest securely.
          </h1>
          <p className="properties-description">
            Use our intelligent criteria (e.g., sea view, proximity to marina) and discover your international home. 
            We accompany you from click to key handover.
          </p>
          <p className="properties-info">
            Currently over 5,000 verified properties from verified providers worldwide.
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
              Basic Search
            </button>
            <button
              type="button"
              className={`search-tab ${activeTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced Search
            </button>
          </div>

          <form onSubmit={handleSearch} className="properties-search-form">
            {/* First Row */}
            <div className="search-row">
              <div className="search-field">
                <select
                  id="country"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                >
                  <option value="">Please select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="search-field">
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Region / City"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="search-field">
                <select
                  id="propertyType"
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                >
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="search-field">
                <input
                  type="number"
                  id="minPriceCents"
                  name="minPriceCents"
                  placeholder="Price from (€)"
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
                  placeholder="Price to (€)"
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
                  <option value="">Bedrooms</option>
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
                  placeholder="Min. Living Area (m²)"
                  value={filters.minAreaSqm}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
            </div>

            {/* Advanced Search Fields (shown when advanced tab is active) */}
            {activeTab === 'advanced' && (
              <div className="search-row">
                <div className="search-field">
                  <label htmlFor="sort">Sort</label>
                  <select
                    id="sort"
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                  >
                    <option value="newest">Newest first</option>
                    <option value="price_asc">Price ascending</option>
                    <option value="price_desc">Price descending</option>
                    <option value="top">Top offers</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Search Button */}
            <div className="search-actions">
              <button type="submit" className="search-button">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Search Properties
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
              <h2 className="properties-section-title">More Top Properties from TerraCasa</h2>
              <div className="properties-sort-wrapper">
                <label htmlFor="properties-sort" className="properties-sort-label">Sort by</label>
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
                      <div className="property-badge property-badge-new">New</div>
                    )}
                    {index === 2 && (
                      <div className="property-badge property-badge-top">Top</div>
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
                  {loadingMore ? 'Loading...' : 'Load More'}
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
            <div className="loading-message">Loading properties...</div>
          </div>
        </section>
      )}

      {!loading && properties.length === 0 && (
        <section className="properties-list-section">
          <div className="properties-list-container">
            <div className="no-properties-message">
              <p>No properties found.</p>
              <p>Try adjusting your search criteria.</p>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Properties;

