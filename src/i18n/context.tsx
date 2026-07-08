import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TranslationKeys, getTranslation, LANGUAGES } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  languages: typeof LANGUAGES;
}

const I18nContext = createContext<I18nContextType | null>(null);

const LANG_KEY = 'volleyball_scout_language';

function detectLanguage(): Language {
  // Check localStorage first
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && ['it', 'en', 'es', 'fr', 'de', 'pt'].includes(saved)) {
    return saved as Language;
  }
  
  // Detect from browser
  const browserLang = navigator.language.split('-')[0];
  if (['it', 'en', 'es', 'fr', 'de', 'pt'].includes(browserLang)) {
    return browserLang as Language;
  }
  
  return 'it'; // Default to Italian
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  };
  
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  const t = getTranslation(language);
  
  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
