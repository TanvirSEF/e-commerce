"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  UploadCloud,
  Search,
  Check,
  X,
  FileText,
  Loader2,
  Image as ImageIcon,
} from "lucide-react"
import { type Upload } from "@/db/schema/uploads"

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (selectedUrls: string[]) => void
  multiple?: boolean
  type?: "image" | "document" | "video" | "all"
  title?: string
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  type = "image",
  title = "Select File / Media",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"select" | "upload">("select")
  const [files, setFiles] = useState<Upload[]>([])
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      loadFiles()
      setSelectedUrls([])
    }
  }, [isOpen])

  const loadFiles = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/uploader")
      const data = await res.json()
      if (data.success && data.files) {
        setFiles(data.files)
      }
    } catch (err) {
      console.error("Failed to load uploads:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return
    setIsUploading(true)

    try {
      const formData = new FormData()
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("files", uploadedFiles[i])
      }

      const res = await fetch("/api/uploader", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.files) {
        setFiles((prev) => [...data.files, ...prev])
        const firstUrl = data.files[0]?.externalLink || data.files[0]?.fileName
        if (firstUrl) {
          if (multiple) {
            setSelectedUrls((prev) => [...prev, firstUrl])
          } else {
            setSelectedUrls([firstUrl])
          }
        }
        setActiveTab("select")
      }
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const toggleSelect = (url: string) => {
    if (multiple) {
      setSelectedUrls((prev) =>
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
      )
    } else {
      setSelectedUrls([url])
    }
  }

  const handleConfirm = () => {
    onSelect(selectedUrls)
    onClose()
  }

  const filtered = files.filter((f) => {
    if (type !== "all" && f.type !== type) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        f.fileOriginalName?.toLowerCase().includes(q) ||
        f.fileName?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full h-[620px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">Pick from Cloudinary library or upload new</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-100 px-6 shrink-0">
          <button
            onClick={() => setActiveTab("select")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 ${
              activeTab === "select"
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Select File ({selectedUrls.length} selected)
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 ${
              activeTab === "upload"
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload New
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "select" ? (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files by name..."
                  className="w-full text-xs pl-8 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#d43533]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-[#d43533] mb-2" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-xs">
                  No files found. Switch to Upload New tab to add images.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filtered.map((file) => {
                    const url = file.externalLink || file.fileName
                    const isSelected = selectedUrls.includes(url)
                    return (
                      <div
                        key={file.id}
                        onClick={() => toggleSelect(url)}
                        className={`relative rounded-xl border p-1 cursor-pointer transition-all aspect-square flex flex-col items-center justify-center overflow-hidden bg-gray-50 ${
                          isSelected
                            ? "border-[#d43533] ring-2 ring-[#d43533]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {file.type === "image" ||
                        ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(
                          file.extension || ""
                        ) ? (
                          <img
                            src={url}
                            alt={file.fileOriginalName || ""}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <FileText className="w-8 h-8 mb-1" />
                            <span className="text-[10px] font-bold uppercase">{file.extension}</span>
                          </div>
                        )}

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#d43533] text-white rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1 py-0.5 text-center">
                          <p className="text-[9px] text-white truncate">
                            {file.fileOriginalName || file.fileName}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  handleFileUpload(e.dataTransfer.files)
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  dragOver ? "border-[#d43533] bg-red-50/50" : "border-gray-300 bg-gray-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={multiple}
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                {isUploading ? (
                  <div className="space-y-3">
                    <Loader2 className="w-10 h-10 text-[#d43533] animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-gray-700">Uploading to Cloudinary CDN...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-red-50 text-[#d43533] rounded-full flex items-center justify-center mx-auto mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">Fast Cloudinary CDN upload</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <span className="text-xs text-gray-500">
            {selectedUrls.length} file{selectedUrls.length === 1 ? "" : "s"} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200"
            >
              Cancel
            </button>
            <button
              disabled={selectedUrls.length === 0}
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-semibold bg-[#d43533] hover:bg-[#b82d2b] text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              Add Files
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
