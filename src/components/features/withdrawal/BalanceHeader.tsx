
import React from 'react';

type BalanceHeaderProps = {
  amount: number;
  currency: string;
};

const BalanceHeader: React.FC<BalanceHeaderProps> = ({ amount, currency }) => (
  <div className="bg-muted p-4 rounded-md text-center mb-4">
    <p className="text-sm">Saldo Disponível</p>
    <p className="font-bold text-xl">{amount.toLocaleString()} {currency}</p>
  </div>
);

export default BalanceHeader;
