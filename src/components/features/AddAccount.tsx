
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Wallet, Plus } from 'lucide-react';

const AddAccount: React.FC = () => {
  const [isAccountApproved, setIsAccountApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [bankForm, setBankForm] = useState({
    bank_name: '',
    account_number: '',
    account_holder: ''
  });

  const [usdtForm, setUsdtForm] = useState({
    wallet_address: '',
    network: 'TRC-20'
  });

  useEffect(() => {
    if (user?.id) {
      checkAccountApproval();
    }
  }, [user]);

  const checkAccountApproval = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('status')
        .eq('user_id', user?.id)
        .eq('status', 'verified')
        .limit(1);

      if (error) throw error;
      
      setIsAccountApproved(data && data.length > 0);
    } catch (error) {
      console.error('Error checking account approval:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBankAccountSubmit = async () => {
    if (!bankForm.bank_name || !bankForm.account_number || !bankForm.account_holder) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_bank_accounts')
        .insert({
          user_id: user?.id,
          bank_name: bankForm.bank_name,
          account_number: bankForm.account_number,
          account_holder: bankForm.account_holder,
          currency: 'AKZ'
        });

      if (error) throw error;

      toast({
        title: "Conta bancária adicionada",
        description: "Sua conta bancária foi adicionada com sucesso"
      });

      setBankForm({ bank_name: '', account_number: '', account_holder: '' });
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Erro ao adicionar conta",
        description: "Não foi possível adicionar a conta bancária",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUsdtWalletSubmit = async () => {
    if (!usdtForm.wallet_address) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira o endereço da carteira",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_usdt_wallets')
        .insert({
          user_id: user?.id,
          wallet_address: usdtForm.wallet_address,
          network: usdtForm.network
        });

      if (error) throw error;

      toast({
        title: "Carteira USDT adicionada",
        description: "Sua carteira USDT foi adicionada com sucesso"
      });

      setUsdtForm({ wallet_address: '', network: 'TRC-20' });
    } catch (error) {
      console.error('Error adding USDT wallet:', error);
      toast({
        title: "Erro ao adicionar carteira",
        description: "Não foi possível adicionar a carteira USDT",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!isAccountApproved) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={24} />
            Adicionar Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium mb-2">Conta não aprovada</p>
              <p className="text-yellow-700 text-sm">
                Você precisa ter sua conta aprovada pelo administrador para poder adicionar contas bancárias e carteiras.
                Envie um comprovativo de pagamento e aguarde a aprovação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus size={24} />
          Adicionar Conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="akz" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="akz">AKZ (Conta Bancária)</TabsTrigger>
            <TabsTrigger value="usdt">USDT (Carteira)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="akz" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} />
                <h3 className="font-medium">Adicionar Conta Bancária (AKZ)</h3>
              </div>
              
              <div>
                <Label htmlFor="bank_name">Nome do Banco</Label>
                <Input
                  id="bank_name"
                  value={bankForm.bank_name}
                  onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                  placeholder="Ex: Banco BAI"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <Label htmlFor="account_holder">Nome Completo (Titular da Conta)</Label>
                <Input
                  id="account_holder"
                  value={bankForm.account_holder}
                  onChange={(e) => setBankForm({ ...bankForm, account_holder: e.target.value })}
                  placeholder="Seu nome completo"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <Label htmlFor="account_number">Número da Conta</Label>
                <Input
                  id="account_number"
                  value={bankForm.account_number}
                  onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
                  placeholder="Número da sua conta bancária"
                  disabled={submitting}
                />
              </div>
              
              <Button 
                onClick={handleBankAccountSubmit}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Adicionando..." : "Adicionar Conta Bancária"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="usdt" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={20} />
                <h3 className="font-medium">Adicionar Carteira USDT</h3>
              </div>
              
              <div>
                <Label htmlFor="wallet_address">Endereço da Carteira</Label>
                <Input
                  id="wallet_address"
                  value={usdtForm.wallet_address}
                  onChange={(e) => setUsdtForm({ ...usdtForm, wallet_address: e.target.value })}
                  placeholder="Endereço da sua carteira USDT"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <Label htmlFor="network">Rede</Label>
                <Input
                  id="network"
                  value={usdtForm.network}
                  onChange={(e) => setUsdtForm({ ...usdtForm, network: e.target.value })}
                  disabled={submitting}
                />
              </div>
              
              <Button 
                onClick={handleUsdtWalletSubmit}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Adicionando..." : "Adicionar Carteira USDT"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AddAccount;
