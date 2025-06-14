import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  updateBalance: (newAmount: number) => Promise<void>;
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
  updateBalance: async () => {},
  setDepositMethod: () => {},
  setWithdrawalMethod: () => {},
  setIsDepositVerified: () => {},
  addProofUpload: () => {},
  incrementReferralCount: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
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

  // Fetch authoritative balance from the database when authenticated
  useEffect(() => {
    const fetchBalanceFromDB = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('user_quantifications')
            .select('balance, investment_plan:investment_plans(currency)')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          if (data) {
            setBalance({
              amount: data.balance || 0,
              currency: data.investment_plan?.currency || 'AKZ',
            });
          }
        } catch(error) {
          console.error("Error fetching user balance from DB:", error);
        }
      }
    };

    if (isAuthenticated) {
      fetchBalanceFromDB();
    }
  }, [isAuthenticated, user]);

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

  const updateBalance = async (newAmount: number) => {
    if (!user?.id) {
      console.error("Cannot update balance: user not authenticated.");
      return;
    }
    
    const originalBalance = balance;
    setBalance(prev => ({...prev, amount: newAmount}));

    const { error } = await supabase
      .from('user_quantifications')
      .update({ balance: newAmount, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (error) {
      console.error("Failed to update balance in database:", error);
      setBalance(originalBalance); // Revert on failure
    }
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
        updateBalance,
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
