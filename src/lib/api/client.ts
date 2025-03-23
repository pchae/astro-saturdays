import type {
  ProfileFormData,
} from '@/lib/schemas/settings/profile';
import type {
  SecurityFormData,
} from '@/lib/schemas/settings/security';
import type {
  NotificationFormData,
} from '@/lib/schemas/settings/notifications';
import type {
  PrivacyFormData,
} from '@/lib/schemas/settings/privacy';
import type {
  AppearanceFormData,
} from '@/lib/schemas/settings/appearance';

interface SettingsData {
  profile?: ProfileFormData;
  security?: SecurityFormData;
  notifications?: NotificationFormData;
  privacy?: PrivacyFormData;
  appearance?: AppearanceFormData;
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