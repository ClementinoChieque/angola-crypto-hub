
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const USDTInvestmentPlan: React.FC = () => {
  const investmentData = [
    { level: 'BitcoinL1', investment: '10', dailyEarning: '0,20', monthlyEarnings: '6,00', yearlyEarnings: '73,00' },
    { level: 'BitcoinL2', investment: '20', dailyEarning: '0,8', monthlyEarnings: '18', yearlyEarnings: '292' },
    { level: 'BitcoinL3', investment: '30', dailyEarning: '1,2', monthlyEarnings: '27', yearlyEarnings: '438' },
    { level: 'BitcoinL4', investment: '40', dailyEarning: '1,6', monthlyEarnings: '36', yearlyEarnings: '584' },
    { level: 'BitcoinL5', investment: '50', dailyEarning: '2', monthlyEarnings: '45', yearlyEarnings: '730' },
    { level: 'BitcoinL6', investment: '100', dailyEarning: '4', monthlyEarnings: '90', yearlyEarnings: '1460' },
  ];

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">USDT Investment Plan</h3>
        <p className="text-gray-600">Planos de investimento em USDT com retornos garantidos</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-600 hover:bg-green-600">
              <TableHead className="text-white font-bold">Level</TableHead>
              <TableHead className="text-white font-bold">Investment in usdt</TableHead>
              <TableHead className="text-white font-bold">Daily Earning</TableHead>
              <TableHead className="text-white font-bold">Monthly earnings</TableHead>
              <TableHead className="text-white font-bold">365 days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investmentData.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.level}</TableCell>
                <TableCell className="text-center">{row.investment}</TableCell>
                <TableCell className="text-center">{row.dailyEarning}</TableCell>
                <TableCell className="text-center">{row.monthlyEarnings}</TableCell>
                <TableCell className="text-center">{row.yearlyEarnings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Informações Importantes:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Investimento mínimo: 10 USDT</li>
          <li>• Retornos diários garantidos</li>
          <li>• Período de investimento: 365 dias</li>
          <li>• Saques disponíveis após período mínimo</li>
        </ul>
      </div>
    </Card>
  );
};

export default USDTInvestmentPlan;
