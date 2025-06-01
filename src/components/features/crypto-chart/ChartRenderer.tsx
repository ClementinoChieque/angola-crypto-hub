
import React, { memo, useMemo } from 'react';
import { ChartContainer } from '@/components/ui/chart';
import LineChartComponent from './LineChart';
import BarChartComponent from './BarChart';
import CandleChartComponent from './CandleChart';
import { ChartType, CRYPTO_COLORS } from './types';
import { processCandlestickData } from './utils';

interface ChartRendererProps {
  chartType: ChartType;
  processedData: any[];
  selectedCryptos: string[];
  historyData: any[];
  activeCrypto: string;
  setActiveCrypto: (crypto: string) => void;
  isMobile: boolean;
}

const ChartRenderer: React.FC<ChartRendererProps> = memo(({
  chartType,
  processedData,
  selectedCryptos,
  historyData,
  activeCrypto,
  setActiveCrypto,
  isMobile
}) => {
  // Memoize chart config to prevent unnecessary recalculations
  const chartConfig = useMemo(() => {
    return Object.fromEntries(
      Object.entries(CRYPTO_COLORS)
        .filter(([key]) => selectedCryptos.includes(key))
        .map(([key, color]) => [
          key, 
          { 
            label: key === 'aocripto' ? 'AOcripto' : key.charAt(0).toUpperCase() + key.slice(1), 
            theme: { light: color, dark: color } 
          }
        ])
    );
  }, [selectedCryptos]);

  // Memoize candlestick data processing
  const candleData = useMemo(() => {
    return processCandlestickData(historyData, activeCrypto);
  }, [historyData, activeCrypto]);

  // Memoize chart component rendering
  const chartComponent = useMemo(() => {
    switch (chartType) {
      case 'line':
        return (
          <LineChartComponent 
            processedData={processedData} 
            selectedCryptos={selectedCryptos}
            isMobile={isMobile}
          />
        );
      
      case 'bar':
        return (
          <BarChartComponent 
            processedData={processedData} 
            selectedCryptos={selectedCryptos}
            isMobile={isMobile}
          />
        );
      
      case 'candle':
        return (
          <CandleChartComponent 
            candleData={candleData}
            activeCrypto={activeCrypto}
            setActiveCrypto={setActiveCrypto}
            isMobile={isMobile}
          />
        );
      
      default:
        return null;
    }
  }, [chartType, processedData, selectedCryptos, candleData, activeCrypto, setActiveCrypto, isMobile]);

  return (
    <div className="h-[170px] md:h-[240px]">
      <ChartContainer config={chartConfig}>
        {chartComponent}
      </ChartContainer>
    </div>
  );
});

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer;
