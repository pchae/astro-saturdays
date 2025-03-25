import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroGlobal } from 'astro';
import { AuthErrors } from '../utils/errors';

export class AuthService {
  static async createSupabaseClient(Astro: AstroGlobal) {
    return createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (key: string) => Astro.cookies.get(key)?.value,
          set: (key: string, value: string, options: CookieOptions) => {
            Astro.cookies.set(key, value, {
              ...options,
              path: '/',
            });
          },
          remove: (key: string, options: CookieOptions) => {
            Astro.cookies.delete(key, {
              ...options,
              path: '/',
            });
          },
        },
      }
    );
  }

  static async validateSession(Astro: AstroGlobal) {
    try {
      const supabase = await this.createSupabaseClient(Astro);
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("[Auth] User validation error:", error);
        return {
          redirect: Astro.redirect("/signin"),
        };
      }

      const { data: { session } } = await supabase.auth.getSession();

      return {
        session: {
          data: {
            user,
            session
          }
        }
      };
    } catch (error) {
      console.error("[Auth] Unexpected error:", error);
      return {
        redirect: Astro.redirect("/signin"),
      };
    }
  }
} 