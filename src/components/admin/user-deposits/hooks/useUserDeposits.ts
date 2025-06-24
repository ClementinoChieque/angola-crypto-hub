
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserDeposit {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    full_name: string;
  } | null;
}

export const useUserDeposits = () => {
  const [deposits, setDeposits] = useState<UserDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDeposits = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Primeiro, vamos verificar se há dados na tabela user_deposits
      const { data: rawDeposits, error: rawError } = await supabase
        .from('user_deposits')
        .select('*');

      if (rawError) {
        console.error('❌ Erro ao buscar dados brutos:', rawError);
      }

      // Agora vamos fazer a consulta com join
      const { data, error } = await supabase
        .from('user_deposits')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setDeposits(data || []);
    } catch (error: any) {
      setError(error.message || 'Erro desconhecido ao carregar depósitos');
      toast.error('Erro ao carregar depósitos: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const updateDepositStatus = async (depositId: string, newStatus: string) => {
    setUpdating(depositId);
    try {
      const { error } = await supabase
        .from('user_deposits')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', depositId);

      if (error) throw error;

      toast.success(`Status do depósito atualizado para ${newStatus}`);
      fetchDeposits();
    } catch (error: any) {
      toast.error('Erro ao atualizar status do depósito');
    } finally {
      setUpdating(null);
    }
  };

  const deleteDeposit = async (depositId: string) => {
    setDeleting(depositId);
    try {
      const { error } = await supabase
        .from('user_deposits')
        .delete()
        .eq('id', depositId);

      if (error) throw error;

      toast.success('Depósito eliminado com sucesso');
      fetchDeposits();
    } catch (error: any) {
      toast.error('Erro ao eliminar depósito');
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  return {
    deposits,
    loading,
    updating,
    deleting,
    error,
    fetchDeposits,
    updateDepositStatus,
    deleteDeposit
  };
};
