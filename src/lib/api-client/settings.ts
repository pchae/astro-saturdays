import type { ProfileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import type { SecuritySettingsSchema, PasswordSchema } from '@/lib/database/schemas/settings/security';
import type { NotificationSettingsSchema } from '@/lib/database/schemas/settings/notifications';
import { supabase } from '@/lib/supabase/client'; // Restore this import
import type { ApiResponse } from '@/types/api'; // Import ApiResponse type

// Define the structure for combined settings data
export interface AllSettingsData {
  profile: ProfileSettingsSchema | null;
  security: SecuritySettingsSchema | null;
  notifications: NotificationSettingsSchema | null;
}

interface SettingsApi {
  updateProfile: (data: ProfileSettingsSchema) => Promise<ApiResponse<ProfileSettingsSchema>>;
  updateSecurity: (data: SecuritySettingsSchema) => Promise<ApiResponse<SecuritySettingsSchema>>;
  updateNotifications: (data: NotificationSettingsSchema) => Promise<ApiResponse<NotificationSettingsSchema>>;
  fetchAll: () => Promise<ApiResponse<AllSettingsData>>;
  updatePassword: (data: PasswordSchema) => Promise<ApiResponse<{ message: string }>>;
  fetchProfile: () => Promise<ApiResponse<ProfileSettingsSchema>>;
}

// Specific fetch function for profile
async function fetchProfileSettings(): Promise<ApiResponse<ProfileSettingsSchema>> {
  console.log('Fetching profile settings via API...');
  try {
    const response = await fetch('/api/settings/profile'); // Assuming GET endpoint
    const result: ApiResponse<ProfileSettingsSchema> = await response.json();

    if (!response.ok || !result.success) {
      console.error('Error fetching profile settings via API:', result.error || `HTTP status ${response.status}`);
      throw new Error(result.error || `Failed to fetch profile (HTTP ${response.status})`);
    }
    console.log('Profile settings fetched successfully via API.');
    return result;
  } catch (error: any) {
    console.error('Unexpected error in fetchProfileSettings fetch:', error);
    return { success: false, error: error.message || 'Failed to fetch profile settings' };
  }
}

// Specific update functions per section
async function updateProfileSettings(data: ProfileSettingsSchema): Promise<ApiResponse<ProfileSettingsSchema>> {
  console.log('Updating profile settings via API with:', data);
  try {
    const response = await fetch('/api/settings/profile', { 
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<ProfileSettingsSchema> = await response.json();

    if (!response.ok || !result.success) {
      console.error('Error updating profile settings via API:', result.error || `HTTP status ${response.status}`);
      return { success: false, error: result.error || new Error(`Failed to update profile (HTTP ${response.status})`).message };
    }

    console.log('Profile settings updated successfully via API.');
    return result;

  } catch (error: any) {
    console.error('Unexpected error in updateProfileSettings fetch:', error);
    return { success: false, error: error.message || 'Failed to update profile' };
  }
}

async function updatePasswordSettings(data: PasswordSchema): Promise<ApiResponse<{ message: string }>> {
  console.log('Updating password via API...');
  try {
    const response = await fetch('/api/settings/security/password', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<{ message: string }> = await response.json();

    if (!response.ok) {
      const errorPayload = result || {};
      console.error('Error updating password via API:', errorPayload.error || `HTTP status ${response.status}`);
      throw new Error(errorPayload.error || `HTTP error! status: ${response.status}`);
    }

    if (!result.success) {
      console.error('API indicated password update failure:', result.error);
      throw new Error(result.error || 'API indicated failure');
    }

    console.log('Password updated successfully via API.');
    return result;

  } catch (error: any) {
    console.error('Unexpected error in updatePasswordSettings fetch:', error);
    return { success: false, error: error.message || 'Failed to update password' };
  }
}

async function updateSecuritySettings(data: SecuritySettingsSchema): Promise<ApiResponse<SecuritySettingsSchema>> {
  console.warn('updateSecuritySettings using direct Supabase calls - consider using API route like password/profile');
  await new Promise(res => setTimeout(res, 500));
  return { success: false, error: 'Direct client-side security update not implemented, use API route.' };
}

async function updateNotificationSettings(data: NotificationSettingsSchema): Promise<ApiResponse<NotificationSettingsSchema>> {
  console.warn('updateNotificationSettings using direct Supabase calls - consider using API route like password/profile');
  await new Promise(res => setTimeout(res, 500));
  return { success: false, error: 'Direct client-side notification update not implemented, use API route.' };
}

async function fetchAllSettings(): Promise<ApiResponse<AllSettingsData>> {
  console.log('Attempting to fetch all settings via fetchProfile...');
  const profileResult = await fetchProfileSettings();
  if (!profileResult.success) {
    return { success: false, error: profileResult.error };
  }
  return { 
    success: true, 
    data: { 
      profile: profileResult.data ?? null,
      security: null,
      notifications: null
    }
  };
}

export const settingsApi: SettingsApi = {
  fetchProfile: fetchProfileSettings,
  updateProfile: updateProfileSettings,
  updatePassword: updatePasswordSettings,
  updateSecurity: updateSecuritySettings,
  updateNotifications: updateNotificationSettings,
  fetchAll: fetchAllSettings,
}; 