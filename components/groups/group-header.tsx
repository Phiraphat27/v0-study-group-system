import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"

interface GroupHeaderProps {
  group: {
    group_name: string
    subjects: {
      subject_code: string
      subject_name: string
    }
    profiles: {
      display_name: string
    }
    created_at: string
  }
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex size-16 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="size-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{group.group_name}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>สร้างโดย {group.profiles.display_name}</span>
            <span>•</span>
            <span>
              {new Date(group.created_at).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-base">
          {group.subjects.subject_code} - {group.subjects.subject_name}
        </Badge>
      </div>
    </div>
  )
}
