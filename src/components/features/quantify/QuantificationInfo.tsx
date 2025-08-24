
import React from 'react';

interface QuantificationInfoProps {
  isMobile: boolean;
}

const QuantificationInfo: React.FC<QuantificationInfoProps> = ({ isMobile }) => {
  return (
    <div className="text-[10px] md:text-sm text-muted-foreground text-center mt-2 md:mt-4">
      <p></p>
      {!isMobile && <p></p>}
    </div>
  );
};

export default QuantificationInfo;
