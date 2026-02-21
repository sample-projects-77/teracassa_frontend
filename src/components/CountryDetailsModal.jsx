import { useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import './CountryDetailsModal.css';

const CountryDetailsModal = ({ isOpen, onClose, countryData }) => {
  const { t } = useTranslation();
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

  if (!isOpen || !countryData) return null;

  const { name, code, sections } = countryData;

  return (
    <div className="country-details-modal-overlay" onClick={onClose}>
      <div className="country-details-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="country-details-modal-header-wrapper">
          <button className="country-details-modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="country-details-modal-header">
            <div className="country-details-header-content">
              <span className="country-details-code">{code}</span>
              <h2 className="country-details-title">{name}</h2>
            </div>
          </div>
        </div>

        <div className="country-details-modal-body">
          {sections && sections.map((section, index) => (
            <div key={index} className="country-details-section">
              <h3 className="country-details-section-title">{section.title}</h3>
              
              {section.description && (
                <p className="country-details-description">{section.description}</p>
              )}
              
              {section.items && section.items.length > 0 && (
                <ul className="country-details-list">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="country-details-item">
                      <svg className="country-details-checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.subsections && section.subsections.length > 0 && (
                <div className="country-details-subsections">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="country-details-subsection">
                      <h4 className="country-details-subsection-title">{subsection.title}</h4>
                      {subsection.items && subsection.items.length > 0 && (
                        <ul className="country-details-list">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="country-details-item">
                              <svg className="country-details-checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {section.prosCons && (
                <div className="country-details-pros-cons">
                  <div className="country-details-pros">
                    <h4 className="country-details-pros-title">{t('common.pros')}</h4>
                    <ul className="country-details-list">
                      {section.prosCons.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="country-details-item country-details-pro">
                          <svg className="country-details-checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="country-details-cons">
                    <h4 className="country-details-cons-title">{t('common.cons')}</h4>
                    <ul className="country-details-list">
                      {section.prosCons.cons.map((con, conIndex) => (
                        <li key={conIndex} className="country-details-item country-details-con">
                          <svg className="country-details-xmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {section.areas && section.areas.length > 0 && (
                <div className="country-details-areas">
                  <h4 className="country-details-areas-title">{t('common.bestAreasForRetirees')}</h4>
                  <div className="country-details-areas-tags">
                    {section.areas.map((area, areaIndex) => (
                      <span key={areaIndex} className="country-details-area-tag">{area}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryDetailsModal;

