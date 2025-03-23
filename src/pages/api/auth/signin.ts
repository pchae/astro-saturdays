// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

// Disable static optimization for API routes
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  console.log("[Auth API] Starting signin request");
  
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    console.log("[Auth API] Validating credentials:", { 
      hasEmail: !!email, 
      hasPassword: !!password 
    });

    if (!email || !password) {
      console.error("[Auth API] Missing credentials");
      return new Response("Email and password are required", { status: 400 });
    }

    console.log("[Auth API] Attempting Supabase signin");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[Auth API] Supabase signin error:", error);
      return new Response(error.message, { status: 401 });
    }

    console.log("[Auth API] Signin successful, setting cookies");
    const { access_token, refresh_token } = data.session;
    
    // Set cookies with Supabase-compatible settings
    const cookieOptions = {
      path: "/",
      secure: import.meta.env.PROD, // Secure in production only
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    };

    cookies.set("sb-access-token", access_token, cookieOptions);
    cookies.set("sb-refresh-token", refresh_token, cookieOptions);
    
    console.log("[Auth API] Cookies set, redirecting to dashboard");
    return redirect("/dashboard");
  } catch (error) {
    console.error("[Auth API] Unexpected error:", error);
    return new Response(
      error instanceof Error ? error.message : "Internal Server Error", 
      { status: 500 }
    );
  }
};