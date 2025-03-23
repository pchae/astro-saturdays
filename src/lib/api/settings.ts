import type {
  ProfileFormData,
  SecurityFormData,
  NotificationFormData,
  PrivacyFormData,
  AppearanceFormData,
} from "../schemas"
import { supabase } from "../supabase"

// Server-side Supabase functions
export async function updateProfile(userId: string, data: Partial<ProfileFormData>) {
  const { error } = await supabase
    .from("user_profiles")
    .update({
      full_name: data.fullName,
      bio: data.bio,
      avatar_url: data.avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) throw error
  return { success: true }
}

// Security Settings
export async function updateSecurity(userId: string, data: Partial<SecurityFormData>) {
  const { error } = await supabase
    .from("user_security")
    .update({
      two_factor_enabled: data.twoFactorEnabled,
      recovery_email: data.recoveryEmail,
      security_questions: data.securityQuestions,
      session_management: data.sessionManagement,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) throw error
  return { success: true }
}

// Notification Settings
export async function updateNotifications(userId: string, data: Partial<NotificationFormData>) {
  const { error } = await supabase
    .from("user_notifications")
    .update({
      preferences: data.preferences,
      global_settings: data.globalSettings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) throw error
  return { success: true }
}

// Privacy Settings
export async function updatePrivacy(userId: string, data: Partial<PrivacyFormData>) {
  const { error } = await supabase
    .from("user_settings")
    .update({
      privacy: {
        profileVisibility: data.profileVisibility,
        activityVisibility: data.activityVisibility,
        dataSharing: data.dataSharing,
        contentPreferences: data.contentPreferences,
        searchVisibility: data.searchVisibility,
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) throw error
  return { success: true }
}

// Appearance Settings
export async function updateAppearance(userId: string, data: Partial<AppearanceFormData>) {
  const { error } = await supabase
    .from("user_settings")
    .update({
      theme: data.theme,
      language: data.language,
      accessibility: data.accessibility,
      layout: data.layout,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) throw error
  return { success: true }
}

// Fetch all settings for a user
export async function fetchUserSettings(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single()

  const { data: settings, error: settingsError } = await supabase
    .from("user_settings")
    .select("*")
    .eq("id", userId)
    .single()

  const { data: notifications, error: notificationsError } = await supabase
    .from("user_notifications")
    .select("*")
    .eq("id", userId)
    .single()

  const { data: security, error: securityError } = await supabase
    .from("user_security")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError || settingsError || notificationsError || securityError) {
    throw new Error("Failed to fetch user settings")
  }

  return {
    profile,
    settings,
    notifications,
    security,
  }
} 