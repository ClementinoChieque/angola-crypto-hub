
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChartLine } from 'lucide-react';

interface LoadingStateProps {
  isMobile: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isMobile }) => {
  return (
    <Card className="p-2 md:p-4 h-[220px] md:h-[250px] flex items-center justify-center">
      <div className="animate-pulse text-center">
        <ChartLine size={isMobile ? 20 : 24} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground text-xs md:text-sm">Carregando dados históricos...</p>
      </div>
    </Card>
  );
};

export default LoadingState;
