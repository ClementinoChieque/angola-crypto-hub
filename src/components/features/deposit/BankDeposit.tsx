
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Ban } from 'lucide-react';

type DepositMethod = 'USDT' | 'BAE' | 'BFA' | 'BIC' | 'ATL';

interface BankDepositProps {
  amount: string;
  setAmount: (value: string) => void;
  onDeposit: (method: DepositMethod) => void;
}

const BankDeposit: React.FC<BankDepositProps> = ({ amount, setAmount, onDeposit }) => {
  const [bankTab, setBankTab] = useState<DepositMethod>('BAE');
  
  const bankAccounts = {
    BAE: "123456789",
    BFA: "987654321",
    BIC: "456789123",
    ATL: "789123456"
  };

  return (
    <Tabs value={bankTab} onValueChange={(v) => setBankTab(v as DepositMethod)} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="BAE">BAE</TabsTrigger>
        <TabsTrigger value="BFA">BFA</TabsTrigger>
        <TabsTrigger value="BIC">BIC</TabsTrigger>
        <TabsTrigger value="ATL">ATL</TabsTrigger>
      </TabsList>
      
      <div className="space-y-4 mt-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Ban size={24} className="text-crypto-blue" />
            <div>
              <h3 className="font-medium">{bankTab}</h3>
              <p className="text-sm text-muted-foreground">
                Conta: {bankAccounts[bankTab]}
              </p>
            </div>
          </div>
        </Card>
        
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
          onClick={() => onDeposit(bankTab)}
          className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
        >
          Confirmar Depósito
        </Button>
      </div>
    </Tabs>
  );
};

export default BankDeposit;
