
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
  levelName: string | null;
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
  levelName: null,
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
  const [levelName, setLevelName] = useState<string | null>(null);
  const [depositMethod, setDepositMethod] = useState<DepositMethod>(null);
  const [withdrawalMethod, setWithdrawalMethod] = useState<WithdrawalMethod>(null);
  const [isDepositVerified, setIsDepositVerified] = useState(false);
  const [proofUploads, setProofUploads] = useState<ProofUpload[]>([]);
  const [referralCount, setReferralCount] = useState(0);

  // Reset all state when user changes or logs out
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setBalance({ amount: 0, currency: 'AKZ' });
      setLevelName(null);
      setDepositMethod(null);
      setWithdrawalMethod(null);
      setIsDepositVerified(false);
      setProofUploads([]);
      setReferralCount(0);
    }
  }, [isAuthenticated, user?.id]);

  // Load user data from local storage only for authenticated users
  useEffect(() => {
    if (user?.id && isAuthenticated) {
      // Use user ID instead of phone number for more reliable key
      const userKey = `crypto_user_data_${user.id}`;
      const storedData = localStorage.getItem(userKey);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          // Only use localStorage data if it matches current user
          if (parsedData.userId === user.id) {
            setIsDepositVerified(parsedData.isDepositVerified || false);
            setProofUploads(parsedData.proofUploads || []);
            setReferralCount(parsedData.referralCount || 0);
          } else {
            // Clear outdated data
            localStorage.removeItem(userKey);
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem(userKey);
        }
      }
    }
  }, [user?.id, isAuthenticated]);

  // Fetch authoritative balance from the database when authenticated
  useEffect(() => {
    const fetchBalanceFromDB = async () => {
      if (user?.id && isAuthenticated) {
        try {
          console.log('Fetching balance for user:', user.id);
          const { data, error } = await supabase
            .from('user_quantifications')
            .select('balance, investment_plan:investment_plans(currency, level_name)')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          if (data) {
            console.log('Balance data found:', data);
            setBalance({
              amount: data.balance || 0,
              currency: data.investment_plan?.currency || 'AKZ',
            });
            setLevelName(data.investment_plan?.level_name || null);
          } else {
            console.log('No balance data found, using defaults');
            // New user - reset to defaults
            setBalance({ amount: 0, currency: 'AKZ' });
            setLevelName(null);
          }
        } catch(error) {
          console.error("Error fetching user balance from DB:", error);
          setBalance({ amount: 0, currency: 'AKZ' });
          setLevelName(null);
        }
      }
    };

    // Remove the timeout and fetch immediately when user is authenticated
    if (isAuthenticated && user?.id) {
      fetchBalanceFromDB();
    }
  }, [isAuthenticated, user?.id]);

  // Save user data to local storage when it changes
  useEffect(() => {
    if (user?.id && isAuthenticated) {
      const userKey = `crypto_user_data_${user.id}`;
      const userData = {
        userId: user.id, // Include user ID for validation
        isDepositVerified,
        proofUploads,
        referralCount,
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
  }, [user?.id, isAuthenticated, isDepositVerified, proofUploads, referralCount]);

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
        levelName,
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
