import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function logInitContext() {
  console.log("[Supabase] Initialization context:", {
    timestamp: new Date().toISOString(),
    context: import.meta.env.SSR ? 'server' : 'client',
    mode: import.meta.env.MODE,
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV,
    // Log all available environment variables (only in development)
    env: import.meta.env.DEV ? import.meta.env : undefined
  });
}

function validateEnvironmentVariables(supabaseUrl: string | undefined, supabaseAnonKey: string | undefined): void {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('PUBLIC_SUPABASE_ANON_KEY');

  console.log("[Supabase] Environment variables status:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? "present" : "missing",
    key: supabaseAnonKey ? "present" : "missing",
    urlPrefix: supabaseUrl?.substring(0, 10),
    keyPrefix: supabaseAnonKey?.substring(0, 10),
    processEnvKeys: Object.keys(process.env).filter(key => key.startsWith('PUBLIC_')),
    importMetaEnvKeys: Object.keys(import.meta.env).filter(key => key.startsWith('PUBLIC_'))
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missingVars.join(', ')}\n` +
      `Please ensure these variables are set in your Vercel project settings.\n` +
      `Available process.env keys: ${Object.keys(process.env).filter(key => key.startsWith('PUBLIC_')).join(', ')}\n` +
      `Available import.meta.env keys: ${Object.keys(import.meta.env).filter(key => key.startsWith('PUBLIC_')).join(', ')}`
    );
  }
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
  validateEnvironmentVariables(supabaseUrl, supabaseAnonKey);

  try {
    const client = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    // Verify auth methods are available
    console.log("[Supabase] Client initialization result:", {
      hasAuth: !!client.auth,
      authMethods: Object.keys(client.auth || {}),
      hasSignInWithPassword: !!client.auth?.signInWithPassword,
      clientType: client.constructor.name
    });

    if (!client.auth?.signInWithPassword) {
      throw new Error("Supabase client initialized but auth.signInWithPassword is not available");
    }

    console.log("[Supabase] Client initialized successfully");
    supabaseInstance = client;
    return client;
  } catch (error: any) {
    console.error("[Supabase] Error initializing client:", {
      error,
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      context: import.meta.env.SSR ? 'server' : 'client',
      mode: import.meta.env.MODE,
      isProd: import.meta.env.PROD,
      isDev: import.meta.env.DEV
    });
    
    throw error;
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