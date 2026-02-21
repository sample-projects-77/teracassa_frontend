import api from '../config/api';

// Get all countries
export const getCountries = async () => {
  const response = await api.get('/countries');
  return response;
};

// Get country overview
export const getCountryOverview = async (countryCode) => {
  const response = await api.get(`/countries/${countryCode}`);
  return response;
};

// Get country sections
export const getCountrySections = async (countryCode) => {
  const response = await api.get(`/countries/${countryCode}/sections`);
  return response;
};

// Get country details
export const getCountryDetails = async (countryCode) => {
  const response = await api.get(`/countries/${countryCode}/details`);
  return response;
};

