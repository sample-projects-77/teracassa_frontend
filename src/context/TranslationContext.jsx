import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const TranslationContext = createContext(null);

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'ru', 'tr'];
const DEFAULT_LANGUAGE = 'en';

// Cache for loaded translations
const translationCache = {};

export const TranslationProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
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
      let importedModule;
      switch (language) {
        case 'de':
          importedModule = await import('../translations/de.json');
          break;
        case 'es':
          importedModule = await import('../translations/es.json');
          break;
        case 'fr':
          importedModule = await import('../translations/fr.json');
          break;
        case 'ru':
          importedModule = await import('../translations/ru.json');
          break;
        case 'tr':
          importedModule = await import('../translations/tr.json');
          break;
        default:
          importedModule = await import('../translations/en.json');
      }
      
      // Handle both .default and direct import (Vite handles JSON imports differently)
      translationData = importedModule.default || importedModule;
      
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

  // Initialize language from user preference or localStorage
  useEffect(() => {
    // Don't initialize until auth loading is complete
    if (authLoading) {
      return;
    }
    
    // Check localStorage first (works for both authenticated and guest users)
    const storedLanguage = localStorage.getItem('language');
    const userLanguage = user?.language || storedLanguage || DEFAULT_LANGUAGE;
    const language = SUPPORTED_LANGUAGES.includes(userLanguage.toLowerCase()) 
      ? userLanguage.toLowerCase() 
      : DEFAULT_LANGUAGE;
    
    setCurrentLanguage(language);
    loadTranslations(language);
  }, [user, authLoading]);

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

