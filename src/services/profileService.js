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

// Update user language preference
export const updateUserLanguage = async (locale) => {
  const response = await api.patch('/user/language', { locale });
  return response;
};

