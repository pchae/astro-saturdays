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
      return new Response(error.message, { status: 500 });
    }

    const { access_token, refresh_token } = data.session;
    
    // Set cookies that work in both development and production
    const cookieOptions = {
      path: "/",
      secure: true, // Always use secure in modern browsers
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    };

    cookies.set("sb-access-token", access_token, cookieOptions);
    cookies.set("sb-refresh-token", refresh_token, cookieOptions);
    
    return redirect("/dashboard");
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};