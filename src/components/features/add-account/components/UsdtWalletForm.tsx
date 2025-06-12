
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Wallet } from 'lucide-react';

const UsdtWalletForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [usdtForm, setUsdtForm] = useState({
    wallet_address: '',
    network: 'TRC-20'
  });

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
        .from('user_usdt_wallets' as any)
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

  return (
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
  );
};

export default UsdtWalletForm;
