
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CryptoDepositProps {
  amount: string;
  setAmount: (value: string) => void;
  onDeposit: () => void;
}

const CryptoDeposit: React.FC<CryptoDepositProps> = ({ amount, setAmount, onDeposit }) => {
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
