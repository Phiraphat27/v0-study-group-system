"use client"

import type React from "react"

import { resendVerificationEmail, signIn } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setNeedsVerification(false)
    setResendSuccess(false)

    try {
      const result = await signIn(email, password)

      if (result?.error) {
        setError(result.error)
        if (result.code === "email_not_confirmed") {
          setNeedsVerification(true)
        }
        setIsLoading(false)
      }
      // If successful, redirect happens in server action
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "ไม่สามารถเข้าสู่ระบบได้")
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    setResendSuccess(false)

    try {
      const result = await resendVerificationEmail(email)

      if (result?.error) {
        setError(result.error)
      } else {
        setResendSuccess(true)
        setError(null)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "ไม่สามารถส่งอีเมลได้")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">เพื่อนติว</CardTitle>
            <CardDescription>เข้าสู่ระบบเพื่อเริ่มเรียนรู้</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.ac.th"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="รหัสผ่านของคุณ"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <div className="flex gap-2">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                </div>
              )}

              {resendSuccess && (
                <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
                  <div className="flex gap-2">
                    <Mail className="size-4 shrink-0 mt-0.5" />
                    <div>ส่งอีเมลยืนยันใหม่แล้ว กรุณาตรวจสอบกล่องข้อความของคุณ</div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>

              {needsVerification && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? "กำลังส่งอีเมล..." : "ส่งอีเมลยืนยันอีกครั้ง"}
                </Button>
              )}

              <div className="text-center text-sm text-muted-foreground">
                ยังไม่มีบัญชี?{" "}
                <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
                  สร้างบัญชีใหม่
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
