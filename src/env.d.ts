/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string
    readonly PUBLIC_SUPABASE_ANON_KEY: string
    readonly PUBLIC_SUPABASE_PROJECT_ID: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

// Use the AuthSession type from our auth types
type Session = import('@/types/auth').AuthSession;

interface Metrics {
  operations: number;
}

declare namespace App {
  interface Locals {
    session?: Session;
    user?: import('@supabase/supabase-js').User;
    metrics: Metrics;
  }
}