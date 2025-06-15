
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

type DepositType = 'USDT' | 'AKZ';

interface UsdtWallet {
  id: string;
  wallet_address: string;
  network: string;
  is_active: boolean;
}

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_active: boolean;
}

const DepositOptionsContainer: React.FC = () => {
  const [selected, setSelected] = useState<DepositType | null>(null);
  const [usdtWallets, setUsdtWallets] = useState<UsdtWallet[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [banksLoading, setBanksLoading] = useState(false);

  // Fetch USDT wallets when USDT is selected
  useEffect(() => {
    if (selected === 'USDT') {
      setWalletsLoading(true);
      supabase
        .from('broker_usdt_wallets')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setUsdtWallets(data || []);
        })
        .finally(() => setWalletsLoading(false));
    }
  }, [selected]);

  // Fetch bank accounts when AKZ is selected
  useEffect(() => {
    if (selected === 'AKZ') {
      setBanksLoading(true);
      supabase
        .from('broker_bank_accounts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setBankAccounts(data || []);
        })
        .finally(() => setBanksLoading(false));
    }
  }, [selected]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Selecione o Método de Depósito</h2>
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={selected === 'USDT' ? 'default' : 'outline'}
          onClick={() => setSelected('USDT')}
          className="w-40"
        >
          USDT (Criptomoeda)
        </Button>
        <Button
          variant={selected === 'AKZ' ? 'default' : 'outline'}
          onClick={() => setSelected('AKZ')}
          className="w-40"
        >
          Kwanza (AKZ)
        </Button>
      </div>

      {selected === 'USDT' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Carteiras USDT Disponíveis</h3>
          {walletsLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Carregando carteiras...
            </div>
          ) : usdtWallets.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma carteira USDT disponível.
            </div>
          ) : (
            <div className="space-y-3">
              {usdtWallets.map((wallet) => (
                <Card key={wallet.id} className="p-4">
                  <div>
                    <div className="text-sm mb-1">
                      Rede: <span className="font-semibold">{wallet.network}</span>
                    </div>
                    <div className="font-mono break-all text-base bg-gray-100 rounded p-2">
                      {wallet.wallet_address}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {selected === 'AKZ' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Contas Bancárias Disponíveis</h3>
          {banksLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Carregando contas bancárias...
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma conta bancária disponível.
            </div>
          ) : (
            <div className="space-y-3">
              {bankAccounts.map((b) => (
                <Card key={b.id} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{b.bank_name}</div>
                    <div className="text-sm">Titular: {b.account_holder}</div>
                    <div className="text-sm">Conta: {b.account_number}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DepositOptionsContainer;

