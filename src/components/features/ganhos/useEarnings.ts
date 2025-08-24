
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Earning {
  id: string;
  amount: number;
  currency: string;
  created_at: string;
  description: string;
}

export const useEarnings = () => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalEarningsToday, setTotalEarningsToday] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEarnings = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('quantification_earnings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEarnings(data || []);
      
      // Calcular total geral
      const total = (data || []).reduce((sum, earning) => sum + Number(earning.amount), 0);
      setTotalEarnings(total);
      
      // Calcular total de hoje
      const today = new Date().toISOString().split('T')[0];
      const todayEarnings = (data || []).filter(earning => 
        earning.created_at.split('T')[0] === today
      );
      const todayTotal = todayEarnings.reduce((sum, earning) => sum + Number(earning.amount), 0);
      setTotalEarningsToday(todayTotal);
      
    } catch (error) {
      toast({
        title: "Erro ao carregar ganhos",
        description: "Não foi possível carregar seus ganhos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [user?.id]);

  return {
    earnings,
    loading,
    totalEarnings,
    totalEarningsToday,
    refetch: fetchEarnings
  };
};
