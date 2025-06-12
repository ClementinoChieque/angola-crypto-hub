
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

  const addReferralReward = async (userId: string, amount: number) => {
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
          referred_user_id: userId, // Placeholder - adjust as needed
          reward_amount: amount,
          reward_currency: 'USDT',
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: "Recompensa adicionada",
        description: `Recompensa de ${amount} USDT adicionada com sucesso`
      });

      await fetchReferralRewards();
      return true;
    } catch (error) {
      console.error('Error adding referral reward:', error);
      toast({
        title: "Erro ao adicionar recompensa",
        description: "Não foi possível adicionar a recompensa",
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
