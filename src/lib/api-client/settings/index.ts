import type {
  ProfileSettingsSchema,
  SecuritySettingsSchema,
  NotificationSettingsSchema,
  PasswordSchema
} from '@/lib/database/schemas';
import type { ApiResponse } from '@/types/api';

export interface SettingsData {
  profile?: ProfileSettingsSchema;
  security?: SecuritySettingsSchema;
  notifications?: NotificationSettingsSchema;
}

export interface SettingsUpdateData {
  profile?: Partial<ProfileSettingsSchema>;
  security?: Partial<SecuritySettingsSchema>;
  notifications?: Partial<NotificationSettingsSchema>;
}

/**
 * Client-side settings API for managing user settings
 */
export class SettingsApi {
  private baseUrl = '/api/settings';
  private profileUrl = '/api/settings/profile';
  private passwordUrl = '/api/settings/security/password';
  private twoFactorUrl = '/api/settings/security/2fa';

  /**
   * Fetch all settings for the current user
   */
  async fetch(): Promise<ApiResponse<SettingsData>> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      return {
        success: false,
        error: 'Failed to fetch settings',
      };
    }
  }

  /**
   * Update settings for the current user
   */
  async update(data: SettingsUpdateData): Promise<ApiResponse<SettingsData>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return {
        success: false,
        error: 'Failed to update settings',
      };
    }
  }

  /**
   * Fetch profile settings for the current user
   */
  async fetchProfile(): Promise<ApiResponse<ProfileSettingsSchema>> {
    try {
      const response = await fetch(this.profileUrl);
      const data: ApiResponse<ProfileSettingsSchema> = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error: any) {
      console.error('Failed to fetch profile settings:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch profile settings',
      };
    }
  }

  /**
   * Update profile settings for the current user
   */
  async updateProfile(data: ProfileSettingsSchema): Promise<ApiResponse<ProfileSettingsSchema>> {
    try {
      const response = await fetch(this.profileUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData: ApiResponse<ProfileSettingsSchema> = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }
      return responseData;
    } catch (error: any) {
      console.error('Failed to update profile settings:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile settings',
      };
    }
  }

  /**
   * Update user's password
   */
  async updatePassword(data: PasswordSchema): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(this.passwordUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData: ApiResponse<{ message: string }> = await response.json();
      if (!response.ok) {
        const errorPayload = responseData || {};
        throw new Error(errorPayload.error || `HTTP error! status: ${response.status}`);
      }
      if (!responseData.success) {
        throw new Error(responseData.error || 'API indicated failure');
      }
      return responseData;
    } catch (error: any) {
      console.error('Failed to update password:', error);
      return {
        success: false,
        error: error.message || 'Failed to update password',
      };
    }
  }
}

// Export singleton instance
export const settingsApi = new SettingsApi(); 