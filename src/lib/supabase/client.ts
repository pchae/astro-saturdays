import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../shared/types/supabase';

/**
 * Creates a Supabase client for client-side operations
 * @returns Supabase client instance with proper typing
 */
export function createClient() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

// Export a type for the browser client
export type SupabaseBrowserClient = ReturnType<typeof createClient>; 