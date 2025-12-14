"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.Puen_TiwSUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.Puen_TiwSUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}
