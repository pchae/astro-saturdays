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
  user?: User;
}

interface User {
  id: string;
  email: string;
  role: string;
}

interface Metrics {
  operations: number;
}

declare namespace App {
  interface Locals {
    session?: Session;
    user?: User;
    metrics: Metrics;
  }
}