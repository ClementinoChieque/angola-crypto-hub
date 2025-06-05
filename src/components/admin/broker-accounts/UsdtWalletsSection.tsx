
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const [form, setForm] = useState<UsdtWalletForm>({
    wallet_address: '',
    network: 'TRC-20',
    is_active: true
  });

  const saveWallet = async () => {
    try {
      if (editing) {
        const updatedWallets = wallets.map(wallet => 
          wallet.id === editing.id 
            ? { ...wallet, ...form, id: editing.id, created_at: editing.created_at }
            : wallet
        );
        onWalletsChange(updatedWallets);
        toast({ title: "Carteira USDT atualizada" });
      } else {
        const newWallet: UsdtWallet = {
          ...form,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        onWalletsChange([...wallets, newWallet]);
        toast({ title: "Carteira USDT adicionada" });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving USDT wallet:', error);
      toast({
        title: "Erro ao salvar carteira",
        description: "Não foi possível salvar a carteira USDT",
        variant: "destructive"
      });
    }
  };

  const deleteWallet = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta carteira USDT?')) return;

    try {
      onWalletsChange(wallets.filter(wallet => wallet.id !== id));
      toast({ title: "Carteira USDT excluída" });
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
