
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traduções básicas
const translations = {
  pt: {
    // Navbar
    balance: 'Saldo',
    user: 'Usuário',
    logout: 'Sair',
    menu: 'Menu',
    currentBalance: 'Saldo Atual',
    logoutAccount: 'Sair da Conta',
    // Outros textos podem ser adicionados conforme necessário
  },
  en: {
    // Navbar
    balance: 'Balance',
    user: 'User',
    logout: 'Logout',
    menu: 'Menu',
    currentBalance: 'Current Balance',
    logoutAccount: 'Logout Account',
    // Outros textos podem ser adicionados conforme necessário
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
