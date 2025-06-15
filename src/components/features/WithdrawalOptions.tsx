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

type WithdrawalMethod = 'USDT' | 'AO';

const WithdrawalOptions: React.FC = () => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const { balance, setWithdrawalMethod, updateBalance } = useUser();
  const { user } = useAuth(); // para obter user_id

  const balanceCurrency = balance.currency; // 'AKZ' ou 'USDT'
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

    // Enviar solicitação para Supabase
    if (!user?.id) {
      toast({
        title: "Usuário não autenticado",
        description: "É necessário estar logado para solicitar o saque.",
        variant: "destructive",
      });
      return;
    }

    // Descontar saldo imediatamente do usuário
    const novoSaldo = balance.amount - withdrawalAmount;
    await updateBalance(novoSaldo);

    // Definir dados adicionais
    let withdrawal_method = '';
    let wallet_address = null;
    let bank_name = null;
    let bank_account = null;

    if (withdrawalTab === 'USDT') {
      withdrawal_method = 'crypto';
      wallet_address = null;
    } else {
      withdrawal_method = 'bank';
      bank_name = null;
      bank_account = null;
    }

    const { error } = await supabase.from('withdrawal_requests').insert([
      {
        user_id: user.id,
        amount: withdrawalAmount,
        currency: balanceCurrency,
        withdrawal_method,
        wallet_address,
        bank_name,
        bank_account,
        status: 'pending',
      }
    ]);

    if (error) {
      // Se der erro ao registrar solicitação, estornamos o saldo
      await updateBalance(balance.amount);
      toast({
        title: "Erro ao registrar solicitação",
        description: "Não foi possível registrar seu pedido de saque. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saque solicitado",
        description: "Sua solicitação de saque foi enviada e aguarda aprovação do administrador.",
      });
      setAmount('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Sacar</h2>

      <div className="bg-muted p-4 rounded-md text-center mb-4">
        <p className="text-sm">Saldo Disponível</p>
        <p className="font-bold text-xl">{balance.amount.toLocaleString()} {balance.currency}</p>
      </div>
      
      <Tabs value={withdrawalTab} onValueChange={() => {}} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="USDT" disabled={balanceCurrency !== 'USDT'}>
            USDT
          </TabsTrigger>
          <TabsTrigger value="AO" disabled={balanceCurrency !== 'AKZ'}>
            Kwanza (AKZ)
          </TabsTrigger>
        </TabsList>
        
        {/* USDT Withdrawal */}
        <TabsContent value="USDT">
          {balanceCurrency === 'USDT' && (
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
                Saque | Mínimo: 5 USDT
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* AO Withdrawal */}
        <TabsContent value="AO">
          {balanceCurrency === 'AKZ' && (
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
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>Observações:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Saques são processados em até 72 horas úteis.</li>
          <li>Certifique-se de inserir as informações corretas.</li>
          <li>Todos os pedidos passam por aprovação manual do administrador.</li>
        </ul>
      </div>
    </div>
  );
};

export default WithdrawalOptions;
