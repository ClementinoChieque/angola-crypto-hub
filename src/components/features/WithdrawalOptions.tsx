import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import BalanceHeader from './withdrawal/BalanceHeader';
import WithdrawalNotes from './withdrawal/WithdrawalNotes';
import USDTWithdrawalForm from './withdrawal/USDTWithdrawalForm';
import AOWithdrawalForm from './withdrawal/AOWithdrawalForm';

type WithdrawalMethod = 'USDT' | 'AO';

const WithdrawalOptions: React.FC = () => {
  const [amount, setAmount] = useState('');
  // Removidos os campos desnecessários
  const { toast } = useToast();
  const { balance, setWithdrawalMethod, updateBalance } = useUser();
  const { user } = useAuth();

  const balanceCurrency = balance.currency;
  const allowedMethod: WithdrawalMethod = balanceCurrency === 'USDT' ? 'USDT' : 'AO';
  const [withdrawalTab, setWithdrawalTab] = useState<WithdrawalMethod>(allowedMethod);

  useEffect(() => {
    setWithdrawalTab(allowedMethod);
  }, [balanceCurrency]);

  const getMinimumWithdrawal = () => {
    if (withdrawalTab === 'USDT') return 5;
    if (withdrawalTab === 'AO') return 5000;
    return 0;
  };

  const handleWithdrawal = async () => {
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

    if (!user?.id) {
      toast({
        title: "Usuário não autenticado",
        description: "É necessário estar logado para solicitar o saque.",
        variant: "destructive",
      });
      return;
    }

    const withdrawal_method = withdrawalTab === 'USDT' ? 'crypto' : 'bank';

    const novoSaldo = balance.amount - withdrawalAmount;
    await updateBalance(novoSaldo);

    // 1. Registrar solicitação de saque
    const { error: withdrawalError } = await supabase.from('withdrawal_requests').insert([
      {
        user_id: user.id,
        amount: withdrawalAmount,
        currency: balanceCurrency,
        withdrawal_method,
        status: 'pending',
      }
    ]);

    // 2. Registrar transação de saque (não bloqueante)
    const { error: transactionError } = await supabase.from('transactions').insert([
      {
        user_id: user.id,
        amount: withdrawalAmount,
        currency: balanceCurrency,
        type: 'withdraw',
        description: 'Solicitação de saque',
      }
    ]);
    if (transactionError) {
      console.error("Erro ao registrar na tabela transactions:", transactionError.message);
    }

    if (withdrawalError) {
      // reverte saldo e notifica
      await updateBalance(balance.amount);
      toast({
        title: "Erro ao registrar saque",
        description: "Não foi possível registrar seu pedido de saque. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saque solicitado",
        description: "Sua solicitação de saque foi enviada com sucesso, aguarde a aprovação.",
      });
      setAmount('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Sacar</h2>
      <BalanceHeader amount={balance.amount} currency={balance.currency} />

      <Tabs value={withdrawalTab} onValueChange={() => {}} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="USDT" disabled={balanceCurrency !== 'USDT'}>
            USDT
          </TabsTrigger>
          <TabsTrigger value="AO" disabled={balanceCurrency !== 'AKZ'}>
            Kwanza (AKZ)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="USDT">
          {balanceCurrency === 'USDT' && (
            <USDTWithdrawalForm
              amount={amount}
              onAmountChange={setAmount}
            />
          )}
        </TabsContent>
        <TabsContent value="AO">
          {balanceCurrency === 'AKZ' && (
            <AOWithdrawalForm
              amount={amount}
              onAmountChange={setAmount}
            />
          )}
        </TabsContent>
      </Tabs>

      <Button
        onClick={handleWithdrawal}
        className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
      >
        <ArrowDown size={16} className="mr-2" />
        Solicitar Saque
      </Button>

      <WithdrawalNotes />
    </div>
  );
};

export default WithdrawalOptions;
