import api from './api';

export interface AiAnalysisRequest {
  symbol?: string;
  query?: string;
  timeframe?: string;
  advisor_id?: string;
  user_portfolio_context?: any;
}

export interface AiAnalysisResponse {
  symbol?: string;
  recommendation?: string;
  confidence_score?: number;
  analysis_text?: string;
  related_stocks?: Array<{
    symbol: string;
    company: string;
    price: string;
    change: string;
    positive: boolean;
  }>;
  visual_type?: 'heatmap' | 'chart' | 'sip' | 'risk' | 'fundamentals' | 'news';
}

class AiService {
  /**
   * Send a query to the Groq AI backend API endpoint
   */
  async analyzeMarket(request: AiAnalysisRequest): Promise<AiAnalysisResponse> {
    try {
      const response = await api.post('/ai/analyze', request);
      return response.data;
    } catch (error) {
      try {
        const altResponse = await api.post('/groq/analyze', request);
        return altResponse.data;
      } catch (err) {
        console.warn('AI analysis API request error:', err);
        return {
          symbol: request.symbol || '',
          recommendation: '',
          confidence_score: 0,
          analysis_text: `AI analysis service connection error for "${request.query || request.symbol}". Please ensure backend endpoint is active.`,
          related_stocks: [],
          visual_type: 'fundamentals'
        };
      }
    }
  }

  /**
   * Send query to specific AI Advisor persona powered by Groq API
   */
  async sendAdvisorQuery(advisorId: string, query: string, context?: any): Promise<AiAnalysisResponse> {
    try {
      const response = await api.post('/ai/advisor-chat', {
        advisor_id: advisorId,
        query,
        context
      });
      return response.data;
    } catch (error) {
      try {
        const altResponse = await api.post('/groq/chat', {
          advisor_id: advisorId,
          query,
          context
        });
        return altResponse.data;
      } catch (err) {
        return this.analyzeMarket({ advisor_id: advisorId, query, user_portfolio_context: context });
      }
    }
  }
}

export const aiService = new AiService();
export default aiService;
