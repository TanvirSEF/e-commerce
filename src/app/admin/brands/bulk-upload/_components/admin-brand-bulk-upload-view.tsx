"use client"

import React, { useState } from "react"
import Link from "next/link"
import { UploadCloud, Download, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import { bulkCreateBrandsAction } from "@/app/actions/ecommerce-actions"

export function AdminBrandBulkUploadView() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setStatusMessage(null)
    }
  }

  const handleDownloadSample = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Name,Logo_URL,Meta_Title,Meta_Description\nApple,https://example.com/apple.png,Apple Store,Official Apple products\nSamsung,https://example.com/samsung.png,Samsung Electronics,Original Samsung devices\nSony,https://example.com/sony.png,Sony Brand,Sony audio and displays"
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "brand_bulk_demo.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsUploading(true)
    setStatusMessage(null)
    try {
      const text = await selectedFile.text()
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
      const items: { name: string; logo?: string }[] = []

      // Row 0 is header: Name,Logo_URL,...
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim())
        if (parts[0]) {
          items.push({
            name: parts[0],
            logo: parts[1] || undefined,
          })
        }
      }

      if (items.length === 0) {
        setStatusMessage({
          type: "error",
          text: "No valid brand rows found in the uploaded file.",
        })
        return
      }

      const res = await bulkCreateBrandsAction(items)
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: `Successfully imported ${res.count} brands from "${selectedFile.name}".`,
        })
        setSelectedFile(null)
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to import brands into database.",
        })
      }
    } catch (err) {
      console.error("Error bulk uploading brands:", err)
      setStatusMessage({
        type: "error",
        text: "Failed to parse or upload brand file.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#d43533]" />
            Brand Bulk Upload
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Import multiple product brands simultaneously via CSV spreadsheet
          </p>
        </div>

        <Link
          href="/admin/brands"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-bold rounded shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Back to Brands</span>
        </Link>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* Step Instructions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
          Step 1: Download Template File
        </h2>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2 text-xs text-blue-900">
          <p className="font-bold">Instructions:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Download the sample CSV file and fill it with your brand details.</li>
            <li>Do not modify the column header names (Name, Logo_URL, Meta_Title, Meta_Description).</li>
            <li>Ensure image URLs are publicly reachable or uploaded through the media manager.</li>
          </ul>
        </div>
        <div>
          <button
            type="button"
            onClick={handleDownloadSample}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Sample CSV
          </button>
        </div>
      </div>

      {/* Step 2: Upload File */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
          Step 2: Upload Brand File
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 hover:border-[#d43533]/50 rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-gray-50/50">
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              required
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">
              {selectedFile ? (
                <span className="text-[#d43533] font-bold">{selectedFile.name}</span>
              ) : (
                "Choose CSV or Excel file to upload"
              )}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Supports .csv, .xlsx, .xls up to 10MB
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {isUploading ? (
                "Importing Brands..."
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Upload & Import CSV
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
