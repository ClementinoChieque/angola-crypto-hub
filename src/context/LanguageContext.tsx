
import React, { createContext, useState, ReactNode } from 'react';
import { Language, LanguageContextType } from './types/language';
import { translations } from './translations';

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations['pt']];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Re-export types and hook for convenience
export type { Language, LanguageContextType } from './types/language';
export { useLanguage } from './hooks/useLanguage';
