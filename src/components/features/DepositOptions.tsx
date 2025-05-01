
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { Ban } from 'lucide-react';

type DepositMethod = 'USDT' | 'BAE' | 'BFA' | 'BIC' | 'ATL';

const DepositOptions: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'crypto' | 'bank'>('crypto');
  const [bankTab, setBankTab] = useState<DepositMethod>('BAE');
  const { toast } = useToast();
  const { setDepositMethod } = useUser();

  const handleDeposit = (method: DepositMethod) => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    setDepositMethod(method);
    
    toast({
      title: "Depósito iniciado",
      description: `Você solicitou um depósito de ${parseFloat(amount).toLocaleString()} via ${method}`,
    });

    // Reset form
    setAmount('');
  };

  const bankAccounts = {
    BAE: "123456789",
    BFA: "987654321",
    BIC: "456789123",
    ATL: "789123456"
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Depositar</h2>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'crypto' | 'bank')} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="crypto">USDT (TRC-20)</TabsTrigger>
          <TabsTrigger value="bank">Conta Bancária</TabsTrigger>
        </TabsList>
        
        {/* USDT Deposit */}
        <TabsContent value="crypto">
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
              onClick={() => handleDeposit('USDT')}
              className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
            >
              Confirmar Depósito
            </Button>
          </div>
        </TabsContent>
        
        {/* Bank Deposit */}
        <TabsContent value="bank">
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
                onClick={() => handleDeposit(bankTab)}
                className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
              >
                Confirmar Depósito
              </Button>
            </div>
          </Tabs>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>Observações:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Após o depósito, faça o upload do comprovativo.</li>
          <li>O saldo será habilitado após confirmação pelo administrador.</li>
          <li>Depósitos em banco são convertidos para AKZ.</li>
        </ul>
      </div>
    </div>
  );
};

export default DepositOptions;
