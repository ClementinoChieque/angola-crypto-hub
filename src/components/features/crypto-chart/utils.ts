
import { CandleDataPoint, HistoricalDataPoint } from "./types";

// Helper function to process candlestick data
export const processCandlestickData = (data: HistoricalDataPoint[], cryptoId: string): CandleDataPoint[] => {
  if (!data || !data.length) return [];
  
  return data.map((item: HistoricalDataPoint) => {
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

// Helper to format prices with appropriate precision
export const formatPrice = (price: number): string => {
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  if (price < 10) return price.toFixed(2);
  return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// Helper to get crypto display name
export const getCryptoDisplayName = (cryptoId: string): string => {
  if (cryptoId === 'aocripto') return 'AOcripto';
  if (cryptoId === 'binancecoin') return 'BNB';
  return cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1);
};
