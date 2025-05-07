
export type ChartTimeRange = '1d' | '7d' | '30d';
export type ChartType = 'line' | 'candle' | 'bar';

export interface HistoricalDataPoint {
  date: string;
  prices: Record<string, number>;
}

export interface CandleDataPoint {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  price: number;
}

// Define colors for each cryptocurrency
export const CRYPTO_COLORS: Record<string, string> = {
  bitcoin: '#f7931a',
  ethereum: '#627eea',
  solana: '#00ffbd',
  cardano: '#0033ad',
  binancecoin: '#f3ba2f',
  aocripto: '#3b82f6',
};

export const TIME_RANGES = [
  { value: '1d', label: '24h' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
];

// Define chart types
export const CHART_TYPES = [
  { value: 'line', label: 'Linha', icon: 'ChartLine' },
  { value: 'candle', label: 'Velas', icon: 'CandlestickChart' },
  { value: 'bar', label: 'Barras', icon: 'BarChart3' },
];
