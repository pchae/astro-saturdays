import type { SettingsFormData, SettingsApiResponse } from '@/types/settings';

// Get the base API URL, defaulting to the current origin
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

const API_BASE = getApiBase();
const SETTINGS_ENDPOINT = `${API_BASE}/api/settings`;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Client-side settings API
export const settingsApi = {
  async fetch(): Promise<SettingsFormData> {
    const response = await fetch(SETTINGS_ENDPOINT);
    
    if (!response.ok) {
      throw new ApiError(
        response.status,
        'Failed to fetch settings'
      );
    }

    const data: SettingsApiResponse = await response.json();
    if (!data.success || !data.data) {
      throw new ApiError(500, data.error || 'Unknown error');
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
      throw new ApiError(
        response.status,
        'Failed to update settings'
      );
    }

    const data: SettingsApiResponse = await response.json();
    if (!data.success || !data.data) {
      throw new ApiError(500, data.error || 'Unknown error');
    }

    return data.data;
  },
}; 