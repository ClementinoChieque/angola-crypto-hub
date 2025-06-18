
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AmountInputProps {
  selectedMethod: 'bank' | 'crypto';
  amount: string;
  onAmountChange: (amount: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
  selectedMethod,
  amount,
  onAmountChange
}) => {
  const currency = selectedMethod === 'bank' ? 'AKZ' : 'USDT';
  const currencySymbol = selectedMethod === 'bank' ? 'Kz' : '$';

  return (
    <div>
      <Label htmlFor="amount">Valor ({currency})</Label>
      <div className="relative">
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder={`0.00 ${currencySymbol}`}
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="pr-12"
          required
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {currencySymbol}
        </span>
      </div>
    </div>
  );
};

export default AmountInput;
