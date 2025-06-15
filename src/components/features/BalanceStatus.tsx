import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import { Circle, ArrowUp, ArrowDown, Award } from 'lucide-react';
import { useEffect } from 'react';
import DepositOptions from './DepositOptions';
import WithdrawalOptions from './WithdrawalOptions';

const BalanceStatus: React.FC = () => {
  const { balance, levelName } = useUser();
  const [exchangeRate, setExchangeRate] = useState(1350); // 1 USDT = 1350,00 AKZ
  const [usdtEquivalent, setUsdtEquivalent] = useState(0);
  const [akzEquivalent, setAkzEquivalent] = useState(0);
  const [isActionOpen, setIsActionOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('deposit');
  
  useEffect(() => {
    // Calcule a conversão bidirecional conforme a moeda atual
    if (balance.currency === 'AKZ') {
      setUsdtEquivalent(balance.amount / exchangeRate); // AKZ → USDT
      setAkzEquivalent(balance.amount); // já está em AKZ
    } else {
      setAkzEquivalent(balance.amount * exchangeRate); // USDT → AKZ
      setUsdtEquivalent(balance.amount); // já está em USDT
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
              <div className="flex items-center gap-2">
                {levelName && (
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    <Award size={12} className="mr-1" />
                    <span>Nível: {levelName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                  <Circle size={8} fill="currentColor" className="mr-1" />
                  <span>Ativo</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{balance.amount.toLocaleString()} {balance.currency}</p>
                <p className="text-sm text-muted-foreground">
                  {balance.currency === 'AKZ'
                    ? <>≈ {usdtEquivalent.toFixed(2)} USDT</>
                    : <>≈ {akzEquivalent.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AKZ</>
                  }
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
              <span>
                Taxa de câmbio: 1 USDT = {exchangeRate.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AKZ
              </span>
              <span>Atualizado em: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas de ação: Depósito, Saque */}
      <div className="flex gap-2 mt-4">
        <button
          className={`flex-1 py-2 rounded font-semibold transition-all ${activeTab === 'deposit' ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}
          onClick={() => setActiveTab('deposit')}
        >
          Depositar
        </button>
        <button
          className={`flex-1 py-2 rounded font-semibold transition-all ${activeTab === 'withdraw' ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:bg-blue-50"}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Sacar
        </button>
      </div>

      {/* Conteúdo de cada aba */}
      <Card className="mt-4 border-t-4 border-crypto-blue">
        <CardContent className="p-4">
          {activeTab === 'deposit' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Depositar</h3>
              </div>
              <DepositOptions />
            </>
          )}
          {activeTab === 'withdraw' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Sacar</h3>
              </div>
              <WithdrawalOptions />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceStatus;
