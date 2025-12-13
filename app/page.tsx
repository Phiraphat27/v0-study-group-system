import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, FileText, Calendar, BookMarked, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <BookMarked className="size-7 text-primary" />
            <span className="text-2xl font-bold">เพื่อนติว</span>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">เข้าสู่ระบบ</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>สร้างบัญชี</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              แพลตฟอร์มหากลุ่มติวสำหรับนักศึกษา
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tight">เรียนรู้ไปด้วยกัน กับเพื่อนติว</h1>
            <p className="text-balance text-xl text-muted-foreground">
              แพลตฟอร์มที่ช่วยให้นักศึกษาหาเพื่อนติว แชร์เอกสาร และจัดตารางการเรียนได้อย่างง่ายดาย
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="text-lg">
                  เริ่มต้นใช้งานฟรี
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-lg bg-transparent">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <h2 className="mb-12 text-center text-3xl font-bold">ฟีเจอร์หลัก</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">กลุ่มติว</h3>
                  <p className="text-muted-foreground">สร้างและเข้าร่วมกลุ่มติวตามวิชาที่คุณสนใจ</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">จัดการความถนัด</h3>
                  <p className="text-muted-foreground">แสดงความถนัดของคุณเพื่อให้เพื่อนคนอื่นหาคุณเจอ</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">คลังเอกสาร</h3>
                  <p className="text-muted-foreground">แชร์และเข้าถึงเอกสารการเรียนจากเพื่อนๆ</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">ปฏิทินและนัดหมาย</h3>
                  <p className="text-muted-foreground">จัดการตารางสอบและนัดหมายติวได้สะดวก</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 เพื่อนติว. สร้างด้วย v0 by Vercel</p>
        </div>
      </footer>
    </div>
  )
}
