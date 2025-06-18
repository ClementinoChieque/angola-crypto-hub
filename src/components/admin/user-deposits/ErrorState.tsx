
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar depósitos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onRetry} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
