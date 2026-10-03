"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Upload,
  MoreVertical,
  Info,
  Download,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
} from "lucide-react"
import type { Upload as UploadType } from "@/db/schema/uploads"
import {
  deleteUploadRecordAction,
  bulkDeleteUploadRecordsAction,
} from "@/app/actions/ecommerce-actions"

interface SellerUploadedFilesViewProps {
  initialFiles: UploadType[]
}

function formatBytes(bytes?: number | null) {
  if (!bytes || bytes === 0) return "0 KB"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function SellerUploadedFilesView({ initialFiles }: SellerUploadedFilesViewProps) {
  const [files, setFiles] = useState<UploadType[]>(initialFiles)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)
  const [infoModalFile, setInfoModalFile] = useState<UploadType | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredFiles.map((f) => f.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleCopyUrl = (file: UploadType) => {
    const url = file.fileName.startsWith("http") ? file.fileName : `${window.location.origin}${file.fileName}`
    navigator.clipboard.writeText(url)
    showToast("success", "File URL copied to clipboard!")
    setActiveDropdownId(null)
  }

  const handleDeleteSingle = () => {
    if (!deleteTargetId) return
    startTransition(async () => {
      const res = await deleteUploadRecordAction(deleteTargetId)
      if (res) {
        setFiles((prev) => prev.filter((f) => f.id !== deleteTargetId))
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId))
        showToast("success", "File deleted successfully!")
        setDeleteTargetId(null)
      } else {
        showToast("error", "Failed to delete file.")
      }
    })
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    startTransition(async () => {
      const res = await bulkDeleteUploadRecordsAction(selectedIds)
      if (res) {
        setFiles((prev) => prev.filter((f) => !selectedIds.includes(f.id)))
        setSelectedIds([])
        showToast("success", `${selectedIds.length} files deleted!`)
        setIsBulkDeleteOpen(false)
      } else {
        showToast("error", "Failed to delete selected files.")
      }
    })
  }

  const filteredFiles = files
    .filter((f) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        f.fileOriginalName?.toLowerCase().includes(q) ||
        f.fileName?.toLowerCase().includes(q) ||
        f.extension?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === "smallest") return (a.fileSize || 0) - (b.fileSize || 0)
      if (sortBy === "largest") return (b.fileSize || 0) - (a.fileSize || 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-sm rounded border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-800">All uploaded files</h1>
        <Link
          href="/seller/uploaded-files/create"
          className="inline-flex items-center gap-1.5 rounded bg-[#d43533] hover:bg-[#b82a28] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload New File
        </Link>
      </div>

      {/* Card Filter Bar */}
      <div className="rounded border border-gray-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <h2 className="text-sm font-semibold text-gray-700">All files ({filteredFiles.length})</h2>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setIsBulkDeleteOpen(true)}
                className="rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 text-xs font-medium transition-colors"
              >
                Delete selected ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:border-[#d43533]"
            >
              <option value="newest">Sort by newest</option>
              <option value="oldest">Sort by oldest</option>
              <option value="smallest">Sort by smallest</option>
              <option value="largest">Sort by largest</option>
            </select>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Select All */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
          <input
            type="checkbox"
            id="selectAll"
            checked={filteredFiles.length > 0 && selectedIds.length === filteredFiles.length}
            onChange={toggleSelectAll}
            className="rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
          />
          <label htmlFor="selectAll" className="text-xs text-gray-600 font-medium cursor-pointer">
            Select All
          </label>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
          {filteredFiles.map((file) => {
            const isSelected = selectedIds.includes(file.id)
            const isImage = file.type === "image" || ["jpg", "jpeg", "png", "webp", "gif"].includes(file.extension || "")
            return (
              <div
                key={file.id}
                className={`relative rounded border bg-white p-2 transition-all flex flex-col justify-between group ${
                  isSelected ? "border-[#d43533] ring-1 ring-[#d43533]" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Top controls: Checkbox & Dropdown */}
                <div className="flex items-center justify-between z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(file.id)}
                    className="rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdownId(activeDropdownId === file.id ? null : file.id)}
                      className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {activeDropdownId === file.id && (
                      <div className="absolute right-0 mt-1 w-36 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-20 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setInfoModalFile(file)
                            setActiveDropdownId(null)
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                        >
                          <Info className="w-3.5 h-3.5 text-blue-500" />
                          Details Info
                        </button>
                        <a
                          href={file.fileName}
                          download={file.fileOriginalName || "file"}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-500" />
                          Download
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(file)}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                        >
                          <Copy className="w-3.5 h-3.5 text-purple-500" />
                          Copy Link
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTargetId(file.id)
                            setActiveDropdownId(null)
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="my-2 h-24 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                  {isImage ? (
                    <Image
                      src={file.fileName}
                      alt={file.fileOriginalName || "File"}
                      width={120}
                      height={96}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* Footer metadata */}
                <div className="pt-1 border-t border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-800 truncate" title={file.fileOriginalName || ""}>
                    {file.fileOriginalName || "Untitled"}
                  </p>
                  <p className="text-[10px] text-gray-400">{formatBytes(file.fileSize)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info Modal */}
      {infoModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-900">File Details</h4>
              <button type="button" onClick={() => setInfoModalFile(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-3 space-y-2 text-xs">
              <div><span className="text-gray-400">Original Name:</span> <span className="font-medium text-gray-800">{infoModalFile.fileOriginalName}</span></div>
              <div><span className="text-gray-400">File Size:</span> <span className="font-medium text-gray-800">{formatBytes(infoModalFile.fileSize)}</span></div>
              <div><span className="text-gray-400">Extension:</span> <span className="font-medium text-gray-800 uppercase">{infoModalFile.extension}</span></div>
              <div><span className="text-gray-400">Uploaded:</span> <span className="font-medium text-gray-800">{new Date(infoModalFile.createdAt).toLocaleDateString()}</span></div>
            </div>
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button type="button" onClick={() => setInfoModalFile(null)} className="px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h4 className="text-sm font-bold text-gray-900">Delete File</h4>
            <p className="text-xs text-gray-500 mt-2">Are you sure you want to delete this file? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setDeleteTargetId(null)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button type="button" onClick={handleDeleteSingle} disabled={isPending} className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50">
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {isBulkDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h4 className="text-sm font-bold text-gray-900">Delete Selected Files</h4>
            <p className="text-xs text-gray-500 mt-2">Are you sure you want to delete {selectedIds.length} selected files?</p>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setIsBulkDeleteOpen(false)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button type="button" onClick={handleBulkDelete} disabled={isPending} className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50">
                {isPending ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
