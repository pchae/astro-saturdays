/// <reference types="astro/client" />

// Add necessary imports for Supabase types
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Assuming your generated types are here
import type { AuthSession as Session } from '@/types/auth'; // Also import Session directly for clarity

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string
    readonly PUBLIC_SUPABASE_ANON_KEY: string
    readonly PUBLIC_SUPABASE_PROJECT_ID: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

// Use the AuthSession type from our auth types
// type Session = import('@/types/auth').AuthSession; // Removed inline import

interface Metrics {
  operations: number;
}

declare namespace App {
  interface Locals {
    // Add the Supabase client instance type
    supabase: SupabaseClient<Database> | null; 
    // Use official Supabase types
    session: import('@supabase/supabase-js').Session | null;
    user: import('@supabase/supabase-js').User | null;
    // Keep metrics or other custom locals
    metrics?: { operations: number };
  }
}