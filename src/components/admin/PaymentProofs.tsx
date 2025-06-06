
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { usePaymentProofs } from './payment-proofs/usePaymentProofs';
import ProofCard from './payment-proofs/ProofCard';
import ImageViewer from './payment-proofs/ImageViewer';

const PaymentProofs: React.FC = () => {
  const { proofs, loading, updateProofStatus } = usePaymentProofs();
  const [viewingImage, setViewingImage] = useState<string | null>(null);

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
              <ProofCard
                key={proof.id}
                proof={proof}
                onStatusUpdate={updateProofStatus}
                onImageView={setViewingImage}
              />
            ))}

            {proofs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum comprovativo encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ImageViewer
        imageUrl={viewingImage}
        onClose={() => setViewingImage(null)}
      />
    </>
  );
};

export default PaymentProofs;
