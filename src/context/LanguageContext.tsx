import { createContext, useContext } from 'react';

export type Lang = 'en' | 'hi';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Language toggle removed — always English
  localStorage.removeItem('roop_lang');
  const lang: Lang = 'en';
  const setLang = (_l: Lang) => {};

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
