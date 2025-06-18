
import React from 'react';
import { useEarnings } from './ganhos/useEarnings';
import EarningsLoader from './ganhos/EarningsLoader';
import EarningsList from './ganhos/EarningsList';
import EarningsSummary from './ganhos/EarningsSummary';

const Ganhos: React.FC = () => {
  const { earnings, loading, totalEarnings, totalEarningsToday } = useEarnings();

  if (loading) {
    return <EarningsLoader />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-xl font-semibold">Ganhos</h2>
      
      <EarningsSummary 
        totalEarnings={totalEarnings}
        totalEarningsToday={totalEarningsToday}
      />
      
      <EarningsList earnings={earnings} />
    </div>
  );
};

export default Ganhos;
