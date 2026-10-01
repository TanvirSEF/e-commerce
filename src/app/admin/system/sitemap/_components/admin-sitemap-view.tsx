"use client"

import React, { useState, useTransition } from "react"
import { Globe, RefreshCw, CheckCircle2, FileCode } from "lucide-react"
import { generateSitemapAction } from "@/app/actions/settings-actions"

interface AdminSitemapViewProps {
  initialLastGenerated: Date | null
}

export function AdminSitemapView({ initialLastGenerated }: AdminSitemapViewProps) {
  const [lastGenerated, setLastGenerated] = useState<Date | null>(initialLastGenerated)
  const [status, setStatus] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleGenerate = () => {
    setStatus(null)
    startTransition(async () => {
      const result = await generateSitemapAction()
      if (result.success) {
        setLastGenerated(new Date(result.generatedAt!))
        setStatus("Sitemap.xml regenerated successfully!")
      } else {
        setStatus("Failed to regenerate sitemap. Please try again.")
      }
    })
  }

  const formatDate = (d: Date | null) => {
    if (!d) return "Never generated"
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Globe className="w-7 h-7 text-[#d43533]" />
          XML Sitemap Generator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Automate search engine indexing for Google, Bing, and search crawlers
        </p>
      </div>

      {status && (
        <div className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${
          status.startsWith("Failed")
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {status}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Sitemap URL</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="text-base font-bold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5"
            >
              <FileCode className="w-4 h-4" /> /sitemap.xml
            </a>
            <span className="text-xs text-slate-500 mt-1 block">
              Last generated: {formatDate(lastGenerated)}
            </span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
            {isPending ? "Generating..." : "Regenerate Sitemap"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">Sitemap Type</span>
            <div className="text-sm font-bold text-slate-900">Dynamic (Live DB)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">Sitemap Route</span>
            <div className="text-sm font-bold text-slate-900">/sitemap.xml</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">Last Generated</span>
            <div className="text-sm font-bold text-slate-900">{lastGenerated ? lastGenerated.toLocaleDateString() : "Never"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
