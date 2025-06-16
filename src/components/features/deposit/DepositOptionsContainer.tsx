
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import UploadProofContainer from '@/components/features/uploadproof/UploadProofContainer';
import { useDepositData } from './hooks/useDepositData';
import type { DepositType } from './types/index';
import DepositMethodSelector from './components/DepositMethodSelector';
import UsdtWalletList from './components/UsdtWalletList';
import BankAccountList from './components/BankAccountList';
import DepositForm from './components/DepositForm';

const DepositOptionsContainer: React.FC = () => {
  const [selected, setSelected] = useState<DepositType | null>(null);
  const [amount, setAmount] = useState<string>('');
  const { toast } = useToast();
  const { usdtWallets, bankAccounts, walletsLoading, banksLoading } = useDepositData(selected);

  const handleConfirmDeposit = () => {
    console.log('Depósito confirmado:', { tipo: selected, valor: amount });
    toast({
      title: 'Confirmação Recebida',
      description: `Sua intenção de depósito de ${amount} ${selected} foi registrada. Prossiga com o upload do comprovativo.`,
    });
    setAmount('');
  };

  const handleBack = () => {
    setSelected(null);
    setAmount('');
  };

  return (
    <div>
      <DepositMethodSelector selected={selected} onSelect={setSelected} />

      {selected === 'USDT' && (
        <UsdtWalletList wallets={usdtWallets} isLoading={walletsLoading} />
      )}

      {selected === 'AKZ' && (
        <BankAccountList accounts={bankAccounts} isLoading={banksLoading} />
      )}

      {selected && (
        <>
          <DepositForm
            selectedMethod={selected === 'USDT' ? 'crypto' : 'bank'}
            currency={selected}
            onBack={handleBack}
          />
          <div className="mt-6">
            <UploadProofContainer />
          </div>
        </>
      )}
    </div>
  );
};

export default DepositOptionsContainer;
