
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="animate-spin mr-2" size={20} />
      Carregando depósitos...
    </div>
  );
};
