// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Disable static optimization for API routes
export const prerender = false;

const API_STATS = {
  success: 0,
  clientError: 0,
  serverError: 0,
  validation: 0
}

function logApiResponse(status: number) {
  if (status >= 500) API_STATS.serverError++
  else if (status >= 400) API_STATS.clientError++
  else if (status >= 200 && status < 300) API_STATS.success++
  console.log(`[API Stats] Response patterns:`, API_STATS)
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      API_STATS.validation++
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

    // Attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logApiResponse(400)
      console.log("[Auth Pattern] Auth error handling", {
        type: error.name,
        status: error.status,
        message: error.message
      });
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        { status: 400 }
      );
    }

    // No need to manually set cookies - Supabase SSR client handles this
    logApiResponse(200)
    return new Response(
      JSON.stringify({
        success: true,
        redirect: "/dashboard"
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error("[API Error]", error);
    logApiResponse(500)
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred"
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};