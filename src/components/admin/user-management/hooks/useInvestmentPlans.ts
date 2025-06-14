
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type InvestmentPlan = Database['public']['Tables']['investment_plans']['Row'];

export const useInvestmentPlans = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase.from('investment_plans').select('*').order('investment', { ascending: true });
        if (error) throw error;
        setPlans(data || []);
      } catch (error) {
        console.error('Error fetching investment plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return { plans, loading };
};
