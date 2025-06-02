
import React, { memo } from 'react';
import { format } from 'date-fns';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { CRYPTO_COLORS } from './types';

interface BarChartProps {
  processedData: any[];
  selectedCryptos: string[];
  isMobile: boolean;
}

const BarChartComponent: React.FC<BarChartProps> = memo(({ 
  processedData, 
  selectedCryptos, 
  isMobile 
}) => {
  console.log('BarChart - rendering with data points:', processedData?.length || 0);
  console.log('BarChart - selectedCryptos:', selectedCryptos);

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Sem dados para exibir</p>
      </div>
    );
  }

  try {
    return (
      <RechartsBarChart
        width={800}
        height={isMobile ? 170 : 240}
        data={processedData}
        margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 25 } : { top: 10, right: 30, left: 5, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            try {
              return format(new Date(value), isMobile ? 'd/M' : 'dd/MM');
            } catch (error) {
              console.error('Error formatting date:', error);
              return value;
            }
          }}
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
          tickFormatter={(value) => {
            try {
              return isMobile ? `$${(value >= 1000) ? (value/1000).toFixed(1) + 'k' : value}` : `$${value.toLocaleString()}`;
            } catch (error) {
              console.error('Error formatting value:', error);
              return value;
            }
          }}
          tick={{ fontSize: isMobile ? 9 : 11 }}
          width={isMobile ? 35 : 70}
          domain={['auto', 'auto']}
        />
        <Tooltip 
          content={<ChartTooltipContent />}
          animationDuration={isMobile ? 100 : 200}
        />
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
            isAnimationActive={!isMobile}
          />
        ))}
      </RechartsBarChart>
    );
  } catch (error) {
    console.error('Error rendering BarChart:', error);
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Erro ao carregar gráfico de barras</p>
      </div>
    );
  }
});

BarChartComponent.displayName = 'BarChartComponent';

export default BarChartComponent;
