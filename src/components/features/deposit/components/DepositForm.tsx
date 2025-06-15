
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DepositType } from '../types';

interface DepositFormProps {
  selectedType: DepositType;
  amount: string;
  onAmountChange: (value: string) => void;
  onConfirm: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({ selectedType, amount, onAmountChange, onConfirm }) => {
  return (
    <div className="mt-6">
      <label className="block text-sm font-medium mb-1">
        Valor do Depósito {selectedType === 'USDT' ? '(USDT)' : '(AKZ)'}
      </label>
      <Input
        type="number"
        min="0"
        inputMode="decimal"
        placeholder={selectedType === 'USDT' ? 'Digite o valor em USDT' : 'Digite o valor em AKZ'}
        value={amount}
        onChange={e => onAmountChange(e.target.value)}
        className="max-w-xs"
      />

      <div className="bg-blue-50 text-blue-800 rounded mt-3 mb-2 px-3 py-2 text-sm space-y-1">
        <div>Após o depósito, faça o upload do comprovativo.</div>
        <div>Verifique cuidadosamente o valor a depositar.</div>
        <div>A sua conta será habilitada após confirmação.</div>
      </div>

      <Button 
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
        onClick={onConfirm}
        disabled={!amount || parseFloat(amount) <= 0}
        type="button"
      >
        Confirmar Depósito
      </Button>
    </div>
  );
};

export default DepositForm;
