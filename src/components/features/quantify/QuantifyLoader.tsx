
import React from 'react';

const QuantifyLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 md:space-y-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p className="text-sm text-muted-foreground">Verificando status...</p>
    </div>
  );
};

export default QuantifyLoader;
