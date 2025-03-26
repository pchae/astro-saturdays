export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          user_id: string;
          security: {
            twoFactorEnabled: boolean;
            passwordLastChanged: string | null;
            loginNotifications: boolean;
          };
          notifications: {
            email: {
              marketing: boolean;
              security: boolean;
              updates: boolean;
            };
            push: {
              enabled: boolean;
              marketing: boolean;
              security: boolean;
              updates: boolean;
            };
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          security?: {
            twoFactorEnabled?: boolean;
            passwordLastChanged?: string | null;
            loginNotifications?: boolean;
          };
          notifications?: {
            email?: {
              marketing?: boolean;
              security?: boolean;
              updates?: boolean;
            };
            push?: {
              enabled?: boolean;
              marketing?: boolean;
              security?: boolean;
              updates?: boolean;
            };
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          security?: {
            twoFactorEnabled?: boolean;
            passwordLastChanged?: string | null;
            loginNotifications?: boolean;
          };
          notifications?: {
            email?: {
              marketing?: boolean;
              security?: boolean;
              updates?: boolean;
            };
            push?: {
              enabled?: boolean;
              marketing?: boolean;
              security?: boolean;
              updates?: boolean;
            };
          };
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 