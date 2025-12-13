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
import { Plus } from "lucide-react"

interface AddSessionDialogProps {
  groups: { id: string; group_name: string }[]
  userId: string
}

export function AddSessionDialog({ groups, userId }: AddSessionDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    session_title: "",
    group_id: "",
    session_description: "",
    session_date: "",
    start_time: "",
    end_time: "",
    location: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("study_sessions").insert({
        group_id: formData.group_id,
        session_title: formData.session_title,
        session_description: formData.session_description || null,
        session_date: formData.session_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location || null,
        created_by: userId,
      })

      if (error) throw error

      setOpen(false)
      setFormData({
        session_title: "",
        group_id: "",
        session_description: "",
        session_date: "",
        start_time: "",
        end_time: "",
        location: "",
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
          <Plus className="mr-2 size-4" />
          เพิ่มนัดหมายติว
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>เพิ่มนัดหมายติว</DialogTitle>
          <DialogDescription>สร้างนัดหมายติวสำหรับกลุ่มของคุณ</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group_id">กลุ่ม *</Label>
            <Select value={formData.group_id} onValueChange={(value) => setFormData({ ...formData, group_id: value })}>
              <SelectTrigger id="group_id">
                <SelectValue placeholder="เลือกกลุ่ม" />
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

          <div className="space-y-2">
            <Label htmlFor="session_title">หัวข้อ *</Label>
            <Input
              id="session_title"
              value={formData.session_title}
              onChange={(e) => setFormData({ ...formData, session_title: e.target.value })}
              placeholder="เช่น ติว Chapter 3"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session_description">รายละเอียด</Label>
            <Textarea
              id="session_description"
              value={formData.session_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  session_description: e.target.value,
                })
              }
              placeholder="บอกเล่าเกี่ยวกับนัดหมายติวนี้..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session_date">วันที่ *</Label>
            <Input
              id="session_date"
              type="date"
              value={formData.session_date}
              onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">เวลาเริ่ม *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">เวลาสิ้นสุด *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">สถานที่</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="เช่น ห้องสมุดกลาง"
            />
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "กำลังเพิ่ม..." : "สร้างนัดหมาย"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
