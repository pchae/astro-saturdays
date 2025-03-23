import { createClient, type SupabaseClient } from "@supabase/supabase-js";

console.log("[Supabase] Starting client initialization");

// Get environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

console.log("[Supabase] Environment variables status:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? "present" : "missing",
});

// Initialize Supabase client
let supabase: SupabaseClient;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  
  console.log("[Supabase] Client initialized successfully");
} catch (error) {
  console.error("[Supabase] Error initializing client:", error);
  
  // Create a dummy client that throws descriptive errors
  supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      return () => {
        throw new Error(
          `Supabase client not properly initialized. Failed to access: ${String(prop)}`
        );
      };
    },
  });
}

export { supabase };