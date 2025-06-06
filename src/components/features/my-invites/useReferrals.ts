
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Referral } from './types';

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReferrals = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching referrals for user:', user.id);
      
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching referrals:', error);
        throw error;
      }

      console.log('Fetched referrals:', data);
      // Type assertion to ensure compatibility with our Referral interface
      setReferrals((data as Referral[]) || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Erro ao carregar convites",
        description: "Não foi possível carregar seus convites. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [user]);

  return { referrals, loading, fetchReferrals };
};
