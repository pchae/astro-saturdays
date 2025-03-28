import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createBrowserClient } from '@supabase/supabase-js'; // Added for service role client
import type { Database } from '@/types/supabase';
import type { AstroGlobal } from 'astro';

/**
 * Creates a Supabase client for server-side operations using request context
 * @param context - Astro global context for cookie handling
 * @returns Supabase client instance with proper typing
 */
export function createClient(context: AstroGlobal) {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get: (key) => {
          return context.cookies.get(key)?.value;
        },
        set: (key, value, options) => {
          context.cookies.set(key, value, options as CookieOptions);
        },
        remove: (key, options) => {
          context.cookies.delete(key, options as CookieOptions);
        },
      },
    }
  );
}

/**
 * Creates a Supabase client using the service role key for elevated privileges.
 * Use with caution and only in secure server-side environments.
 * Requires SUPABASE_SERVICE_ROLE_KEY environment variable.
 * @returns Supabase client instance with proper typing
 */
export function createServiceRoleClient() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  // Service role key should be sourced from environment variables securely
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Service role client cannot be created.');
    // Optionally throw an error or return a limited client
    // For now, returning a client that might fail on privileged operations
  }

  // Using createBrowserClient here as we don't need cookie handling for service role
  return createBrowserClient<Database>(
    supabaseUrl,
    serviceRoleKey || import.meta.env.PUBLIC_SUPABASE_ANON_KEY // Fallback to anon key if service key is missing, though this might not be desired
  );
}

// Export a type for the server client
export type SupabaseServerClient = ReturnType<typeof createClient>;

// Export a type for the service role client
export type SupabaseServiceRoleClient = ReturnType<typeof createServiceRoleClient>; 