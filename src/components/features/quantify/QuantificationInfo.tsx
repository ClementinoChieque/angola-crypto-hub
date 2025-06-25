
import React from 'react';

interface QuantificationInfoProps {
  isMobile: boolean;
}

const QuantificationInfo: React.FC<QuantificationInfoProps> = ({ isMobile }) => {
  return (
    <div className="text-[10px] md:text-sm text-muted-foreground text-center mt-2 md:mt-4">
      <p>A quantificação é um processo que analisa o mercado em tempo real.</p>
      {!isMobile && <p> A quantificação torna as decisões de investimento mais precisas e automáticas.</p>}
    </div>
  );
};

export default QuantificationInfo;
