"use client"

import React, { useState } from "react"
import { Tag, Search, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import type { CustomLabel } from "@/db/schema"

interface SellerCustomLabelsViewProps {
  labels: CustomLabel[]
}

export function SellerCustomLabelsView({ labels }: SellerCustomLabelsViewProps) {
  const [search, setSearch] = useState("")

  const filteredLabels = labels.filter((l) =>
    l.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Tag className="h-6 w-6 text-[#d43533]" />
          Storefront Badges & Custom Labels
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Available visual badge labels enabled by marketplace administrators for your store catalog
        </p>
      </div>

      {/* Info notice */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Marketplace Merchandising Badges:</span>
          <p className="text-blue-700 mt-0.5 leading-relaxed">
            These labels are authorized for seller catalog assignment. When creating or editing products, you can select any of these approved badge designs to appear as corner ribbons on your product cards.
          </p>
        </div>
      </div>

      {/* Card with Search & Grid */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
          <h2 className="text-sm font-bold text-gray-900">
            Available Labels ({filteredLabels.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search badge name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
        </div>

        {filteredLabels.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">
            No approved seller labels found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLabels.map((lbl) => (
              <div
                key={lbl.id}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3 hover:border-gray-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      backgroundColor: lbl.backgroundColor,
                      color: lbl.textColor,
                    }}
                    className="inline-block px-3 py-1 rounded-md text-xs font-bold shadow-xs"
                  >
                    {lbl.text}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Permitted
                  </span>
                </div>

                <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200/60">
                  <div className="flex justify-between">
                    <span>Authorized by:</span>
                    <span className="font-semibold text-gray-700">{lbl.addedBy || "Admin"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color hex:</span>
                    <span className="font-mono text-gray-700">{lbl.backgroundColor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
