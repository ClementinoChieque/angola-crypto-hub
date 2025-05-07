import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCryptoHistory } from '@/utils/cryptoRates';
import { ChartLine } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const timeRanges = [
  { value: '1d', label: '24h' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
];

// Define colors for each cryptocurrency
const cryptoColors = {
  bitcoin: '#f7931a',
  ethereum: '#627eea',
  solana: '#00ffbd',
  cardano: '#0033ad',
  binancecoin: '#f3ba2f',
  aocripto: '#3b82f6',
};

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin', 'ethereum', 'aocripto']);
  const { historyData, isLoading } = useCryptoHistory(timeRange);
  const isMobile = useIsMobile();

  // Process data for the chart to include all selected cryptocurrencies
  const processedData = historyData.map(item => {
    const result: any = { date: item.date };
    
    // Add price for each selected cryptocurrency
    Object.keys(item.prices).forEach(cryptoId => {
      if (selectedCryptos.includes(cryptoId)) {
        result[cryptoId] = item.prices[cryptoId];
      }
    });
    
    return result;
  });

  // Helper function to toggle cryptocurrency selection
  const toggleCrypto = (cryptoId: string) => {
    setSelectedCryptos(prev => {
      // If already selected, remove it
      if (prev.includes(cryptoId)) {
        return prev.filter(id => id !== cryptoId);
      }
      // Otherwise add it
      return [...prev, cryptoId];
    });
  };

  // Create chart config from selected cryptos
  const chartConfig = Object.fromEntries(
    Object.entries(cryptoColors)
      .filter(([key]) => selectedCryptos.includes(key))
      .map(([key, color]) => [
        key, 
        { 
          label: key === 'aocripto' ? 'AOcripto' : key.charAt(0).toUpperCase() + key.slice(1), 
          theme: { light: color, dark: color } 
        }
      ])
  );

  if (isLoading) {
    return (
      <Card className="p-2 md:p-4 h-[220px] md:h-[250px] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <ChartLine size={isMobile ? 20 : 24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground text-xs md:text-sm">Carregando dados históricos...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 md:p-4 overflow-hidden bg-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-5 gap-2">
        <h3 className="font-semibold text-base md:text-lg">Análise do Gráfico</h3>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList className="grid grid-cols-3 h-7 md:h-8 min-w-[180px]">
            {timeRanges.map((range) => (
              <TabsTrigger 
                key={range.value} 
                value={range.value}
                className="text-xs px-2 md:px-3"
              >
                {range.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Currency selection toggle group */}
      <div className="mb-3 md:mb-4 overflow-x-auto">
        <ToggleGroup type="multiple" className="flex flex-wrap gap-1" value={selectedCryptos} onValueChange={(value) => {
          if (value.length) setSelectedCryptos(value);
        }}>
          {Object.entries(cryptoColors).map(([cryptoId, color]) => (
            <ToggleGroupItem 
              key={cryptoId}
              value={cryptoId}
              className="text-xs h-6 md:h-7 px-2 py-1"
              style={{ borderColor: color, color: selectedCryptos.includes(cryptoId) ? 'white' : color, 
                      backgroundColor: selectedCryptos.includes(cryptoId) ? color : 'transparent' }}
            >
              {cryptoId === 'aocripto' ? 'AOcripto' : 
               cryptoId === 'binancecoin' ? 'BNB' :
               cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      
      {/* Optimized chart height and margins for mobile */}
      <div className="h-[170px] md:h-[240px]">
        <ChartContainer config={chartConfig}>
          <LineChart 
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
            
            {/* Dynamically create Lines based on selected cryptocurrencies */}
            {selectedCryptos.map(cryptoId => (
              <Line
                key={cryptoId}
                type="monotone"
                dataKey={cryptoId}
                name={cryptoId}
                stroke={cryptoColors[cryptoId as keyof typeof cryptoColors]}
                yAxisId="price"
                activeDot={{ r: isMobile ? 4 : 6 }}
                strokeWidth={isMobile ? 2 : 2.5}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
        <p className="font-medium mb-0.5 md:mb-1">Análise:</p>
        {timeRange === '1d' && (
          <p>Análise de curto prazo mostra variações dentro das últimas 24 horas.</p>
        )}
        {timeRange === '7d' && (
          <p>Análise de médio prazo indica tendência de {
            selectedCryptos.length > 0 && processedData.length > 0 ? 
            (processedData[processedData.length - 1][selectedCryptos[0]] > processedData[0][selectedCryptos[0]] ? 'alta' : 'baixa') 
            : 'variação'
          } na semana.</p>
        )}
        {timeRange === '30d' && (
          <p>Análise de longo prazo revela padrão de {
            selectedCryptos.length > 0 && processedData.length > 0 ? 
            (processedData[processedData.length - 1][selectedCryptos[0]] > processedData[0][selectedCryptos[0]] ? 'valorização' : 'desvalorização') 
            : 'variação'
          } no mês.</p>
        )}
      </div>
    </Card>
  );
};

export default CryptoChart;
