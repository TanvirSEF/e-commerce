"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { type Upload } from "@/db/schema/uploads"
import {
  createUploadRecordAction,
  deleteUploadRecordAction,
  bulkDeleteUploadRecordsAction,
} from "@/app/actions/ecommerce-actions"
import {
  Upload as UploadIcon,
  Search,
  MoreVertical,
  Info,
  Download,
  Copy,
  Trash2,
  File,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  X,
} from "lucide-react"

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

  // Upload Form State
  const [uploadName, setUploadName] = useState("")
  const [uploadUrl, setUploadUrl] = useState("")
  const [uploadType, setUploadType] = useState("image")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return
    await deleteUploadRecordAction(id)
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setSelectedIds((prev) => prev.filter((i) => i !== id))
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

  const handleAddUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadName.trim() || !uploadUrl.trim()) return
    setIsSubmitting(true)
    try {
      const ext = uploadUrl.split(".").pop()?.split("?")[0] || "jpg"
      const created = await createUploadRecordAction({
        fileOriginalName: uploadName,
        fileName: uploadUrl,
        fileSize: 450000,
        extension: ext,
        type: uploadType,
        externalLink: uploadUrl,
      })
      if (created) {
        setFiles((prev) => [created, ...prev])
      }
      setIsUploadOpen(false)
      setUploadName("")
      setUploadUrl("")
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-800">All Uploaded Files</h1>
          <p className="text-xs text-gray-500 mt-1">Manage images, banners, and documents in media library</p>
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
                    onClick={() => handleDelete(file.id)}
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
                  <span className="uppercase text-[10px] font-bold px-1.5 py-0.2 bg-gray-100 rounded">
                    {file.extension}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Details Info Modal */}
      {infoModalFile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-800">File Details</h3>
              <button onClick={() => setInfoModalFile(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Original Name:</span>
                <span className="text-gray-800 font-semibold truncate max-w-xs">{infoModalFile.fileOriginalName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">File Size:</span>
                <span className="text-gray-800 font-semibold">{formatSize(infoModalFile.fileSize || 0)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Type:</span>
                <span className="text-gray-800 font-semibold uppercase">{infoModalFile.type} ({infoModalFile.extension})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Uploaded At:</span>
                <span className="text-gray-800 font-semibold">
                  {new Date(infoModalFile.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="pt-2">
                <label className="text-gray-500 font-medium block mb-1">Direct Link:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={infoModalFile.externalLink || infoModalFile.fileName}
                    className="w-full text-[11px] p-2 bg-gray-50 border border-gray-200 rounded font-mono"
                  />
                  <button
                    onClick={() => handleCopyLink(infoModalFile)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => setInfoModalFile(null)}
                className="px-4 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New File Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddUpload}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-800">Add New File to Library</h3>
              <button type="button" onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. promo-banner-summer.jpg"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">File URL / Source</label>
                <input
                  type="url"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or file path"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                >
                  <option value="image">Image</option>
                  <option value="document">Document (PDF/DOC)</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#d43533] text-white text-xs font-semibold rounded-lg hover:bg-[#b82d2b]"
              >
                {isSubmitting ? "Uploading..." : "Save File"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
