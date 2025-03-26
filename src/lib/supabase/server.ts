import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import type { AstroGlobal } from 'astro';

/**
 * Creates a Supabase client for server-side operations
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

// Export a type for the server client
export type SupabaseServerClient = ReturnType<typeof createClient>; 