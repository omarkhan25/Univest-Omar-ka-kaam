// Centralized Mock Dataset Fallbacks for ArthSetu API Services

export const MOCK_INDICES = [
  { name: 'NIFTY 50', symbol: 'NIFTY50', value: '24,820.40', change: '+142.15', percent: '+0.58%', isPositive: true },
  { name: 'SENSEX', symbol: 'SENSEX', value: '81,380.20', change: '+415.80', percent: '+0.51%', isPositive: true },
  { name: 'BANK NIFTY', symbol: 'BANKNIFTY', value: '52,140.75', change: '+290.40', percent: '+0.56%', isPositive: true },
  { name: 'NIFTY IT', symbol: 'NIFTYIT', value: '41,250.30', change: '+510.20', percent: '+1.25%', isPositive: true },
  { name: 'NIFTY AUTO', symbol: 'NIFTYAUTO', value: '26,410.10', change: '-85.50', percent: '-0.32%', isPositive: false },
  { name: 'NIFTY PHARMA', symbol: 'NIFTYPHARMA', value: '22,980.60', change: '+115.30', percent: '+0.50%', isPositive: true },
];

export const MOCK_SECTORS = [
  { name: 'Information Tech', change: '+1.45%', status: 'Bullish', leadStock: 'TCS', color: '#16A34A' },
  { name: 'Banking & Financials', change: '+0.88%', status: 'Positive', leadStock: 'HDFC Bank', color: '#16A34A' },
  { name: 'Capital Goods', change: '+0.72%', status: 'Positive', leadStock: 'L&T', color: '#16A34A' },
  { name: 'Pharma & Healthcare', change: '+0.35%', status: 'Neutral', leadStock: 'Sun Pharma', color: '#16A34A' },
  { name: 'FMCG', change: '-0.18%', status: 'Cautious', leadStock: 'ITC', color: '#DC2626' },
  { name: 'Auto & Ancillary', change: '-0.42%', status: 'Bearish', leadStock: 'Tata Motors', color: '#DC2626' },
];

export const MOCK_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: '2,934.50', change: '+36.20', changePercent: 1.25, sector: 'Energy & Conglomerate', mcap: '₹19,85,400 Cr', pe: '28.4', peCategory: 'Fair', volume: '4.8M', high52: '3,024.90', low52: '2,220.30' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: '4,185.10', change: '+62.40', changePercent: 1.51, sector: 'Information Tech', mcap: '₹15,14,200 Cr', pe: '31.2', peCategory: 'Fair', volume: '2.1M', high52: '4,585.90', low52: '3,311.80' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: '1,682.40', change: '+14.30', changePercent: 0.86, sector: 'Banking & Finance', mcap: '₹12,78,900 Cr', pe: '18.6', peCategory: 'Attractive', volume: '8.4M', high52: '1,794.00', low52: '1,363.50' },
  { symbol: 'INFY', name: 'Infosys Limited', price: '1,562.10', change: '-13.40', changePercent: -0.85, sector: 'Information Tech', mcap: '₹6,48,500 Cr', pe: '24.1', peCategory: 'Fair', volume: '5.2M', high52: '1,903.00', low52: '1,355.00' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', price: '1,215.80', change: '+18.50', changePercent: 1.54, sector: 'Banking & Finance', mcap: '₹8,52,300 Cr', pe: '17.8', peCategory: 'Attractive', volume: '6.7M', high52: '1,257.00', low52: '920.00' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: '1,495.00', change: '+22.10', changePercent: 1.50, sector: 'Telecom', mcap: '₹8,90,100 Cr', pe: '42.5', peCategory: 'High Growth', volume: '3.9M', high52: '1,550.00', low52: '840.00' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', price: '3,456.90', change: '+35.80', changePercent: 1.05, sector: 'Infrastructure', mcap: '₹4,75,300 Cr', pe: '33.1', peCategory: 'Fair', volume: '1.8M', high52: '3,900.00', low52: '2,800.00' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited', price: '147.20', change: '+3.45', changePercent: 2.40, sector: 'Metals & Mining', mcap: '₹1,83,700 Cr', pe: '14.2', peCategory: 'Value', volume: '12.4M', high52: '184.60', low52: '114.60' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: '985.40', change: '-12.80', changePercent: -1.28, sector: 'Auto & Ancillary', mcap: '₹3,27,400 Cr', pe: '10.5', peCategory: 'Deep Value', volume: '4.1M', high52: '1,179.00', low52: '593.00' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', price: '1,720.50', change: '+8.90', changePercent: 0.52, sector: 'Pharma & Healthcare', mcap: '₹4,12,800 Cr', pe: '36.8', peCategory: 'Growth', volume: '1.4M', high52: '1,825.00', low52: '1,100.00' },
];

export const MOCK_RESEARCH_PICKS = [
  {
    id: 'pk-1',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd',
    category: 'High Conviction',
    datePublished: '01 Mar 2025',
    returnPercent: 21.75,
    risk: 'Low Risk',
    horizon: '6 - 12 Months',
    convictionScore: 92,
    summary: 'Telecommunications tariff hikes and expanding refining margins driver.'
  },
  {
    id: 'pk-2',
    symbol: 'HAL',
    companyName: 'Hindustan Aeronautics Ltd',
    category: 'Growth',
    datePublished: '12 Jan 2025',
    returnPercent: 92.15,
    risk: 'Moderate Risk',
    horizon: '1 - 3 Years',
    convictionScore: 95,
    summary: 'Record defense order book pipeline for indigenous fighter jets.'
  },
  {
    id: 'pk-3',
    symbol: 'TATASTEEL',
    companyName: 'Tata Steel Limited',
    category: 'Value',
    datePublished: '15 Feb 2025',
    returnPercent: 20.16,
    risk: 'Moderate Risk',
    horizon: '6 - 12 Months',
    convictionScore: 84,
    summary: 'UK plant turnaround and domestic steel demand recovery.'
  }
];
