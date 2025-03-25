import type { AstroGlobal } from "astro";
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function checkAuth(Astro: AstroGlobal) {
  try {
    // Create server-side Supabase client with cookie handling
    const supabase = createServerClient(
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

    // Get and validate user with the server
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("[Auth] User validation error:", error);
      return {
        redirect: Astro.redirect("/signin"),
      };
    }

    // Get session for additional data if needed
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