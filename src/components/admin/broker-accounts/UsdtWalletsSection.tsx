
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UsdtWallet, UsdtWalletForm } from './types';
import UsdtWalletFormComponent from './UsdtWalletForm';
import UsdtWalletsList from './UsdtWalletsList';

interface UsdtWalletsSectionProps {
  wallets: UsdtWallet[];
  onWalletsChange: (wallets: UsdtWallet[]) => void;
}

const UsdtWalletsSection: React.FC<UsdtWalletsSectionProps> = ({
  wallets,
  onWalletsChange
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UsdtWallet | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState<UsdtWalletForm>({
    wallet_address: '',
    network: 'TRC-20',
    is_active: true
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('broker_usdt_wallets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedWallets = data?.map(wallet => ({
        id: wallet.id,
        wallet_address: wallet.wallet_address,
        network: wallet.network,
        is_active: wallet.is_active,
        created_at: wallet.created_at
      })) || [];

      onWalletsChange(formattedWallets);
    } catch (error) {
      console.error('Error fetching USDT wallets:', error);
      toast({
        title: "Erro ao carregar carteiras",
        description: "Não foi possível carregar as carteiras USDT",
        variant: "destructive"
      });
    }
  };

  const saveWallet = async () => {
    setLoading(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from('broker_usdt_wallets')
          .update({
            wallet_address: form.wallet_address,
            network: form.network,
            is_active: form.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editing.id);

        if (error) throw error;
        toast({ title: "Carteira USDT atualizada" });
      } else {
        const { error } = await supabase
          .from('broker_usdt_wallets')
          .insert({
            wallet_address: form.wallet_address,
            network: form.network,
            is_active: form.is_active
          });

        if (error) throw error;
        toast({ title: "Carteira USDT adicionada" });
      }
      
      await fetchWallets();
      resetForm();
    } catch (error) {
      console.error('Error saving USDT wallet:', error);
      toast({
        title: "Erro ao salvar carteira",
        description: "Não foi possível salvar a carteira USDT",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteWallet = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta carteira USDT?')) return;

    try {
      const { error } = await supabase
        .from('broker_usdt_wallets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "Carteira USDT excluída" });
      await fetchWallets();
    } catch (error) {
      console.error('Error deleting USDT wallet:', error);
      toast({
        title: "Erro ao excluir carteira",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setForm({ wallet_address: '', network: 'TRC-20', is_active: true });
    setShowForm(false);
    setEditing(null);
  };

  const startEdit = (wallet: UsdtWallet) => {
    setForm({
      wallet_address: wallet.wallet_address,
      network: wallet.network,
      is_active: wallet.is_active
    });
    setEditing(wallet);
    setShowForm(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Wallet size={24} />
            Carteiras USDT da Corretora
          </CardTitle>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={16} className="mr-1" />
            Adicionar Carteira
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <UsdtWalletFormComponent
            form={form}
            setForm={setForm}
            onSave={saveWallet}
            onCancel={resetForm}
            editing={editing}
            loading={loading}
          />
        )}
        <UsdtWalletsList
          wallets={wallets}
          onEdit={startEdit}
          onDelete={deleteWallet}
        />
      </CardContent>
    </Card>
  );
};

export default UsdtWalletsSection;
