// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";
import { AuthCookieManager } from "@/lib/auth/CookieManager";

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
    const cookieManager = new AuthCookieManager({ cookies });
    
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

    // Check existing tokens
    const { data: existingTokens } = cookieManager.getAuthTokens();
    const { data: existingSession } = cookieManager.getSessionData();

    console.log("[Auth Pattern] Sign-in attempt", {
      hasExistingTokens: !!existingTokens,
      hasExistingSession: !!existingSession,
      email
    });

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

    const { session } = data;

    // Set auth tokens
    const tokenResult = cookieManager.setAuthTokens({
      accessToken: session.access_token,
      refreshToken: session.refresh_token
    });

    if (tokenResult.error) {
      console.error("[Auth Pattern] Failed to set auth tokens", tokenResult.error);
      return new Response(
        JSON.stringify({
          error: "Failed to set authentication tokens",
        }),
        { status: 500 }
      );
    }

    // Set session data
    const sessionResult = cookieManager.setSessionData({
      user: session.user,
      tokens: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token
      },
      expiresAt: session.expires_at ?? Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // Default to 1 week if not provided
    });

    if (sessionResult.error) {
      console.error("[Auth Pattern] Failed to set session data", sessionResult.error);
      return new Response(
        JSON.stringify({
          error: "Failed to set session data",
        }),
        { status: 500 }
      );
    }

    // Verify cookies were set
    const { data: verifyTokens } = cookieManager.getAuthTokens();
    const { data: verifySession } = cookieManager.getSessionData();

    console.log("[Auth Pattern] Auth cookies verification", {
      tokensSet: !!verifyTokens,
      sessionSet: !!verifySession
    });

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