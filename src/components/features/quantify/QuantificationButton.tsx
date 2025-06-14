
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuantificationButtonProps {
  onClick: () => void;
  isActive: boolean;
  canQuantify: boolean;
  usedToday: number;
  dailyLimit: number;
  isMobile: boolean;
}

const QuantificationButton: React.FC<QuantificationButtonProps> = ({
  onClick,
  isActive,
  canQuantify,
  usedToday,
  dailyLimit,
  isMobile,
}) => {
  const isDisabled = isActive || !canQuantify || usedToday >= dailyLimit;
  
  const getButtonText = () => {
    if (isActive) return "Processando...";
    if (!canQuantify) return "Bloqueado";
    if (usedToday >= dailyLimit) return "Limite Atingido";
    return "Iniciar Quantificação";
  };

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      size={isMobile ? "sm" : "default"}
      className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
    >
      {getButtonText()}
    </Button>
  );
};

export default QuantificationButton;
