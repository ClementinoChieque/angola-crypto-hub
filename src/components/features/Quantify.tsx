
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Lock } from 'lucide-react';

const Quantify: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [canQuantify, setCanQuantify] = useState(false);
  const [usedToday, setUsedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user?.id) {
      checkUserQuantificationStatus();
    }
  }, [user]);

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
  }, [isActive, timeLeft]);

  const checkUserQuantificationStatus = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_quantifications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const today = new Date().toISOString().split('T')[0];
        const lastResetDate = data.last_reset_date;
        
        // Reset if it's a new day
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
      } else {
        setCanQuantify(false);
      }
    } catch (error) {
      console.error('Error checking quantification status:', error);
      setCanQuantify(false);
    } finally {
      setLoading(false);
    }
  };

  const completeQuantification = async () => {
    const randomValue = (Math.random() * 100).toFixed(2);
    const newResult = `Quantificação: ${randomValue}%`;
    setResults(prev => [newResult, ...prev].slice(0, 5));
    
    // Update usage count
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_quantifications')
          .update({
            used_today: usedToday + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
        setUsedToday(prev => prev + 1);
      } catch (error) {
        console.error('Error updating usage count:', error);
      }
    }
    
    toast({
      title: "Quantificação concluída",
      description: `Resultado: ${randomValue}%`,
    });
  };

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 md:space-y-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-blue"></div>
        <p className="text-sm text-muted-foreground">Verificando status...</p>
      </div>
    );
  }

  const remainingUses = Math.max(0, dailyLimit - usedToday);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 md:space-y-8">
      <h2 className="text-lg md:text-xl font-semibold">Quantificar</h2>
      
      {!canQuantify && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <h3 className="font-medium text-orange-800 mb-1">Quantificação Bloqueada</h3>
          <p className="text-sm text-orange-700">
            Para ativar a quantificação, envie um comprovativo de pagamento na seção "Upload de Comprovativo"
          </p>
        </div>
      )}

      <div className="text-center space-y-2">
        <div className="relative">
          {isActive ? (
            <div className="spinner-circle scale-75 md:scale-100"></div>
          ) : (
            <div className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} rounded-full border-2 ${canQuantify ? 'border-dashed border-crypto-blue' : 'border-solid border-gray-300 bg-gray-100'} flex items-center justify-center`}>
              {canQuantify ? (
                <span className="text-xs md:text-sm font-medium">Iniciar</span>
              ) : (
                <Lock className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
              )}
            </div>
          )}
          
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold">{timeLeft}s</span>
            </div>
          )}
        </div>

        {canQuantify && (
          <div className="text-xs md:text-sm text-muted-foreground">
            <p>Usos restantes hoje: <span className="font-medium text-crypto-blue">{remainingUses}/{dailyLimit}</span></p>
          </div>
        )}
      </div>
      
      <Button
        onClick={startQuantify}
        disabled={isActive || !canQuantify || usedToday >= dailyLimit}
        size={isMobile ? "sm" : "default"}
        className="bg-crypto-blue hover:bg-crypto-light-blue disabled:opacity-50"
      >
        {isActive ? "Processando..." : !canQuantify ? "Bloqueado" : usedToday >= dailyLimit ? "Limite Atingido" : "Iniciar Quantificação"}
      </Button>
      
      {results.length > 0 && (
        <div className="w-full mt-3 md:mt-6">
          <h3 className="text-xs md:text-sm font-medium mb-1 md:mb-2">Últimas Quantificações</h3>
          <div className="bg-muted rounded-md p-2 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {results.map((result, index) => (
                <li key={index} className="text-xs md:text-sm">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="text-[10px] md:text-sm text-muted-foreground text-center mt-2 md:mt-4">
        <p>A quantificação é um processo que analisa o mercado em tempo real.</p>
        {!isMobile && <p>Use os resultados para tomar decisões de investimento mais precisas.</p>}
      </div>
    </div>
  );
};

export default Quantify;
