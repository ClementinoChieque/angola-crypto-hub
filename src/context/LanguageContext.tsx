
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Sistema de traduções completo
const translations = {
  pt: {
    // Navbar
    balance: 'Saldo',
    user: 'Usuário',
    logout: 'Sair',
    menu: 'Menu',
    currentBalance: 'Saldo Atual',
    logoutAccount: 'Sair da Conta',
    
    // Auth
    login: 'Entrar',
    register: 'Cadastrar',
    phoneNumber: 'Número de Telefone',
    password: 'Senha',
    fullName: 'Nome Completo',
    inviteCode: 'Código de Convite',
    processing: 'Processando...',
    createAccount: 'Criar Conta',
    loginToAccount: 'Entrar na Conta',
    forgotPassword: 'Esqueceu a senha?',
    dontHaveAccount: 'Não tem uma conta?',
    alreadyHaveAccount: 'Já tem uma conta?',
    
    // Formulários
    enterPhoneNumber: 'Digite o número de telefone',
    enterPassword: 'Digite sua senha',
    createStrongPassword: 'Crie uma senha forte',
    enterFullName: 'Seu nome completo',
    enterInviteCode: 'Digite o código de convite',
    countryCode: 'Código do País',
    phoneNumberWithoutCountry: 'Número de telefone sem código do país',
    
    // Dashboard
    dashboard: 'Painel',
    investments: 'Investimentos',
    transactions: 'Transações',
    invites: 'Convites',
    settings: 'Configurações',
    
    // Investimentos
    investmentPlans: 'Planos de Investimento',
    minimumInvestment: 'Investimento Mínimo',
    duration: 'Duração',
    expectedReturn: 'Retorno Esperado',
    invest: 'Investir',
    days: 'dias',
    
    // Transações
    transactionHistory: 'Histórico de Transações',
    amount: 'Valor',
    type: 'Tipo',
    status: 'Status',
    date: 'Data',
    pending: 'Pendente',
    completed: 'Concluído',
    failed: 'Falhou',
    
    // Convites
    inviteUsers: 'Convidar Usuários',
    myInvites: 'Meus Convites',
    referralCode: 'Código de Referência',
    shareCode: 'Compartilhar Código',
    invitesCount: 'Convites Enviados',
    registeredUsers: 'Usuários Registrados',
    
    // Depósitos e Saques
    deposit: 'Depósito',
    withdraw: 'Saque',
    bankTransfer: 'Transferência Bancária',
    cryptoTransfer: 'Transferência Cripto',
    selectMethod: 'Selecionar Método',
    uploadProof: 'Enviar Comprovante',
    
    // Geral
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    back: 'Voltar',
    next: 'Próximo',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    warning: 'Aviso',
    info: 'Informação',
    
    // Páginas
    aboutUs: 'Sobre Nós',
    termsOfUse: 'Termos de Uso',
    privacyPolicy: 'Política de Privacidade',
    contact: 'Contato',
    
    // Mensagens
    welcomeMessage: 'Bem-vindo à Bitget12',
    noDataAvailable: 'Nenhum dado disponível',
    operationCompleted: 'Operação concluída com sucesso',
    operationFailed: 'Operação falhou',
    
    // Admin
    admin: 'Administrador',
    userManagement: 'Gestão de Usuários',
    systemSettings: 'Configurações do Sistema',
    reports: 'Relatórios',
    
    // Crypto
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    litecoin: 'Litecoin',
    ripple: 'Ripple',
    cardano: 'Cardano',
    polkadot: 'Polkadot',
    chainlink: 'Chainlink',
    stellar: 'Stellar',
    
    // Status
    active: 'Ativo',
    inactive: 'Inativo',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    expired: 'Expirado',
    
    // Contas
    bankAccount: 'Conta Bancária',
    usdtWallet: 'Carteira USDT',
    addAccount: 'Adicionar Conta',
    accountDetails: 'Detalhes da Conta',
    
    // Quantificação
    quantify: 'Quantificar',
    quantification: 'Quantificação',
    quantificationResults: 'Resultados da Quantificação',
    
    // Gráficos
    charts: 'Gráficos',
    priceChart: 'Gráfico de Preços',
    performanceChart: 'Gráfico de Performance',
    
    // Notificações
    notifications: 'Notificações',
    newMessage: 'Nova Mensagem',
    systemUpdate: 'Atualização do Sistema'
  },
  en: {
    // Navbar
    balance: 'Balance',
    user: 'User',
    logout: 'Logout',
    menu: 'Menu',
    currentBalance: 'Current Balance',
    logoutAccount: 'Logout Account',
    
    // Auth
    login: 'Login',
    register: 'Register',
    phoneNumber: 'Phone Number',
    password: 'Password',
    fullName: 'Full Name',
    inviteCode: 'Invite Code',
    processing: 'Processing...',
    createAccount: 'Create Account',
    loginToAccount: 'Login to Account',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    
    // Forms
    enterPhoneNumber: 'Enter phone number',
    enterPassword: 'Enter your password',
    createStrongPassword: 'Create a strong password',
    enterFullName: 'Your full name',
    enterInviteCode: 'Enter invite code',
    countryCode: 'Country Code',
    phoneNumberWithoutCountry: 'Phone number without country code',
    
    // Dashboard
    dashboard: 'Dashboard',
    investments: 'Investments',
    transactions: 'Transactions',
    invites: 'Invites',
    settings: 'Settings',
    
    // Investments
    investmentPlans: 'Investment Plans',
    minimumInvestment: 'Minimum Investment',
    duration: 'Duration',
    expectedReturn: 'Expected Return',
    invest: 'Invest',
    days: 'days',
    
    // Transactions
    transactionHistory: 'Transaction History',
    amount: 'Amount',
    type: 'Type',
    status: 'Status',
    date: 'Date',
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    
    // Invites
    inviteUsers: 'Invite Users',
    myInvites: 'My Invites',
    referralCode: 'Referral Code',
    shareCode: 'Share Code',
    invitesCount: 'Invites Sent',
    registeredUsers: 'Registered Users',
    
    // Deposits and Withdrawals
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    bankTransfer: 'Bank Transfer',
    cryptoTransfer: 'Crypto Transfer',
    selectMethod: 'Select Method',
    uploadProof: 'Upload Proof',
    
    // General
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    
    // Pages
    aboutUs: 'About Us',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    contact: 'Contact',
    
    // Messages
    welcomeMessage: 'Welcome to Bitget12',
    noDataAvailable: 'No data available',
    operationCompleted: 'Operation completed successfully',
    operationFailed: 'Operation failed',
    
    // Admin
    admin: 'Administrator',
    userManagement: 'User Management',
    systemSettings: 'System Settings',
    reports: 'Reports',
    
    // Crypto
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    litecoin: 'Litecoin',
    ripple: 'Ripple',
    cardano: 'Cardano',
    polkadot: 'Polkadot',
    chainlink: 'Chainlink',
    stellar: 'Stellar',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired',
    
    // Accounts
    bankAccount: 'Bank Account',
    usdtWallet: 'USDT Wallet',
    addAccount: 'Add Account',
    accountDetails: 'Account Details',
    
    // Quantification
    quantify: 'Quantify',
    quantification: 'Quantification',
    quantificationResults: 'Quantification Results',
    
    // Charts
    charts: 'Charts',
    priceChart: 'Price Chart',
    performanceChart: 'Performance Chart',
    
    // Notifications
    notifications: 'Notifications',
    newMessage: 'New Message',
    systemUpdate: 'System Update'
  }
};

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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
