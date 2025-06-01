
import React, { memo, useMemo } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CRYPTO_COLORS } from './types';
import { getCryptoDisplayName } from './utils';
import { CandleDataPoint } from './types';

interface CandleChartProps {
  candleData: CandleDataPoint[];
  activeCrypto: string;
  setActiveCrypto: (crypto: string) => void;
  isMobile: boolean;
}

const CandleChartComponent: React.FC<CandleChartProps> = memo(({ 
  candleData, 
  activeCrypto, 
  setActiveCrypto, 
  isMobile 
}) => {
  console.log('CandleChart - rendering with data points:', candleData?.length || 0);
  console.log('CandleChart - activeCrypto:', activeCrypto);

  // Optimize candle data for mobile
  const optimizedCandleData = useMemo(() => {
    if (isMobile && candleData.length > 20) {
      return candleData.filter((_, index) => index % 2 === 0);
    }
    return candleData;
  }, [candleData, isMobile]);

  const cryptoOptions = useMemo(() => {
    return Object.keys(CRYPTO_COLORS).map(cryptoId => ({
      id: cryptoId,
      name: getCryptoDisplayName(cryptoId)
    }));
  }, []);

  if (!candleData || candleData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 text-xs">
        <Select
          value={activeCrypto}
          onValueChange={setActiveCrypto}
        >
          <SelectTrigger className="h-7 w-full md:w-44 text-xs bg-muted">
            <SelectValue placeholder="Selecione uma criptomoeda" />
          </SelectTrigger>
          <SelectContent>
            {cryptoOptions.map(({ id, name }) => (
              <SelectItem key={id} value={id} className="text-xs">
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <LineChart
        width={800}
        height={isMobile ? 170 : 240}
        data={optimizedCandleData}
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
          labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
          formatter={(value, name) => {
            const nameStr = String(name);
            return [
              `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 4 })}`,
              nameStr === 'price' ? 'Preço' : nameStr.charAt(0).toUpperCase() + nameStr.slice(1)
            ];
          }}
          animationDuration={isMobile ? 100 : 200}
        />
        
        {/* Draw price line */}
        <Line
          type="monotone"
          dataKey="price"
          stroke={CRYPTO_COLORS[activeCrypto as keyof typeof CRYPTO_COLORS]}
          yAxisId="price"
          strokeWidth={2}
          dot={false}
          isAnimationActive={!isMobile}
        />
        
        {/* Draw high/low lines */}
        <Line
          type="monotone"
          dataKey="high"
          stroke="rgba(0,255,0,0.5)"
          yAxisId="price"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="low"
          stroke="rgba(255,0,0,0.5)"
          yAxisId="price"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
          isAnimationActive={false}
        />
        
        {/* Draw open/close reference lines */}
        {optimizedCandleData.map((entry: any, index: number) => {
          const isIncreasing = entry.close > entry.open;
          const color = isIncreasing ? 'rgba(0,200,0,0.7)' : 'rgba(200,0,0,0.7)';
          
          return (
            <ReferenceLine
              key={`candle-${index}`}
              x={entry.date}
              stroke={color}
              strokeWidth={4}
              yAxisId="price"
              segment={[{ y: entry.open }, { y: entry.close }]}
            />
          );
        })}
      </LineChart>
    </div>
  );
});

CandleChartComponent.displayName = 'CandleChartComponent';

export default CandleChartComponent;
