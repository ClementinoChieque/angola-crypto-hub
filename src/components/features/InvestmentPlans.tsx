
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import USDTInvestmentPlan from './investment-plans/USDTInvestmentPlan';
import AKZInvestmentPlan from './investment-plans/AKZInvestmentPlan';

const InvestmentPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState('usdt');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Planos de Investimento</h2>
        <p className="text-gray-600">Escolha entre nossos planos de investimento USDT e AKZ</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="usdt" className="text-sm font-medium">
            USDT Investment Plan
          </TabsTrigger>
          <TabsTrigger value="akz" className="text-sm font-medium">
            Plano AKZ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="usdt" className="mt-6">
          <USDTInvestmentPlan />
        </TabsContent>
        
        <TabsContent value="akz" className="mt-6">
          <AKZInvestmentPlan />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentPlans;
