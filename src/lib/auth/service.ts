import type { AstroGlobal } from "astro";
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import type { AuthSession } from '@/types/auth';

/**
 * Check authentication status and return session or redirect
 */
export async function checkAuth(context: AstroGlobal): Promise<{ 
  session?: { 
    data: { 
      user: User;
      session: AuthSession;
    } 
  };
  redirect?: Response;
}> {
  try {
    // Create server-side Supabase client with cookie handling
    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
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
      }
    );

    // Get and validate user with the server
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("[Auth] User validation error:", error);
      return {
        redirect: context.redirect("/signin"),
      };
    }

    // Get session for additional data if needed
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return {
        redirect: context.redirect("/signin"),
      };
    }

    return {
      session: {
        data: {
          user,
          session: {
            isValid: true,
            expiresAt: session.expires_at ?? 0,
            user
          }
        }
      }
    };
  } catch (error) {
    console.error("[Auth] Unexpected error:", error);
    return {
      redirect: context.redirect("/signin"),
    };
  }
} 