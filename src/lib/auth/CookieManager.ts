import type { 
  AuthTokens, 
  SessionData, 
  CookieOptions, 
  AstroContext,
  CookieResult 
} from './types';
import type { AstroGlobal } from 'astro';
import type { APIContext } from 'astro';

export class AuthCookieManager {
  private static readonly COOKIE_NAMES = {
    ACCESS_TOKEN: 'sb-access-token',
    REFRESH_TOKEN: 'sb-refresh-token',
    SESSION: 'sb-auth'
  } as const;

  private static readonly DEFAULT_OPTIONS: CookieOptions = {
    path: '/',
    secure: import.meta.env.PROD,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  };

  constructor(
    private readonly context: AstroContext,
    private readonly options: CookieOptions = {}
  ) {}

  /**
   * Get the cookies object from either Astro.cookies or APIContext cookies
   */
  private get cookies() {
    if (this.isAPIContext(this.context)) {
      return this.context.cookies;
    }
    return this.context.cookies;
  }

  private isAPIContext(context: AstroContext): context is APIContext {
    return 'cookies' in context;
  }

  /**
   * Validate session data structure
   */
  private validateSessionData(data: any): data is SessionData {
    if (!data || typeof data !== 'object') return false;
    if (!data.user || typeof data.user !== 'object') return false;
    if (!data.tokens || typeof data.tokens !== 'object') return false;
    if (typeof data.expiresAt !== 'number') return false;
    if (!data.tokens.accessToken || !data.tokens.refreshToken) return false;
    return true;
  }

  /**
   * Get auth tokens from cookies
   */
  getAuthTokens(): CookieResult<AuthTokens> {
    try {
      const accessToken = this.cookies.get(AuthCookieManager.COOKIE_NAMES.ACCESS_TOKEN)?.value;
      const refreshToken = this.cookies.get(AuthCookieManager.COOKIE_NAMES.REFRESH_TOKEN)?.value;

      if (!accessToken || !refreshToken) {
        return { data: null, error: null };
      }

      return {
        data: { accessToken, refreshToken },
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to get auth tokens')
      };
    }
  }

  /**
   * Set auth tokens in cookies
   */
  setAuthTokens(tokens: AuthTokens): CookieResult<void> {
    try {
      const options = { ...AuthCookieManager.DEFAULT_OPTIONS, ...this.options };
      
      this.cookies.set(
        AuthCookieManager.COOKIE_NAMES.ACCESS_TOKEN, 
        tokens.accessToken, 
        options
      );
      
      this.cookies.set(
        AuthCookieManager.COOKIE_NAMES.REFRESH_TOKEN, 
        tokens.refreshToken, 
        options
      );

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to set auth tokens')
      };
    }
  }

  /**
   * Get session data from cookie
   */
  getSessionData(): CookieResult<SessionData> {
    try {
      const sessionCookie = this.cookies.get(AuthCookieManager.COOKIE_NAMES.SESSION)?.value;
      
      if (!sessionCookie) {
        return { data: null, error: null };
      }

      let sessionData: any;
      try {
        sessionData = JSON.parse(decodeURIComponent(sessionCookie));
      } catch (e) {
        return {
          data: null,
          error: new Error('Failed to parse session data: Invalid format')
        };
      }

      if (!this.validateSessionData(sessionData)) {
        return {
          data: null,
          error: new Error('Invalid session data structure')
        };
      }

      return { data: sessionData, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to get session data')
      };
    }
  }

  /**
   * Set session data in cookie
   */
  setSessionData(data: SessionData): CookieResult<void> {
    try {
      if (!this.validateSessionData(data)) {
        return {
          data: null,
          error: new Error('Invalid session data structure')
        };
      }

      const options = { ...AuthCookieManager.DEFAULT_OPTIONS, ...this.options };
      
      try {
        const sessionStr = JSON.stringify(data);
        this.cookies.set(
          AuthCookieManager.COOKIE_NAMES.SESSION, 
          sessionStr, 
          options
        );
      } catch (e) {
        return {
          data: null,
          error: new Error('Failed to serialize session data')
        };
      }

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to set session data')
      };
    }
  }

  /**
   * Clear all auth cookies
   */
  clearAuthCookies(): CookieResult<void> {
    try {
      const options = { path: '/' };
      
      this.cookies.delete(AuthCookieManager.COOKIE_NAMES.ACCESS_TOKEN, options);
      this.cookies.delete(AuthCookieManager.COOKIE_NAMES.REFRESH_TOKEN, options);
      this.cookies.delete(AuthCookieManager.COOKIE_NAMES.SESSION, options);

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to clear auth cookies')
      };
    }
  }
} 