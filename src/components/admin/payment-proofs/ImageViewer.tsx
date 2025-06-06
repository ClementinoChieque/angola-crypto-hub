
import React from 'react';

interface ImageViewerProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="max-w-4xl max-h-full">
        <img
          src={imageUrl}
          alt="Comprovativo ampliado"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ImageViewer;
