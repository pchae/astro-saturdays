import type { ProfileSettingsSchema } from '@/lib/database/schemas';
import { createClient } from '@/lib/supabase/server';
import type { AstroGlobal } from 'astro';
import type { ApiResponse } from '../../server/types';

/**
 * Get user profile
 */
export async function getUserProfile(
  context: AstroGlobal,
  userId: string
): Promise<ApiResponse<ProfileSettingsSchema>> {
  const supabase = createClient(context);
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        personal: {
          username: profile.username,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
          bio: profile.bio
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
    const { data: profile, error } = await supabase
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
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        personal: {
          username: profile.username,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
          bio: profile.bio
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