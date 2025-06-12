
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserWithReferrals } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithReferrals[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Get unique users from referrals table and payment_proofs table
      const { data: referralUsers, error: referralError } = await supabase
        .from('referrals')
        .select('referrer_id, created_at')
        .order('created_at', { ascending: false });

      const { data: proofUsers, error: proofError } = await supabase
        .from('payment_proofs')
        .select('user_id, created_at')
        .order('created_at', { ascending: false });

      if (referralError && referralError.code !== 'PGRST116') {
        console.error('Error fetching referral users:', referralError);
      }

      if (proofError && proofError.code !== 'PGRST116') {
        console.error('Error fetching proof users:', proofError);
      }

      // Combine and deduplicate user IDs
      const allUserIds = new Set<string>();
      
      if (referralUsers) {
        referralUsers.forEach(ref => allUserIds.add(ref.referrer_id));
      }
      
      if (proofUsers) {
        proofUsers.forEach(proof => allUserIds.add(proof.user_id));
      }

      // Get user data for each unique user ID
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
            .select('is_active')
            .eq('user_id', userId)
            .single();

          // Get user creation date from the first referral or payment proof
          let createdAt = new Date().toISOString();
          if (referralUsers) {
            const userReferral = referralUsers.find(ref => ref.referrer_id === userId);
            if (userReferral) createdAt = userReferral.created_at;
          }
          if (proofUsers) {
            const userProof = proofUsers.find(proof => proof.user_id === userId);
            if (userProof) createdAt = userProof.created_at;
          }

          return {
            id: userId,
            phone: `Usuário ${userId.slice(0, 8)}...`, // Placeholder since we can't access auth.users
            created_at: createdAt,
            referral_count: referrals?.length || 0,
            quantification_active: quantification?.is_active || false
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários",
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
