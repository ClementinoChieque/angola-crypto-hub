
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserWithReferrals, InvestmentPlan } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithReferrals[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      console.log("Iniciando fetchUsers...");
      // Busca usuários nas tabelas permitidas
      const { data: referralUsers, error: referralError } = await supabase
        .from('referrals')
        .select('referrer_id, created_at')
        .order('created_at', { ascending: false });

      if (referralError && referralError.code !== 'PGRST116') {
        console.error('Error fetching referral users:', referralError);
      }

      const { data: proofUsers, error: proofError } = await supabase
        .from('payment_proofs')
        .select('user_id, created_at')
        .order('created_at', { ascending: false });

      if (proofError && proofError.code !== 'PGRST116') {
        console.error('Error fetching proof users:', proofError);
      }

      const { data: quantificationUsers, error: quantificationError } = await supabase
        .from('user_quantifications')
        .select('user_id, created_at')
        .order('created_at', { ascending: false });

      if (quantificationError && quantificationError.code !== 'PGRST116') {
        console.error('Error fetching quantification users:', quantificationError);
      }

      // Combina ids únicos
      const allUserIds = new Set<string>();

      if (referralUsers) {
        referralUsers.forEach(ref => allUserIds.add(ref.referrer_id));
      }

      if (proofUsers) {
        proofUsers.forEach(proof => allUserIds.add(proof.user_id));
      }

      if (quantificationUsers) {
        quantificationUsers.forEach(quant => allUserIds.add(quant.user_id));
      }

      // Busca dados do usuário das tabelas permitidas (NUNCA de users!)
      const usersWithData = await Promise.all(
        Array.from(allUserIds).map(async (userId) => {
          // Count referrals
          const { data: referrals } = await supabase
            .from('referrals')
            .select('id')
            .eq('referrer_id', userId);

          // Check quantification status
          const { data: quantification } = await supabase
            .from('user_quantifications')
            .select('is_active, balance, investment_plan_id, daily_limit, plan:investment_plans(*)')
            .eq('user_id', userId)
            .maybeSingle();

          // Consolida a data de criação do usuário
          let createdAt = new Date().toISOString();

          if (referralUsers) {
            const userReferral = referralUsers.find(ref => ref.referrer_id === userId);
            if (userReferral) createdAt = userReferral.created_at;
          }

          if (proofUsers) {
            const userProof = proofUsers.find(proof => proof.user_id === userId);
            if (userProof) createdAt = userProof.created_at;
          }

          if (quantificationUsers) {
            const userQuant = quantificationUsers.find(quant => quant.user_id === userId);
            if (userQuant) createdAt = userQuant.created_at;
          }

          // NUNCA TENTE BUSCAR DE 'users', use apenas o placeholder abaixo!
          // Caso queira o nome, consulte a tabela "profiles" aqui no futuro
          return {
            id: userId,
            phone: `Usuário ${userId.slice(0, 8)}...`, // Placeholder, não existe acesso a users
            created_at: createdAt,
            referral_count: referrals?.length || 0,
            quantification_active: quantification?.is_active || false,
            balance: quantification?.balance || 0,
            investment_plan_id: quantification?.investment_plan_id || null,
            plan: quantification?.plan || null,
            daily_limit: quantification?.daily_limit || 1,
          };
        })
      );

      setUsers(usersWithData);
      console.log("usersWithData retornados:", usersWithData.map(u => u.id));
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error?.message || "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, refetchUsers: fetchUsers };
};
