import api from '../config/api';

/**
 * Submit Contact Us form. Sends email to backend; backend forwards to CONTACT_EMAIL via SendGrid.
 * @param {{ name: string, email: string, subject?: string, message: string }} data
 */
export const submitContactUs = async (data) => {
  const response = await api.post('/contact', data);
  return response;
};
