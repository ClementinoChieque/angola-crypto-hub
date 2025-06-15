
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReferralReward } from '../types';

function isReferralReward(obj: any): obj is ReferralReward {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.referrer_id === 'string' &&
    typeof obj.referred_user_id === 'string' &&
    typeof obj.reward_amount === 'number' &&
    typeof obj.reward_currency === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.created_at === 'string' &&
    // updated_at field from supabase may be present or not; be defensive but expect string
    typeof obj.updated_at === 'string'
  );
}

export const useReferralRewards = () => {
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);
  const { toast } = useToast();

  const columns = [
    'id',
    'referrer_id',
    'referred_user_id',
    'reward_amount',
    'reward_currency',
    'status',
    'created_at',
    'updated_at'
  ].join(',');

  const fetchReferralRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_rewards')
        .select(columns)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[ReferralRewards] Erro ao buscar referral_rewards via supabase:', error);
        throw error;
      }

      // Ensure only a valid data array is ever assigned
      if (Array.isArray(data)) {
        const rewards: ReferralReward[] = data.filter(isReferralReward);
        setReferralRewards(rewards);
      } else {
        // If data is not an array, ensure we do not assign error objects!
        setReferralRewards([]); // Only set an empty valid array!
      }
    } catch (err) {
      console.error('Error fetching referral rewards [catch]:', err);
      toast({
        title: "Erro ao buscar recompensas",
        description: (typeof err === "object" && err !== null && "message" in err)
          ? (err as { message?: string }).message ?? String(err)
          : String(err),
        variant: "destructive"
      });
      setReferralRewards([]); // Only assign a valid empty ReferralReward array
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

      const { error: insertError } = await supabase
        .from('referral_rewards')
        .insert({
          referrer_id: userId,
          referred_user_id: userId, // Placeholder - pode ajustar no futuro
          reward_amount: amount,
          reward_currency: currency,
          status: 'completed'
        });

      if (insertError) {
        console.error("Erro ao inserir em referral_rewards:", insertError);
        throw insertError;
      }

      const { data: quant, error: fetchQuantError } = await supabase
        .from('user_quantifications')
        .select('balance, investment_plan_id, investment_plan:investment_plans(currency)')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchQuantError) {
        console.error("Erro ao buscar quantificação:", fetchQuantError);
        throw fetchQuantError;
      }

      let shouldUpdateBalance = false;

      if (quant && quant.investment_plan) {
        if (quant.investment_plan.currency === currency) {
          shouldUpdateBalance = true;
        }
      } else if (!quant || !quant.investment_plan) {
        shouldUpdateBalance = (currency === 'AKZ');
      }

      if (shouldUpdateBalance) {
        const newBalance = (quant?.balance || 0) + amount;
        const { error: updateError } = await supabase
          .from('user_quantifications')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        if (updateError) {
          console.error("Erro ao atualizar saldo:", updateError);
          throw updateError;
        }
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
        description: (typeof error === "object" && error !== null && "message" in error)
          ? (error as { message?: string }).message ?? String(error)
          : String(error),
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
