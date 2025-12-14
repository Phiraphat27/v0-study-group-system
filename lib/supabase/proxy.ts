import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.SUPABASE_URL || process.env.Puen_TiwSUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.Puen_TiwSUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  // Get auth tokens from cookies
  const authToken = request.cookies.get("sb-access-token")?.value
  const refreshToken = request.cookies.get("sb-refresh-token")?.value

  const supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })

  // Set session if tokens exist
  if (authToken && refreshToken) {
    const {
      data: { session },
      error,
    } = await supabase.auth.setSession({
      access_token: authToken,
      refresh_token: refreshToken,
    })

    // If session was refreshed, update cookies
    if (session) {
      supabaseResponse.cookies.set("sb-access-token", session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      supabaseResponse.cookies.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser(authToken)

  const protectedPaths = ["/dashboard", "/profile", "/groups", "/documents", "/calendar"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.pathname.startsWith("/auth") && user && request.nextUrl.pathname !== "/auth/verify-email") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
