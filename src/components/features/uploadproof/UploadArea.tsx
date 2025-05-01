
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadAreaProps {
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploadArea: React.FC<UploadAreaProps> = ({ 
  dragActive,
  handleDrag,
  handleDrop,
  handleChange,
  handleButtonClick,
  fileInputRef,
}) => {
  return (
    <>
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
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />
    </>
  );
};

export default UploadArea;
