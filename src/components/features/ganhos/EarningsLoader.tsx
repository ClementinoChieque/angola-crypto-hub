
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const EarningsLoader: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
};

export default EarningsLoader;
