import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CalendarView } from "@/components/calendar/calendar-view"
import { AddExamDialog } from "@/components/calendar/add-exam-dialog"
import { AddSessionDialog } from "@/components/calendar/add-session-dialog"
import { Card, CardContent } from "@/components/ui/card"

export default async function CalendarPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get user's exam schedules
  const { data: exams } = await supabase
    .from("exam_schedules")
    .select(
      `
      *,
      subjects (
        subject_code,
        subject_name
      )
    `,
    )
    .eq("user_id", user.id)
    .order("exam_date", { ascending: true })

  // Get study sessions from user's groups
  const { data: userGroups } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .eq("status", "approved")

  const groupIds = userGroups?.map((g) => g.group_id) || []

  const { data: sessions } =
    groupIds.length > 0
      ? await supabase
          .from("study_sessions")
          .select(
            `
        *,
        study_groups (
          id,
          group_name
        )
      `,
          )
          .in("group_id", groupIds)
          .order("session_date", { ascending: true })
      : { data: [] }

  // Get user's groups and subjects for the add dialogs
  const { data: myGroups } = await supabase
    .from("group_members")
    .select(
      `
      group_id,
      study_groups (
        id,
        group_name
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "approved")

  const { data: subjects } = await supabase.from("subjects").select("*").order("subject_code")

  const groups = myGroups?.map((ug) => ug.study_groups).filter(Boolean) || []

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ปฏิทินและนัดหมาย</h1>
          <p className="text-muted-foreground">จัดการตารางสอบและนัดหมายติว</p>
        </div>
        <div className="flex gap-2">
          <AddExamDialog subjects={subjects || []} userId={user.id} />
          <AddSessionDialog groups={groups as { id: string; group_name: string }[]} userId={user.id} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CalendarView exams={exams || []} sessions={sessions || []} />
        </CardContent>
      </Card>
    </div>
  )
}
