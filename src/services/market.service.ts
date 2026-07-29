import api from './api';

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  sparklineData?: number[];
}

export interface StockQuote {
  symbol: string;
  companyName: string;
  sector?: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap?: string;
  peRatio?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

export interface ResearchCallData {
  id: string;
  symbol: string;
  companyName: string;
  sector: string;
  exchange: 'NSE' | 'BSE' | 'MCX';
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  entryRange: string;
  targetPrice: number;
  stopLoss: number;
  currentPrice: number;
  potentialReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidenceScore: number;
  horizon: string;
  summary: string;
  thesis: string;
  status: 'ACTIVE' | 'TARGET_HIT' | 'STOP_LOSS_HIT';
  publishedTime: string;
  analyst: string;
  analystAccuracy: string;
  technicals: { rsi: number; macd: string; trend: string };
}

export interface SectorData {
  name: string;
  changePercent: number;
  topGainer: string;
  gainerChange: number;
  topLoser: string;
  loserChange: number;
  marketCap: string;
  volume: string;
  momentumScore: number;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  rsi: number;
  capitalFlow: string;
}

export interface MarketOutlookData {
  niftyTrend: string;
  niftySupport: number;
  niftyResistance: number;
  bankNiftyTrend: string;
  bankNiftySupport: number;
  bankNiftyResistance: number;
  vixValue: number;
  vixChange: number;
  fiiFlow: string;
  diiFlow: string;
  pcrRatio: number;
  marketSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  keyEvents: Array<{ title: string; date: string; impact: string }>;
}

class MarketService {
  /**
   * Fetch live market indices (Nifty 50, Sensex, Bank Nifty, etc.)
   */
  async getIndices(): Promise<MarketIndex[]> {
    try {
      const response = await api.get('/market/indices');
      return response.data;
    } catch (error) {
      try {
        const altResponse = await api.get('/groww/indices');
        return altResponse.data;
      } catch (err) {
        console.warn('Backend API /market/indices endpoint error:', err);
        return [];
      }
    }
  }

  /**
   * Fetch live quote for a specific symbol
   */
  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await api.get(`/market/quote/${symbol}`);
      return response.data;
    } catch (error) {
      try {
        const altResponse = await api.get(`/groww/quote/${symbol}`);
        return altResponse.data;
      } catch (err) {
        console.warn(`Quote error for ${symbol}:`, err);
        return null;
      }
    }
  }

  /**
   * Fetch quotes for multiple symbols
   */
  async getBatchQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
    try {
      const response = await api.post('/market/quotes/batch', { symbols });
      return response.data;
    } catch (error) {
      try {
        const altResponse = await api.get(`/groww/quotes?symbols=${symbols.join(',')}`);
        return altResponse.data;
      } catch (err) {
        return {};
      }
    }
  }

  /**
   * Search stocks via backend Groww API
   */
  async searchStocks(query: string): Promise<StockQuote[]> {
    if (!query || query.trim().length === 0) return [];
    try {
      const response = await api.get(`/market/search`, { params: { query } });
      return response.data;
    } catch (error) {
      try {
        const altResponse = await api.get(`/groww/search`, { params: { q: query } });
        return altResponse.data;
      } catch (err) {
        return [];
      }
    }
  }

  /**
   * Fetch list of top market stocks
   */
  async getStocks(category: string = 'all'): Promise<StockQuote[]> {
    try {
      const response = await api.get('/market/stocks', { params: { category } });
      return response.data;
    } catch (error) {
      try {
        const altResponse = await api.get('/groww/stocks', { params: { category } });
        return altResponse.data;
      } catch (err) {
        return [];
      }
    }
  }

  /**
   * Fetch research calls & recommendations
   */
  async getResearchCalls(filter?: string): Promise<ResearchCallData[]> {
    try {
      const response = await api.get('/research/calls', { params: { filter } });
      return response.data;
    } catch (error) {
      try {
        const altResponse = await api.get('/calls', { params: { filter } });
        return altResponse.data;
      } catch (err) {
        return [];
      }
    }
  }

  /**
   * Fetch sector performance
   */
  async getSectors(): Promise<SectorData[]> {
    try {
      const response = await api.get('/market/sectors');
      return response.data;
    } catch (error) {
      return [];
    }
  }

  /**
   * Fetch daily market outlook
   */
  async getMarketOutlook(): Promise<MarketOutlookData | null> {
    try {
      const response = await api.get('/market/outlook');
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

export const marketService = new MarketService();
export default marketService;
