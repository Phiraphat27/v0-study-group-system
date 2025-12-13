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

interface ProfileFormProps {
  profile: {
    id: string
    display_name: string
    student_id: string | null
    major: string | null
    year_level: number | null
    bio: string | null
    contact_info: Record<string, string>
  } | null
  userId: string
}

export function ProfileForm({ profile, userId }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    student_id: profile?.student_id || "",
    major: profile?.major || "",
    year_level: profile?.year_level?.toString() || "",
    bio: profile?.bio || "",
    phone: profile?.contact_info?.phone || "",
    line_id: profile?.contact_info?.line_id || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: formData.display_name,
          student_id: formData.student_id || null,
          major: formData.major || null,
          year_level: formData.year_level ? Number.parseInt(formData.year_level) : null,
          bio: formData.bio || null,
          contact_info: {
            phone: formData.phone,
            line_id: formData.line_id,
          },
        })
        .eq("id", userId)

      if (error) throw error

      router.refresh()
      alert("บันทึกข้อมูลสำเร็จ")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาด")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display_name">ชื่อที่แสดง *</Label>
        <Input
          id="display_name"
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student_id">รหัสนักศึกษา</Label>
          <Input
            id="student_id"
            value={formData.student_id}
            onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year_level">ชั้นปี</Label>
          <Select
            value={formData.year_level}
            onValueChange={(value) => setFormData({ ...formData, year_level: value })}
          >
            <SelectTrigger id="year_level">
              <SelectValue placeholder="เลือกชั้นปี" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">ปี 1</SelectItem>
              <SelectItem value="2">ปี 2</SelectItem>
              <SelectItem value="3">ปี 3</SelectItem>
              <SelectItem value="4">ปี 4</SelectItem>
              <SelectItem value="5">ปี 5</SelectItem>
              <SelectItem value="6">ปี 6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="major">สาขาวิชา</Label>
        <Input
          id="major"
          value={formData.major}
          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          placeholder="วิทยาการคอมพิวเตอร์"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">เกี่ยวกับฉัน</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="บอกเล่าเกี่ยวกับตัวคุณ..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0812345678"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="line_id">LINE ID</Label>
          <Input
            id="line_id"
            value={formData.line_id}
            onChange={(e) => setFormData({ ...formData, line_id: e.target.value })}
            placeholder="mylineid"
          />
        </div>
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
      </Button>
    </form>
  )
}
