
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, FileText, Eye, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentProof {
  id: string;
  image_url: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  user_id: string;
}

const PaymentProofs: React.FC = () => {
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentProofs();
  }, []);

  const fetchPaymentProofs = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
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

      setSelectedProof(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating proof status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do comprovativo",
        variant: "destructive"
      });
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock size={14} className="mr-1" />Pendente</Badge>;
      case 'verified':
        return <Badge variant="default"><CheckCircle size={14} className="mr-1" />Verificado</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle size={14} className="mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={24} />
            Comprovativos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando comprovativos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={24} />
            Comprovativos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proofs.map((proof) => (
              <div key={proof.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={proof.image_url}
                      alt="Comprovativo"
                      className="w-16 h-16 object-cover rounded border cursor-pointer"
                      onClick={() => setViewingImage(proof.image_url)}
                    />
                    <div>
                      <div className="text-sm text-gray-500">
                        {new Date(proof.created_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {proof.user_id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(proof.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewingImage(proof.image_url)}
                    >
                      <Eye size={16} className="mr-1" />
                      Ver Imagem
                    </Button>
                  </div>
                </div>

                {proof.admin_notes && (
                  <div className="bg-gray-50 p-2 rounded text-sm mb-3">
                    <strong>Notas do Admin:</strong> {proof.admin_notes}
                  </div>
                )}

                {proof.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => setSelectedProof(proof.id)}
                    >
                      Gerenciar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProofStatus(proof.id, 'verified')}
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      <Zap size={14} className="mr-1" />
                      Verificar + Ativar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateProofStatus(proof.id, 'rejected')}
                    >
                      <XCircle size={16} className="mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}

                {selectedProof === proof.id && (
                  <div className="mt-4 p-4 border-t">
                    <Textarea
                      placeholder="Adicionar notas administrativas..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="mb-3"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateProofStatus(proof.id, 'verified', adminNotes)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        <Zap size={14} className="mr-1" />
                        Verificar + Ativar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateProofStatus(proof.id, 'rejected', adminNotes)}
                      >
                        Rejeitar com Notas
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProof(null);
                          setAdminNotes('');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {proofs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum comprovativo encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para visualizar imagem */}
      {viewingImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={viewingImage}
              alt="Comprovativo ampliado"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentProofs;
