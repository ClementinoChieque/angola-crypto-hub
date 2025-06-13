
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { PaymentProof } from './types';

export const usePaymentProofs = () => {
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProofs = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment proofs:', error);
        throw error;
      }

      setProofs(data || []);
    } catch (error) {
      console.error('Error loading payment proofs:', error);
      toast({
        title: "Erro ao carregar comprovativos",
        description: "Não foi possível carregar os comprovativos de pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProofStatus = async (proofId: string, status: 'verified' | 'rejected', adminNotes?: string): Promise<boolean> => {
    try {
      console.log('Updating proof status:', { proofId, status, adminNotes });
      
      const { error } = await supabase
        .from('payment_proofs')
        .update({ 
          status, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', proofId);

      if (error) {
        console.error('Error updating proof status:', error);
        throw error;
      }

      // Update local state
      setProofs(prev => prev.map(proof => 
        proof.id === proofId 
          ? { ...proof, status, admin_notes: adminNotes, updated_at: new Date().toISOString() }
          : proof
      ));

      toast({
        title: status === 'verified' ? "Comprovativo aprovado" : "Comprovativo rejeitado",
        description: `O comprovativo foi ${status === 'verified' ? 'aprovado' : 'rejeitado'} com sucesso`,
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

  const deleteProof = async (proofId: string): Promise<boolean> => {
    try {
      console.log('Attempting to delete payment proof:', proofId);
      
      const { error } = await supabase
        .from('payment_proofs')
        .delete()
        .eq('id', proofId);

      if (error) {
        console.error('Error deleting payment proof:', error);
        throw error;
      }

      // Update local state
      setProofs(prev => prev.filter(proof => proof.id !== proofId));
      
      console.log('Payment proof deleted successfully');
      toast({
        title: "Comprovativo eliminado",
        description: "O comprovativo foi eliminado com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Error deleting payment proof:', error);
      toast({
        title: "Erro ao eliminar comprovativo",
        description: "Não foi possível eliminar o comprovativo",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  return {
    proofs,
    loading,
    updateProofStatus,
    deleteProof,
    refetch: fetchProofs
  };
};
