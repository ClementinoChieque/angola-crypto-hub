
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

const AKZInvestmentPlan: React.FC = () => {
  const isMobile = useIsMobile();
  
  const investmentData = [
    { level: 'BitcoinL1', investment: '4 000,00 Kz', dailyEarning: '800,00 Kz', monthlyEarnings: '30 000,00 Kz', yearlyEarnings: '7DIAS= 5.600 kz' },
    { level: 'BitcoinL2', investment: '10 000,00 Kz', dailyEarning: '1200,00 Kz', monthlyEarnings: '46 000,00 Kz', yearlyEarnings: '14DIAS= 20.000 Kz'},
    { level: 'BitcoinL3', investment: '50 000,00 Kz', dailyEarning: '2500,00 Kz', monthlyEarnings: '75 000,00 Kz', yearlyEarnings: '50DIAS=230.000,00 Kz'},
    { level: 'BitcoinL4', investment: '100 000,00 Kz', dailyEarning: '7000,00 Kz', monthlyEarnings: '210 000,00 Kz', yearlyEarnings: '120DIAS= 1200.000,00 Kz'},

  ];

  const MobileCard = ({ row, index }: { row: typeof investmentData[0], index: number }) => (
    <Card key={index} className="p-4 mb-4 border-l-4 border-l-green-600">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600">{row.level}</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
            {row.investment}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 block">Ganho Diário</span>
            <span className="font-medium text-xs">{row.dailyEarning}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Ganho Mensal</span>
            <span className="font-medium text-xs">{row.monthlyEarnings}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <span className="text-gray-500 text-sm block">365 Dias</span>
          <span className="font-bold text-sm text-green-600">{row.yearlyEarnings}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Plano de investimento em AKZ</h3>
        <p className="text-gray-600">Planos de investimento em Kwanza Angolano com retornos atrativos</p>
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
      )}

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">Informações Importantes:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Investimento mínimo: 4.000,00 Kz</li>
          <li>• Retornos diários em Kwanza</li>

          <li>• Saques disponíveis após período mínimo</li>
        </ul>
      </div>
    </Card>
  );
};

export default AKZInvestmentPlan;
