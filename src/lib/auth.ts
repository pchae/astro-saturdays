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

const getCookieOptions = (Astro: AstroGlobal) => {
  const options = {
    path: "/",
    secure: import.meta.env.PROD || Astro.url.protocol === 'https:',
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  };

  console.log("[Cookie Pattern] Cookie options consistency check", {
    source: "auth.ts",
    options,
    url: Astro.url.pathname,
    environment: import.meta.env.MODE
  });

  return options;
};

/**
 * Middleware function to check authentication status
 * @param Astro - The Astro context
 * @returns Session data and redirect if needed
 */
export async function checkAuth(Astro: AstroGlobal): Promise<AuthResult> {
  console.log("[Auth Pattern] Starting auth check", {
    url: Astro.url.pathname,
    timestamp: new Date().toISOString()
  });

  try {
    const accessToken = Astro.cookies.get("sb-access-token");
    const refreshToken = Astro.cookies.get("sb-refresh-token");
    const sessionCookie = Astro.cookies.get("sb-auth");

    console.log("[Cookie Pattern] Auth check cookie state", {
      hasAccessToken: !!accessToken?.value,
      hasRefreshToken: !!refreshToken?.value,
      hasSessionCookie: !!sessionCookie?.value,
      url: Astro.url.pathname
    });

    // If no tokens or session, redirect to signin
    if (!accessToken?.value || !refreshToken?.value || !sessionCookie?.value) {
      console.log("[Auth Pattern] Missing required cookies", {
        missingAccessToken: !accessToken?.value,
        missingRefreshToken: !refreshToken?.value,
        missingSessionCookie: !sessionCookie?.value
      });
      return {
        session: null,
        redirect: Astro.redirect("/signin")
      };
    }

    try {
      // Parse session data
      const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));

      console.log("[Auth Pattern] Session state check", {
        hasExpiry: !!sessionData.expires_at,
        isExpired: Date.now() > sessionData.expires_at * 1000,
        timeToExpiry: sessionData.expires_at * 1000 - Date.now()
      });

      // Check if session is expired
      if (Date.now() > sessionData.expires_at * 1000) {
        console.log("[Auth Pattern] Attempting session refresh", {
          timestamp: new Date().toISOString()
        });

        // Try to refresh the session
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refreshToken.value
        });

        if (error || !data.session) {
          console.log("[Auth Pattern] Session refresh failed", {
            error: error?.message,
            hasSession: !!data?.session
          });
          clearAuthCookies(Astro);
          return {
            session: null,
            redirect: Astro.redirect("/signin")
          };
        }

        console.log("[Auth Pattern] Session refresh successful", {
          newExpiryTime: data.session.expires_at
        });

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

      console.log("[Auth Pattern] Setting session", {
        timestamp: new Date().toISOString()
      });

      // Set the session
      const { data: sessionResult, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken.value,
        refresh_token: refreshToken.value
      });

      if (sessionError) {
        console.log("[Auth Pattern] Session set failed", {
          error: sessionError.message
        });
        clearAuthCookies(Astro);
        return {
          session: null,
          redirect: Astro.redirect("/signin")
        };
      }

      console.log("[Auth Pattern] Auth check successful", {
        hasUser: !!sessionResult?.user,
        sessionValid: !!sessionResult?.session
      });

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
      console.log("[Auth Pattern] Session handling error", {
        type: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      clearAuthCookies(Astro);
      return {
        session: null,
        redirect: Astro.redirect("/signin")
      };
    }
  } catch (error) {
    console.log("[Auth Pattern] Fatal auth error", {
      type: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    clearAuthCookies(Astro);
    return {
      session: null,
      redirect: Astro.redirect("/signin")
    };
  }
}

function clearAuthCookies(Astro: AstroGlobal) {
  console.log("[Cookie Pattern] Clearing auth cookies", {
    url: Astro.url.pathname
  });
  const cookieOptions = getCookieOptions(Astro);
  Astro.cookies.delete("sb-access-token", cookieOptions);
  Astro.cookies.delete("sb-refresh-token", cookieOptions);
  Astro.cookies.delete("sb-auth", cookieOptions);
}

function updateAuthCookies(Astro: AstroGlobal, session: any) {
  console.log("[Cookie Pattern] Updating auth cookies", {
    url: Astro.url.pathname
  });
  const cookieOptions = getCookieOptions(Astro);

  if (!session?.access_token || !session?.refresh_token) {
    console.log("[Cookie Pattern] Invalid session for cookie update", {
      hasAccessToken: !!session?.access_token,
      hasRefreshToken: !!session?.refresh_token
    });
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

  console.log("[Cookie Pattern] Cookies updated successfully", {
    cookieCount: 3,
    sessionDataSize: sessionStr.length
  });
} 