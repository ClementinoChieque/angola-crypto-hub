
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
};

export default QuantificationButton;
