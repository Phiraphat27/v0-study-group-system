"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface Skill {
  id: string
  subject_id: string
  skill_level: string
  subjects: {
    id: string
    subject_code: string
    subject_name: string
  }
}

interface Subject {
  id: string
  subject_code: string
  subject_name: string
}

interface SkillsManagerProps {
  skills: Skill[]
  subjects: Subject[]
  userId: string
}

export function SkillsManager({ skills, subjects, userId }: SkillsManagerProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [error, setError] = useState<string | null>(null)

  const availableSubjects = subjects.filter((subject) => !skills.some((skill) => skill.subject_id === subject.id))

  const handleAddSkill = async () => {
    if (!selectedSubject || !selectedLevel) {
      setError("กรุณาเลือกวิชาและระดับความถนัด")
      return
    }

    setIsAdding(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("user_skills").insert({
        user_id: userId,
        subject_id: selectedSubject,
        skill_level: selectedLevel,
      })

      if (error) throw error

      setSelectedSubject("")
      setSelectedLevel("")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาด")
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase.from("user_skills").delete().eq("id", skillId)

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      console.error("Error removing skill:", error)
    }
  }

  const getSkillLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: "เริ่มต้น",
      intermediate: "ปานกลาง",
      advanced: "ดี",
      expert: "เชี่ยวชาญ",
    }
    return labels[level] || level
  }

  const getSkillLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      intermediate: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      expert: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    }
    return colors[level] || ""
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">ความถนัดของฉัน</h3>
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">ยังไม่มีความถนัด เพิ่มความถนัดของคุณเพื่อให้เพื่อนหาคุณเจอ</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="gap-2 px-3 py-1.5">
                <span className="font-medium">{skill.subjects.subject_code}</span>
                <span className="text-muted-foreground">-</span>
                <span className={getSkillLevelColor(skill.skill_level)}>{getSkillLevelLabel(skill.skill_level)}</span>
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="ml-1 rounded-full hover:bg-muted"
                  aria-label="ลบความถนัด"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">เพิ่มความถนัด</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกวิชา" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.subject_code} - {subject.subject_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue placeholder="ระดับความถนัด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">เริ่มต้น</SelectItem>
              <SelectItem value="intermediate">ปานกลาง</SelectItem>
              <SelectItem value="advanced">ดี</SelectItem>
              <SelectItem value="expert">เชี่ยวชาญ</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleAddSkill} disabled={isAdding || !selectedSubject || !selectedLevel}>
            {isAdding ? "กำลังเพิ่ม..." : "เพิ่มความถนัด"}
          </Button>
        </div>

        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      </div>
    </div>
  )
}
