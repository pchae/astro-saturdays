// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { AuthService } from '@/lib/api/server/services/auth.service';
import { AuthErrors } from '@/lib/api/server/errors';
import { createClient } from '@/lib/supabase/client';
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

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
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

    // Create server client for cookie handling
    const serverClient = createServerClient(
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

    // Sign in with server client to handle cookies
    const { data, error } = await serverClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      logApiResponse(400);
      console.log("[Auth Pattern] Auth error handling", {
        error: error.message
      });
      return new Response(
        JSON.stringify({
          error: error.message || "Authentication failed",
        }),
        { status: 400 }
      );
    }

    if (!data?.session) {
      logApiResponse(500);
      return new Response(
        JSON.stringify({
          error: "Failed to establish session",
        }),
        { status: 500 }
      );
    }

    logApiResponse(200);
    return new Response(
      JSON.stringify({
        success: true,
        redirect: "/dashboard",
        user: data.user
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
    logApiResponse(500);
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