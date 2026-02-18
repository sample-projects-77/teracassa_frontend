import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { getPublicProfile } from '../services/profileService';
import { getPartnerReviews, createReview } from '../services/reviewService';
import { getCountries } from '../services/countryService';
import './PartnerProfile.css';

const PartnerProfile = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [partner, setPartner] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Scroll to top immediately (no smooth scroll for instant transition)
    window.scrollTo(0, 0);
    loadPartnerProfile();
    loadReviews();
    loadCountries();
  }, [partnerId]);

  const loadPartnerProfile = async () => {
    try {
      setLoading(true);
      // Ensure we're at the top before loading
      window.scrollTo(0, 0);
      const data = await getPublicProfile(partnerId);
      setPartner(data);
      // Ensure we stay at top after data loads
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    } catch (error) {
      console.error('Error loading partner profile:', error);
      setError(t('partnerProfile.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await getPartnerReviews(partnerId, 1, 10);
      const reviewsData = response?.data || response || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const getCountryName = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setError('');
    setReviewLoading(true);

    try {
      await createReview(partnerId, reviewData);
      setSuccess(t('partnerProfile.reviewSubmitted'));
      setReviewData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      // Reload reviews
      await loadReviews();
      // Reload partner to update rating
      await loadPartnerProfile();
    } catch (err) {
      setError(err.message || t('partnerProfile.reviewError'));
    } finally {
      setReviewLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`star ${i < rating ? 'filled' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={i < rating ? "currentColor" : "none"}
        />
      </svg>
    ));
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="partner-profile-page">
        <Navbar />
        <div className="partner-profile-container">
          <div className="partner-profile-loading">{t('partnerProfile.loading')}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="partner-profile-page">
        <Navbar />
        <div className="partner-profile-container">
          <div className="partner-profile-error">{t('partnerProfile.notFound')}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="partner-profile-page">
      <Navbar />
      
      <div className="partner-profile-container">
        {/* Partner Header */}
        <div className="partner-profile-header">
          <div className="partner-profile-avatar">
            {partner.avatarUrl ? (
              <img src={partner.avatarUrl} alt={partner.displayName} />
            ) : (
              <div className="avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="partner-profile-info">
            <div className="partner-profile-name-row">
              <h1>{partner.displayName}</h1>
              {partner.isVerified && (
                <svg className="verified-badge" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              )}
            </div>
            
            <div className="partner-profile-role">{partner.roleTitle}</div>
            
            <div className="partner-profile-location">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {partner.baseCity && `${partner.baseCity}, `}
              {partner.baseCountry ? getCountryName(partner.baseCountry) : partner.baseCountry}
            </div>
            
            <div className="partner-profile-rating">
              <div className="rating-stars">
                {renderStars(Math.round(partner.ratingAverage))}
              </div>
              <span className="rating-value">{partner.ratingAverage > 0 ? partner.ratingAverage.toFixed(1) : '0.0'}</span>
              <span className="rating-count">
                ({partner.ratingCount} {partner.ratingCount === 1 ? t('partnerProfile.review') : t('partnerProfile.reviews')})
              </span>
            </div>
            
            {(partner.isAvailable247 || partner.isImmediatelyAvailable) && (
              <div className="partner-availability-badges">
                {partner.isAvailable247 && (
                  <span className="availability-badge badge-247">{t('partnerProfile.available247')}</span>
                )}
                {partner.isImmediatelyAvailable && (
                  <span className="availability-badge badge-immediate">{t('partnerProfile.immediatelyAvailable')}</span>
                )}
              </div>
            )}
            
            <div className="partner-profile-actions">
              <button
                className="contact-button"
                onClick={() => setShowContactModal(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="L22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('partnerProfile.contact')}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="partner-profile-reviews">
          <div className="reviews-header">
            <h2>{t('partnerProfile.reviews')} ({partner.ratingCount})</h2>
            {currentUser && currentUser.id !== partnerId && (
              <button
                className="write-review-button"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? t('partnerProfile.cancelReview') : t('partnerProfile.writeReview')}
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Review Form */}
          {showReviewForm && currentUser && currentUser.id !== partnerId && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="review-form-field">
                <label>{t('partnerProfile.rating')}</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`rating-button ${reviewData.rating >= rating ? 'active' : ''}`}
                      onClick={() => setReviewData({ ...reviewData, rating })}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="review-form-field">
                <label htmlFor="review-comment">{t('partnerProfile.comment')}</label>
                <textarea
                  id="review-comment"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  rows="5"
                  placeholder={t('partnerProfile.commentPlaceholder')}
                  required
                />
              </div>
              
              <div className="review-form-actions">
                <button type="submit" disabled={reviewLoading} className="submit-review-button">
                  {reviewLoading ? t('partnerProfile.submitting') : t('partnerProfile.submitReview')}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.reviewer?.avatarUrl ? (
                          <img src={review.reviewer.avatarUrl} alt={review.reviewer.name} />
                        ) : (
                          <div className="avatar-placeholder-small">
                            {review.reviewer?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="reviewer-name">{review.reviewer?.name || t('partnerProfile.anonymous')}</div>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <div className="review-comment">{review.comment}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              <p>{t('partnerProfile.noReviews')}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <ContactModal
        show={showContactModal}
        onClose={() => setShowContactModal(false)}
        partner={partner}
      />
    </div>
  );
};

export default PartnerProfile;

