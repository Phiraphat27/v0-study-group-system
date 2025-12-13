import type { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

  if (!supabaseUrl || !supabaseKey) {
    console.log("[v0] Missing Supabase env vars. Available:", {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasPuenTiwUrl: !!process.env.Puen_TiwSUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      hasPuenTiwKey: !!process.env.Puen_TiwSUPABASE_ANON_KEY,
    })
    throw new Error("Missing Supabase environment variables")
  }

  client = createBrowserClient(supabaseUrl, supabaseKey)

  return client
}
