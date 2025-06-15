
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useFileUpload } from './useFileUpload';
import ImagePreview from './ImagePreview';
import UploadArea from './UploadArea';
import ProofUploadList from './ProofUploadList';

// ADDED: Props interface
interface UploadProofContainerProps {
  onUpload?: (url: string) => void;
}

interface ProofUpload {
  imageUrl: string;
  timestamp: Date;
  verified: boolean;
}

// CHANGED: Accept props
const UploadProofContainer: React.FC<UploadProofContainerProps> = ({ onUpload }) => {
  const {
    dragActive,
    previewUrl,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleChange,
    handleButtonClick,
    handleRemove,
    setPreviewUrl,
  } = useFileUpload();
  
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [proofUploads, setProofUploads] = useState<ProofUpload[]>([]);
  const isMobile = useIsMobile();

  // Load user's payment proofs from database
  useEffect(() => {
    if (user?.id) {
      loadPaymentProofs();
    }
  }, [user]);

  const loadPaymentProofs = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const proofs: ProofUpload[] = data.map(proof => ({
        imageUrl: proof.image_url,
        timestamp: new Date(proof.created_at),
        verified: proof.status === 'verified'
      }));

      setProofUploads(proofs);
    } catch (error) {
      console.error('Error loading payment proofs:', error);
    }
  };

  const handleSubmit = async () => {
    if (!previewUrl) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione uma imagem para enviar",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Usuário não autenticado",
        description: "Por favor, faça login para enviar comprovativos",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const { error } = await supabase
        .from('payment_proofs')
        .insert({
          user_id: user.id,
          image_url: previewUrl,
          status: 'pending'
        });

      if (error) throw error;

      // Add to local state
      const newProof: ProofUpload = {
        imageUrl: previewUrl,
        timestamp: new Date(),
        verified: false
      };
      setProofUploads(prev => [newProof, ...prev]);
      
      toast({
        title: "Comprovativo enviado",
        description: "Seu comprovativo de pagamento foi enviado com sucesso e está sendo analisado",
      });

      // ADDED: Call onUpload!
      if (onUpload) {
        onUpload(previewUrl);
      }
      
      setPreviewUrl(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o comprovativo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">Upload de Comprovativo</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-3 md:p-6 text-center ${
          dragActive ? 'border-crypto-blue bg-crypto-blue/5' : 'border-muted-foreground/25'
        } transition-colors`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <ImagePreview 
            previewUrl={previewUrl} 
            onRemove={handleRemove} 
          />
        ) : (
          <UploadArea
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleChange={handleChange}
            handleButtonClick={handleButtonClick}
            fileInputRef={fileInputRef}
            isMobile={isMobile}
          />
        )}
      </div>

      {previewUrl && (
        <Button 
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isUploading}
          size={isMobile ? "sm" : "default"}
        >
          {isUploading ? "Enviando..." : "Enviar Comprovativo"}
        </Button>
      )}

      <div className="bg-blue-50 p-3 rounded-lg text-sm">
        <p className="text-blue-800 font-medium mb-1">Importante:</p>
        <p className="text-blue-700">
          Após o envio e aprovação do seu comprovativo pelo admin, a função "Quantificar" será ativada automaticamente na sua conta.
        </p>
      </div>

      <ProofUploadList proofUploads={proofUploads} />
    </div>
  );
};

export default UploadProofContainer;

