
import React from 'react';
import { Button } from '@/components/ui/button';
import type { DepositType } from '../types';

interface DepositMethodSelectorProps {
  selected: DepositType | null;
  onSelect: (type: DepositType) => void;
}

const DepositMethodSelector: React.FC<DepositMethodSelectorProps> = ({ selected, onSelect }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">Selecione o Método de Depósito</h2>
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={selected === 'USDT' ? 'default' : 'outline'}
          onClick={() => onSelect('USDT')}
          className="w-40"
        >
          USDT (Criptomoeda)
        </Button>
        <Button
          variant={selected === 'AKZ' ? 'default' : 'outline'}
          onClick={() => onSelect('AKZ')}
          className="w-40"
        >
          Kwanza (AKZ)
        </Button>
      </div>
    </>
  );
};

export default DepositMethodSelector;
