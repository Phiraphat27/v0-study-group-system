"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Upload } from "lucide-react"

interface UploadDocumentDialogProps {
  groups: { id: string; group_name: string }[]
  subjects: { id: string; subject_code: string; subject_name: string }[]
  userId: string
}

export function UploadDocumentDialog({ groups, subjects, userId }: UploadDocumentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    subject_id: "",
    group_id: "",
    is_public: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (!formData.file_url) {
        throw new Error("กรุณากรอก URL ของไฟล์")
      }

      const { error } = await supabase.from("documents").insert({
        title: formData.title,
        description: formData.description || null,
        file_url: formData.file_url,
        file_type: "pdf",
        file_size: null,
        uploaded_by: userId,
        group_id: formData.group_id || null,
        subject_id: formData.subject_id || null,
        is_public: formData.is_public,
      })

      if (error) throw error

      setOpen(false)
      setFormData({
        title: "",
        description: "",
        file_url: "",
        subject_id: "",
        group_id: "",
        is_public: false,
      })
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาด")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 size-4" />
          อัปโหลดเอกสาร
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>อัปโหลดเอกสารใหม่</DialogTitle>
          <DialogDescription>แชร์เอกสารการเรียนของคุณกับเพื่อนๆ</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อเอกสาร *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="เช่น สรุปเนื้อหา Chapter 1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file_url">URL ของไฟล์ *</Label>
            <Input
              id="file_url"
              type="url"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              placeholder="https://example.com/document.pdf"
              required
            />
            <p className="text-xs text-muted-foreground">วาง URL ของไฟล์จาก Google Drive, Dropbox หรือที่อื่นๆ</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">คำอธิบาย</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="บอกเล่าเกี่ยวกับเอกสารนี้..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject_id">วิชา</Label>
            <Select
              value={formData.subject_id}
              onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
            >
              <SelectTrigger id="subject_id">
                <SelectValue placeholder="เลือกวิชา (ถ้ามี)" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.subject_code} - {subject.subject_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group_id">แชร์ในกลุ่ม</Label>
            <Select value={formData.group_id} onValueChange={(value) => setFormData({ ...formData, group_id: value })}>
              <SelectTrigger id="group_id">
                <SelectValue placeholder="เลือกกลุ่ม (ถ้ามี)" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.group_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="is_public" className="text-base">
                เอกสารสาธารณะ
              </Label>
              <p className="text-sm text-muted-foreground">อนุญาตให้ทุกคนเข้าถึงได้</p>
            </div>
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
            />
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "กำลังอัปโหลด..." : "อัปโหลด"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
