
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface UseDepositFormProps {
  onSuccess: () => void;
  selectedCurrency?: string;
}

export const useDepositForm = ({ onSuccess, selectedCurrency = 'USDT' }: UseDepositFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_deposits')
        .insert([
          {
            user_id: user.id,
            amount: parseFloat(amount),
            currency: selectedCurrency,
            description: description || null,
            status: 'pending'
          }
        ]);

      if (error) {
        throw error;
      }
      
      toast.success('Depósito registrado com sucesso! Aguarde a aprovação do administrador.');
      setAmount('');
      setDescription('');
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao registrar depósito:', error);
      toast.error('Erro ao registrar depósito. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    amount,
    setAmount,
    description,
    setDescription,
    loading,
    handleSubmit,
  };
};
