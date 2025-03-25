import type {
  ProfileFormData,
  SecurityFormData,
  NotificationFormData
} from '@/lib/schemas/settings';

export interface SettingsData {
  profile?: ProfileFormData;
  security?: SecurityFormData;
  notifications?: NotificationFormData;
}

export interface SettingsUpdateData {
  profile?: ProfileFormData;
  security?: SecurityFormData;
  notifications?: NotificationFormData;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class SettingsApi {
  private baseUrl = '/api/settings';

  async fetch(): Promise<ApiResponse<SettingsData>> {
    try {
      const response = await fetch(this.baseUrl);
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

  async update(data: SettingsData): Promise<ApiResponse<SettingsData>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
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

export const settingsApi = new SettingsApi(); 