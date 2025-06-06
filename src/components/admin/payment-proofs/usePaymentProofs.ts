
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentProof } from './types';

export const usePaymentProofs = () => {
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPaymentProofs = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched payment proofs:', data);
      setProofs(data || []);
    } catch (error) {
      console.error('Error fetching payment proofs:', error);
      toast({
        title: "Erro ao carregar comprovativos",
        description: "Não foi possível carregar os comprovativos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProofStatus = async (proofId: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('payment_proofs')
        .update({
          status,
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', proofId);

      if (error) throw error;

      // Se aprovado, ativar quantificação para o usuário
      if (status === 'verified') {
        const proof = proofs.find(p => p.id === proofId);
        if (proof) {
          await activateUserQuantification(proof.user_id);
        }
      }

      await fetchPaymentProofs();
      toast({
        title: "Status atualizado",
        description: `Comprovativo ${status === 'verified' ? 'verificado' : 'rejeitado'}`
      });

      return true;
    } catch (error) {
      console.error('Error updating proof status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do comprovativo",
        variant: "destructive"
      });
      return false;
    }
  };

  const activateUserQuantification = async (userId: string) => {
    try {
      // Verificar se já existe um registro de quantificação para o usuário
      const { data: existing, error: fetchError } = await supabase
        .from('user_quantifications')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existing) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('user_quantifications')
          .update({
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('user_quantifications')
          .insert({
            user_id: userId,
            is_active: true,
            daily_limit: 1,
            used_today: 0,
            last_reset_date: new Date().toISOString().split('T')[0]
          });

        if (error) throw error;
      }

      toast({
        title: "Quantificação ativada",
        description: "A quantificação foi ativada para o usuário"
      });
    } catch (error) {
      console.error('Error activating user quantification:', error);
      toast({
        title: "Erro ao ativar quantificação",
        description: "Não foi possível ativar a quantificação para o usuário",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPaymentProofs();
  }, []);

  return {
    proofs,
    loading,
    updateProofStatus,
    fetchPaymentProofs
  };
};
