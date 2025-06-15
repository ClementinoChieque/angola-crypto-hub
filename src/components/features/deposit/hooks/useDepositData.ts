
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { DepositType, UsdtWallet, BankAccount } from '../types';

export const useDepositData = (selected: DepositType | null) => {
  const [usdtWallets, setUsdtWallets] = useState<UsdtWallet[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [banksLoading, setBanksLoading] = useState(false);

  useEffect(() => {
    if (selected === 'USDT') {
      const fetchWallets = async () => {
        setWalletsLoading(true);
        try {
          const { data } = await supabase
            .from('broker_usdt_wallets')
            .select('id, wallet_address, network')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          setUsdtWallets(data || []);
        } finally {
          setWalletsLoading(false);
        }
      };
      fetchWallets();
    }
  }, [selected]);

  useEffect(() => {
    if (selected === 'AKZ') {
      const fetchBanks = async () => {
        setBanksLoading(true);
        try {
          const { data } = await supabase
            .from('broker_bank_accounts')
            .select('id, bank_name, account_number, account_holder')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          setBankAccounts(data || []);
        } finally {
          setBanksLoading(false);
        }
      };
      fetchBanks();
    }
  }, [selected]);

  return { usdtWallets, bankAccounts, walletsLoading, banksLoading };
};
