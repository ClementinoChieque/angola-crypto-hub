
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';

export const useQuantification = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [canQuantify, setCanQuantify] = useState(false);
  const [usedToday, setUsedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(1);
  const [dailyEarning, setDailyEarning] = useState(0);
  const [planCurrency, setPlanCurrency] = useState('AKZ');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { balance, updateBalance } = useUser();

  const checkUserQuantificationStatus = useCallback(async () => {
    if (!user?.id) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_quantifications')
        .select('*, investment_plan:investment_plans(daily_earning, currency)')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const today = new Date().toISOString().split('T')[0];
        const lastResetDate = data.last_reset_date;
        
        if (lastResetDate !== today) {
          const { error: updateError } = await supabase
            .from('user_quantifications')
            .update({
              used_today: 0,
              last_reset_date: today,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

          if (updateError) throw updateError;
          
          setUsedToday(0);
        } else {
          setUsedToday(data.used_today);
        }

        setCanQuantify(data.is_active);
        setDailyLimit(data.daily_limit);
        setDailyEarning(data.investment_plan?.daily_earning || 0);
        setPlanCurrency(data.investment_plan?.currency || 'AKZ');
      } else {
        setCanQuantify(false);
      }
    } catch (error) {
      console.error('Error checking quantification status:', error);
      setCanQuantify(false);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const completeQuantification = useCallback(async () => {
    const earningPerQuantification = Number(dailyEarning);
    const newResult = `Ganhos: +${earningPerQuantification.toFixed(2)} ${planCurrency}`;
    setResults(prev => [newResult, ...prev].slice(0, 5));
    
    if (user?.id) {
      const newBalance = balance.amount + earningPerQuantification;
      await updateBalance(newBalance);

      const newUsedToday = usedToday + 1;
      try {
        const { error } = await supabase
          .from('user_quantifications')
          .update({
            used_today: newUsedToday,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
        setUsedToday(newUsedToday);
      } catch (error) {
        console.error('Error updating usage count:', error);
      }
    }
    
    toast({
      title: "Quantificação concluída",
      description: `Você ganhou ${earningPerQuantification.toFixed(2)} ${planCurrency}.`,
    });
  }, [dailyEarning, planCurrency, user, balance, updateBalance, usedToday, toast]);

  useEffect(() => {
    if (user?.id) {
      checkUserQuantificationStatus();
    } else {
        setLoading(false);
    }
  }, [user, checkUserQuantificationStatus]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      completeQuantification();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, completeQuantification]);

  const startQuantify = () => {
    if (!canQuantify) {
      toast({
        title: "Quantificação não disponível",
        description: "Envie um comprovativo de pagamento para ativar a quantificação",
        variant: "destructive"
      });
      return;
    }

    if (usedToday >= dailyLimit) {
      toast({
        title: "Limite diário atingido",
        description: `Você já usou ${usedToday}/${dailyLimit} quantificações hoje`,
        variant: "destructive"
      });
      return;
    }

    setIsActive(true);
    setTimeLeft(12); // 12 seconds
    
    toast({
      title: "Quantificação iniciada",
      description: "O processo levará 12 segundos",
    });
  };

  const remainingUses = Math.max(0, dailyLimit - usedToday);

  return {
    isActive,
    timeLeft,
    results,
    canQuantify,
    usedToday,
    dailyLimit,
    loading,
    startQuantify,
    remainingUses,
  };
};
