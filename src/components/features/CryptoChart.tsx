
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
  BarChart,
  Bar,
  ReferenceLine,
  Brush,
} from 'recharts';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCryptoHistory } from '@/utils/cryptoRates';
import { ChartLine, BarChart3, CandlestickChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const timeRanges = [
  { value: '1d', label: '24h' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
];

// Define chart types
const chartTypes = [
  { value: 'line', label: 'Linha', icon: <ChartLine size={16} /> },
  { value: 'candle', label: 'Velas', icon: <CandlestickChart size={16} /> },
  { value: 'bar', label: 'Barras', icon: <BarChart3 size={16} /> },
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

// Helper function to process candlestick data
const processCandlestickData = (data: any, cryptoId: string) => {
  if (!data || !data.length) return [];
  
  return data.map((item: any) => {
    // For candles, simulate some open/close/high/low based on the known price
    // In a real app, this would come from your API
    const basePrice = item.prices[cryptoId];
    const variation = basePrice * 0.015; // 1.5% variation for the day
    
    return {
      date: item.date,
      open: basePrice - (variation * 0.3),
      close: basePrice + (variation * 0.2),
      high: basePrice + variation,
      low: basePrice - variation,
      price: basePrice, // Keep the original price for reference
    };
  });
};

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin', 'ethereum', 'aocripto']);
  const [chartType, setChartType] = useState<'line' | 'candle' | 'bar'>('line');
  const [activeCrypto, setActiveCrypto] = useState('bitcoin');
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

  // Process data for candlestick chart (only for the active crypto)
  const candleData = processCandlestickData(historyData, activeCrypto);

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

  // Helper to get crypto display name
  const getCryptoDisplayName = (cryptoId: string) => {
    if (cryptoId === 'aocripto') return 'AOcripto';
    if (cryptoId === 'binancecoin') return 'BNB';
    return cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1);
  };

  // Function to render the appropriate chart based on selected type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
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
        );
      
      case 'bar':
        return (
          <BarChart
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
            <ReferenceLine y={0} stroke="#000" />
            
            {selectedCryptos.map(cryptoId => (
              <Bar
                key={cryptoId}
                dataKey={cryptoId}
                name={cryptoId}
                fill={cryptoColors[cryptoId as keyof typeof cryptoColors]}
                yAxisId="price"
                radius={[4, 4, 0, 0]}
                barSize={isMobile ? 6 : 10}
              />
            ))}
          </BarChart>
        );
      
      case 'candle':
        // For candlestick, we only show one crypto at a time
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
                  {Object.keys(cryptoColors).map(cryptoId => (
                    <SelectItem key={cryptoId} value={cryptoId} className="text-xs">
                      {getCryptoDisplayName(cryptoId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <LineChart
              data={candleData}
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
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                formatter={(value, name) => {
                  // Fix: Convert name to string before using string methods
                  const nameStr = String(name);
                  return [
                    `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 4 })}`,
                    nameStr === 'price' ? 'Preço' : nameStr.charAt(0).toUpperCase() + nameStr.slice(1)
                  ];
                }}
              />
              
              {/* Draw price line */}
              <Line
                type="monotone"
                dataKey="price"
                stroke={cryptoColors[activeCrypto as keyof typeof cryptoColors]}
                yAxisId="price"
                strokeWidth={2}
                dot={false}
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
              />
              <Line
                type="monotone"
                dataKey="low"
                stroke="rgba(255,0,0,0.5)"
                yAxisId="price"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
              
              {/* Draw open/close */}
              {candleData.map((entry: any, index: number) => {
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
      default:
        return null;
    }
  };

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
        <div className="flex flex-col md:flex-row gap-2">
          {/* Chart type selector */}
          <RadioGroup 
            value={chartType} 
            onValueChange={(value) => setChartType(value as 'line' | 'candle' | 'bar')}
            className="flex items-center space-x-1"
            orientation="horizontal"
          >
            {chartTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-1">
                <div className={`flex items-center justify-center p-1 rounded cursor-pointer ${chartType === type.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`} 
                     onClick={() => setChartType(type.value as 'line' | 'candle' | 'bar')}>
                  {type.icon}
                  <span className="ml-1 text-xs hidden md:inline">{type.label}</span>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          {/* Time range selector */}
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
      </div>
      
      {/* Only show crypto selection for line and bar charts */}
      {chartType !== 'candle' && (
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
      )}
      
      {/* Optimized chart height and margins for mobile */}
      <div className="h-[170px] md:h-[240px]">
        <ChartContainer config={chartConfig}>
          {renderChart()}
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
