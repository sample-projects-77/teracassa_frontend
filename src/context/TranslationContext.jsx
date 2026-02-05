import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const TranslationContext = createContext(null);

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'ru', 'tr'];
const DEFAULT_LANGUAGE = 'en';

// Cache for loaded translations
const translationCache = {};

export const TranslationProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  // Load translations for a specific language
  const loadTranslations = async (lang) => {
    // Validate language
    const language = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;

    // Use cache if available
    if (translationCache[language]) {
      setTranslations(translationCache[language]);
      setLoading(false);
      return;
    }

    try {
      // Dynamically import translation file
      let translationData;
      switch (language) {
        case 'de':
          translationData = (await import('../translations/de.json')).default;
          break;
        case 'es':
          translationData = (await import('../translations/es.json')).default;
          break;
        case 'fr':
          translationData = (await import('../translations/fr.json')).default;
          break;
        case 'ru':
          translationData = (await import('../translations/ru.json')).default;
          break;
        case 'tr':
          translationData = (await import('../translations/tr.json')).default;
          break;
        default:
          translationData = (await import('../translations/en.json')).default;
      }
      
      // Cache the translations
      translationCache[language] = translationData;
      setTranslations(translationData);
    } catch (error) {
      console.error(`Error loading translation file for ${language}:`, error);
      // Fallback to English if file doesn't exist
      if (language !== DEFAULT_LANGUAGE) {
        await loadTranslations(DEFAULT_LANGUAGE);
      } else {
        setTranslations({});
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize language from user preference
  useEffect(() => {
    const userLanguage = user?.language || localStorage.getItem('language') || DEFAULT_LANGUAGE;
    const language = SUPPORTED_LANGUAGES.includes(userLanguage.toLowerCase()) 
      ? userLanguage.toLowerCase() 
      : DEFAULT_LANGUAGE;
    
    setCurrentLanguage(language);
    loadTranslations(language);
  }, [user]);

  // Update language when user language changes
  const changeLanguage = async (lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setCurrentLanguage(lang);
      localStorage.setItem('language', lang);
      await loadTranslations(lang);
    }
  };

  // Translation function
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters in translation string
    let translated = value;
    Object.keys(params).forEach((param) => {
      translated = translated.replace(`{${param}}`, params[param]);
    });

    return translated;
  };

  const value = {
    t,
    currentLanguage,
    changeLanguage,
    loading,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

