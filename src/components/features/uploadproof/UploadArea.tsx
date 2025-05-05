
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadAreaProps {
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isMobile?: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ 
  dragActive,
  handleDrag,
  handleDrop,
  handleChange,
  handleButtonClick,
  fileInputRef,
  isMobile = false,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-3 md:py-6">
        <Upload className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} text-muted-foreground mb-2`} />
        <p className="mb-1 md:mb-2 text-xs md:text-sm text-muted-foreground">
          <span className="font-semibold">Clique para enviar</span> {!isMobile && 'ou arraste e solte'}
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG ou JPEG (máx. 5MB)
        </p>
        <Button
          onClick={handleButtonClick}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="mt-2 md:mt-4"
        >
          <Upload className="mr-2 h-3 w-3 md:h-4 md:w-4" />
          {isMobile ? "Selecionar" : "Selecionar arquivo"}
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
