
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFileUpload } from './useFileUpload';
import ImagePreview from './ImagePreview';
import UploadArea from './UploadArea';
import ProofUploadList from './ProofUploadList';

const UploadProofContainer: React.FC = () => {
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
  const { addProofUpload, proofUploads } = useUser();
  const isMobile = useIsMobile();

  const handleSubmit = () => {
    if (!previewUrl) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione uma imagem para enviar",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      addProofUpload(previewUrl);
      
      toast({
        title: "Comprovativo enviado",
        description: "Seu comprovativo de pagamento foi enviado com sucesso",
      });
      
      setPreviewUrl(null);
      setIsUploading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
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
          className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
          disabled={isUploading}
          size={isMobile ? "sm" : "default"}
        >
          {isUploading ? "Enviando..." : "Enviar Comprovativo"}
        </Button>
      )}

      <ProofUploadList proofUploads={proofUploads} />
    </div>
  );
};

export default UploadProofContainer;
