
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CRYPTO_COLORS } from './types';
import { getCryptoDisplayName } from './utils';

interface CryptoToggleGroupProps {
  selectedCryptos: string[];
  setSelectedCryptos: (cryptos: string[]) => void;
}

const CryptoToggleGroup: React.FC<CryptoToggleGroupProps> = ({ 
  selectedCryptos, 
  setSelectedCryptos 
}) => {
  return (
    <div className="mb-3 md:mb-4 overflow-x-auto">
      <ToggleGroup 
        type="multiple" 
        className="flex flex-wrap gap-1" 
        value={selectedCryptos} 
        onValueChange={(value) => {
          if (value.length) setSelectedCryptos(value);
        }}
      >
        {Object.entries(CRYPTO_COLORS).map(([cryptoId, color]) => (
          <ToggleGroupItem 
            key={cryptoId}
            value={cryptoId}
            className="text-xs h-6 md:h-7 px-2 py-1"
            style={{ 
              borderColor: color, 
              color: selectedCryptos.includes(cryptoId) ? 'white' : color, 
              backgroundColor: selectedCryptos.includes(cryptoId) ? color : 'transparent' 
            }}
          >
            {getCryptoDisplayName(cryptoId)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default CryptoToggleGroup;
