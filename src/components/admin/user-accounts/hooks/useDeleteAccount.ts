
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useDeleteAccount = () => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const deleteBankAccount = async (accountId: string, onSuccess: (accountId: string) => void) => {
    setDeletingId(accountId);
    try {
      const { error } = await supabase
        .from('user_bank_accounts')
        .delete()
        .eq('id', accountId);

      if (error) {
        console.error('Error deleting bank account:', error);
        toast({
          title: "Erro ao eliminar conta",
          description: "Não foi possível eliminar a conta bancária",
          variant: "destructive"
        });
      } else {
        onSuccess(accountId);
        toast({
          title: "Conta eliminada",
          description: "A conta bancária foi eliminada com sucesso",
        });
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast({
        title: "Erro ao eliminar conta",
        description: "Não foi possível eliminar a conta bancária",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const deleteUsdtWallet = async (walletId: string, onSuccess: (walletId: string) => void) => {
    setDeletingId(walletId);
    try {
      const { error } = await supabase
        .from('user_usdt_wallets')
        .delete()
        .eq('id', walletId);

      if (error) {
        console.error('Error deleting USDT wallet:', error);
        toast({
          title: "Erro ao eliminar carteira",
          description: "Não foi possível eliminar a carteira USDT",
          variant: "destructive"
        });
      } else {
        onSuccess(walletId);
        toast({
          title: "Carteira eliminada",
          description: "A carteira USDT foi eliminada com sucesso",
        });
      }
    } catch (error) {
      console.error('Error deleting USDT wallet:', error);
      toast({
        title: "Erro ao eliminar carteira",
        description: "Não foi possível eliminar a carteira USDT",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  return {
    deletingId,
    deleteBankAccount,
    deleteUsdtWallet
  };
};
