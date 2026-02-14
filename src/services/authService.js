import api from '../config/api';

// Register user
export const register = async (userData) => {
  // FormData will be handled automatically by the API interceptor
  const response = await api.post('/auth/register', userData);
  return response;
};

// Login user
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/me');
  return response;
};

// Update password (authenticated user changes their own password)
export const updatePassword = async (oldPassword, newPassword) => {
  const response = await api.put('/auth/change-password', { oldPassword, newPassword });
  return response;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response;
};

// Verify reset code
export const verifyResetCode = async (email, code) => {
  const response = await api.post('/auth/verify-code', { email, code });
  return response;
};

