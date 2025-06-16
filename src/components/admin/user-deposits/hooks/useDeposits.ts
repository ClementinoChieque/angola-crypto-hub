
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DepositRequest } from '../types';

export const useDeposits = () => {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles (username)
        `)
        .eq('type', 'deposit')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setDeposits(data || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar depósitos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDepositStatus = async (depositId: string, status: string) => {
    setUpdating(depositId);
    
    try {
      const { data: updatedData, error: updateError } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', depositId)
        .select();

      if (updateError) {
        throw updateError;
      }

      // Atualizar o estado local imediatamente
      setDeposits(prevDeposits => 
        prevDeposits.map(deposit => 
          deposit.id === depositId 
            ? { ...deposit, status } 
            : deposit
        )
      );

      // Também refetch para garantir que temos os dados mais recentes
      await fetchDeposits();
      
      toast({
        title: "Sucesso",
        description: `Depósito ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`,
      });
    } catch (error) {
      console.error('Error updating deposit:', error);
      toast({
        title: "Erro",
        description: `Erro ao atualizar status do depósito: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  return {
    deposits,
    loading,
    updating,
    updateDepositStatus,
    fetchDeposits
  };
};
