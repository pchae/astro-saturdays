import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroGlobal } from 'astro';
import { ApiErrors } from '../errors/api';

class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient | null = null;

  private constructor() {}

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  private getConfig() {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw ApiErrors.internal();
    }

    return { url, key };
  }

  getClient(): SupabaseClient {
    if (this.client) return this.client;

    const { url, key } = this.getConfig();

    this.client = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    return this.client;
  }

  createServerClient(context: AstroGlobal) {
    const { url, key } = this.getConfig();

    return createServerClient(url, key, {
      cookies: {
        get: (key: string) => context.cookies.get(key)?.value,
        set: (key: string, value: string, options: CookieOptions) => {
          context.cookies.set(key, value, {
            ...options,
            path: '/',
          });
        },
        remove: (key: string, options: CookieOptions) => {
          context.cookies.delete(key, {
            ...options,
            path: '/',
          });
        },
      },
    });
  }
}

// Export singleton instance
export const supabase = SupabaseService.getInstance(); 