import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface Exam {
  id: string
  exam_name: string
  exam_date: string
  exam_time: string | null
  subjects: {
    subject_code: string
  }
}

interface Session {
  id: string
  session_title: string
  session_date: string
  start_time: string
  end_time: string
  study_groups: {
    group_name: string
  }
}

interface UpcomingEventsProps {
  exams: Exam[]
  sessions: Session[]
}

export function UpcomingEvents({ exams, sessions }: UpcomingEventsProps) {
  const allEvents = [
    ...exams.map((exam) => ({
      id: exam.id,
      type: "exam" as const,
      title: exam.exam_name,
      date: exam.exam_date,
      time: exam.exam_time,
      badge: exam.subjects.subject_code,
    })),
    ...sessions.map((session) => ({
      id: session.id,
      type: "session" as const,
      title: session.session_title,
      date: session.session_date,
      time: `${session.start_time} - ${session.end_time}`,
      badge: session.study_groups.group_name,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>กิจกรรมที่กำลังจะมาถึง</CardTitle>
        <Link href="/calendar">
          <Button variant="ghost" size="sm">
            ดูทั้งหมด
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {allEvents.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">ยังไม่มีกิจกรรมที่กำลังจะมาถึง</p>
        ) : (
          <div className="space-y-3">
            {allEvents.slice(0, 5).map((event) => (
              <div key={`${event.type}-${event.id}`} className="flex items-start gap-3 rounded-lg border p-3">
                <div
                  className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    event.type === "exam" ? "bg-destructive/10" : "bg-primary/10"
                  }`}
                >
                  <Calendar className={`size-5 ${event.type === "exam" ? "text-destructive" : "text-primary"}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant={event.type === "exam" ? "destructive" : "default"} className="shrink-0">
                      {event.badge}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {new Date(event.date).toLocaleDateString("th-TH", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {event.time && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{event.time}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
