import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.SUPABASE_URL || process.env.Puen_TiwSUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.Puen_TiwSUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  // Get the auth token from cookies
  const authToken = cookieStore.get("sb-access-token")?.value
  const refreshToken = cookieStore.get("sb-refresh-token")?.value

  const supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {},
    },
  })

  // Set session if tokens exist
  if (authToken && refreshToken) {
    await supabase.auth.setSession({
      access_token: authToken,
      refresh_token: refreshToken,
    })
  }

  return supabase
}
