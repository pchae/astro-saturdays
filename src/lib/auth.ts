import { supabase } from "./supabase";
import type { AstroGlobal } from 'astro';

interface AuthResult {
  session: any | null;
  redirect: Response | null;
}

interface SessionData {
  access_token: string;
  refresh_token: string;
  user: any;
  expires_at: number;
}

const getCookieOptions = (Astro: AstroGlobal) => ({
  path: "/",
  secure: import.meta.env.PROD || Astro.url.protocol === 'https:',
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7 // 1 week
});

/**
 * Middleware function to check authentication status
 * @param Astro - The Astro context
 * @returns Session data and redirect if needed
 */
export async function checkAuth(Astro: AstroGlobal): Promise<AuthResult> {
  try {
    const accessToken = Astro.cookies.get("sb-access-token");
    const refreshToken = Astro.cookies.get("sb-refresh-token");
    const sessionCookie = Astro.cookies.get("sb-auth");

    // If no tokens or session, redirect to signin
    if (!accessToken?.value || !refreshToken?.value || !sessionCookie?.value) {
      return {
        session: null,
        redirect: Astro.redirect("/signin")
      };
    }

    try {
      // Parse session data
      const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));

      // Check if session is expired
      if (Date.now() > sessionData.expires_at * 1000) {
        // Try to refresh the session
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refreshToken.value
        });

        if (error || !data.session) {
          clearAuthCookies(Astro);
          return {
            session: null,
            redirect: Astro.redirect("/signin")
          };
        }

        // Update cookies with new session data
        updateAuthCookies(Astro, data.session);
        return {
          session: {
            data: {
              session: data.session,
              user: data.user
            }
          },
          redirect: null
        };
      }

      // Set the session
      const { data: sessionResult, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken.value,
        refresh_token: refreshToken.value
      });

      if (sessionError) {
        clearAuthCookies(Astro);
        return {
          session: null,
          redirect: Astro.redirect("/signin")
        };
      }

      return {
        session: {
          data: {
            session: sessionResult.session,
            user: sessionResult.user
          }
        },
        redirect: null
      };
    } catch (error) {
      clearAuthCookies(Astro);
      return {
        session: null,
        redirect: Astro.redirect("/signin")
      };
    }
  } catch (error) {
    clearAuthCookies(Astro);
    return {
      session: null,
      redirect: Astro.redirect("/signin")
    };
  }
}

function clearAuthCookies(Astro: AstroGlobal) {
  const cookieOptions = getCookieOptions(Astro);
  Astro.cookies.delete("sb-access-token", cookieOptions);
  Astro.cookies.delete("sb-refresh-token", cookieOptions);
  Astro.cookies.delete("sb-auth", cookieOptions);
}

function updateAuthCookies(Astro: AstroGlobal, session: any) {
  const cookieOptions = getCookieOptions(Astro);

  if (!session?.access_token || !session?.refresh_token) {
    throw new Error("Invalid session for cookie update");
  }

  const sessionStr = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: session.user,
    expires_at: session.expires_at
  });

  const encodedSession = encodeURIComponent(sessionStr);

  Astro.cookies.set("sb-access-token", session.access_token, cookieOptions);
  Astro.cookies.set("sb-refresh-token", session.refresh_token, cookieOptions);
  Astro.cookies.set("sb-auth", encodedSession, cookieOptions);
} 