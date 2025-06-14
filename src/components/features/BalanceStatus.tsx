
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import { Circle, ArrowUp, ArrowDown } from 'lucide-react';
import { useEffect } from 'react';
import DepositOptions from './DepositOptions';
import WithdrawalOptions from './WithdrawalOptions';

const BalanceStatus: React.FC = () => {
  const { balance } = useUser();
  const [exchangeRate, setExchangeRate] = useState(800); // 1 USDT = 800 AKZ (example rate)
  const [usdtEquivalent, setUsdtEquivalent] = useState(0);
  const [isActionOpen, setIsActionOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('deposit');
  
  useEffect(() => {
    // Calculate USDT equivalent
    if (balance.currency === 'AKZ') {
      setUsdtEquivalent(balance.amount / exchangeRate);
    } else {
      // If balance is already in USDT, just set it directly
      setUsdtEquivalent(balance.amount);
    }
  }, [balance, exchangeRate]);

  const toggleActionPanel = () => {
    setIsActionOpen(!isActionOpen);
  };

  const handleActionClick = (action: 'deposit' | 'withdraw') => {
    setActiveTab(action);
    setIsActionOpen(true);
  };

  return (
    <div className="w-full mb-6">
      <Card className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-crypto-blue">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Saldo Atual</h3>
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                <Circle size={8} fill="currentColor" className="mr-1" />
                <span>Ativo</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{balance.amount.toLocaleString()} {balance.currency}</p>
                <p className="text-sm text-muted-foreground">
                  ≈ {usdtEquivalent.toFixed(2)} {balance.currency === 'AKZ' ? 'USDT' : 'AKZ'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <div 
                  className="flex flex-col items-center bg-muted/50 p-1 rounded cursor-pointer hover:bg-muted"
                  onClick={() => handleActionClick('deposit')}
                >
                  <ArrowUp className="text-green-600" size={16} />
                  <span className="text-xs">Depositar</span>
                </div>
                <div 
                  className="flex flex-col items-center bg-muted/50 p-1 rounded cursor-pointer hover:bg-muted"
                  onClick={() => handleActionClick('withdraw')}
                >
                  <ArrowDown className="text-blue-600" size={16} />
                  <span className="text-xs">Sacar</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-3 pt-2 border-t border-gray-100">
              <span>Taxa de câmbio: 1 USDT = {exchangeRate} AKZ</span>
              <span>Atualizado em: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {isActionOpen && (
        <Card className="mt-4 border-t-4 border-crypto-blue">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {activeTab === 'deposit' ? 'Depositar' : 'Sacar'}
              </h3>
              <button 
                onClick={toggleActionPanel}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {activeTab === 'deposit' && <DepositOptions />}
            {activeTab === 'withdraw' && <WithdrawalOptions />}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BalanceStatus;
