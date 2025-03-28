import type {
  ProfileSettingsSchema,
  SecuritySettingsSchema,
  NotificationSettingsSchema
} from '@/lib/database/schemas';
import { createClient } from '@/lib/supabase/server';
import type { AstroGlobal } from 'astro';
import type { ApiResponse } from '@/types/api';

/**
 * Update user profile settings
 */
export async function updateProfile(
  context: AstroGlobal,
  userId: string,
  data: Partial<ProfileSettingsSchema>
): Promise<ApiResponse> {
  const supabase = createClient(context);
  
  const updatePayload: { [key: string]: any } = {};
  if (data.personal?.firstName !== undefined) updatePayload.firstName = data.personal.firstName;
  if (data.personal?.lastName !== undefined) updatePayload.lastName = data.personal.lastName;
  if (data.personal?.phoneNumber !== undefined) updatePayload.phoneNumber = data.personal.phoneNumber;
  if (data.professional?.companyName !== undefined) updatePayload.companyName = data.professional.companyName;
  if (data.professional?.companyPosition !== undefined) updatePayload.companyPosition = data.professional.companyPosition;
  
  if (Object.keys(updatePayload).length === 0) {
    return { success: true };
  }

  updatePayload.updatedAt = new Date().toISOString();
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('userId', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to update profile settings'
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
    const [profileResult, settingsResult, userResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('userId', userId)
        .maybeSingle(),
      supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .single(),
      supabase.auth.admin.getUserById(userId)
    ]);

    const profileData = profileResult.data;

    if (profileResult.error && profileResult.error.code !== 'PGRST116') throw profileResult.error;
    if (settingsResult.error) throw settingsResult.error;
    if (userResult.error) throw userResult.error;

    const email = userResult.data.user.email;
    if (!email) {
      throw new Error('User email not found');
    }

    const mappedProfile: ProfileSettingsSchema = {
      personal: {
        firstName: profileData?.firstName ?? '',
        lastName: profileData?.lastName ?? '',
        phoneNumber: profileData?.phoneNumber ?? ''
      },
      professional: {
        companyName: profileData?.companyName ?? '',
        companyPosition: profileData?.companyPosition ?? ''
      },
    };

    return {
      success: true,
      data: {
        profile: mappedProfile,
        security: settingsResult.data.security,
        notifications: settingsResult.data.notifications
      }
    };
  } catch (error: any) {
    console.error('Failed to fetch user settings:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user settings'
    };
  }
} 