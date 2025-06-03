
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">Meus Convidados</h2>
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-blue mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Carregando convites...</p>
      </div>
    </div>
  );
};

export default LoadingState;
