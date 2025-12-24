import api from '../config/api';

// Search partners with filters
export const searchPartners = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to query params
    if (filters.country) params.append('country', filters.country);
    if (filters.city) params.append('city', filters.city);
    if (filters.serviceCategory) params.append('serviceCategory', filters.serviceCategory);

    const queryString = params.toString();
    const url = queryString ? `/partners?${queryString}` : '/partners';
    
    console.log('API Request URL:', url);
    const response = await api.get(url);
    console.log('API Response:', response);
    return response;
  } catch (error) {
    console.error('Error in searchPartners:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Contact partner (Lead Form)
export const contactPartner = async (partnerId, contactData) => {
  const response = await api.post(`/partners/${partnerId}/contact`, contactData);
  return response;
};

