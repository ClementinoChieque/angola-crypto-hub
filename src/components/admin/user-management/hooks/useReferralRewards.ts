
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReferralReward } from '../types';

// Guard function
function isReferralReward(obj: any): obj is ReferralReward {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.referrer_id === 'string' &&
    typeof obj.referred_user_id === 'string' &&
    typeof obj.reward_amount === 'number' &&
    typeof obj.reward_currency === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.created_at === 'string'
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
      // Seleciona apenas colunas explícitas, sem JOIN ou referência de select oculto que vá para users!
      const { data, error } = await supabase
        .from('referral_rewards')
        .select(columns)
        .order('created_at', { ascending: false });

      if (error) {
        // Verifica se o erro refere explicitamente "users". Se sim, provavelmente algum campo, select ou política do banco faz referência à tabela users.
        // Para evitar isso: Não tente acessar colunas não listadas em "columns"
        console.error('[ReferralRewards] Erro ao buscar referral_rewards via supabase:', error);
        throw error;
      }

      if (Array.isArray(data)) {
        const rewards: ReferralReward[] = [];
        for (const item of data) {
          if (isReferralReward(item)) {
            rewards.push(item);
          }
        }
        setReferralRewards(rewards);
      } else {
        setReferralRewards([]);
      }
    } catch (err) {
      // Erro tratado de modo seguro para não vazar detalhes ao usuário final.
      console.error('Error fetching referral rewards [catch]:', err);
      toast({
        title: "Erro ao buscar recompensas",
        description: (typeof err === "object" && err !== null && "message" in err)
          ? (err as { message?: string }).message ?? String(err)
          : String(err),
        variant: "destructive"
      });
      setReferralRewards([]);
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

      // Usa o próprio id também como referred_user_id para não deixar null (evita joins problemáticos)
      const { error: insertError } = await supabase
        .from('referral_rewards')
        .insert({
          referrer_id: userId,
          referred_user_id: userId,
          reward_amount: amount,
          reward_currency: 'USDT',
          status: 'completed'
        });

      if (insertError) {
        console.error("Erro ao inserir em referral_rewards:", insertError);
        throw insertError;
      }

      // Atualizar saldo do usuário na tabela user_quantifications em USDT
      const { data: quant, error: fetchQuantError } = await supabase
        .from('user_quantifications')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchQuantError) {
        console.error("Erro ao buscar quantificação:", fetchQuantError);
        throw fetchQuantError;
      }

      if (quant) {
        const newBalance = (quant.balance || 0) + amount;
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
        description: `Recompensa de ${amount} USDT adicionada e saldo atualizado com sucesso!`
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
