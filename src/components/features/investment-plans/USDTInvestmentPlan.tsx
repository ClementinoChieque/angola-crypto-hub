
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
import { useIsMobile } from '@/hooks/use-mobile';

const USDTInvestmentPlan: React.FC = () => {
  const isMobile = useIsMobile();
  
  const investmentData = [
    { level: 'BitcoinL1', investment: '10', dailyEarning: '1', monthlyEarnings: '30,00', yearlyEarnings: '7DIAS= 15$' },
    { level: 'BitcoinL2', investment: '20', dailyEarning: '2', monthlyEarnings: '60,00', yearlyEarnings: '15DIAS=30$' },
    { level: 'BitcoinL3', investment: '30', dailyEarning: '3', monthlyEarnings: '90,00', yearlyEarnings: '50DIAS=150$' },
    { level: 'BitcoinL4', investment: '40', dailyEarning: '4', monthlyEarnings: '120,00', yearlyEarnings: '80DIAS=400$' },
    { level: 'BitcoinL5', investment: '50', dailyEarning: '5', monthlyEarnings: '150,00', yearlyEarnings: '90DIAS=600$' },
    { level: 'BitcoinL6', investment: '100', dailyEarning: '6', monthlyEarnings: '200,00', yearlyEarnings: '120DIAS=900$' },
  ];

  const MobileCard = ({ row, index }: { row: typeof investmentData[0], index: number }) => (
    <Card key={index} className="p-4 mb-4 border-l-4 border-l-green-600">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600">{row.level}</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
            {row.investment} USDT
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 block">Ganho Diário</span>
            <span className="font-medium">{row.dailyEarning}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Ganho Mensal</span>
            <span className="font-medium">{row.monthlyEarnings}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <span className="text-gray-500 text-sm block">Dias</span>
          <span className="font-bold text-lg text-green-600">{row.yearlyEarnings}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">USDT Investment Plan</h3>
        <p className="text-gray-600">Planos de investimento em USDT com retornos garantidos</p>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {investmentData.map((row, index) => (
            <MobileCard key={index} row={row} index={index} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-600 hover:bg-green-600">
                <TableHead className="text-white font-bold">Level</TableHead>
                <TableHead className="text-white font-bold">Investment in usdt</TableHead>
                <TableHead className="text-white font-bold">Daily Earning</TableHead>
                <TableHead className="text-white font-bold">Monthly earnings</TableHead>
                <TableHead className="text-white font-bold">Days</TableHead>
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
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Informações Importantes:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Investimento mínimo: 10 USDT</li>
          <li>• Retornos diários garantidos</li>
          <li>• Saques disponíveis após período mínimo</li>
        </ul>
      </div>
    </Card>
  );
};

export default USDTInvestmentPlan;
