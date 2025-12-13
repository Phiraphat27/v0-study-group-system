"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react"

interface Exam {
  id: string
  exam_name: string
  exam_date: string
  exam_time: string | null
  location: string | null
  notes: string | null
  subjects: {
    subject_code: string
    subject_name: string
  }
}

interface Session {
  id: string
  session_title: string
  session_description: string | null
  session_date: string
  start_time: string
  end_time: string
  location: string | null
  study_groups: {
    group_name: string
  }
}

interface CalendarViewProps {
  exams: Exam[]
  sessions: Session[]
}

export function CalendarView({ exams, sessions }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayExams = exams.filter((exam) => exam.exam_date === dateStr)
    const daySessions = sessions.filter((session) => session.session_date === dateStr)
    return { exams: dayExams, sessions: daySessions }
  }

  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ]

  const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {monthNames[month]} {year + 543}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const { exams: dayExams, sessions: daySessions } = getEventsForDate(day)
          const today = new Date()
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

          return (
            <div
              key={day}
              className={`min-h-24 rounded-lg border p-2 ${isToday ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <div className={`mb-1 text-sm font-semibold ${isToday ? "text-primary" : ""}`}>{day}</div>
              <div className="space-y-1">
                {dayExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="rounded bg-destructive/10 px-1.5 py-0.5 text-xs text-destructive"
                    title={`${exam.exam_name} - ${exam.subjects.subject_name}`}
                  >
                    สอบ: {exam.subjects.subject_code}
                  </div>
                ))}
                {daySessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary"
                    title={`${session.session_title} - ${session.study_groups.group_name}`}
                  >
                    ติว: {session.session_title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">ตารางสอบ</h3>
          {exams.length === 0 ? (
            <p className="text-sm text-muted-foreground">ยังไม่มีตารางสอบ</p>
          ) : (
            <div className="space-y-3">
              {exams.slice(0, 5).map((exam) => (
                <div key={exam.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{exam.exam_name}</h4>
                      <Badge variant="outline" className="mt-1">
                        {exam.subjects.subject_code}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>
                        {new Date(exam.exam_date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {exam.exam_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        <span>{exam.exam_time}</span>
                      </div>
                    )}
                    {exam.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        <span>{exam.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">นัดหมายติว</h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">ยังไม่มีนัดหมายติว</p>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="rounded-lg border p-3 space-y-2">
                  <div>
                    <h4 className="font-semibold">{session.session_title}</h4>
                    <p className="text-sm text-muted-foreground">{session.study_groups.group_name}</p>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>
                        {new Date(session.session_date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <span>
                        {session.start_time} - {session.end_time}
                      </span>
                    </div>
                    {session.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        <span>{session.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
