"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { UserPlus, LogOut } from "lucide-react"

interface GroupActionsProps {
  groupId: string
  isMember: boolean
  isOwner: boolean
  userId: string
}

export function GroupActions({ groupId, isMember, isOwner, userId }: GroupActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinGroup = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: userId,
        role: "member",
        status: "approved",
      })

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error joining group:", error)
      alert("ไม่สามารถเข้าร่วมกลุ่มได้")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveGroup = async () => {
    if (!confirm("คุณต้องการออกจากกลุ่มนี้ใช่หรือไม่?")) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", userId)

      if (error) throw error

      router.push("/groups")
    } catch (error) {
      console.error("Error leaving group:", error)
      alert("ไม่สามารถออกจากกลุ่มได้")
    } finally {
      setIsLoading(false)
    }
  }

  if (isOwner) {
    return (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>คุณเป็นผู้สร้างกลุ่มนี้</p>
      </div>
    )
  }

  if (isMember) {
    return (
      <Button onClick={handleLeaveGroup} disabled={isLoading} variant="outline" className="w-full bg-transparent">
        <LogOut className="mr-2 size-4" />
        {isLoading ? "กำลังออก..." : "ออกจากกลุ่ม"}
      </Button>
    )
  }

  return (
    <Button onClick={handleJoinGroup} disabled={isLoading} className="w-full">
      <UserPlus className="mr-2 size-4" />
      {isLoading ? "กำลังเข้าร่วม..." : "เข้าร่วมกลุ่ม"}
    </Button>
  )
}
