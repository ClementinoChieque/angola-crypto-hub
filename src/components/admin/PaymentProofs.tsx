
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, FileText, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentProof {
  id: string;
  image_url: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  user_id: string;
}

const PaymentProofs: React.FC = () => {
  const [proofs, setProofs] = useState<PaymentProof[]>([
    {
      id: '1',
      image_url: 'https://via.placeholder.com/150',
      status: 'pending',
      admin_notes: '',
      created_at: new Date().toISOString(),
      user_id: 'user123'
    }
  ]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const { toast } = useToast();

  const updateProofStatus = async (proofId: string, status: string, notes?: string) => {
    try {
      setProofs(prev => prev.map(proof => 
        proof.id === proofId 
          ? { ...proof, status, admin_notes: notes }
          : proof
      ));

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
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Verificar
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
                      >
                        Verificar com Notas
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
