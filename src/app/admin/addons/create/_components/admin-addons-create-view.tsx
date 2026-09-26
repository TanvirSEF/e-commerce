"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, UploadCloud, Key, CheckCircle2, ShieldCheck } from "lucide-react"

export function AdminAddonsCreateView() {
  const router = useRouter()
  const [purchaseCode, setPurchaseCode] = useState("")
  const [fileSelected, setFileSelected] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!purchaseCode) {
      alert("Please enter purchase code")
      return
    }

    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin/addons")
      }, 1500)
    }, 1200)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/addons"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-[#d43533]" />
            Install New Addon
          </h1>
          <p className="text-sm text-slate-500">Upload addon .zip package and activate with your CodeCanyon license</p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Addon uploaded and verified successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Addon Package (.ZIP file)</label>
          <div className="border-2 border-dashed border-slate-200 hover:border-[#d43533]/50 rounded-xl p-8 text-center transition-colors">
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Click to browse or drop addon ZIP archive</p>
            <p className="text-xs text-slate-400 mt-1">Maximum file size: 50MB</p>
            <input
              type="file"
              accept=".zip"
              onChange={() => setFileSelected(true)}
              className="mt-4 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#d43533] hover:file:bg-red-100"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-500" />
            CodeCanyon Purchase Code *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 3a7b9c12-4d5e-6f78-9a0b-1c2d3e4f5a6b"
            value={purchaseCode}
            onChange={(e) => setPurchaseCode(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533] font-mono"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            {isUploading ? "Verifying & Installing..." : "Install & Activate Addon"}
          </button>
        </div>
      </form>
    </div>
  )
}
