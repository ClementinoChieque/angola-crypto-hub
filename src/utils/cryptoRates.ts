
import { useState, useEffect } from 'react';

// Types for the API response
interface CryptoRates {
  [key: string]: {
    usd: number;
  };
}

interface CryptoDetail {
  currentPrice: number;
  maxPrice: number;
  minPrice: number;
  symbol: string;
}

interface ConversionRates {
  cryptoPrices: Record<string, CryptoDetail>;
  usdtToAoc: number;
  aocToAkz: number; // Kwanza conversion rate
}

interface HistoricalData {
  date: string;
  prices: Record<string, number>;
}

// Fixed rate for AOcripto to USDT as specified
const FIXED_AOC_TO_USDT_RATE = 1450;

// List of cryptocurrencies we want to track
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin'];
const CRYPTO_SYMBOLS: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
  cardano: 'ADA',
  binancecoin: 'BNB'
};

export const fetchCryptoPrices = async (): Promise<Record<string, CryptoDetail>> => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${CRYPTO_IDS.join(',')}&vs_currencies=usd`
    );
    const data: CryptoRates = await response.json();
    
    const result: Record<string, CryptoDetail> = {};
    
    // Process each cryptocurrency
    for (const cryptoId in data) {
      if (data.hasOwnProperty(cryptoId)) {
        const currentPrice = data[cryptoId].usd;
        // Generate random variations for max and min prices (in a real app, this would be fetched from API)
        const maxVariation = 0.05; // 5% variation
        const minVariation = 0.03; // 3% variation
        
        result[cryptoId] = {
          currentPrice,
          maxPrice: currentPrice * (1 + Math.random() * maxVariation),
          minPrice: currentPrice * (1 - Math.random() * minVariation),
          symbol: CRYPTO_SYMBOLS[cryptoId] || cryptoId.substring(0, 3).toUpperCase()
        };
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching crypto rates:', error);
    // Return default values if API fails
    return {
      bitcoin: { currentPrice: 65000, maxPrice: 68250, minPrice: 63050, symbol: 'BTC' },
      ethereum: { currentPrice: 3200, maxPrice: 3360, minPrice: 3104, symbol: 'ETH' },
      solana: { currentPrice: 170, maxPrice: 178.5, minPrice: 164.9, symbol: 'SOL' },
      cardano: { currentPrice: 0.45, maxPrice: 0.47, minPrice: 0.43, symbol: 'ADA' },
      binancecoin: { currentPrice: 610, maxPrice: 640, minPrice: 590, symbol: 'BNB' }
    };
  }
};

// Generate mock historical data based on actual current rates
const generateHistoricalData = (days: number, currentRates: Record<string, CryptoDetail>): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const now = new Date();
  
  // Create some volatility around the current price
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const prices: Record<string, number> = {};
    
    // Generate prices for each cryptocurrency
    for (const cryptoId in currentRates) {
      if (currentRates.hasOwnProperty(cryptoId)) {
        const currentPrice = currentRates[cryptoId].currentPrice;
        
        // Random variation (+/- 10%)
        const volatility = 0.10;
        const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
        
        // Create a trend pattern
        const trend = Math.sin(i / (days / 2) * Math.PI) * 0.05;
        
        // Combine factors
        prices[cryptoId] = currentPrice * (randomFactor + trend);
      }
    }
    
    // Add AOcripto prices based on USDT rate
    prices['aocripto'] = FIXED_AOC_TO_USDT_RATE;
    
    data.push({
      date: date.toISOString(),
      prices,
    });
  }
  
  return data;
};

export const useCryptoRates = () => {
  const [rates, setRates] = useState<ConversionRates>({
    cryptoPrices: {},
    usdtToAoc: FIXED_AOC_TO_USDT_RATE,
    aocToAkz: 100 // Default conversion rate AOcripto to Kwanza
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRates = async () => {
      try {
        setIsLoading(true);
        const cryptoPrices = await fetchCryptoPrices();
        
        setRates({
          cryptoPrices,
          usdtToAoc: FIXED_AOC_TO_USDT_RATE,
          aocToAkz: 100
        });
      } catch (error) {
        console.error('Error calculating rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getRates();
    
    // Update rates every 5 minutes
    const intervalId = setInterval(getRates, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { rates, isLoading };
};

export const useCryptoHistory = (timeRange: string = '7d') => {
  const [historyData, setHistoryData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rates } = useCryptoRates();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      try {
        // Convert timeRange to days
        const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : 30;
        
        // In a real app, you would fetch historical data from an API
        // For this demo, we'll generate mock data based on the current prices
        const data = generateHistoricalData(days, rates.cryptoPrices);
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (Object.keys(rates.cryptoPrices).length > 0) {
      fetchHistoricalData();
    }
  }, [timeRange, rates.cryptoPrices]);

  return { historyData, isLoading };
};
