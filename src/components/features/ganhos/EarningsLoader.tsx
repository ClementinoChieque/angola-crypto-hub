
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const EarningsLoader: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      
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
