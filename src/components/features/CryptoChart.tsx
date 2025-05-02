
import React from 'react';
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
  ChartLegendContent,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCryptoHistory } from '@/utils/cryptoRates';
import { ChartLine } from 'lucide-react';

const timeRanges = [
  { value: '1d', label: '24h' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
];

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('7d');
  const { historyData, isLoading } = useCryptoHistory(timeRange);

  if (isLoading) {
    return (
      <Card className="p-4 h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <ChartLine size={24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dados históricos...</p>
        </div>
      </Card>
    );
  }

  const chartConfig = {
    bitcoin: { label: 'Bitcoin', theme: { light: '#f7931a', dark: '#f7931a' } },
    aocripto: { label: 'AOcripto', theme: { light: '#2563eb', dark: '#3b82f6' } },
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Análise do Gráfico</h3>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList className="grid grid-cols-3">
            {timeRanges.map((range) => (
              <TabsTrigger key={range.value} value={range.value}>
                {range.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => format(new Date(value), 'dd/MM')}
              stroke="var(--foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="btc"
              orientation="left"
              stroke="var(--foreground)"
              fontSize={12}
              tickCount={5}
              tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
            />
            <YAxis 
              yAxisId="aoc"
              orientation="right"
              stroke="var(--foreground)"
              fontSize={12}
              tickCount={5}
              tickFormatter={(value) => `${Math.round(value).toLocaleString()}`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="btcPrice"
              name="bitcoin"
              stroke="var(--color-bitcoin)"
              yAxisId="btc"
              activeDot={{ r: 8 }}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="aocValue"
              name="aocripto"
              stroke="var(--color-aocripto)"
              yAxisId="aoc"
              activeDot={{ r: 6 }}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium mb-1">Análise:</p>
        {timeRange === '1d' && (
          <p>Análise de curto prazo mostra variações dentro das últimas 24 horas.</p>
        )}
        {timeRange === '7d' && (
          <p>Análise de médio prazo indica tendência de {historyData[historyData.length - 1]?.btcPrice > historyData[0]?.btcPrice ? 'alta' : 'baixa'} na semana.</p>
        )}
        {timeRange === '30d' && (
          <p>Análise de longo prazo revela padrão de {historyData[historyData.length - 1]?.btcPrice > historyData[0]?.btcPrice ? 'valorização' : 'desvalorização'} no mês.</p>
        )}
      </div>
    </Card>
  );
};

export default CryptoChart;
