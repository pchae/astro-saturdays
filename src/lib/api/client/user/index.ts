import type { ProfileSettingsSchema } from '@/lib/database/schemas';
import type { ApiResponse } from '../types';

export class UserApi {
  private baseUrl: string;

  constructor(baseUrl = '/api/user') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch user profile
   */
  async fetch(userId: string): Promise<ApiResponse<ProfileSettingsSchema>> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return {
        success: false,
        error: 'Failed to fetch user profile'
      };
    }
  }

  /**
   * Update user profile
   */
  async update(
    userId: string,
    data: Partial<ProfileSettingsSchema>
  ): Promise<ApiResponse<ProfileSettingsSchema>> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return {
        success: false,
        error: 'Failed to update user profile'
      };
    }
  }
}

// Export singleton instance
export const userApi = new UserApi(); 