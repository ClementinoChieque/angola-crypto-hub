
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const EmptyState: React.FC = () => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-500">Nenhum depósito encontrado</p>
      </CardContent>
    </Card>
  );
};
