"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { BookMarked, Home, Users, FileText, Calendar, User, LogOut } from "lucide-react"

interface DashboardNavProps {
  userName: string
}

export function DashboardNav({ userName }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { href: "/dashboard", label: "หน้าแรก", icon: Home },
    { href: "/groups", label: "กลุ่มติว", icon: Users },
    { href: "/documents", label: "เอกสาร", icon: FileText },
    { href: "/calendar", label: "ปฏิทิน", icon: Calendar },
    { href: "/profile", label: "โปรไฟล์", icon: User },
  ]

  return (
    <aside className="w-64 border-r bg-muted/30">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BookMarked className="size-7 text-primary" />
            <span className="text-xl font-bold">เพื่อนติว</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? "bg-secondary" : ""}`}
                >
                  <Icon className="mr-3 size-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 px-3 text-sm">
            <div className="font-medium">{userName}</div>
            <div className="text-xs text-muted-foreground">นักศึกษา</div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
            <LogOut className="mr-3 size-5" />
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </aside>
  )
}
