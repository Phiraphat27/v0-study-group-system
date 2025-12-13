"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { DocumentCard } from "./document-card"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Document {
  id: string
  title: string
  description: string | null
  file_url: string
  file_type: string | null
  file_size: number | null
  is_public: boolean
  download_count: number
  created_at: string
  uploaded_by: string
  profiles: {
    display_name: string
  }
  study_groups: {
    id: string
    group_name: string
  } | null
  subjects: {
    subject_code: string
    subject_name: string
  } | null
}

interface DocumentsListProps {
  documents: Document[]
  userId: string
}

export function DocumentsList({ documents, userId }: DocumentsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.subjects?.subject_name.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "my-documents") {
      return matchesSearch && doc.uploaded_by === userId
    }
    if (filter === "public") {
      return matchesSearch && doc.is_public
    }

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหาเอกสาร..."
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
            <SelectItem value="all">เอกสารทั้งหมด</SelectItem>
            <SelectItem value="my-documents">เอกสารของฉัน</SelectItem>
            <SelectItem value="public">เอกสารสาธารณะ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">ไม่พบเอกสารที่ตรงกับเงื่อนไข</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} isOwner={doc.uploaded_by === userId} />
          ))}
        </div>
      )}
    </div>
  )
}
