import type { SettingsFormData, SettingsApiResponse } from '@/types/settings';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const SETTINGS_ENDPOINT = `${API_BASE}/api/settings`;

export class SettingsApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'SettingsApiError';
  }
}

export const settingsApi = {
  async fetch(): Promise<SettingsFormData> {
    const response = await fetch(SETTINGS_ENDPOINT);
    
    if (!response.ok) {
      throw new SettingsApiError(
        response.status,
        'Failed to fetch settings'
      );
    }

    const data: SettingsApiResponse = await response.json();
    if (!data.success || !data.data) {
      throw new SettingsApiError(500, data.error || 'Unknown error');
    }

    return data.data;
  },

  async update(settings: Partial<SettingsFormData>): Promise<SettingsFormData> {
    const response = await fetch(SETTINGS_ENDPOINT, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new SettingsApiError(
        response.status,
        'Failed to update settings'
      );
    }

    const data: SettingsApiResponse = await response.json();
    if (!data.success || !data.data) {
      throw new SettingsApiError(500, data.error || 'Unknown error');
    }

    return data.data;
  },
}; 