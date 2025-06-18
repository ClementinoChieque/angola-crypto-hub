
import React from 'react';
import { useEarnings } from './ganhos/useEarnings';
import EarningsLoader from './ganhos/EarningsLoader';
import EarningsList from './ganhos/EarningsList';

const Ganhos: React.FC = () => {
  const { earnings, loading } = useEarnings();

  if (loading) {
    return <EarningsLoader />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-xl font-semibold">Ganhos</h2>
      
      <EarningsList earnings={earnings} />
    </div>
  );
};

export default Ganhos;
