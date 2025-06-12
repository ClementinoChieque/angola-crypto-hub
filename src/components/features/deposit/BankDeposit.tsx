
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Banknote } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DepositMethod = 'USDT' | 'BAI' | 'BFA' | 'BIC' | 'ATL';

interface BankDepositProps {
  amount: string;
  setAmount: (value: string) => void;
  onDeposit: (method: DepositMethod) => void;
}

interface BankOption {
  value: DepositMethod;
  label: string;
  accountNumber: string;
}

const BankDeposit: React.FC<BankDepositProps> = ({ amount, setAmount, onDeposit }) => {
  const [selectedBank, setSelectedBank] = useState<DepositMethod>('BAE');
  
  const bankOptions: BankOption[] = [
    { value: 'BAI', label: 'Banco Angolano de Investimentos', accountNumber: '123456789' },
    { value: 'BFA', label: 'Banco de Fomento Angola', accountNumber: '987654321' },
    { value: 'BIC', label: 'Banco BIC', accountNumber: '456789123' },
    { value: 'ATL', label: 'Banco Atlântico', accountNumber: '789123456' }
  ];

  const selectedBankInfo = bankOptions.find(bank => bank.value === selectedBank);

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="bank-select">Nome do Banco</Label>
        <Select value={selectedBank} onValueChange={(value) => setSelectedBank(value as DepositMethod)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o banco" />
          </SelectTrigger>
          <SelectContent>
            {bankOptions.map(bank => (
              <SelectItem key={bank.value} value={bank.value}>
                {bank.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedBankInfo && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Banknote size={24} className="text-crypto-blue" />
            <div>
              <h3 className="font-medium">{selectedBankInfo.label}</h3>
              <p className="text-sm text-muted-foreground">
                Conta: {selectedBankInfo.accountNumber}
              </p>
            </div>
          </div>
        </Card>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="amount-bank">Valor (AKZ)</Label>
        <Input
          id="amount-bank"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={() => onDeposit(selectedBank)}
        className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
      >
        Confirmar Depósito
      </Button>
    </div>
  );
};

export default BankDeposit;
