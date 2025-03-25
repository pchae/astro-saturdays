import type { AstroGlobal } from 'astro';
import { supabase } from '../../supabase/client';
import { AuthError, AuthErrors } from '../../errors/auth';
import { UserRole } from '../../../types/auth';
import type { AuthResponse, AuthSession } from '../../../types/auth';

export class AuthService {
  static async validateSession(context: AstroGlobal): Promise<AuthResponse> {
    try {
      const client = supabase.createServerClient(context);
      const { data: { user }, error: userError } = await client.auth.getUser();

      if (userError || !user) {
        throw AuthErrors.unauthorized();
      }

      const { data: { session }, error: sessionError } = await client.auth.getSession();

      if (sessionError || !session) {
        throw AuthErrors.sessionExpired();
      }

      return {
        success: true,
        data: {
          session: {
            isValid: true,
            expiresAt: session.expires_at ?? 0,
            user
          },
          user: {
            ...user,
            role: (user.role as UserRole) ?? UserRole.USER
          }
        }
      };
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          success: false,
          error
        };
      }
      
      return {
        success: false,
        error: AuthErrors.unauthorized()
      };
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.getClient().auth.signInWithPassword({
        email,
        password
      });

      if (error) throw AuthErrors.invalidCredentials();

      return {
        success: true,
        data: {
          session: {
            isValid: true,
            expiresAt: data.session?.expires_at ?? 0,
            user: data.user
          },
          user: {
            ...data.user,
            role: (data.user.role as UserRole) ?? UserRole.USER
          }
        }
      };
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          success: false,
          error
        };
      }

      return {
        success: false,
        error: AuthErrors.invalidCredentials()
      };
    }
  }

  static async signOut(context: AstroGlobal): Promise<void> {
    const client = supabase.createServerClient(context);
    await client.auth.signOut();
  }
} 