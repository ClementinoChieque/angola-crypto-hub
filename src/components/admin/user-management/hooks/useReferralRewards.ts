import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReferralReward } from '../types';

export const useReferralRewards = () => {
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);
  const { toast } = useToast();

  const fetchReferralRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferralRewards(data || []);
    } catch (error) {
      console.error('Error fetching referral rewards:', error);
    }
  };

  const addReferralReward = async (userId: string, amount: number, currency: 'USDT' | 'AKZ' = 'USDT') => {
    try {
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Valor inválido",
          description: "Por favor, insira um valor válido para a recompensa",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('referral_rewards')
        .insert({
          referrer_id: userId,
          referred_user_id: userId, // Placeholder - pode ajustar no futuro
          reward_amount: amount,
          reward_currency: currency,
          status: 'completed'
        });

      if (error) throw error;

      // ATUALIZAR O SALDO na user_quantifications
      // Buscar quantification do usuário
      const { data: quant, error: fetchError } = await supabase
        .from('user_quantifications')
        .select('balance, investment_plan_id, investment_plan:investment_plans(currency)')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let shouldUpdateBalance = false;

      // Verifica se o plano do usuário está na moeda correta
      if (quant && quant.investment_plan) {
        if (quant.investment_plan.currency === currency) {
          shouldUpdateBalance = true;
        }
      } else if (!quant || !quant.investment_plan) {
        // Usuário sem plano, adiciona saldo apenas se moeda é AKZ (ajuste se desejar outro comportamento)
        shouldUpdateBalance = (currency === 'AKZ');
      }

      if (shouldUpdateBalance) {
        const newBalance = (quant?.balance || 0) + amount;
        const { error: updateError } = await supabase
          .from('user_quantifications')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Recompensa adicionada",
        description: `Recompensa de ${amount} ${currency} adicionada e saldo atualizado com sucesso!`
      });

      await fetchReferralRewards();
      return true;
    } catch (error) {
      console.error('Error adding referral reward:', error);
      toast({
        title: "Erro ao adicionar recompensa",
        description: "Não foi possível adicionar a recompensa/saldo",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchReferralRewards();
  }, []);

  return { referralRewards, refetchReferralRewards: fetchReferralRewards, addReferralReward };
};
