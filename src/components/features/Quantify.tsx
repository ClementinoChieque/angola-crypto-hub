
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Quantify: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      // Generate random result
      const randomValue = (Math.random() * 100).toFixed(2);
      const newResult = `Quantificação: ${randomValue}%`;
      setResults(prev => [newResult, ...prev].slice(0, 5));
      
      toast({
        title: "Quantificação concluída",
        description: `Resultado: ${randomValue}%`,
      });
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, toast]);

  const startQuantify = () => {
    setIsActive(true);
    setTimeLeft(12); // 12 seconds
    
    toast({
      title: "Quantificação iniciada",
      description: "O processo levará 12 segundos",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="text-xl font-semibold">Quantificar</h2>
      
      <div className="relative">
        {isActive ? (
          <div className="spinner-circle"></div>
        ) : (
          <div className="h-16 w-16 rounded-full border-2 border-dashed border-crypto-blue flex items-center justify-center">
            <span className="text-sm font-medium">Iniciar</span>
          </div>
        )}
        
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold">{timeLeft}s</span>
          </div>
        )}
      </div>
      
      <Button
        onClick={startQuantify}
        disabled={isActive}
        className="bg-crypto-blue hover:bg-crypto-light-blue"
      >
        {isActive ? "Processando..." : "Iniciar Quantificação"}
      </Button>
      
      {results.length > 0 && (
        <div className="w-full mt-6">
          <h3 className="text-sm font-medium mb-2">Últimas Quantificações</h3>
          <div className="bg-muted rounded-md p-4">
            <ul className="space-y-2">
              {results.map((result, index) => (
                <li key={index} className="text-sm">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground text-center mt-4">
        <p>A quantificação é um processo que analisa o mercado em tempo real.</p>
        <p>Use os resultados para tomar decisões de investimento mais precisas.</p>
      </div>
    </div>
  );
};

export default Quantify;
