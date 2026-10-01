"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Upload } from "@/db/schema/uploads"
import {
  deleteUploadRecordAction,
  bulkDeleteUploadRecordsAction,
} from "@/app/actions/ecommerce-actions"
import { Search, Plus, Cloud, RefreshCw, Trash2 } from "lucide-react"
import { UploadFileModal } from "./upload-file-modal"
import { FileDetailsModal } from "./file-details-modal"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { UploadedFileCard } from "./uploaded-file-card"

export function UploadedFilesView({ initialFiles }: { initialFiles: Upload[] }) {
  const router = useRouter()
  const [files, setFiles] = useState<Upload[]>(initialFiles)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [typeFilter, setTypeFilter] = useState("all")
  const [infoModalFile, setInfoModalFile] = useState<Upload | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [deleteTargetFile, setDeleteTargetFile] = useState<Upload | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (initialFiles?.length) {
      setFiles((prev) => {
        const map = new Map<number, Upload>()
        for (const f of initialFiles) map.set(f.id, f)
        for (const f of prev) if (!map.has(f.id)) map.set(f.id, f)
        return Array.from(map.values())
      })
    }
  }, [initialFiles])

  const refreshFiles = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch("/api/uploader", { cache: "no-store" })
      const data = await res.json()
      if (data.success && Array.isArray(data.files)) setFiles(data.files)
    } catch (e) {
      console.warn("Could not fetch uploads:", e)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    refreshFiles()
  }, [])

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
    setSelectedIds(selectedIds.length === filteredFiles.length ? [] : filteredFiles.map((f) => f.id))
  }

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const handleCopyLink = (file: Upload) => {
    navigator.clipboard.writeText(file.externalLink || file.fileName)
    setCopiedId(file.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const confirmSingleDelete = async () => {
    if (!deleteTargetFile) return
    setIsDeleting(true)
    try {
      await deleteUploadRecordAction(deleteTargetFile.id, deleteTargetFile.fileName)
      setFiles((prev) => prev.filter((f) => f.id !== deleteTargetFile.id))
      setSelectedIds((prev) => prev.filter((i) => i !== deleteTargetFile.id))
      setDeleteTargetFile(null)
      router.refresh()
      setTimeout(refreshFiles, 300)
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return
    setIsDeleting(true)
    try {
      await bulkDeleteUploadRecordsAction(selectedIds)
      setFiles((prev) => prev.filter((f) => !selectedIds.includes(f.id)))
      setSelectedIds([])
      setIsBulkDeleteOpen(false)
      router.refresh()
      setTimeout(refreshFiles, 300)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUploadedFiles = (newFiles: Upload[]) => {
    setFiles((prev) => {
      const existingIds = new Set(prev.map((f) => f.id))
      const toAdd = newFiles.filter((f) => !existingIds.has(f.id))
      return [...toAdd, ...prev]
    })
    router.refresh()
    setTimeout(refreshFiles, 500)
  }

  return (
    <div className="space-y-6">
      {/* Title Bar matching Active eCommerce CMS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">All uploaded files</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Cloud className="w-3 h-3" /> Storage Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse and organize product media, images, and documents in high-speed storage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshFiles}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#d43533]" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/uploaded-files/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload New File
          </Link>
        </div>
      </div>

      {/* Toolbar & Filters Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">All Files ({filteredFiles.length})</span>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setIsBulkDeleteOpen(true)}
                className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
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
              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
            >
              <option value="all">All File Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
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
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg outline-hidden w-44 sm:w-56 focus:border-[#d43533]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Select All Checkbox */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            type="checkbox"
            id="selectAll"
            checked={filteredFiles.length > 0 && selectedIds.length === filteredFiles.length}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded text-[#d43533] focus:ring-[#d43533] cursor-pointer"
          />
          <label htmlFor="selectAll" className="text-xs text-slate-600 font-medium cursor-pointer">
            Select All
          </label>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredFiles.map((file) => (
          <UploadedFileCard
            key={file.id}
            file={file}
            isSelected={selectedIds.includes(file.id)}
            copiedId={copiedId}
            onToggleSelect={toggleSelectOne}
            onCopyLink={handleCopyLink}
            onShowDetails={setInfoModalFile}
            onDelete={setDeleteTargetFile}
          />
        ))}
      </div>

      <UploadFileModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={handleUploadedFiles}
      />

      <FileDetailsModal
        file={infoModalFile}
        onClose={() => setInfoModalFile(null)}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTargetFile}
        onClose={() => setDeleteTargetFile(null)}
        onConfirm={confirmSingleDelete}
        isDeleting={isDeleting}
        title="Confirmation"
      />

      <DeleteConfirmationModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        isDeleting={isDeleting}
        isBulk={true}
        title="Confirmation"
        message={`Are you sure to delete those (${selectedIds.length} files)?`}
      />
    </div>
  )
}
