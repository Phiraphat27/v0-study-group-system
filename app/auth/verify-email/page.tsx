import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">ตรวจสอบอีเมลของคุณ</CardTitle>
            <CardDescription className="text-base">เราได้ส่งลิงก์ยืนยันไปยังอีเมลของคุณแล้ว</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
            <p>กรุณาคลิกลิงก์ในอีเมลเพื่อยืนยันบัญชีของคุณ หากคุณไม่เห็นอีเมล ลองตรวจสอบในโฟลเดอร์สแปม</p>
            <Link href="/auth/login" className="inline-block text-primary hover:underline">
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
