import type { ProfileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import type { SecuritySettingsSchema } from '@/lib/database/schemas/settings/security';
import type { NotificationSettingsSchema } from '@/lib/database/schemas/settings/notifications';
import { supabase } from '@/lib/supabase/client'; // Uncomment if using Supabase

// Define the structure for combined settings data
export interface AllSettingsData {
  profile: ProfileSettingsSchema | null;
  security: SecuritySettingsSchema | null;
  notifications: NotificationSettingsSchema | null;
}

interface SettingsApi {
  updateProfile: (data: ProfileSettingsSchema) => Promise<{ success: boolean; error?: any }>;
  updateSecurity: (data: SecuritySettingsSchema) => Promise<{ success: boolean; error?: any }>;
  updateNotifications: (data: NotificationSettingsSchema) => Promise<{ success: boolean; error?: any }>;
  fetchAll: () => Promise<{ success: boolean; data?: AllSettingsData; error?: any }>;
}

// Specific update functions per section
async function updateProfileSettings(data: ProfileSettingsSchema): Promise<{ success: boolean; error?: any }> {
  console.log('Updating profile settings with:', data);
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return { success: false, error: userError || new Error('User not found') };
    }

    // Assuming your table is 'user_profiles' and the schema matches the columns
    // or you are using JSONB columns matching the nested structure.
    const { error: updateError } = await supabase
      .from('user_profiles') // Replace 'user_profiles' if your table name is different
      .update(data)
      .eq('user_id', user.id); // Assuming a 'user_id' column linked to auth.users.id

    if (updateError) {
      console.error('Error updating profile settings:', updateError);
      return { success: false, error: updateError };
    }

    console.log('Profile settings updated successfully.');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in updateProfileSettings:', error);
    return { success: false, error };
  }
}

async function updateSecuritySettings(data: SecuritySettingsSchema): Promise<{ success: boolean; error?: any }> {
  console.log('Updating security settings with:', data);
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return { success: false, error: userError || new Error('User not found') };
    }

    // 1. Update Password (if new password is provided)
    if (data.password?.newPassword) {
      // Note: Supabase auth.updateUser doesn't require currentPassword for client-side updates
      // Server-side validation of currentPassword should happen before calling this if needed.
      const { error: passwordError } = await supabase.auth.updateUser({
        password: data.password.newPassword,
      });
      if (passwordError) {
        console.error('Error updating password:', passwordError);
        // Don't necessarily stop here, maybe other settings can still be saved
        // return { success: false, error: passwordError };
      } else {
        console.log('Password updated successfully.');
      }
    }

    // 2. Update other security settings (2FA, Session Management, etc.)
    // Assuming these are stored in a separate table, e.g., 'user_security_settings'
    // We exclude the 'password' field as it's handled by auth.
    const { password, ...otherSecurityData } = data;
    const { error: settingsUpdateError } = await supabase
      .from('user_security_settings') // Replace if your table name is different
      .update(otherSecurityData)
      .eq('user_id', user.id); // Assuming a 'user_id' column

    if (settingsUpdateError) {
      console.error('Error updating security settings:', settingsUpdateError);
      return { success: false, error: settingsUpdateError };
    }

    console.log('Security settings updated successfully.');
    return { success: true };

  } catch (error) {
    console.error('Unexpected error in updateSecuritySettings:', error);
    return { success: false, error };
  }
}

async function updateNotificationSettings(data: NotificationSettingsSchema): Promise<{ success: boolean; error?: any }> {
  console.log('Updating notification settings with:', data);
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return { success: false, error: userError || new Error('User not found') };
    }

    // Assuming these settings are stored in a table like 'user_notification_settings'
    const { error: updateError } = await supabase
      .from('user_notification_settings') // Replace if your table name is different
      .update(data)
      .eq('user_id', user.id); // Assuming a 'user_id' column

    if (updateError) {
      console.error('Error updating notification settings:', updateError);
      return { success: false, error: updateError };
    }

    console.log('Notification settings updated successfully.');
    return { success: true };

  } catch (error) {
    console.error('Unexpected error in updateNotificationSettings:', error);
    return { success: false, error };
  }
}

