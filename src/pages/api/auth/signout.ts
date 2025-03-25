// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Disable static optimization for API routes
export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  try {
    // Create server-side Supabase client with cookie handling
    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (key: string) => cookies.get(key)?.value,
          set: (key: string, value: string, options: CookieOptions) => {
            cookies.set(key, value, {
              ...options,
              path: '/',
            });
          },
          remove: (key: string, options: CookieOptions) => {
            cookies.delete(key, {
              ...options,
              path: '/',
            });
          },
        },
      }
    );
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("[Auth Pattern] Failed to sign out", error);
      return new Response(
        JSON.stringify({
          error: "Failed to sign out",
        }),
        { status: 500 }
      );
    }

    return redirect("/signin");
  } catch (error: any) {
    console.error("[API Error]", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
      }),
      { status: 500 }
    );
  }
};