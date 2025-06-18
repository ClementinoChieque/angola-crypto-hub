
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
  const [error, setError] = useState<string | null>(null);

  const fetchDeposits = async () => {
    console.log('🔍 Iniciando busca de depósitos...');
    setLoading(true);
    setError(null);
    
    try {
      // Primeiro, vamos verificar se há dados na tabela user_deposits
      console.log('📊 Verificando dados na tabela user_deposits...');
      const { data: rawDeposits, error: rawError } = await supabase
        .from('user_deposits')
        .select('*');

      console.log('📋 Dados brutos da tabela user_deposits:', rawDeposits);
      console.log('⚠️ Erro na consulta bruta:', rawError);

      if (rawError) {
        console.error('❌ Erro ao buscar dados brutos:', rawError);
      }

      // Agora vamos fazer a consulta com join
      console.log('🔗 Fazendo consulta com join...');
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

      console.log('🎯 Resultado da consulta com join:', { data, error });
      console.log('📊 Número de depósitos retornados:', data?.length || 0);

      if (error) {
        console.error('❌ Erro na consulta Supabase:', error);
        throw error;
      }
      
      console.log('✅ Depósitos carregados com sucesso:', data?.length || 0);
      setDeposits(data || []);
    } catch (error: any) {
      console.error('💥 Erro ao buscar depósitos:', error);
      setError(error.message || 'Erro desconhecido ao carregar depósitos');
      toast.error('Erro ao carregar depósitos: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const updateDepositStatus = async (depositId: string, newStatus: string) => {
    console.log(`🔄 Atualizando status do depósito ${depositId} para ${newStatus}`);
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
      console.error('❌ Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do depósito');
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    console.log('🚀 Componente UserDeposits montado, carregando depósitos...');
    fetchDeposits();
  }, []);

  return {
    deposits,
    loading,
    updating,
    error,
    fetchDeposits,
    updateDepositStatus
  };
};
