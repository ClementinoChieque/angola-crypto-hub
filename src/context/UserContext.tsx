
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

type DepositMethod = 'USDT' | 'BAE' | 'BFA' | 'BIC' | 'ATL' | null;
type WithdrawalMethod = 'USDT' | 'AO' | null;
type ProofUpload = {
  imageUrl: string;
  timestamp: Date;
  verified: boolean;
};

type UserContextType = {
  balance: { amount: number; currency: string };
  depositMethod: DepositMethod;
  withdrawalMethod: WithdrawalMethod;
  isDepositVerified: boolean;
  proofUploads: ProofUpload[];
  referralCount: number;
  setBalance: React.Dispatch<React.SetStateAction<{ amount: number; currency: string }>>;
  setDepositMethod: React.Dispatch<React.SetStateAction<DepositMethod>>;
  setWithdrawalMethod: React.Dispatch<React.SetStateAction<WithdrawalMethod>>;
  setIsDepositVerified: React.Dispatch<React.SetStateAction<boolean>>;
  addProofUpload: (imageUrl: string) => void;
  incrementReferralCount: () => void;
};

const defaultContext: UserContextType = {
  balance: { amount: 0, currency: 'AKZ' },
  depositMethod: null,
  withdrawalMethod: null,
  isDepositVerified: false,
  proofUploads: [],
  referralCount: 0,
  setBalance: () => {},
  setDepositMethod: () => {},
  setWithdrawalMethod: () => {},
  setIsDepositVerified: () => {},
  addProofUpload: () => {},
  incrementReferralCount: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState({ amount: 0, currency: 'AKZ' });
  const [depositMethod, setDepositMethod] = useState<DepositMethod>(null);
  const [withdrawalMethod, setWithdrawalMethod] = useState<WithdrawalMethod>(null);
  const [isDepositVerified, setIsDepositVerified] = useState(false);
  const [proofUploads, setProofUploads] = useState<ProofUpload[]>([]);
  const [referralCount, setReferralCount] = useState(0);

  // Load user data from local storage
  useEffect(() => {
    if (user) {
      const storedData = localStorage.getItem(`crypto_user_data_${user.phoneNumber}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setBalance(parsedData.balance || { amount: 0, currency: 'AKZ' });
        setIsDepositVerified(parsedData.isDepositVerified || false);
        setProofUploads(parsedData.proofUploads || []);
        setReferralCount(parsedData.referralCount || 0);
      }
    }
  }, [user]);

  // Save user data to local storage when it changes
  useEffect(() => {
    if (user) {
      const userData = {
        balance,
        isDepositVerified,
        proofUploads,
        referralCount,
      };
      localStorage.setItem(`crypto_user_data_${user.phoneNumber}`, JSON.stringify(userData));
    }
  }, [user, balance, isDepositVerified, proofUploads, referralCount]);

  const addProofUpload = (imageUrl: string) => {
    const newProof = { imageUrl, timestamp: new Date(), verified: false };
    setProofUploads([...proofUploads, newProof]);
  };

  const incrementReferralCount = () => {
    setReferralCount(prev => prev + 1);
  };

  return (
    <UserContext.Provider
      value={{
        balance,
        depositMethod,
        withdrawalMethod,
        isDepositVerified,
        proofUploads,
        referralCount,
        setBalance,
        setDepositMethod,
        setWithdrawalMethod,
        setIsDepositVerified,
        addProofUpload,
        incrementReferralCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
