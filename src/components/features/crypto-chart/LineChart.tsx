
import React, { memo } from 'react';
import { format } from 'date-fns';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { CRYPTO_COLORS } from './types';

interface LineChartProps {
  processedData: any[];
  selectedCryptos: string[];
  isMobile: boolean;
}

const LineChartComponent: React.FC<LineChartProps> = memo(({ 
  processedData, 
  selectedCryptos, 
  isMobile 
}) => {
  console.log('LineChart - rendering with data points:', processedData?.length || 0);
  console.log('LineChart - selectedCryptos:', selectedCryptos);

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <RechartsLineChart 
      width={800}
      height={isMobile ? 170 : 240}
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
        interval={isMobile ? 'preserveStartEnd' : 'preserveStart'}
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
      <Tooltip 
        content={<ChartTooltipContent />}
        animationDuration={isMobile ? 100 : 200}
      />
      
      {selectedCryptos.map(cryptoId => (
        <Line
          key={cryptoId}
          type="monotone"
          dataKey={cryptoId}
          name={cryptoId}
          stroke={CRYPTO_COLORS[cryptoId as keyof typeof CRYPTO_COLORS]}
          yAxisId="price"
          activeDot={{ r: isMobile ? 4 : 6 }}
          strokeWidth={isMobile ? 2 : 2.5}
          dot={false}
          connectNulls={false}
          isAnimationActive={!isMobile}
        />
      ))}
    </RechartsLineChart>
  );
});

LineChartComponent.displayName = 'LineChartComponent';

export default LineChartComponent;
