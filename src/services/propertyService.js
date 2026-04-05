import api from '../config/api';

// Search properties with filters and pagination
export const searchProperties = async (filters = {}, page = 1, itemsPerPage = 6) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to query params
    if (filters.country) params.append('country', filters.country);
    if (filters.city) params.append('city', filters.city);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.minPriceCents) params.append('minPriceCents', filters.minPriceCents);
    if (filters.maxPriceCents) params.append('maxPriceCents', filters.maxPriceCents);
    if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms);
    if (filters.maxBedrooms) params.append('maxBedrooms', filters.maxBedrooms);
    if (filters.minAreaSqm) params.append('minAreaSqm', filters.minAreaSqm);
    if (filters.maxAreaSqm) params.append('maxAreaSqm', filters.maxAreaSqm);
    if (filters.sort) params.append('sort', filters.sort);

    // String filters
    const stringFilters = [
      'district', 'currency', 'features', 'q', 'keywords', 'condition', 'cellar', 'pool',
      'furnishing', 'security24h', 'accessible', 'heatingType', 'seaLakeView',
      'directWaterfront', 'beachAccess', 'foreignersCanBuy', 'secondHomeAllowed',
      'localAdvisorRecommended', 'popularWith', 'currentlyRented', 'energyCertificateClass',
      'publicTransport', 'internetQuality', 'taxBenefits', 'localFinancingOptions',
      'propertyManagementAvailable', 'availability', 'solarSystem',
    ];
    stringFilters.forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    // Integer filters
    const intFilters = [
      'minYearBuilt', 'maxYearBuilt', 'minBathrooms', 'maxBathrooms',
      'minLivingAreaSqm', 'maxLivingAreaSqm', 'minPlotAreaSqm', 'maxPlotAreaSqm',
      'minGarageSpaces', 'maxGarageSpaces', 'minBalconyTerraceCount', 'maxBalconyTerraceCount',
      'minAirConditioningRooms', 'maxAirConditioningRooms',
      'minDetailsBathrooms', 'maxDetailsBathrooms',
      'minBathroomsWithToilet', 'maxBathroomsWithToilet',
      'minSeparateToilets', 'maxSeparateToilets',
      'minDetailsYearBuilt', 'maxDetailsYearBuilt',
    ];
    intFilters.forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    // Number (float) filters
    const numberFilters = [
      'minLandRegistryAreaSqm', 'maxLandRegistryAreaSqm',
      'minEnergyConsumptionKwhPerSqmA', 'maxEnergyConsumptionKwhPerSqmA',
      'minExpectedYieldPercent', 'maxExpectedYieldPercent',
      'maxDistanceToBeachMeters', 'maxDistanceToSkiKm', 'maxDistanceToMarinaKm',
      'maxDistanceToGolfKm', 'maxDistanceToTennisKm', 'maxDistanceToAirportMinutes',
      'maxDistanceToSightsMinutes', 'maxDistanceToRestaurantsMinutes',
      'maxDistanceToSupermarketMinutes', 'maxDistanceToMallMinutes',
      'maxDistanceToDoctorsMinutes', 'maxDistanceToHospitalMinutes',
      'maxDistanceToSchoolsMinutes',
    ];
    numberFilters.forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    // Boolean filters (only append when explicitly set to true/false)
    const boolFilters = [
      'allYearHabitable', 'expatFriendly', 'digitalNomadFriendly', 'petFriendly',
      'familyFriendly', 'audienceSeniorFriendly', 'airbnbReady',
      'caretakerService', 'detailsSeniorFriendly',
    ];
    boolFilters.forEach(key => {
      if (filters[key] === true || filters[key] === false) {
        params.append(key, filters[key]);
      }
    });
    
    // Add pagination parameters
    params.append('page', page.toString());
    params.append('itemsPerPage', itemsPerPage.toString());

    const queryString = params.toString();
    const url = `/properties?${queryString}`;
    
    console.log('API Request URL:', url);
    const response = await api.get(url);
    console.log('API Response:', response);
    
    // Return the full response object with data and pagination
    return response;
  } catch (error) {
    console.error('Error in searchProperties:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Get property detail by ID
export const getPropertyDetail = async (propertyId) => {
  const response = await api.get(`/properties/${propertyId}`);
  return response;
};

// Create property listing (auth required)
export const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response;
};

// Update property listing (auth required)
export const updateProperty = async (propertyId, propertyData) => {
  const response = await api.patch(`/properties/${propertyId}`, propertyData);
  return response;
};

// Upload property images (auth required)
export const uploadPropertyImages = async (imageFiles) => {
  const formData = new FormData();
  // Append all image files to FormData
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });
  
  const response = await api.post('/properties/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

// Delete/archive property listing (auth required)
export const deleteProperty = async (propertyId) => {
  const response = await api.delete(`/properties/${propertyId}`);
  return response;
};

// Submit property for review (auth required)
export const submitPropertyForReview = async (propertyId) => {
  const response = await api.post(`/properties/${propertyId}/submit`);
  return response;
};

// Get partner's own properties (auth required)
export const getPartnerProperties = async (status = null) => {
  const url = status ? `/partners/me/properties?status=${status}` : '/partners/me/properties';
  const response = await api.get(url);
  return response;
};