// Implementation for fetching all settings concurrently
async function fetchAllSettings(): Promise<{ success: boolean; data?: AllSettingsData; error?: any }> {
  try {
    // 1. Get User
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('fetchAllSettings: Error fetching user:', userError);
      return { success: false, error: userError || new Error('User not found') };
    }
    const userId = user.id;

    // 2. Define Queries (Promises)
    // Replace table names if different
    const profilePromise = supabase.from('user_profiles').select('*').eq('user_id', userId).single();
    const securityPromise = supabase.from('user_security_settings').select('*').eq('user_id', userId).single();
    const notificationsPromise = supabase.from('user_notification_settings').select('*').eq('user_id', userId).single();

    // 3. Execute Concurrently
    console.log('fetchAllSettings: Fetching all settings sections...');
    const results = await Promise.allSettled([
      profilePromise,
      securityPromise,
      notificationsPromise
    ]);
    console.log('fetchAllSettings: Fetched sections, processing results...');

    // 4. Process Results & Combine Data
    const allData: AllSettingsData = {
      profile: null,
      security: null,
      notifications: null,
    };
    let overallSuccess = true;
    const errors: any[] = [];

    // Profile Result
    if (results[0].status === 'fulfilled') {
      if (results[0].value.error) {
        // Handle Supabase-specific error returned even on fulfilled select
        console.error('fetchAllSettings: Error fetching profile:', results[0].value.error);
        errors.push({ section: 'profile', error: results[0].value.error });
        overallSuccess = false; // Decide if one error fails all
      } else {
        allData.profile = results[0].value.data as ProfileSettingsSchema | null;
      }
    } else { // 'rejected'
      console.error('fetchAllSettings: Failed fetching profile promise:', results[0].reason);
      errors.push({ section: 'profile', error: results[0].reason });
      overallSuccess = false; // Decide if one error fails all
    }

    // Security Result
    if (results[1].status === 'fulfilled') {
      if (results[1].value.error) {
        console.error('fetchAllSettings: Error fetching security:', results[1].value.error);
        errors.push({ section: 'security', error: results[1].value.error });
        overallSuccess = false;
      } else {
        allData.security = results[1].value.data as SecuritySettingsSchema | null;
      }
    } else { // 'rejected'
      console.error('fetchAllSettings: Failed fetching security promise:', results[1].reason);
      errors.push({ section: 'security', error: results[1].reason });
      overallSuccess = false;
    }

    // Notifications Result
    if (results[2].status === 'fulfilled') {
      if (results[2].value.error) {
        console.error('fetchAllSettings: Error fetching notifications:', results[2].value.error);
        errors.push({ section: 'notifications', error: results[2].value.error });
        overallSuccess = false;
      } else {
        allData.notifications = results[2].value.data as NotificationSettingsSchema | null;
      }
    } else { // 'rejected'
      console.error('fetchAllSettings: Failed fetching notifications promise:', results[2].reason);
      errors.push({ section: 'notifications', error: results[2].reason });
      overallSuccess = false;
    }

    // 5. Return Value
    if (overallSuccess) {
      console.log('fetchAllSettings: Successfully fetched all sections.');
      return { success: true, data: allData };
    } else {
      console.warn('fetchAllSettings: Failed to fetch one or more sections.');
      // Return partial data along with errors, or just the error
      // Depending on requirements, you might still return { success: true, data: allData, errors: errors }
      return { success: false, data: allData, error: errors }; // Returning partial data + error flag
    }

  } catch (error) {
    console.error('fetchAllSettings: Unexpected error:', error);
    return { success: false, error };
  }
}

export const settingsApi: SettingsApi = {
  // get: async () => { /* Placeholder for fetching settings */ return { success: true, data: {} }; },
  updateProfile: updateProfileSettings,
  updateSecurity: updateSecuritySettings,
  updateNotifications: updateNotificationSettings,
  fetchAll: fetchAllSettings,
}; 