// Language selector utility
// Provides functions to switch between available languages

import { useState, useEffect } from 'react';
import en from './en';
import it from './it';
import fr from './fr';
import es from './es';

// Export the type based on the English language structure
export type LanguageStrings = typeof en;

// All available languages
const languages: Record<string, LanguageStrings> = {
  en,
  it,
  fr,
  es,
};

// Default language code
const DEFAULT_LANGUAGE = 'en';

// Local storage key for saving language preference
const LANGUAGE_STORAGE_KEY = 'offcanvas-language';

/**
 * Detect the user's browser language
 * Returns a language code that matches our available languages
 * or the default language if no match is found
 */
function detectBrowserLanguage(): string {
  // Only run in browser environment
  if (typeof window === 'undefined' || !navigator) {
    return DEFAULT_LANGUAGE;
  }
  
  // Get browser language (e.g. 'en-US', 'it-IT', 'en', 'it')
  const browserLang = navigator.language;
  
  if (!browserLang) {
    return DEFAULT_LANGUAGE;
  }
  
  // Extract the language code (e.g. 'en' from 'en-US')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Check if we support this language
  return languages[langCode] ? langCode : DEFAULT_LANGUAGE;
}

/**
 * Get the currently selected language or detect from browser
 */
export function getLanguage(langCode?: string): LanguageStrings {
  // If a specific language code is provided and valid, use it
  if (langCode && languages[langCode]) {
    return languages[langCode];
  }
  
  // If no code provided, try to get from local storage
  if (!langCode && typeof window !== 'undefined') {
    const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLang && languages[storedLang]) {
      return languages[storedLang];
    }
    
    // If not in local storage, try to detect from browser
    const browserLangCode = detectBrowserLanguage();
    if (browserLangCode && languages[browserLangCode]) {
      return languages[browserLangCode];
    }
  }
  
  // Fall back to default language
  return languages[DEFAULT_LANGUAGE];
}

/**
 * Set the active language and save to local storage
 */
export function setLanguage(langCode: string): LanguageStrings | null {
  if (languages[langCode]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    }
    return languages[langCode];
  }
  return null;
}

/**
 * React hook for using language in components
 * Automatically detects the user's browser language on first load
 * and allows manual language switching with persistence
 */
export function useLanguage() {
  const [currentLang, setCurrentLang] = useState<LanguageStrings>(
    () => {
      // Initialize from localStorage, browser language, or default to English
      if (typeof window !== 'undefined') {
        // First try from localStorage (user's explicit choice)
        const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (storedLang && languages[storedLang]) {
          return languages[storedLang];
        }
        
        // If no stored preference, try to detect from browser
        const browserLangCode = detectBrowserLanguage();
        if (browserLangCode && languages[browserLangCode]) {
          // Save detected language to localStorage for future visits
          localStorage.setItem(LANGUAGE_STORAGE_KEY, browserLangCode);
          return languages[browserLangCode];
        }
      }
      return languages[DEFAULT_LANGUAGE];
    }
  );
  
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can safely access localStorage
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Function to change the language
  const changeLanguage = (langCode: string) => {
    const newLang = setLanguage(langCode);
    if (newLang) {
      setCurrentLang(newLang);
      
      // Force a re-render by updating the document language attribute
      document.documentElement.lang = langCode;
      
      // Force a refresh of all components that use the language
      window.location.reload();
    }
  };
  
  return {
    lang: currentLang,
    changeLanguage,
    availableLanguages: Object.keys(languages),
    mounted,
  };
}

// For non-React contexts, export a default language
export default getLanguage();
