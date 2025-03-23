import { createClient, type SupabaseClient } from "@supabase/supabase-js";

console.log("[Supabase] Starting client initialization");

// Get environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Log initialization context
console.log("[Supabase] Initialization context:", {
  timestamp: new Date().toISOString(),
  context: import.meta.env.SSR ? 'server' : 'client',
  mode: import.meta.env.MODE,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV
});

console.log("[Supabase] Environment variables status:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? "present" : "missing",
  key: supabaseAnonKey ? "present" : "missing",
  urlPrefix: supabaseUrl?.substring(0, 10),
  keyPrefix: supabaseAnonKey?.substring(0, 10)
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
  
  console.log("[Supabase] Client initialization result:", {
    hasError: !!testError,
    errorMessage: testError?.message,
    hasUser: !!user,
    hasAuth: !!supabase.auth,
    authMethods: Object.keys(supabase.auth || {}),
    hasSignInWithPassword: !!supabase.auth?.signInWithPassword,
    clientType: supabase.constructor.name
  });

  if (testError) {
    console.error("[Supabase] Client test failed:", testError);
  } else {
    console.log("[Supabase] Client initialized and tested successfully");
  }
} catch (error: any) {
  console.error("[Supabase] Error initializing client:", {
    error,
    errorName: error.name,
    errorMessage: error.message,
    errorStack: error.stack
  });
  
  // Create a dummy client that throws descriptive errors
  supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      return () => {
        throw new Error(
          `Supabase client not properly initialized. Failed to access: ${String(prop)}\nCheck environment variables and client initialization.\nContext: ${import.meta.env.SSR ? 'server' : 'client'}`
        );
      };
    },
  });
}

export { supabase };