import api from '../config/api';

// Create a review for a partner
export const createReview = async (partnerId, reviewData) => {
  const response = await api.post(`/partners/${partnerId}/reviews`, reviewData);
  return response;
};

// Get reviews for a partner
export const getPartnerReviews = async (partnerId, page = 1, itemsPerPage = 10) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('itemsPerPage', itemsPerPage);
  const response = await api.get(`/partners/${partnerId}/reviews?${params.toString()}`);
  return response;
};

// Update own review
export const updateReview = async (partnerId, reviewId, reviewData) => {
  const response = await api.patch(`/partners/${partnerId}/reviews/${reviewId}`, reviewData);
  return response;
};

// Delete own review
export const deleteReview = async (partnerId, reviewId) => {
  const response = await api.delete(`/partners/${partnerId}/reviews/${reviewId}`);
  return response;
};

