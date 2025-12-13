import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users } from "lucide-react"

interface Group {
  id: string
  group_name: string
  subjects: {
    subject_code: string
    subject_name: string
  }
}

interface RecentGroupsProps {
  groups: Group[]
}

export function RecentGroups({ groups }: RecentGroupsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>กลุ่มของฉัน</CardTitle>
        <Link href="/groups">
          <Button variant="ghost" size="sm">
            ดูทั้งหมด
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">คุณยังไม่ได้เข้าร่วมกลุ่มใดๆ</p>
            <Link href="/groups">
              <Button size="sm">ค้นหากลุ่มติว</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <div className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent">
                  <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">{group.group_name}</h4>
                    <Badge variant="outline">{group.subjects.subject_code}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
