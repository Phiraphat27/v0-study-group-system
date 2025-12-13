import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { GroupHeader } from "@/components/groups/group-header"
import { GroupMembers } from "@/components/groups/group-members"
import { GroupActions } from "@/components/groups/group-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar } from "lucide-react"

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: group } = await supabase
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
        id,
        display_name
      )
    `,
    )
    .eq("id", id)
    .single()

  if (!group) {
    notFound()
  }

  const { data: members } = await supabase
    .from("group_members")
    .select(
      `
      *,
      profiles (
        id,
        display_name,
        student_id,
        major,
        year_level
      )
    `,
    )
    .eq("group_id", id)
    .eq("status", "approved")

  const { data: sessions } = await supabase
    .from("study_sessions")
    .select(
      `
      *,
      profiles!study_sessions_created_by_fkey (
        display_name
      )
    `,
    )
    .eq("group_id", id)
    .order("session_date", { ascending: true })

  const isMember = members?.some((m) => m.user_id === user.id) || false
  const isOwner = group.created_by === user.id

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <GroupHeader group={group} />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>รายละเอียดกลุ่ม</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{group.description || "ไม่มีคำอธิบาย"}</p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-muted-foreground" />
                <span>
                  {members?.length || 0} / {group.max_members} สมาชิก
                </span>
              </div>
              {group.study_location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{group.study_location}</span>
                </div>
              )}
              {group.meeting_schedule && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>{group.meeting_schedule}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">ประเภท:</span>
              <Badge variant={group.group_type === "public" ? "default" : "secondary"}>
                {group.group_type === "public" ? "สาธารณะ" : "ส่วนตัว"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>การดำเนินการ</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupActions groupId={id} isMember={isMember} isOwner={isOwner} userId={user.id} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="mt-6">
        <TabsList>
          <TabsTrigger value="members">สมาชิก ({members?.length || 0})</TabsTrigger>
          <TabsTrigger value="sessions">นัดหมายติว ({sessions?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <GroupMembers members={members || []} ownerId={group.created_by} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {sessions && sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex-1">
                        <h4 className="font-semibold">{session.session_title}</h4>
                        <p className="text-sm text-muted-foreground">{session.session_description}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm">
                          <span>
                            {new Date(session.session_date).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <span>
                            {session.start_time} - {session.end_time}
                          </span>
                          {session.location && <span>📍 {session.location}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">ยังไม่มีนัดหมายติว</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
