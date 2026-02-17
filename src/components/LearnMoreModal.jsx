import { useEffect } from 'react';
import './LearnMoreModal.css';

const LearnMoreModal = ({ isOpen, onClose, section }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !section) return null;

  return (
    <div className="learn-more-modal-overlay" onClick={onClose}>
      <div className="learn-more-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="learn-more-modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="learn-more-modal-header">
          <h2 className="learn-more-modal-title">{section.title}</h2>
        </div>

        <div className="learn-more-modal-body">
          {/* Detailed content will be displayed here */}
          {section.detailedContent ? (
            <div className="learn-more-detailed-content">
              {typeof section.detailedContent === 'string' ? (
                <p>{section.detailedContent}</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: section.detailedContent }} />
              )}
            </div>
          ) : (
            <div className="learn-more-placeholder">
              <p>Detailed information will be displayed here.</p>
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="learn-more-bullet-list">
                  {section.bulletPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnMoreModal;

