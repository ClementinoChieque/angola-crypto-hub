
import { useState, useEffect } from 'react';

// Types for the API response
interface CryptoRates {
  bitcoin: {
    usd: number;
  };
}

interface ConversionRates {
  btcToUsd: number;
  usdtToAoc: number; // AOcripto
  btcToAoc: number;
  aocToAkz: number; // Kwanza conversion rate
}

// Fixed rate for AOcripto to USDT as specified
const FIXED_AOC_TO_USDT_RATE = 1450;

export const fetchBitcoinRate = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data: CryptoRates = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching Bitcoin rate:', error);
    // Return a default value if API fails
    return 65000; // Default approximate BTC value
  }
};

export const useCryptoRates = () => {
  const [rates, setRates] = useState<ConversionRates>({
    btcToUsd: 0,
    usdtToAoc: FIXED_AOC_TO_USDT_RATE,
    btcToAoc: 0,
    aocToAkz: 100 // Default conversion rate AOcripto to Kwanza
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRates = async () => {
      try {
        setIsLoading(true);
        const btcRate = await fetchBitcoinRate();
        
        // Calculate BTC to AOcripto rate
        const btcToAoc = btcRate * FIXED_AOC_TO_USDT_RATE;
        
        setRates({
          btcToUsd: btcRate,
          usdtToAoc: FIXED_AOC_TO_USDT_RATE,
          btcToAoc: btcToAoc,
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
