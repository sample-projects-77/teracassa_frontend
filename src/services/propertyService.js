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

