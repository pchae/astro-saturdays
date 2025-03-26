import type {
  ProfileSettingsSchema,
  SecuritySettingsSchema,
  NotificationSettingsSchema
} from '@/lib/database/schemas';
import { createClient } from '@/lib/supabase/server';
import type { AstroGlobal } from 'astro';
import type { ApiResponse } from '../types';

/**
 * Update user profile settings
 */
export async function updateProfile(
  context: AstroGlobal,
  userId: string,
  data: Partial<ProfileSettingsSchema>
): Promise<ApiResponse> {
  const supabase = createClient(context);
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        username: data.personal?.username,
        full_name: data.personal?.fullName,
        avatar_url: data.personal?.avatarUrl,
        website: data.professional?.website,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return {
      success: false,
      error: 'Failed to update profile settings'
    };
  }
}

/**
 * Update user security settings
 */
export async function updateSecurity(
  context: AstroGlobal,
  userId: string,
  data: Partial<SecuritySettingsSchema>
): Promise<ApiResponse> {
  const supabase = createClient(context);
  
  try {
    const { error } = await supabase
      .from('settings')
      .update({
        security: data,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to update security settings:', error);
    return {
      success: false,
      error: 'Failed to update security settings'
    };
  }
}

/**
 * Update user notification settings
 */
export async function updateNotifications(
  context: AstroGlobal,
  userId: string,
  data: Partial<NotificationSettingsSchema>
): Promise<ApiResponse> {
  const supabase = createClient(context);
  
  try {
    const { error } = await supabase
      .from('settings')
      .update({
        notifications: data,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    return {
      success: false,
      error: 'Failed to update notification settings'
    };
  }
}

/**
 * Fetch all settings for a user
 */
export async function fetchUserSettings(
  context: AstroGlobal,
  userId: string
): Promise<ApiResponse<{
  profile: ProfileSettingsSchema;
  security: SecuritySettingsSchema;
  notifications: NotificationSettingsSchema;
}>> {
  const supabase = createClient(context);
  
  try {
    const [profileResult, settingsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .single()
    ]);

    if (profileResult.error) throw profileResult.error;
    if (settingsResult.error) throw settingsResult.error;

    return {
      success: true,
      data: {
        profile: {
          personal: {
            username: profileResult.data.username,
            fullName: profileResult.data.full_name,
            avatarUrl: profileResult.data.avatar_url,
            bio: profileResult.data.bio
          },
          professional: {
            website: profileResult.data.website
          },
          preferences: {
            language: 'en',
            timezone: 'UTC'
          }
        },
        security: settingsResult.data.security,
        notifications: settingsResult.data.notifications
      }
    };
  } catch (error) {
    console.error('Failed to fetch user settings:', error);
    return {
      success: false,
      error: 'Failed to fetch user settings'
    };
  }
} 