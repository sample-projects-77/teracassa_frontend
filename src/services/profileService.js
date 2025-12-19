import api from '../config/api';

// Update profile
export const updateProfile = async (profileData) => {
  const response = await api.patch('/me', profileData);
  return response;
};

// Get public profile
export const getPublicProfile = async (partnerId) => {
  const response = await api.get(`/${partnerId}`);
  return response;
};

