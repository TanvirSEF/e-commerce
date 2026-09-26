"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { type Upload } from "@/db/schema/uploads"
import {
  deleteUploadRecordAction,
  bulkDeleteUploadRecordsAction,
} from "@/app/actions/ecommerce-actions"
import {
  Search,
  Info,
  Copy,
  Trash2,
  FileText,
  CheckCircle,
  Plus,
  Cloud,
} from "lucide-react"
import { UploadFileModal } from "./upload-file-modal"
import { FileDetailsModal } from "./file-details-modal"

interface UploadedFilesViewProps {
  initialFiles: Upload[]
}

export function UploadedFilesView({ initialFiles }: UploadedFilesViewProps) {
  const router = useRouter()
  const [files, setFiles] = useState<Upload[]>(initialFiles)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [typeFilter, setTypeFilter] = useState("all")
  const [infoModalFile, setInfoModalFile] = useState<Upload | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // Filter & Sort
  const filteredFiles = files
    .filter((f) => {
      if (typeFilter !== "all" && f.type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          f.fileOriginalName?.toLowerCase().includes(q) ||
          f.fileName.toLowerCase().includes(q) ||
          f.extension?.toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === "smallest") return (a.fileSize || 0) - (b.fileSize || 0)
      if (sortBy === "largest") return (b.fileSize || 0) - (a.fileSize || 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredFiles.map((f) => f.id))
    }
  }

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleCopyLink = (file: Upload) => {
    const url = file.externalLink || file.fileName
    navigator.clipboard.writeText(url)
    setCopiedId(file.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (file: Upload) => {
    if (!confirm("Are you sure you want to delete this file from storage and database?")) return
    await deleteUploadRecordAction(file.id, file.fileName)
    setFiles((prev) => prev.filter((f) => f.id !== file.id))
    setSelectedIds((prev) => prev.filter((i) => i !== file.id))
    router.refresh()
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Delete ${selectedIds.length} selected files?`)) return
    await bulkDeleteUploadRecordsAction(selectedIds)
    setFiles((prev) => prev.filter((f) => !selectedIds.includes(f.id)))
    setSelectedIds([])
    router.refresh()
  }

  const handleUploadedFiles = (newFiles: Upload[]) => {
    setFiles((prev) => [...newFiles, ...prev])
    router.refresh()
  }

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${bytes} B`
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">All Uploaded Files</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Cloud className="w-3 h-3" /> Cloudinary Enabled
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage images, banners, and documents in high-speed CDN media library
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Upload New File
        </button>
      </div>

      {/* Toolbar & Filters Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700">All Files ({filteredFiles.length})</span>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg outline-none bg-white text-gray-700"
            >
              <option value="all">All File Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg outline-none bg-white text-gray-700"
            >
              <option value="newest">Sort by newest</option>
              <option value="oldest">Sort by oldest</option>
              <option value="smallest">Sort by smallest</option>
              <option value="largest">Sort by largest</option>
            </select>

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="text-xs pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg outline-none w-44 sm:w-56 focus:border-[#d43533]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Select All Checkbox */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
          <input
            type="checkbox"
            id="selectAll"
            checked={filteredFiles.length > 0 && selectedIds.length === filteredFiles.length}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded text-[#d43533] focus:ring-[#d43533] cursor-pointer"
          />
          <label htmlFor="selectAll" className="text-xs text-gray-600 font-medium cursor-pointer">
            Select All
          </label>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredFiles.map((file) => {
          const isSelected = selectedIds.includes(file.id)
          const isImage = file.type === "image" || ["jpg", "jpeg", "png", "webp", "gif"].includes(file.extension || "")
          const fileUrl = file.externalLink || file.fileName

          return (
            <div
              key={file.id}
              className={`bg-white border rounded-xl p-2.5 shadow-sm transition-all group relative flex flex-col justify-between ${
                isSelected ? "border-[#d43533] ring-1 ring-[#d43533]" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Top Row: Checkbox + Actions */}
              <div className="flex items-center justify-between mb-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectOne(file.id)}
                  className="w-3.5 h-3.5 rounded text-[#d43533] focus:ring-[#d43533] cursor-pointer"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyLink(file)}
                    title={copiedId === file.id ? "Copied!" : "Copy Link"}
                    className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {copiedId === file.id ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setInfoModalFile(file)}
                    title="Details Info"
                    className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    title="Delete"
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Preview Thumbnail */}
              <div className="h-28 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={file.fileOriginalName || "Media thumbnail"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <FileText className="w-8 h-8" />
                    <span className="text-[10px] uppercase font-bold text-gray-500">{file.extension}</span>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="mt-2.5">
                <p className="text-xs font-semibold text-gray-800 truncate" title={file.fileOriginalName || ""}>
                  {file.fileOriginalName || file.fileName}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                  <span>{formatSize(file.fileSize || 0)}</span>
                  <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded">
                    {file.extension}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload File Modal */}
      <UploadFileModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={handleUploadedFiles}
      />

      {/* Details Info Modal */}
      <FileDetailsModal
        file={infoModalFile}
        onClose={() => setInfoModalFile(null)}
      />
    </div>
  )
}
