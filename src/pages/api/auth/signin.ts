// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

// Disable static optimization for API routes
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    console.log("[Auth Pattern] Starting auth flow", {
      endpoint: "signin",
      timestamp: new Date().toISOString()
    });

    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    console.log("[Cookie Pattern] Pre-auth cookie state", {
      existingAccessToken: !!cookies.get("sb-access-token"),
      existingRefreshToken: !!cookies.get("sb-refresh-token"),
      existingSession: !!cookies.get("sb-auth")
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("[Auth Pattern] Auth error handling", {
        type: error.name,
        status: error.status,
        message: error.message
      });
      return new Response(error.message, { status: 400 });
    }

    if (!data?.session) {
      return new Response("Authentication failed - no session created", { status: 400 });
    }

    const { session } = data;
    const cookieOptions = {
      path: "/",
      secure: import.meta.env.PROD,
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)
    };

    console.log("[Cookie Pattern] Cookie options", {
      options: cookieOptions,
      environment: import.meta.env.MODE
    });

    // Set auth cookies
    cookies.set("sb-access-token", session.access_token, cookieOptions);
    cookies.set("sb-refresh-token", session.refresh_token, cookieOptions);
    
    // Set session data
    const sessionStr = JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      user: session.user,
      expires_at: session.expires_at
    });
    cookies.set("sb-auth", encodeURIComponent(sessionStr), cookieOptions);

    console.log("[Cookie Pattern] Post-auth cookie state", {
      accessTokenSet: !!cookies.get("sb-access-token"),
      refreshTokenSet: !!cookies.get("sb-refresh-token"),
      sessionSet: !!cookies.get("sb-auth"),
      cookieCount: [
        cookies.get("sb-access-token"),
        cookies.get("sb-refresh-token"),
        cookies.get("sb-auth")
      ].filter(Boolean).length
    });

    return redirect("/dashboard");
  } catch (error: any) {
    console.log("[Auth Pattern] Unexpected error", {
      type: error.name,
      message: error.message,
      stack: error.stack?.split('\n')[0]
    });
    return new Response("An unexpected error occurred", { status: 500 });
  }
};