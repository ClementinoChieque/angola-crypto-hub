
import { useState } from 'react';
import { toast } from 'sonner';

interface UseDepositFormProps {
  onSuccess: () => void;
}

export const useDepositForm = ({ onSuccess }: UseDepositFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    setLoading(true);

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Depósito registrado com sucesso! Aguarde a aprovação do administrador.');
      setAmount('');
      setDescription('');
      onSuccess();
    } catch (error) {
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
