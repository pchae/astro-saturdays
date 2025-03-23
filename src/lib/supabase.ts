import { createClient, type SupabaseClient } from "@supabase/supabase-js";

console.log("[Supabase] Starting client initialization");

// Get environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

console.log("[Supabase] Environment variables status:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? "present" : "missing",
  key: supabaseAnonKey ? "present" : "missing",
  envMode: import.meta.env.MODE,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV
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

  // Test the client initialization
  const { data: { user }, error: testError } = await supabase.auth.getUser();
  if (testError) {
    console.error("[Supabase] Client test failed:", testError);
  } else {
    console.log("[Supabase] Client initialized and tested successfully");
  }
  
  console.log("[Supabase] Client initialized with config:", {
    hasAuth: !!supabase.auth,
    authMethods: Object.keys(supabase.auth || {}),
    hasSignInWithPassword: !!supabase.auth?.signInWithPassword
  });
} catch (error) {
  console.error("[Supabase] Error initializing client:", error);
  
  // Create a dummy client that throws descriptive errors
  supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      return () => {
        throw new Error(
          `Supabase client not properly initialized. Failed to access: ${String(prop)}\nCheck environment variables and client initialization.`
        );
      };
    },
  });
}

export { supabase };