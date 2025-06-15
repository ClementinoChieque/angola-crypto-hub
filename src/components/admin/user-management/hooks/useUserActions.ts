
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserActions = () => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const updateUserInvestment = async (userId: string, planId: string | null, balance: number, dailyLimit: number) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('user_quantifications')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      const dataToUpdate = {
        investment_plan_id: planId,
        balance: balance,
        daily_limit: dailyLimit,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        const { error } = await supabase
          .from('user_quantifications')
          .update(dataToUpdate)
          .eq('user_id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_quantifications')
          .insert({
            ...dataToUpdate,
            user_id: userId,
            is_active: false,
            used_today: 0,
            last_reset_date: new Date().toISOString().split('T')[0]
          });
        if (error) throw error;
      }

      toast({
        title: "Investimento do usuário atualizado",
        description: "O nível de investimento e saldo foram atualizados com sucesso."
      });
      return true;
    } catch (error) {
      console.error('Error updating user investment:', error);
      toast({
        title: "Erro ao atualizar investimento",
        description: "Não foi possível atualizar o investimento do usuário.",
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleQuantification = async (userId: string, currentStatus: boolean) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('user_quantifications')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existing) {
        const { error } = await supabase
          .from('user_quantifications')
          .update({
            is_active: !currentStatus,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_quantifications')
          .insert({
            user_id: userId,
            is_active: !currentStatus,
            daily_limit: 1,
            used_today: 0,
            last_reset_date: new Date().toISOString().split('T')[0]
          });

        if (error) throw error;
      }

      toast({
        title: `Quantificação ${!currentStatus ? 'ativada' : 'desativada'}`,
        description: `A quantificação foi ${!currentStatus ? 'ativada' : 'desativada'} para o usuário`
      });

      return true;
    } catch (error) {
      console.error('Error toggling quantification:', error);
      toast({
        title: "Erro ao alterar quantificação",
        description: "Não foi possível alterar o status da quantificação",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja eliminar este usuário? Esta ação não pode ser desfeita.')) {
      return false;
    }

    setDeletingUserId(userId);
    try {
      // IMPORTANTE: Não tenta deletar da tabela auth.users - apenas tabelas públicas
      
      // Delete referral rewards
      await supabase
        .from('referral_rewards')
        .delete()
        .or(`referrer_id.eq.${userId},referred_user_id.eq.${userId}`);

      // Delete user quantifications
      await supabase
        .from('user_quantifications')
        .delete()
        .eq('user_id', userId);

      // Delete user bank accounts
      await supabase
        .from('user_bank_accounts')
        .delete()
        .eq('user_id', userId);

      // Delete user USDT wallets
      await supabase
        .from('user_usdt_wallets')
        .delete()
        .eq('user_id', userId);

      // Delete referrals where user is referrer
      await supabase
        .from('referrals')
        .delete()
        .eq('referrer_id', userId);

      // Delete referrals where user is referred
      await supabase
        .from('referrals')
        .delete()
        .eq('referred_user_id', userId);

      // Delete payment proofs
      await supabase
        .from('payment_proofs')
        .delete()
        .eq('user_id', userId);

      // Delete transactions
      await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId);

      // Delete referral codes
      await supabase
        .from('referral_codes')
        .delete()
        .eq('user_id', userId);

      // Delete profile (tabela pública)
      await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      // NOTA: NÃO deletamos da tabela auth.users pois não temos permissão
      // O usuário permanecerá na auth mas sem dados associados

      toast({
        title: "Dados do usuário eliminados",
        description: "Todos os dados do usuário foram eliminados com sucesso"
      });

      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      toast({
        title: "Erro ao eliminar dados do usuário",
        description: "Não foi possível eliminar os dados do usuário",
        variant: "destructive"
      });
      return false;
    } finally {
      setDeletingUserId(null);
    }
  };

  return { toggleQuantification, deleteUser, deletingUserId, updateUserInvestment };
};
