export interface PriceUpdate {
  symbol: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type Listener = (prices: Record<string, PriceUpdate>) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private status: WebSocketStatus = 'disconnected';
  private subscribedSymbols: Set<string> = new Set(['RELIANCE', 'INFY', 'TATASTEEL', 'HDFCBANK', 'TCS', 'ICICIBANK']);
  private prices: Record<string, PriceUpdate> = {};
  private listeners: Set<Listener> = new Set();
  private reconnectTimer: any = null;
  private mockTimer: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {
    this.initInitialPrices();
    this.startMockFeed();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private initInitialPrices() {
    const initialData: Array<[string, number, number]> = [
      ['RELIANCE', 2934.50, 1.25],
      ['INFY', 1562.10, -0.85],
      ['TATASTEEL', 147.20, 2.40],
      ['HDFCBANK', 1682.40, 0.85],
      ['TCS', 4185.10, -0.42],
      ['ICICIBANK', 1240.50, 1.40],
      ['LT', 3456.90, 1.05],
      ['SUNPHARMA', 1580.20, 2.10]
    ];

    const now = new Date().toISOString();
    initialData.forEach(([sym, price, changeP]) => {
      const changeVal = parseFloat((price * (changeP / 100)).toFixed(2));
      this.prices[sym] = {
        symbol: sym,
        lastPrice: price,
        change: changeVal,
        changePercent: changeP,
        volume: 1450000,
        timestamp: now,
        high: parseFloat((price * 1.02).toFixed(2)),
        low: parseFloat((price * 0.98).toFixed(2)),
        open: parseFloat((price * 0.99).toFixed(2)),
        previousClose: parseFloat((price - changeVal).toFixed(2))
      };
    });
  }

  private startMockFeed() {
    this.status = 'connected';
    this.notifyListeners();

    if (this.mockTimer) clearInterval(this.mockTimer);
    this.mockTimer = setInterval(() => {
      if (this.status !== 'connected') return;

      const symbols = Array.from(this.subscribedSymbols);
      if (symbols.length === 0) return;

      // Pick a random symbol to update
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const current = this.prices[randomSymbol];
      if (!current) return;

      const variancePercent = (Math.random() - 0.49) * 0.4; // Small realistic tick
      const newPrice = parseFloat((current.lastPrice * (1 + variancePercent / 100)).toFixed(2));
      const newChange = parseFloat((newPrice - current.previousClose).toFixed(2));
      const newChangePercent = parseFloat(((newChange / current.previousClose) * 100).toFixed(2));

      this.prices[randomSymbol] = {
        ...current,
        lastPrice: newPrice,
        change: newChange,
        changePercent: newChangePercent,
        volume: current.volume + Math.floor(Math.random() * 500),
        timestamp: new Date().toISOString(),
        high: Math.max(current.high, newPrice),
        low: Math.min(current.low, newPrice)
      };

      this.notifyListeners();
    }, 2500);
  }

  public subscribe(symbol: string) {
    this.subscribedSymbols.add(symbol.toUpperCase());
  }

  public unsubscribe(symbol: string) {
    this.subscribedSymbols.delete(symbol.toUpperCase());
  }

  public addListener(listener: Listener) {
    this.listeners.add(listener);
    listener(this.prices);
  }

  public removeListener(listener: Listener) {
    this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener({ ...this.prices }));
  }

  public getStatus(): WebSocketStatus {
    return this.status;
  }

  public getPrices(): Record<string, PriceUpdate> {
    return { ...this.prices };
  }
}

export const wsService = WebSocketService.getInstance();
