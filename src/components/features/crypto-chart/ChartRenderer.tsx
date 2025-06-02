
import React, { memo, useMemo } from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { ResponsiveContainer } from 'recharts';
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
  console.log('ChartRenderer - chartType:', chartType);
  console.log('ChartRenderer - processedData length:', processedData?.length || 0);
  console.log('ChartRenderer - selectedCryptos:', selectedCryptos);
  console.log('ChartRenderer - historyData length:', historyData?.length || 0);

  // Memoize chart config to prevent unnecessary recalculations
  const chartConfig = useMemo(() => {
    try {
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
    } catch (error) {
      console.error('Error creating chart config:', error);
      return {};
    }
  }, [selectedCryptos]);

  // Memoize candlestick data processing
  const candleData = useMemo(() => {
    try {
      if (chartType !== 'candle') return [];
      return processCandlestickData(historyData, activeCrypto);
    } catch (error) {
      console.error('Error processing candlestick data:', error);
      return [];
    }
  }, [historyData, activeCrypto, chartType]);

  // Check if we have data to render
  const hasData = chartType === 'candle' 
    ? candleData.length > 0 
    : processedData.length > 0 && selectedCryptos.length > 0;

  console.log('ChartRenderer - hasData:', hasData);

  if (!hasData) {
    return (
      <div className="h-[170px] md:h-[240px] flex items-center justify-center text-muted-foreground">
        <p>Carregando dados do gráfico...</p>
      </div>
    );
  }

  // Memoize chart component rendering
  const chartComponent = useMemo(() => {
    try {
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
          return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Tipo de gráfico não suportado</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering chart component:', error);
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>Erro ao carregar gráfico</p>
        </div>
      );
    }
  }, [chartType, processedData, selectedCryptos, candleData, activeCrypto, setActiveCrypto, isMobile]);

  try {
    return (
      <div className="h-[170px] md:h-[240px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            {chartComponent}
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  } catch (error) {
    console.error('Error rendering ChartRenderer:', error);
    return (
      <div className="h-[170px] md:h-[240px] flex items-center justify-center text-muted-foreground">
        <p>Erro ao renderizar gráfico</p>
      </div>
    );
  }
});

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer;
