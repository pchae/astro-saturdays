import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function logInitContext() {
  console.log("[Supabase] Initialization context:", {
    timestamp: new Date().toISOString(),
    context: import.meta.env.SSR ? 'server' : 'client',
    mode: import.meta.env.MODE,
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV
  });
}

function logEnvStatus(supabaseUrl: string | undefined, supabaseAnonKey: string | undefined) {
  console.log("[Supabase] Environment variables status:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? "present" : "missing",
    key: supabaseAnonKey ? "present" : "missing",
    urlPrefix: supabaseUrl?.substring(0, 10),
    keyPrefix: supabaseAnonKey?.substring(0, 10)
  });
}

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  console.log("[Supabase] Starting client initialization");

  // Get environment variables
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  logInitContext();
  logEnvStatus(supabaseUrl, supabaseAnonKey);

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    // Test the client initialization
    const { data: { user }, error: testError } = await client.auth.getUser();
    
    console.log("[Supabase] Client initialization result:", {
      hasError: !!testError,
      errorMessage: testError?.message,
      hasUser: !!user,
      hasAuth: !!client.auth,
      authMethods: Object.keys(client.auth || {}),
      hasSignInWithPassword: !!client.auth?.signInWithPassword,
      clientType: client.constructor.name
    });

    if (testError) {
      console.error("[Supabase] Client test failed:", testError);
      throw testError;
    }

    console.log("[Supabase] Client initialized and tested successfully");
    supabaseInstance = client;
    return client;
  } catch (error: any) {
    console.error("[Supabase] Error initializing client:", {
      error,
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack
    });
    
    throw new Error(
      `Supabase client initialization failed: ${error.message}\nContext: ${import.meta.env.SSR ? 'server' : 'client'}`
    );
  }
}

// For backwards compatibility, export a proxy that ensures client is initialized
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target: SupabaseClient, prop: string | symbol) {
    return async function(this: any, ...args: any[]) {
      const client = await getSupabaseClient();
      const value = client[prop as keyof SupabaseClient];
      
      if (typeof value === 'function') {
        return (value as Function).bind(client)(...args);
      }
      
      return value;
    };
  }
});