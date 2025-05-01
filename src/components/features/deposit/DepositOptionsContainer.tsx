
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import CryptoDeposit from './CryptoDeposit';
import BankDeposit from './BankDeposit';
import DepositNotes from './DepositNotes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DepositMethod = 'USDT' | 'BAE' | 'BFA' | 'BIC' | 'ATL';

const DepositOptionsContainer: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'crypto' | 'bank'>('crypto');
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
          <CryptoDeposit 
            amount={amount} 
            setAmount={setAmount} 
            onDeposit={() => handleDeposit('USDT')} 
          />
        </TabsContent>
        
        {/* Bank Deposit */}
        <TabsContent value="bank">
          <BankDeposit 
            amount={amount} 
            setAmount={setAmount} 
            onDeposit={handleDeposit} 
          />
        </TabsContent>
      </Tabs>
      
      <DepositNotes />
    </div>
  );
};

export default DepositOptionsContainer;
