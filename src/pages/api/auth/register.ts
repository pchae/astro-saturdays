// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";
import { AuthCookieManager } from "@/lib/auth/CookieManager";

// Disable static optimization for API routes
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const cookieManager = new AuthCookieManager({ cookies });
    
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

    // If auto-confirmed, set session
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
      expiresAt: session.expires_at ?? Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
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