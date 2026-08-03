import api from './api';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  kyc_status?: string;
  created_at?: string;
  last_login?: string | null;
  is_premium?: boolean;
}

class UserService {
  /**
   * Fetch current authenticated user's profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  /**
   * Update current authenticated user's profile
   */
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put('/users/me', data);
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
