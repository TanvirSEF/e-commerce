"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UploadCloud, ArrowLeft, CheckCircle, Loader2, Link as LinkIcon } from "lucide-react"

export function UploadNewFileView({ backHref = "/admin/uploaded-files" }: { backHref?: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"file" | "url">("file")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [urlName, setUrlName] = useState("")
  const [urlType, setUrlType] = useState("image")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i])
      }
      formData.append("userId", "admin")

      const res = await fetch("/api/uploader", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload file")
      }

      setUploadSuccess(`Successfully uploaded ${data.files?.length || 1} file(s)!`)
      setTimeout(() => {
        router.push(backHref)
        router.refresh()
      }, 1200)
    } catch (err: any) {
      console.error("Upload error:", err)
      setUploadError(err.message || "Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim() || !urlName.trim()) return
    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const ext = urlInput.split(".").pop()?.split("?")[0] || "jpg"
      const res = await fetch("/api/uploader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileOriginalName: urlName.trim(),
          fileName: urlInput.trim(),
          fileSize: 450000,
          extension: ext,
          type: urlType,
          externalLink: urlInput.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save link")
      }

      setUploadSuccess("Link saved successfully!")
      setTimeout(() => {
        router.push(backHref)
        router.refresh()
      }, 1000)
    } catch (err: any) {
      setUploadError(err.message || "Failed to save link")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Bar matching Active eCommerce CMS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upload New File</h1>
          <p className="text-xs text-gray-500 mt-1">
            Drag & drop media files directly into your centralized library
          </p>
        </div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to uploaded files</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h5 className="text-sm font-bold text-gray-800">Drag & drop your files</h5>
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("file")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === "file" ? "bg-[#d43533] text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              From Device
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === "url" ? "bg-[#d43533] text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Direct URL
            </button>
          </div>
        </div>

        <div className="p-6">
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {uploadError}
            </div>
          )}

          {uploadSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {uploadSuccess}
            </div>
          )}

          {activeTab === "file" ? (
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
              className={`min-h-[420px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-[#d43533] bg-red-50/40"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.mp4"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={isUploading}
              />

              {isUploading ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-12 h-12 text-[#d43533] animate-spin" />
                  <p className="text-sm font-semibold text-gray-700">Uploading files to storage...</p>
                  <p className="text-xs text-gray-400">Please do not close or reload this window</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-red-50 text-[#d43533] rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">
                    Drag and drop your files here, or browse
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Supports JPG, JPEG, PNG, WebP, SVG, GIF, PDF, and DOC files up to 10MB each
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Select Files
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit} className="max-w-xl mx-auto space-y-4 py-8">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={urlName}
                  onChange={(e) => setUrlName(e.target.value)}
                  placeholder="e.g. promo-summer-banner.jpg"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Direct Link (URL)</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">File Type</label>
                <select
                  value={urlType}
                  onChange={(e) => setUrlType(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                >
                  <option value="image">Image</option>
                  <option value="document">Document (PDF/DOC)</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#d43533] text-white text-xs font-semibold rounded-lg hover:bg-[#b82d2b] disabled:opacity-50"
                >
                  {isUploading ? "Saving..." : "Save to Media Library"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
