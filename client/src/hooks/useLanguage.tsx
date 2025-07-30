import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  fontClass: string;
  fontDisplayClass: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('mr'); // Default to Marathi

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'mr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Font classes based on language
  const fontClass = language === 'mr' ? 'font-marathi' : 'font-english';
  const fontDisplayClass = language === 'mr' ? 'font-marathi-display' : 'font-display';

  const value: LanguageContextType = {
    language,
    t: translations[language],
    setLanguage,
    fontClass,
    fontDisplayClass,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
