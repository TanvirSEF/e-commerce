"use client"

import React, { useState } from "react"
import { Globe, RefreshCw, CheckCircle2, Download, FileCode } from "lucide-react"

export function AdminSitemapView() {
  const [generating, setGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState("September 26, 2026, 09:30 AM")
  const [status, setStatus] = useState<string | null>(null)

  const handleGenerate = () => {
    setGenerating(true)
    setStatus(null)
    setTimeout(() => {
      setGenerating(false)
      setLastGenerated(new Date().toLocaleString())
      setStatus("Sitemap.xml regenerated successfully with 182 indexed routes!")
    }, 1200)
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
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
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
              <FileCode className="w-4 h-4" /> https://huipper.com/sitemap.xml
            </a>
            <span className="text-xs text-slate-500 mt-1 block">Last generated: {lastGenerated}</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
            {generating ? "Crawling & Generating..." : "Regenerate Sitemap"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">Indexed Products</span>
            <div className="text-2xl font-bold text-slate-900">4,280</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">Indexed Categories & Brands</span>
            <div className="text-2xl font-bold text-slate-900">340</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">Static Pages & Blogs</span>
            <div className="text-2xl font-bold text-slate-900">92</div>
          </div>
        </div>
      </div>
    </div>
  )
}
