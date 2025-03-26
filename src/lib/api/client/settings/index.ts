import type {
  ProfileSettingsSchema,
  SecuritySettingsSchema,
  NotificationSettingsSchema
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
}

// Export singleton instance
export const settingsApi = new SettingsApi(); 