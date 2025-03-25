import type {
  ProfileFormData,
  SecurityFormData,
  NotificationFormData
} from '@/lib/schemas/settings';
import { supabase } from "../supabase"

// Server-side Supabase functions
export async function updateProfile(userId: string, data: Partial<ProfileFormData>) {
  const { error } = await supabase
    .from("user_profiles")
    .update({
      fullName: data.fullName,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      updatedAt: new Date().toISOString(),
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
      currentPassword: data.currentPassword,
      twoFactorEnabled: data.twoFactorEnabled,
      recoveryEmail: data.recoveryEmail,
      securityQuestions: data.securityQuestions,
      sessionManagement: data.sessionManagement,
      updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
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