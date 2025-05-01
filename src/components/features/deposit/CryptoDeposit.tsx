
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCryptoRates } from '@/utils/cryptoRates';

interface CryptoDepositProps {
  amount: string;
  setAmount: (value: string) => void;
  onDeposit: () => void;
}

const CryptoDeposit: React.FC<CryptoDepositProps> = ({ amount, setAmount, onDeposit }) => {
  const { rates, isLoading } = useCryptoRates();
  const [aocAmount, setAocAmount] = useState<string>('');

  // Calculate AOcripto equivalent when USDT amount changes
  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      const usdtValue = parseFloat(amount);
      const aocValue = usdtValue * rates.usdtToAoc;
      setAocAmount(aocValue.toLocaleString());
    } else {
      setAocAmount('');
    }
  }, [amount, rates.usdtToAoc]);

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md text-center">
        <p className="text-sm mb-1">Endereço da carteira (TRC-20)</p>
        <p className="font-mono bg-white p-2 rounded border select-all">
          TRB9Vux9dMacKFBuxsuLwD4PQGxgiFT8tU
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Envie apenas USDT pela rede TRC-20
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount-usdt">Valor (USDT)</Label>
        <Input
          id="amount-usdt"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {aocAmount && (
          <div className="text-sm text-muted-foreground mt-1">
            Equivalente a <span className="font-medium">{aocAmount} AOcripto</span>
            <span className="block text-xs">Taxa de conversão: 1 USDT = {rates.usdtToAoc} AOcripto</span>
          </div>
        )}
      </div>
      
      <Button 
        onClick={onDeposit}
        className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
      >
        Confirmar Depósito
      </Button>
    </div>
  );
};

export default CryptoDeposit;
