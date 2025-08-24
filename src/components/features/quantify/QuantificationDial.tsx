
import React from 'react';
import { Lock } from 'lucide-react';

interface QuantificationDialProps {
  isActive: boolean;
  timeLeft: number;
  canQuantify: boolean;
  isMobile: boolean;
  remainingUses: number;
  dailyLimit: number;
}

const QuantificationDial: React.FC<QuantificationDialProps> = ({
  isActive,
  timeLeft,
  canQuantify,
  isMobile,
  remainingUses,
  dailyLimit,
}) => {
  return (
    <div className="text-center space-y-2">
      <div className="relative">
        {isActive ? (
          <div className="relative inline-block">
            <div className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} rounded-full border-4 border-t-green-600 border-r-amber-700 border-b-green-600 border-l-amber-700 animate-spin`}></div>
          </div>
        ) : (
          <div className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} rounded-full border-2 ${canQuantify ? 'border-dashed border-green-600' : 'border-solid border-gray-300 bg-gray-100'} flex items-center justify-center`}>
            {canQuantify ? (
              <span className="text-xs md:text-sm font-medium">Iniciar</span>
            ) : (
              <Lock className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
            )}
          </div>
        )}
        
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-800 font-bold">{timeLeft}s</span>
          </div>
        )}
      </div>

      {canQuantify && (
        <div className="text-xs md:text-sm text-muted-foreground">
          <p>Usos restantes hoje: <span className="font-medium text-green-600">{remainingUses}/{dailyLimit}</span></p>
        </div>
      )}
    </div>
  );
};

export default QuantificationDial;
