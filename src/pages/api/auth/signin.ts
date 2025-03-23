// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

// Disable static optimization for API routes
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(error.message, { status: 400 });
    }

    if (!data?.session) {
      return new Response("Authentication failed - no session created", { status: 400 });
    }

    const { session } = data;
    const cookieOptions = {
      path: "/",
      secure: import.meta.env.PROD,
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)
    };

    // Set auth cookies
    cookies.set("sb-access-token", session.access_token, cookieOptions);
    cookies.set("sb-refresh-token", session.refresh_token, cookieOptions);
    
    // Set session data
    const sessionStr = JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      user: session.user,
      expires_at: session.expires_at
    });
    cookies.set("sb-auth", encodeURIComponent(sessionStr), cookieOptions);

    return redirect("/dashboard");
  } catch (error: any) {
    return new Response("An unexpected error occurred", { status: 500 });
  }
};