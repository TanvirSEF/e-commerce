"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Copy, Check, Trash2, ExternalLink } from "lucide-react"

export interface FlashDealItem {
  id: string
  title: string
  slug: string
  startDate: number
  endDate: number
  status: boolean
  featured: boolean
  banner?: string
}

interface FlashDealsTableProps {
  deals: FlashDealItem[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onToggleStatus: (id: string, current: boolean) => void
  onToggleFeatured: (id: string, current: boolean) => void
  onDeleteClick: (id: string) => void
}

export function FlashDealsTable({
  deals,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onToggleStatus,
  onToggleFeatured,
  onDeleteClick,
}: FlashDealsTableProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/flash-deal/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const allSelected = deals.length > 0 && selectedIds.length === deals.length

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
            <th className="py-3 px-4 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </th>
            <th className="py-3 px-4 w-12">#</th>
            <th className="py-3 px-4">Banner</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Start Date</th>
            <th className="py-3 px-4">End Date</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-center">Featured</th>
            <th className="py-3 px-4 text-center">Link</th>
            <th className="py-3 px-4 text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {deals.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-10 text-gray-400">
                No flash deal campaigns found.
              </td>
            </tr>
          ) : (
            deals.map((deal, idx) => {
              const isSelected = selectedIds.includes(deal.id)
              const isCopied = copiedSlug === deal.slug
              const startDate = new Date(deal.startDate).toLocaleDateString("en-GB")
              const endDate = new Date(deal.endDate).toLocaleDateString("en-GB")

              return (
                <tr key={deal.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(deal.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-400">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative h-9 w-20 overflow-hidden rounded border border-gray-200">
                      <Image
                        src={deal.banner || "/assets/img/placeholder-rect.jpg"}
                        alt={deal.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">{deal.title}</td>
                  <td className="py-3.5 px-4 text-gray-600">{startDate}</td>
                  <td className="py-3.5 px-4 text-gray-600">{endDate}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(deal.id, deal.status)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        deal.status ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          deal.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(deal.id, deal.featured)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        deal.featured ? "bg-amber-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          deal.featured ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(deal.slug)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                        title="Copy Campaign URL"
                      >
                        {isCopied ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                      <Link
                        href={`/flash-deal/${deal.slug}`}
                        target="_blank"
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                        title="Open Preview"
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteClick(deal.id)}
                      className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
