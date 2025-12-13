"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2, Users } from "lucide-react"

interface DocumentCardProps {
  document: {
    id: string
    title: string
    description: string | null
    file_url: string
    file_type: string | null
    file_size: number | null
    is_public: boolean
    download_count: number
    created_at: string
    profiles: {
      display_name: string
    }
    study_groups: {
      group_name: string
    } | null
    subjects: {
      subject_code: string
    } | null
  }
  isOwner: boolean
}

export function DocumentCard({ document, isOwner }: DocumentCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "ไม่ทราบขนาด"
    const mb = bytes / (1024 * 1024)
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`
    return `${mb.toFixed(1)} MB`
  }

  const handleDelete = async () => {
    if (!confirm("คุณต้องการลบเอกสารนี้ใช่หรือไม่?")) return

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("documents").delete().eq("id", document.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting document:", error)
      alert("ไม่สามารถลบเอกสารได้")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    // Increment download count
    const supabase = createClient()
    await supabase
      .from("documents")
      .update({ download_count: document.download_count + 1 })
      .eq("id", document.id)

    // Open file in new tab
    window.open(document.file_url, "_blank")
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{document.title}</CardTitle>
            {document.subjects && <Badge variant="outline">{document.subjects.subject_code}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3">
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{document.description || "ไม่มีคำอธิบาย"}</p>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>อัปโหลดโดย {document.profiles.display_name}</span>
            <span>{formatFileSize(document.file_size)}</span>
          </div>
          {document.study_groups && (
            <div className="flex items-center gap-1">
              <Users className="size-3" />
              <span>{document.study_groups.group_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Download className="size-3" />
            <span>ดาวน์โหลด {document.download_count} ครั้ง</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownload} size="sm" className="flex-1">
            <Download className="mr-2 size-3" />
            ดาวน์โหลด
          </Button>
          {isOwner && (
            <Button onClick={handleDelete} disabled={isDeleting} size="sm" variant="destructive">
              <Trash2 className="size-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
