import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  // If Supabase returned an error (e.g. from OAuth provider)
  if (error) {
    console.error("[Auth Callback] Error from Supabase:", error, errorDescription);
    const params = new URLSearchParams({
      error: error,
      ...(errorDescription ? { message: errorDescription } : {}),
    });
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[Auth Callback] Code exchange error:", exchangeError.message);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
