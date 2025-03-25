// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Disable static optimization for API routes
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: "Email and password are required",
        }),
        { status: 400 }
      );
    }

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("[Auth Pattern] Registration error", {
        type: error.name,
        message: error.message
      });
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        { status: 400 }
      );
    }

    // If email confirmation is required, redirect to confirmation page
    if (!data.session) {
      return new Response(
        JSON.stringify({
          message: "Please check your email for confirmation link",
          requiresEmailConfirmation: true
        }),
        { status: 200 }
      );
    }

    // Session is automatically handled by Supabase SSR client
    return redirect("/dashboard");
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