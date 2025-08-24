
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuantification } from './quantify/useQuantification';
import QuantifyLoader from './quantify/QuantifyLoader';
import QuantifyBlocked from './quantify/QuantifyBlocked';
import QuantificationDial from './quantify/QuantificationDial';
import QuantificationButton from './quantify/QuantificationButton';
import QuantificationResults from './quantify/QuantificationResults';
import QuantificationInfo from './quantify/QuantificationInfo';

const Quantify: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    loading,
    canQuantify,
    isActive,
    timeLeft,
    remainingUses,
    dailyLimit,
    usedToday,
    results,
    startQuantify,
  } = useQuantification();

  if (loading) {
    return <QuantifyLoader />;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 md:space-y-8">
      <h2 className="text-lg md:text-xl font-semibold"></h2>
      
      {!canQuantify && <QuantifyBlocked />}

      <QuantificationDial
        isActive={isActive}
        timeLeft={timeLeft}
        canQuantify={canQuantify}
        isMobile={isMobile}
        remainingUses={remainingUses}
        dailyLimit={dailyLimit}
      />
      
      <QuantificationButton
        onClick={startQuantify}
        isActive={isActive}
        canQuantify={canQuantify}
        usedToday={usedToday}
        dailyLimit={dailyLimit}
        isMobile={isMobile}
      />
      
      <QuantificationResults results={results} />
      
      <QuantificationInfo isMobile={isMobile} />
    </div>
  );
};

export default Quantify;
