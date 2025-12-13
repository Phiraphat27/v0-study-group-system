import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { RecentGroups } from "@/components/dashboard/recent-groups"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's groups
  const { data: userGroups } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .eq("status", "approved")

  const groupIds = userGroups?.map((g) => g.group_id) || []

  // Get recent groups
  const { data: groups } =
    groupIds.length > 0
      ? await supabase
          .from("study_groups")
          .select(
            `
          *,
          subjects (
            subject_code,
            subject_name
          )
        `,
          )
          .in("id", groupIds)
          .order("created_at", { ascending: false })
          .limit(3)
      : { data: [] }

  // Get upcoming exams
  const today = new Date().toISOString().split("T")[0]
  const { data: upcomingExams } = await supabase
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
    .gte("exam_date", today)
    .order("exam_date", { ascending: true })
    .limit(5)

  // Get upcoming sessions
  const { data: upcomingSessions } =
    groupIds.length > 0
      ? await supabase
          .from("study_sessions")
          .select(
            `
        *,
        study_groups (
          group_name
        )
      `,
          )
          .in("group_id", groupIds)
          .gte("session_date", today)
          .order("session_date", { ascending: true })
          .limit(5)
      : { data: [] }

  // Get user's documents count
  const { count: documentsCount } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("uploaded_by", user.id)

  // Get user's skills count
  const { count: skillsCount } = await supabase
    .from("user_skills")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="flex min-h-screen">
      <DashboardNav userName={profile?.display_name || "ผู้ใช้"} />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">ยินดีต้อนรับ, {profile?.display_name || "ผู้ใช้"}</h1>
            <p className="text-muted-foreground">ภาพรวมกิจกรรมและนัดหมายของคุณ</p>
          </div>

          <DashboardStats
            groupsCount={groupIds.length}
            documentsCount={documentsCount || 0}
            skillsCount={skillsCount || 0}
            examsCount={upcomingExams?.length || 0}
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <UpcomingEvents exams={upcomingExams || []} sessions={upcomingSessions || []} />
            <RecentGroups groups={groups || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
