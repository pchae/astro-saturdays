import { supabase } from "./supabase";

/**
 * @typedef {Object} AuthResult
 * @property {Object|null} session - The session data if authentication is successful
 * @property {Object|null} redirect - The redirect response if authentication fails
 */

/**
 * Middleware function to check authentication status
 * @param {Object} Astro - The Astro context
 * @returns {AuthResult} - Session data and redirect if needed
 */
export async function checkAuth(Astro) {
  const accessToken = Astro.cookies.get("sb-access-token");
  const refreshToken = Astro.cookies.get("sb-refresh-token");

  // If no tokens, redirect to signin
  if (!accessToken || !refreshToken) {
    return {
      session: null,
      redirect: Astro.redirect("/signin")
    };
  }

  try {
    // Attempt to set session with tokens
    const session = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    // If error in session, clear cookies and redirect
    if (session.error) {
      Astro.cookies.delete("sb-access-token", { path: "/" });
      Astro.cookies.delete("sb-refresh-token", { path: "/" });
      return {
        session: null,
        redirect: Astro.redirect("/signin")
      };
    }

    // Return valid session
    return {
      session,
      redirect: null
    };
  } catch (error) {
    // Handle any errors by clearing cookies and redirecting
    Astro.cookies.delete("sb-access-token", { path: "/" });
    Astro.cookies.delete("sb-refresh-token", { path: "/" });
    return {
      session: null,
      redirect: Astro.redirect("/signin")
    };
  }
} 