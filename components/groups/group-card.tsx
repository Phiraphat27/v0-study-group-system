import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, User } from "lucide-react"

interface GroupCardProps {
  group: {
    id: string
    group_name: string
    description: string | null
    max_members: number
    group_type: string
    subjects: {
      subject_code: string
      subject_name: string
    }
    profiles: {
      display_name: string
    }
    group_members: { user_id: string }[]
  }
  isMember: boolean
}

export function GroupCard({ group, isMember }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl">{group.group_name}</CardTitle>
              <Badge variant="outline" className="mt-2">
                {group.subjects.subject_code}
              </Badge>
            </div>
            {isMember && <Badge variant="default">เข้าร่วมแล้ว</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">{group.description || "ไม่มีคำอธิบาย"}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="size-4" />
              <span>{group.profiles.display_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="size-4 text-muted-foreground" />
              <span>
                {group.group_members.length}/{group.max_members}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
