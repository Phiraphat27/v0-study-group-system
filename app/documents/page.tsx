import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DocumentsList } from "@/components/documents/documents-list"
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog"
import { Card, CardContent } from "@/components/ui/card"

export default async function DocumentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get user's groups for upload dialog
  const { data: userGroups } = await supabase
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

  // Get all documents user can access (public + their groups + their uploads)
  const { data: documents } = await supabase
    .from("documents")
    .select(
      `
      *,
      profiles!documents_uploaded_by_fkey (
        display_name
      ),
      study_groups (
        id,
        group_name
      ),
      subjects (
        subject_code,
        subject_name
      )
    `,
    )
    .or(`is_public.eq.true,uploaded_by.eq.${user.id}`)
    .order("created_at", { ascending: false })

  const groups = userGroups?.map((ug) => ug.study_groups).filter(Boolean) || []

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">คลังเอกสาร</h1>
          <p className="text-muted-foreground">เข้าถึงและแชร์เอกสารการเรียน</p>
        </div>
        <UploadDocumentDialog
          groups={groups as { id: string; group_name: string }[]}
          subjects={subjects || []}
          userId={user.id}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <DocumentsList documents={documents || []} userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
