import type { ProfileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import { createClient } from '@/lib/supabase/server';
import type { AstroGlobal } from 'astro';
import type { ApiResponse } from '@/types/api';

/**
 * Get user profile
 */
export async function getUserProfile(
  context: AstroGlobal,
  userId: string
): Promise<ApiResponse<ProfileSettingsSchema>> {
  const supabase = createClient(context);
  
  try {
    const [{ data: profile, error }, { data: user, error: userError }] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      supabase.auth.admin.getUserById(userId)
    ]);

    if (error) throw error;
    if (userError) throw userError;

    const email = user.user.email;
    if (!email) {
      throw new Error('User email not found');
    }

    return {
      success: true,
      data: {
        personal: {
          username: profile.username,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
          bio: profile.bio,
          email
        },
        professional: {
          website: profile.website
        },
        preferences: {
          language: 'en',
          timezone: 'UTC'
        }
      }
    };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return {
      success: false,
      error: 'Failed to fetch user profile'
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  context: AstroGlobal,
  userId: string,
  data: Partial<ProfileSettingsSchema>
): Promise<ApiResponse<ProfileSettingsSchema>> {
  const supabase = createClient(context);
  
  try {
    const [{ data: profile, error }, { data: user, error: userError }] = await Promise.all([
      supabase
        .from('profiles')
        .update({
          username: data.personal?.username,
          full_name: data.personal?.fullName,
          avatar_url: data.personal?.avatarUrl,
          bio: data.personal?.bio,
          website: data.professional?.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single(),
      supabase.auth.admin.getUserById(userId)
    ]);

    if (error) throw error;
    if (userError) throw userError;

    const email = user.user.email;
    if (!email) {
      throw new Error('User email not found');
    }

    return {
      success: true,
      data: {
        personal: {
          username: profile.username,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
          bio: profile.bio,
          email
        },
        professional: {
          website: profile.website
        },
        preferences: {
          language: 'en',
          timezone: 'UTC'
        }
      }
    };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return {
      success: false,
      error: 'Failed to update user profile'
    };
  }
} 