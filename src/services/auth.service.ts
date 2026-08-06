import api from './api';

export interface SendOtpRequest {
  email: string;
}

export interface RegisterRequest {
  email: string;
  otp: string;
  full_name: string;
  phone_number?: string;
}

export interface LoginRequest {
  email: string;
  otp: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

class AuthService {
  /**
   * Check if an email is already registered
   */
  async checkEmail(email: string): Promise<{ exists: boolean }> {
    const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
    return response.data;
  }

  /**
   * Send an OTP to the provided email address
   */
  async sendOtp(data: SendOtpRequest): Promise<{ message: string }> {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
  }

  /**
   * Register a new user using OTP
   */
  async register(data: RegisterRequest): Promise<any> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  /**
   * Login an existing user using OTP
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await api.post('/auth/login', data);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  }

  /**
   * Get the current authenticated user's profile
   */
  async getUserProfile(token?: string): Promise<any> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get('/auth/me', config);
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Refresh Token
   */
  async refreshToken(): Promise<TokenResponse | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to refresh token', error);
      this.logout();
    }
    return null;
  }
}

export const authService = new AuthService();
export default authService;
