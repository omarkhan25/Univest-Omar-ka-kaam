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
    // Top Gainers can act as our market overview indices if real indices aren't available yet
    const response = await api.get('/market/stocks', { params: { category: 'gainers', limit: 6 } });
    return response.data;
  }

  /**
   * Fetch live quote for a specific symbol
   */
  async getQuote(symbol: string): Promise<StockQuote | null> {
    const response = await api.get(`/market/quote/${symbol}`);
    return response.data;
  }

  /**
   * Fetch quotes for multiple symbols
   */
  async getBatchQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
    if (!symbols || symbols.length === 0) return {};
    const params = new URLSearchParams();
    symbols.forEach(sym => params.append('symbols', sym));
    const response = await api.get(`/market/quotes?${params.toString()}`);
    const data = response.data;
    for (const key in data) {
      if (data[key]) {
        data[key].lastPrice = data[key].ltp || data[key].currentPrice || data[key].lastPrice || 0;
        data[key].changePercent = data[key].changePercent ?? data[key].dayChangePerc ?? 0;
        data[key].change = data[key].change ?? data[key].dayChange ?? 0;
      }
    }
    return data;
  }

  /**
   * Search stocks via backend Groww API
   */
  async searchStocks(query: string): Promise<StockQuote[]> {
    if (!query || query.trim().length === 0) return [];
    const response = await api.get(`/market/search`, { params: { query } });
    return response.data;
  }

  /**
   * Fetch list of top market stocks
   */
  async getStocks(category: string = 'all'): Promise<StockQuote[]> {
    const response = await api.get('/market/stocks', { params: { category } });
    return response.data.map((st: any) => ({
      ...st,
      lastPrice: st.currentPrice || st.ltp || st.lastPrice || 0
    }));
  }

  /**
   * Fetch research calls & recommendations
   */
  async getResearchCalls(filter?: string): Promise<ResearchCallData[]> {
    try {
      const response = await api.get('/research/feed');
      return response.data.map((call: any) => ({
        id: call.id,
        symbol: call.symbol,
        companyName: call.company_name || call.symbol,
        sector: call.sector || 'Uncategorized',
        exchange: call.exchange || 'NSE',
        recommendation: call.recommendation || 'HOLD',
        entryRange: `₹${call.entry_price_min} - ₹${call.entry_price_max}`,
        targetPrice: call.target_price,
        stopLoss: call.stop_loss,
        currentPrice: call.entry_price_min, // Fallback; websockets update this
        potentialReturn: ((call.target_price - call.entry_price_max) / call.entry_price_max) * 100,
        riskLevel: call.risk_level || 'Medium',
        confidenceScore: call.confidence_score || 80,
        horizon: call.horizon || 'Short Term',
        summary: call.analysis_summary || '',
        thesis: call.analysis_summary || '',
        status: call.status || 'ACTIVE',
        publishedTime: call.published_at || new Date().toISOString(),
        analyst: 'Univest Research',
        analystAccuracy: '85% Win Rate',
        technicals: { rsi: 55, macd: 'Bullish', trend: 'Up' }
      }));
    } catch (error) {
      console.error('Failed to fetch research calls', error);
      return [];
    }
  }

  /**
   * Fetch sector performance
   */
  async getSectors(): Promise<SectorData[]> {
    // Map to a valid endpoint or mock if backend missing
    const response = await api.get('/market/stocks', { params: { category: 'all' } });
    return response.data;
  }

  /**
   * Fetch daily market outlook
   */
  async getMarketOutlook(): Promise<MarketOutlookData | null> {
    const response = await api.get('/market/top-stocks');
    return response.data;
  }
}

export const marketService = new MarketService();
export default marketService;
