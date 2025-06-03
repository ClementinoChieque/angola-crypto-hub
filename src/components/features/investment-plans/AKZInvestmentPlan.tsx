
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

const AKZInvestmentPlan: React.FC = () => {
  const investmentData = [
    { level: 'BitcoinL1', investment: '8 000,00 Kz', dailyEarning: '200,00 Kz', monthlyEarnings: '6 000,00 Kz', yearlyEarnings: '73 000,00 Kz' },
    { level: 'BitcoinL2', investment: '12 000,00 Kz', dailyEarning: '300,00 Kz', monthlyEarnings: '9 000,00 Kz', yearlyEarnings: '109 500,00 Kz' },
    { level: 'BitcoinL3', investment: '20 000,00 Kz', dailyEarning: '500,00 Kz', monthlyEarnings: '15 000,00 Kz', yearlyEarnings: '182 500,00 Kz' },
    { level: 'BitcoinL4', investment: '30 000,00 Kz', dailyEarning: '750,00 Kz', monthlyEarnings: '22 500,00 Kz', yearlyEarnings: '273 750,00 Kz' },
    { level: 'BitcoinL5', investment: '50 000,00 Kz', dailyEarning: '1 250,00 Kz', monthlyEarnings: '37 500,00 Kz', yearlyEarnings: '456 250,00 Kz' },
    { level: 'BitcoinL6', investment: '150 000,00 Kz', dailyEarning: '3 750,00 Kz', monthlyEarnings: '112 500,00 Kz', yearlyEarnings: '1 368 750,00 Kz' },
    { level: 'BitcoinL7', investment: '300 000,00 Kz', dailyEarning: '7 500,00 Kz', monthlyEarnings: '225 000,00 Kz', yearlyEarnings: '2 737 500,00 Kz' },
    { level: 'BitcoinL8', investment: '1 000 000,00 Kz', dailyEarning: '25 000,00 Kz', monthlyEarnings: '750 000,00 Kz', yearlyEarnings: '9 125 000,00 Kz' },
  ];

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Plano de investimento em AKZ</h3>
        <p className="text-gray-600">Planos de investimento em Kwanza Angolano com retornos atrativos</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-600 hover:bg-green-600">
              <TableHead className="text-white font-bold">Level</TableHead>
              <TableHead className="text-white font-bold">Investimento</TableHead>
              <TableHead className="text-white font-bold">Ganhos diários</TableHead>
              <TableHead className="text-white font-bold">Ganhos Mensais</TableHead>
              <TableHead className="text-white font-bold">365 Dias</TableHead>
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

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">Informações Importantes:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Investimento mínimo: 8.000,00 Kz</li>
          <li>• Retornos diários em Kwanza</li>
          <li>• Período de investimento: 365 dias</li>
          <li>• Planos adaptados ao mercado angolano</li>
        </ul>
      </div>
    </Card>
  );
};

export default AKZInvestmentPlan;
