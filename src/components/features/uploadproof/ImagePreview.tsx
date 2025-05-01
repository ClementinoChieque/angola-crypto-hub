
import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  previewUrl: string;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ previewUrl, onRemove }) => {
  return (
    <div className="relative">
      <img 
        src={previewUrl} 
        alt="Preview" 
        className="max-h-64 mx-auto rounded-md" 
      />
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
        type="button"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ImagePreview;
