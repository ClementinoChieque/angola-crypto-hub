
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { ArrowDown } from 'lucide-react';

type WithdrawalMethod = 'USDT' | 'AO';

const WithdrawalOptions: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [withdrawalTab, setWithdrawalTab] = useState<WithdrawalMethod>('USDT');
  const { toast } = useToast();
  const { balance, setWithdrawalMethod } = useUser();

  // Função para buscar o mínimo de saque dependendo da moeda
  const getMinimumWithdrawal = () => {
    if (withdrawalTab === 'USDT') return 10;
    if (withdrawalTab === 'AO') return 5000;
    return 0;
  };

  const handleWithdrawal = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    const minimumWithdrawal = getMinimumWithdrawal();

    // Checagem do valor mínimo de saque
    if (withdrawalAmount < minimumWithdrawal) {
      toast({
        title: "Valor mínimo não atingido",
        description: `O valor mínimo para saque em ${withdrawalTab === 'USDT' ? 'USDT' : 'AKZ'} é ${minimumWithdrawal.toLocaleString()}${withdrawalTab === 'USDT' ? ' USDT' : ' AKZ'}`,
        variant: "destructive",
      });
      return;
    }

    if (withdrawalAmount > balance.amount) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui saldo suficiente para este saque",
        variant: "destructive",
      });
      return;
    }

    setWithdrawalMethod(withdrawalTab);

    toast({
      title: "Solicitação de saque enviada",
      description: `Você solicitou um saque de ${withdrawalAmount.toLocaleString()} via ${withdrawalTab}`,
    });

    // Reset form
    setAmount('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Sacar</h2>

      <div className="bg-muted p-4 rounded-md text-center mb-4">
        <p className="text-sm">Saldo Disponível</p>
        <p className="font-bold text-xl">{balance.amount.toLocaleString()} {balance.currency}</p>
      </div>
      
      <Tabs value={withdrawalTab} onValueChange={(v) => setWithdrawalTab(v as WithdrawalMethod)} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="USDT">USDT</TabsTrigger>
          <TabsTrigger value="AO">Kwanza (AKZ)</TabsTrigger>
        </TabsList>
        
        {/* USDT Withdrawal */}
        <TabsContent value="USDT">
          <div className="space-y-4">
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
            
            <p className="text-xs text-muted-foreground">
               Saque | Mínimo: 10 USDT
            </p>
          </div>
        </TabsContent>
        
        {/* AO Withdrawal */}
        <TabsContent value="AO">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount-ao">Valor (AKZ)</Label>
              <Input
                id="amount-ao"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Saque | Mínimo: 5.000 AKZ
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={handleWithdrawal}
        className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
      >
        <ArrowDown size={16} className="mr-2" />
        Solicitar Saque
      </Button>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>Observações:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Saques são processados em até 72 horas úteis.</li>
          <li>Certifique-se de inserir as informações corretas.</li>
        </ul>
      </div>
    </div>
  );
};

export default WithdrawalOptions;

