import { supabase } from "./supabase";
import type { AstroGlobal } from 'astro';
import { AuthCookieManager } from "./auth/CookieManager";

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

const SESSION_STATES = {
  init: 0,
  refresh: 0,
  expired: 0,
  error: 0
}

function logSessionState(state: keyof typeof SESSION_STATES) {
  SESSION_STATES[state]++
  console.log(`[Session Stats] States:`, SESSION_STATES)
}

/**
 * Middleware function to check authentication status
 * @param Astro - The Astro context
 * @returns Session data and redirect if needed
 */
export async function checkAuth(Astro: AstroGlobal): Promise<AuthResult> {
  logSessionState('init')
  console.log("[Auth Pattern] Starting auth check", {
    url: Astro.url.pathname,
    timestamp: new Date().toISOString()
  });

  try {
    const cookieManager = new AuthCookieManager(Astro);
    const { data: tokens, error: tokenError } = cookieManager.getAuthTokens();
    const { data: sessionData, error: sessionError } = cookieManager.getSessionData();

    console.log("[Cookie Pattern] Auth check cookie state", {
      hasAccessToken: !!tokens?.accessToken,
      hasRefreshToken: !!tokens?.refreshToken,
      hasSessionCookie: !!sessionData,
      url: Astro.url.pathname
    });

    // If no tokens or session, redirect to signin
    if (!tokens?.accessToken || !tokens?.refreshToken || !sessionData) {
      console.log("[Auth Pattern] Missing required cookies", {
        missingAccessToken: !tokens?.accessToken,
        missingRefreshToken: !tokens?.refreshToken,
        missingSessionData: !sessionData
      });
      return {
        session: null,
        redirect: Astro.redirect("/signin")
      };
    }

    try {
      console.log("[Auth Pattern] Session state check", {
        hasExpiry: !!sessionData.expiresAt,
        isExpired: Date.now() > sessionData.expiresAt * 1000,
        timeToExpiry: sessionData.expiresAt * 1000 - Date.now()
      });

      // Check if session is expired
      if (Date.now() > sessionData.expiresAt * 1000) {
        console.log("[Auth Pattern] Attempting session refresh", {
          timestamp: new Date().toISOString()
        });

        // Try to refresh the session
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: tokens.refreshToken
        });

        if (error || !data.session) {
          console.log("[Auth Pattern] Session refresh failed", {
            error: error?.message,
            hasSession: !!data?.session
          });
          
          const { error: clearError } = cookieManager.clearAuthCookies();
          if (clearError) {
            console.error("[Auth Pattern] Failed to clear cookies during refresh", clearError);
          }
          
          return {
            session: null,
            redirect: Astro.redirect("/signin")
          };
        }

        console.log("[Auth Pattern] Session refresh successful", {
          newExpiryTime: data.session.expires_at
        });

        // Update auth tokens
        const tokenResult = cookieManager.setAuthTokens({
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token
        });

        if (tokenResult.error) {
          console.error("[Auth Pattern] Failed to update tokens after refresh", tokenResult.error);
          return {
            session: null,
            redirect: Astro.redirect("/signin")
          };
        }

        // Update session data
        const sessionResult = cookieManager.setSessionData({
          user: data.session.user,
          tokens: {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token
          },
          expiresAt: data.session.expires_at ?? Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // Default to 1 week if not provided
        });

        if (sessionResult.error) {
          console.error("[Auth Pattern] Failed to update session after refresh", sessionResult.error);
          return {
            session: null,
            redirect: Astro.redirect("/signin")
          };
        }

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
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      });

      if (sessionError) {
        console.log("[Auth Pattern] Session set failed", {
          error: sessionError.message
        });
        
        const { error: clearError } = cookieManager.clearAuthCookies();
        if (clearError) {
          console.error("[Auth Pattern] Failed to clear cookies after session error", clearError);
        }
        
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
      
      const { error: clearError } = cookieManager.clearAuthCookies();
      if (clearError) {
        console.error("[Auth Pattern] Failed to clear cookies after error", clearError);
      }
      
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
    
    // Try to clear cookies even in case of fatal error
    try {
      const cookieManager = new AuthCookieManager(Astro);
      const { error: clearError } = cookieManager.clearAuthCookies();
      if (clearError) {
        console.error("[Auth Pattern] Failed to clear cookies after fatal error", clearError);
      }
    } catch (e) {
      console.error("[Auth Pattern] Failed to create cookie manager after fatal error", e);
    }
    
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
  logCookieOp('delete')
  logCookieOp('delete')
  logCookieOp('delete')
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
  logCookieOp('set')
  logCookieOp('set')
  logCookieOp('set')

  console.log("[Cookie Pattern] Cookies updated successfully", {
    cookieCount: 3,
    sessionDataSize: sessionStr.length
  });
} 