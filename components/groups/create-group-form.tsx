"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Subject {
  id: string
  subject_code: string
  subject_name: string
}

interface CreateGroupFormProps {
  subjects: Subject[]
  userId: string
}

export function CreateGroupForm({ subjects, userId }: CreateGroupFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    group_name: "",
    subject_id: "",
    description: "",
    max_members: "10",
    study_location: "",
    meeting_schedule: "",
    group_type: "public",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data: group, error: groupError } = await supabase
        .from("study_groups")
        .insert({
          group_name: formData.group_name,
          subject_id: formData.subject_id,
          description: formData.description || null,
          max_members: Number.parseInt(formData.max_members),
          study_location: formData.study_location || null,
          meeting_schedule: formData.meeting_schedule || null,
          group_type: formData.group_type,
          created_by: userId,
        })
        .select()
        .single()

      if (groupError) throw groupError

      const { error: memberError } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: userId,
        role: "owner",
        status: "approved",
      })

      if (memberError) throw memberError

      router.push(`/groups/${group.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาด")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="group_name">ชื่อกลุ่ม *</Label>
        <Input
          id="group_name"
          value={formData.group_name}
          onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
          placeholder="เช่น กลุ่มติววิชา Calculus"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject_id">วิชา *</Label>
        <Select value={formData.subject_id} onValueChange={(value) => setFormData({ ...formData, subject_id: value })}>
          <SelectTrigger id="subject_id">
            <SelectValue placeholder="เลือกวิชา" />
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
        <Label htmlFor="description">คำอธิบาย</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="บอกเล่าเกี่ยวกับกลุ่มของคุณ..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_members">จำนวนสมาชิกสูงสุด</Label>
          <Input
            id="max_members"
            type="number"
            min="2"
            max="50"
            value={formData.max_members}
            onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="group_type">ประเภทกลุ่ม</Label>
          <Select
            value={formData.group_type}
            onValueChange={(value) => setFormData({ ...formData, group_type: value })}
          >
            <SelectTrigger id="group_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">สาธารณะ</SelectItem>
              <SelectItem value="private">ส่วนตัว</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="study_location">สถานที่ติว</Label>
        <Input
          id="study_location"
          value={formData.study_location}
          onChange={(e) => setFormData({ ...formData, study_location: e.target.value })}
          placeholder="เช่น ห้องสมุดกลาง"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meeting_schedule">ตารางนัดหมาย</Label>
        <Input
          id="meeting_schedule"
          value={formData.meeting_schedule}
          onChange={(e) =>
            setFormData({
              ...formData,
              meeting_schedule: e.target.value,
            })
          }
          placeholder="เช่น ทุกวันอังคาร 16:00-18:00"
        />
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          ยกเลิก
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "กำลังสร้าง..." : "สร้างกลุ่ม"}
        </Button>
      </div>
    </form>
  )
}
