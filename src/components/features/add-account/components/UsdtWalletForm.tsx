
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Wallet } from 'lucide-react';
import type { UsdtWalletFormData } from '../types';

const UsdtWalletForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<UsdtWalletFormData>({
    wallet_address: '',
    network: 'TRC-20'
  });

  const handleSubmit = async () => {
    if (!formData.wallet_address) {
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
          wallet_address: formData.wallet_address,
          network: formData.network
        });

      if (error) throw error;

      toast({
        title: "Carteira USDT adicionada",
        description: "Sua carteira USDT foi adicionada com sucesso"
      });

      setFormData({ wallet_address: '', network: 'TRC-20' });
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
          value={formData.wallet_address}
          onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
          placeholder="Endereço da sua carteira USDT"
          disabled={submitting}
        />
      </div>
      
      <div>
        <Label htmlFor="network">Rede</Label>
        <Input
          id="network"
          value={formData.network}
          onChange={(e) => setFormData({ ...formData, network: e.target.value })}
          disabled={submitting}
        />
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Adicionando..." : "Adicionar Carteira USDT"}
      </Button>
    </div>
  );
};

export default UsdtWalletForm;
