
import React from 'react';
import { format } from 'date-fns';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { CRYPTO_COLORS } from './types';

interface BarChartProps {
  processedData: any[];
  selectedCryptos: string[];
  isMobile: boolean;
}

const BarChartComponent: React.FC<BarChartProps> = ({ 
  processedData, 
  selectedCryptos, 
  isMobile 
}) => {
  return (
    <RechartsBarChart
      data={processedData}
      margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 25 } : { top: 10, right: 30, left: 5, bottom: 40 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
      <XAxis
        dataKey="date"
        tickFormatter={(value) => format(new Date(value), isMobile ? 'd/M' : 'dd/MM')}
        stroke="var(--foreground)"
        fontSize={isMobile ? 10 : 12}
        tick={{ fontSize: isMobile ? 10 : 12 }}
        tickCount={isMobile ? 4 : 5}
        height={isMobile ? 25 : 35}
      />
      <YAxis
        yAxisId="price"
        orientation="left"
        stroke="var(--foreground)"
        fontSize={isMobile ? 9 : 11}
        tickCount={isMobile ? 3 : 4}
        tickFormatter={(value) => isMobile ? `$${(value >= 1000) ? (value/1000).toFixed(1) + 'k' : value}` : `$${value.toLocaleString()}`}
        tick={{ fontSize: isMobile ? 9 : 11 }}
        width={isMobile ? 35 : 70}
        domain={['auto', 'auto']}
      />
      <Tooltip content={<ChartTooltipContent />} />
      <ReferenceLine y={0} stroke="#000" yAxisId="price" />
      
      {selectedCryptos.map(cryptoId => (
        <Bar
          key={cryptoId}
          dataKey={cryptoId}
          name={cryptoId}
          fill={CRYPTO_COLORS[cryptoId as keyof typeof CRYPTO_COLORS]}
          yAxisId="price"
          radius={[4, 4, 0, 0]}
          barSize={isMobile ? 6 : 10}
        />
      ))}
    </RechartsBarChart>
  );
};

export default BarChartComponent;
