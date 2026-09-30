"use client"

import React from "react"
import Image from "next/image"
import { Trash2, ExternalLink } from "lucide-react"

export interface DynamicPopupItem {
  id: number
  title: string
  summary: string
  banner: string
  btnText: string
  btnBackgroundColor: string
  btnTextColor: string
  btnLink: string
  status: boolean
  createdAt: Date
}

interface DynamicPopupsTableProps {
  popups: DynamicPopupItem[]
  selectedIds: number[]
  onToggleSelect: (id: number) => void
  onToggleSelectAll: () => void
  onToggleStatus: (id: number, currentStatus: boolean) => void
  onDeleteClick: (id: number) => void
}

export function DynamicPopupsTable({
  popups,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onToggleStatus,
  onDeleteClick,
}: DynamicPopupsTableProps) {
  const allSelected = popups.length > 0 && selectedIds.length === popups.length

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
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4">Title & Content</th>
            <th className="py-3 px-4">Target Link</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {popups.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12 text-gray-400">
                No dynamic popups configured yet.
              </td>
            </tr>
          ) : (
            popups.map((popup) => {
              const isSelected = selectedIds.includes(popup.id)
              return (
                <tr key={popup.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(popup.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative h-12 w-20 rounded border border-gray-200 overflow-hidden bg-gray-50">
                      <Image
                        src={popup.banner || "/assets/img/placeholder.jpg"}
                        alt={popup.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-gray-900 truncate">{popup.title}</div>
                    <div className="text-gray-500 text-[11px] line-clamp-1 mt-0.5">
                      {popup.summary}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <a
                      href={popup.btnLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-gray-500 hover:text-primary max-w-[180px] truncate"
                    >
                      <span className="truncate">{popup.btnLink || "None"}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(popup.id, popup.status)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        popup.status ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          popup.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteClick(popup.id)}
                      className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Popup"
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
