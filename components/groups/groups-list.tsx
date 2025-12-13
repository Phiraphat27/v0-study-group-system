"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { GroupCard } from "./group-card"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Group {
  id: string
  group_name: string
  description: string | null
  max_members: number
  group_type: string
  created_at: string
  subjects: {
    subject_code: string
    subject_name: string
  }
  profiles: {
    display_name: string
  }
  group_members: { user_id: string }[]
}

interface GroupsListProps {
  groups: Group[]
  myGroupIds: string[]
  userId: string
}

export function GroupsList({ groups, myGroupIds, userId }: GroupsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subjects.subject_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subjects.subject_name.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "my-groups") {
      return matchesSearch && myGroupIds.includes(group.id)
    }

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหากลุ่มติว..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">กลุ่มทั้งหมด</SelectItem>
            <SelectItem value="my-groups">กลุ่มของฉัน</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">ไม่พบกลุ่มที่ตรงกับเงื่อนไข</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} isMember={myGroupIds.includes(group.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
