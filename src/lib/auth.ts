import { supabase } from "./supabase";
import type { AstroGlobal } from 'astro';

interface AuthResult {
  session: any | null;
  redirect: Response | null;
}

/**
 * Middleware function to check authentication status
 * @param Astro - The Astro context
 * @returns Session data and redirect if needed
 */
export async function checkAuth(Astro: AstroGlobal): Promise<AuthResult> {
  console.log("[Auth] Starting auth check");
  const accessToken = Astro.cookies.get("sb-access-token");
  const refreshToken = Astro.cookies.get("sb-refresh-token");

  console.log("[Auth] Token status:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken
  });

  // If no tokens, redirect to signin
  if (!accessToken || !refreshToken) {
    console.log("[Auth] No tokens found, redirecting to signin");
    return {
      session: null,
      redirect: Astro.redirect("/signin")
    };
  }

  try {
    console.log("[Auth] Attempting to set session with tokens");
    // Attempt to set session with tokens
    const session = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    console.log("[Auth] Session result:", {
      hasError: !!session.error,
      hasSession: !!session.data.session
    });

    // If error in session, clear cookies and redirect
    if (session.error) {
      console.error("[Auth] Session error:", session.error);
      Astro.cookies.delete("sb-access-token", { path: "/" });
      Astro.cookies.delete("sb-refresh-token", { path: "/" });
      return {
        session: null,
        redirect: Astro.redirect("/signin")
      };
    }

    // Return valid session
    console.log("[Auth] Auth check successful");
    return {
      session,
      redirect: null
    };
  } catch (error) {
    // Handle any errors by clearing cookies and redirecting
    console.error("[Auth] Unexpected error:", error);
    Astro.cookies.delete("sb-access-token", { path: "/" });
    Astro.cookies.delete("sb-refresh-token", { path: "/" });
    return {
      session: null,
      redirect: Astro.redirect("/signin")
    };
  }
} 