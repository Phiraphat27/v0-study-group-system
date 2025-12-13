import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Member {
  id: string
  user_id: string
  role: string
  profiles: {
    id: string
    display_name: string
    student_id: string | null
    major: string | null
    year_level: number | null
  }
}

interface GroupMembersProps {
  members: Member[]
  ownerId: string
}

export function GroupMembers({ members, ownerId }: GroupMembersProps) {
  const getRoleLabel = (role: string, userId: string) => {
    if (userId === ownerId) return "ผู้สร้าง"
    if (role === "admin") return "ผู้ดูแล"
    return "สมาชิก"
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{member.profiles.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{member.profiles.display_name}</div>
              <div className="text-sm text-muted-foreground">
                {member.profiles.major && member.profiles.year_level
                  ? `${member.profiles.major} ปี ${member.profiles.year_level}`
                  : member.profiles.student_id || "นักศึกษา"}
              </div>
            </div>
          </div>
          <Badge variant={member.user_id === ownerId ? "default" : "secondary"}>
            {getRoleLabel(member.role, member.user_id)}
          </Badge>
        </div>
      ))}
    </div>
  )
}
