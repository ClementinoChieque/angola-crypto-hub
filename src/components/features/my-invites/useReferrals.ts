
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Referral } from './types';

export const useReferrals = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      
      const { data: referralsData, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Garantir que o status seja do tipo correto
      const formattedReferrals: Referral[] = referralsData?.map(referral => ({
        ...referral,
        status: referral.status as 'pending' | 'completed' | 'expired'
      })) || [];

      setReferrals(formattedReferrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Erro ao carregar convites",
        description: "Não foi possível carregar a lista de convites",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchReferrals();
    }
  }, [user]);

  return {
    referrals,
    loading,
    fetchReferrals
  };
};
