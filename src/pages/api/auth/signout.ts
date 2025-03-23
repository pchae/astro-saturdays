// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { AuthCookieManager } from "@/lib/auth/CookieManager";

// Disable static optimization for API routes
export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  try {
    const cookieManager = new AuthCookieManager({ cookies });
    
    // Clear all auth cookies
    const { error } = cookieManager.clearAuthCookies();
    
    if (error) {
      console.error("[Auth Pattern] Failed to clear auth cookies", error);
      return new Response(
        JSON.stringify({
          error: "Failed to clear authentication state",
        }),
        { status: 500 }
      );
    }

    return redirect("/signin");
  } catch (error: any) {
    console.error("[API Error]", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
      }),
      { status: 500 }
    );
  }
};