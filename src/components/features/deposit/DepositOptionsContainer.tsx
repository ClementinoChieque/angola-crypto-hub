
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import UploadProofContainer from '@/components/features/uploadproof/UploadProofContainer';
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
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    if (selected === 'USDT') {
      const fetchWallets = async () => {
        setWalletsLoading(true);
        try {
          const { data } = await supabase
            .from('broker_usdt_wallets')
            .select('*')
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
            .select('*')
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

  // Handler simulando ação ao clicar em confirmar depósito
  const handleConfirmDeposit = () => {
    // Aqui poderia acionar uma toast ou lógica existente futuramente
    // Por ora, apenas console log para marcação visual
    console.log('Depósito confirmado:', { tipo: selected, valor: amount });
  };

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

      {/* Listagem das opções administrativas */}
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

      {/* Campo de valor do depósito */}
      {selected && (
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">
            Valor do Depósito {selected === 'USDT' ? '(USDT)' : '(AKZ)'}
          </label>
          <Input
            type="number"
            min="0"
            inputMode="decimal"
            placeholder={selected === 'USDT' ? 'Digite o valor em USDT' : 'Digite o valor em AKZ'}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="max-w-xs"
          />

          {/* Botão azul Confirmar Depósito */}
          <Button 
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
            onClick={handleConfirmDeposit}
            disabled={!amount || parseFloat(amount) <= 0}
            type="button"
          >
            Confirmar Depósito
          </Button>
        </div>
      )}

      {/* Upload de comprovativo */}
      {selected && (
        <div className="mt-6">
          <UploadProofContainer />
        </div>
      )}
    </div>
  );
};

export default DepositOptionsContainer;
