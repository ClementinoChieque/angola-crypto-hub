
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onRetry: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground mb-4">Nenhum depósito encontrado</p>
        <Button onClick={onRetry} variant="outline">
          🔄 Recarregar
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
