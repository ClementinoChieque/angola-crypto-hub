
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { Upload, X } from 'lucide-react';

const UploadProof: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addProofUpload, proofUploads } = useUser();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie apenas imagens (JPG, PNG, etc)",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload de Comprovativo</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-crypto-blue bg-crypto-blue/5' : 'border-muted-foreground/25'
        } transition-colors`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-md" 
            />
            <button 
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Clique para enviar</span> ou arraste e solte
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou JPEG (máx. 5MB)
            </p>
            <Button
              onClick={handleButtonClick}
              variant="outline"
              className="mt-4"
            >
              <Upload className="mr-2 h-4 w-4" />
              Selecionar arquivo
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {previewUrl && (
        <Button 
          onClick={handleSubmit}
          className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
          disabled={isUploading}
        >
          {isUploading ? "Enviando..." : "Enviar Comprovativo"}
        </Button>
      )}

      {/* Previous uploads */}
      {proofUploads.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Comprovativos Enviados</h3>
          <div className="space-y-2">
            {proofUploads.map((upload, index) => (
              <Card key={index} className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded bg-muted overflow-hidden mr-3">
                    <img src={upload.imageUrl} alt="Comprovativo" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Comprovativo #{index + 1}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(upload.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  upload.verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {upload.verified ? 'Verificado' : 'Pendente'}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProof;
