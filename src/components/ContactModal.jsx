import React, { useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { contactPartner } from '../services/partnerService';
import './ContactModal.css';

const ContactModal = ({ show, onClose, partner }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError(t('contactModal.fillRequiredFields'));
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('contactModal.invalidEmail'));
      setLoading(false);
      return;
    }

    try {
      await contactPartner(partner.id, formData);
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || t('contactModal.submitError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  if (!show || !partner) return null;

  return (
    <div className="contact-modal-overlay" onClick={handleClose}>
      <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal-close" onClick={handleClose}>&times;</button>
        
        <h2 className="contact-modal-title">{t('contactModal.title')}</h2>
        <p className="contact-modal-subtitle">
          {t('contactModal.subtitle', { name: partner.displayName })}
        </p>

        {success ? (
          <div className="contact-modal-success">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>{t('contactModal.successMessage')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-modal-form">
            {error && <div className="contact-modal-error">{error}</div>}
            
            <div className="contact-modal-field">
              <label htmlFor="contact-name">{t('contactModal.name')} *</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="contact-modal-field">
              <label htmlFor="contact-email">{t('contactModal.email')} *</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="contact-modal-field">
              <label htmlFor="contact-phone">{t('contactModal.phone')}</label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="contact-modal-field">
              <label htmlFor="contact-message">{t('contactModal.message')} *</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                disabled={loading}
              />
            </div>

            <div className="contact-modal-actions">
              <button type="button" onClick={handleClose} disabled={loading} className="contact-modal-cancel">
                {t('contactModal.cancel')}
              </button>
              <button type="submit" disabled={loading} className="contact-modal-submit">
                {loading ? t('contactModal.sending') : t('contactModal.send')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;

