"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUp(formData: {
  email: string
  password: string
  displayName: string
  studentId?: string
  major?: string
  yearLevel?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.SUPABASE_URL}/dashboard`,
      data: {
        display_name: formData.displayName,
        student_id: formData.studentId,
        major: formData.major,
        year_level: formData.yearLevel,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/auth/verify-email")
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return {
        error: "กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ ตรวจสอบอีเมลและคลิกลิงก์ยืนยัน",
        code: "email_not_confirmed",
        email,
      }
    }
    return { error: error.message }
  }

  redirect("/dashboard")
}

export async function resendVerificationEmail(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.SUPABASE_URL}/dashboard`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
