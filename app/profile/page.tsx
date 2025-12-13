import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { SkillsManager } from "@/components/profile/skills-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: skills } = await supabase
    .from("user_skills")
    .select(
      `
      *,
      subjects (
        id,
        subject_code,
        subject_name
      )
    `,
    )
    .eq("user_id", user.id)

  const { data: subjects } = await supabase.from("subjects").select("*").order("subject_code")

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">โปรไฟล์ของฉัน</h1>
        <p className="text-muted-foreground">จัดการข้อมูลส่วนตัวและความถนัดของคุณ</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
          <TabsTrigger value="skills">ความถนัด</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>แก้ไขข้อมูลส่วนตัว</CardTitle>
              <CardDescription>อัปเดตข้อมูลโปรไฟล์และข้อมูลการติดต่อของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>จัดการความถนัด</CardTitle>
              <CardDescription>เพิ่มวิชาที่คุณถนัดเพื่อให้เพื่อนคนอื่นหาคุณเจอ</CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsManager skills={skills || []} subjects={subjects || []} userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
