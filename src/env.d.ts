/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string
    readonly PUBLIC_SUPABASE_ANON_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

interface Session {
  isValid: boolean;
  expiresAt: number;
  user?: import('@supabase/supabase-js').User;
}

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