export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string
          full_name: string
          avatar_url: string
          website: string
        }
        Insert: {
          id: string
          updated_at?: string
          username: string
          full_name: string
          avatar_url: string
          website: string
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string
          full_name?: string
          avatar_url?: string
          website?: string
        }
      }
      settings: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          security: Json
          notifications: Json
          profile: Json
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          security: Json
          notifications: Json
          profile: Json
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          security?: Json
          notifications?: Json
          profile?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 