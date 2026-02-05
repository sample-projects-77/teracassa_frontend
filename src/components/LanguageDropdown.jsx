import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { updateUserLanguage } from '../services/profileService';
import './LanguageDropdown.css';

const languages = [
  { code: 'de', flag: 'DE', name: 'Deutsch', nativeName: 'Deutsch (DE)' },
  { code: 'en', flag: 'GB', name: 'English', nativeName: 'English (EN)' },
  { code: 'es', flag: 'ES', name: 'Español', nativeName: 'Español (ES)' },
  { code: 'fr', flag: 'FR', name: 'Français', nativeName: 'Français (FR)' },
  { code: 'ru', flag: 'RU', name: 'Русский', nativeName: 'Русский (RU)' },
  { code: 'tr', flag: 'TR', name: 'Türkçe', nativeName: 'Türkçe (TR)' },
];

const LanguageDropdown = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { changeLanguage, currentLanguage: translationLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize selected language from user data or localStorage
  useEffect(() => {
    // Check localStorage first (works for guest users)
    const storedLanguage = localStorage.getItem('language');
    const languageCode = user?.language || storedLanguage || 'en';
    const lang = languages.find(l => l.code === languageCode.toLowerCase());
    
    if (lang) {
      setSelectedLanguage(lang);
    } else {
      // Default to English if language not found
      setSelectedLanguage(languages.find(l => l.code === 'en'));
    }
  }, [user, translationLanguage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = async (language) => {
    if (isUpdating || selectedLanguage?.code === language.code) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      // Update translation context first (works for both authenticated and guest users)
      await changeLanguage(language.code);
      
      // Update local state
      setSelectedLanguage(language);
      
      // If user is authenticated, update language on server
      if (isAuthenticated && user) {
        try {
          await updateUserLanguage(language.code);
          // Update user in context if response includes language
          updateUser({
            ...user,
            language: language.code
          });
        } catch (error) {
          console.error('Error updating language on server:', error);
          // Continue anyway - language is already updated in localStorage and context
        }
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentLanguage = selectedLanguage || languages.find(l => l.code === 'en');

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button
        className="language-selector"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-text">{currentLanguage.nativeName}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${
                selectedLanguage?.code === language.code ? 'selected' : ''
              }`}
              onClick={() => handleLanguageSelect(language)}
              disabled={isUpdating}
            >
              {selectedLanguage?.code === language.code && (
                <span className="checkmark">✓</span>
              )}
              <span className="language-option-flag">{language.flag}</span>
              <span className="language-option-text">{language.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;

