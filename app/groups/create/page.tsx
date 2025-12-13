import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CreateGroupForm } from "@/components/groups/create-group-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CreateGroupPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: subjects } = await supabase.from("subjects").select("*").order("subject_code")

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>สร้างกลุ่มติวใหม่</CardTitle>
          <CardDescription>สร้างกลุ่มของคุณและเชิญเพื่อนมาเรียนด้วยกัน</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateGroupForm subjects={subjects || []} userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
