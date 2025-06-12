
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Eye, Zap, Trash2 } from 'lucide-react';
import { PaymentProof } from './types';
import StatusBadge from './StatusBadge';

interface ProofCardProps {
  proof: PaymentProof;
  onStatusUpdate: (proofId: string, status: string, notes?: string) => Promise<boolean>;
  onDelete: (proofId: string) => Promise<boolean>;
  onImageView: (imageUrl: string) => void;
}

const ProofCard: React.FC<ProofCardProps> = ({ proof, onStatusUpdate, onDelete, onImageView }) => {
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const handleStatusUpdate = async (status: string, notes?: string) => {
    const success = await onStatusUpdate(proof.id, status, notes);
    if (success) {
      setSelectedProof(null);
      setAdminNotes('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja eliminar este comprovativo?')) {
      await onDelete(proof.id);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img
            src={proof.image_url}
            alt="Comprovativo"
            className="w-16 h-16 object-cover rounded border cursor-pointer"
            onClick={() => onImageView(proof.image_url)}
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
          <StatusBadge status={proof.status} />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onImageView(proof.image_url)}
            >
              <Eye size={16} className="mr-1" />
              Ver Imagem
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 size={16} className="mr-1" />
              Eliminar
            </Button>
          </div>
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
            onClick={() => handleStatusUpdate('verified')}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            <CheckCircle size={16} className="mr-1" />
            <Zap size={14} className="mr-1" />
            Aprovar + Ativar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleStatusUpdate('rejected')}
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
              onClick={() => handleStatusUpdate('verified', adminNotes)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle size={16} className="mr-1" />
              <Zap size={14} className="mr-1" />
              Aprovar + Ativar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate('rejected', adminNotes)}
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
  );
};

export default ProofCard;
