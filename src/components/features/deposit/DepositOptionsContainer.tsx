
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import UploadProofContainer from '@/components/features/uploadproof/UploadProofContainer';
import { useDepositData } from './hooks/useDepositData';
import type { DepositType } from './types/index';
import DepositMethodSelector from './components/DepositMethodSelector';
import UsdtWalletList from './components/UsdtWalletList';
import BankAccountList from './components/BankAccountList';

interface DepositFormProps {
  selectedType: DepositType;
  amount: string;
  onAmountChange: (amount: string) => void;
  onConfirm: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({ selectedType, amount, onAmountChange, onConfirm }) => {
  return (
    <div className="space-y-4 mt-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Valor do Depósito ({selectedType})
        </label>
        <input
          id="amount"
          type="number"
          placeholder={`Valor em ${selectedType}`}
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          step="0.01"
        />
      </div>
      <button
        onClick={onConfirm}
        disabled={!amount || Number(amount) <= 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Confirmar Depósito
      </button>
    </div>
  );
};

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
            selectedType={selected}
            amount={amount}
            onAmountChange={setAmount}
            onConfirm={handleConfirmDeposit}
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
