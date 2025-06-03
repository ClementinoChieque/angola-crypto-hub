
import React from 'react';
import { Users } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Você ainda não convidou ninguém</p>
      <p className="text-sm text-muted-foreground mt-1">
        Use a aba "Convidar" para enviar convites
      </p>
    </div>
  );
};

export default EmptyState;
