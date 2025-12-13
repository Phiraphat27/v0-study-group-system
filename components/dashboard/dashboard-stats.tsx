import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, BookOpen, Calendar } from "lucide-react"

interface DashboardStatsProps {
  groupsCount: number
  documentsCount: number
  skillsCount: number
  examsCount: number
}

export function DashboardStats({ groupsCount, documentsCount, skillsCount, examsCount }: DashboardStatsProps) {
  const stats = [
    {
      label: "กลุ่มที่เข้าร่วม",
      value: groupsCount,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      label: "เอกสารที่อัปโหลด",
      value: documentsCount,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      label: "ความถนัด",
      value: skillsCount,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      label: "สอบที่กำลังจะมาถึง",
      value: examsCount,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <Icon className={`size-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
