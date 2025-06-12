
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando contas dos usuários...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingState;
