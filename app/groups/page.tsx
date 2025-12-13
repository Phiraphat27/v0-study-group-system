import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { GroupsList } from "@/components/groups/groups-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function GroupsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: groups } = await supabase
    .from("study_groups")
    .select(
      `
      *,
      subjects (
        id,
        subject_code,
        subject_name
      ),
      profiles!study_groups_created_by_fkey (
        display_name
      ),
      group_members (
        user_id
      )
    `,
    )
    .order("created_at", { ascending: false })

  const { data: myGroups } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .eq("status", "approved")

  const myGroupIds = myGroups?.map((g) => g.group_id) || []

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">กลุ่มติว</h1>
          <p className="text-muted-foreground">ค้นหาและเข้าร่วมกลุ่มติวที่เหมาะกับคุณ</p>
        </div>
        <Link href="/groups/create">
          <Button>
            <Plus className="mr-2 size-4" />
            สร้างกลุ่มใหม่
          </Button>
        </Link>
      </div>

      <GroupsList groups={groups || []} myGroupIds={myGroupIds} userId={user.id} />
    </div>
  )
}
