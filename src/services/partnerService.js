import api from '../config/api';

// Search partners with filters and pagination. Returns { data, pagination } when backend sends pagination.
export const searchPartners = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.city) params.append('city', filters.city);
    if (filters.serviceCategory) params.append('serviceCategory', filters.serviceCategory);
    if (filters.page != null) params.append('page', String(filters.page));
    if (filters.limit != null) params.append('limit', String(filters.limit));

    const queryString = params.toString();
    const url = queryString ? `/partners?${queryString}` : '/partners';
    const response = await api.get(url);
    return response;
  } catch (error) {
    console.error('Error in searchPartners:', error);
    throw error;
  }
};

// Contact partner (Lead Form)
export const contactPartner = async (partnerId, contactData) => {
  const response = await api.post(`/partners/${partnerId}/contact`, contactData);
  return response;
};

