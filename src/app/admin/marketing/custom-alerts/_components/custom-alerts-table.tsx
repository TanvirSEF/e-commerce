"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Edit } from "lucide-react"

interface CustomAlertsTableProps {
  showAlert: boolean
  onToggleShowAlert: () => void
  alertText: string
  alertLink?: string
}

export function CustomAlertsTable({
  showAlert,
  onToggleShowAlert,
  alertText,
  alertLink,
}: CustomAlertsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">All Custom Alerts</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              <th className="py-3 px-4 w-14">#</th>
              <th className="py-3 px-4 w-20">Image</th>
              <th className="py-3 px-4">Text & Announcement</th>
              <th className="py-3 px-4">Link</th>
              <th className="py-3 px-4 text-center">Type</th>
              <th className="py-3 px-4 text-center">Trigger</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {/* Built-in Active eCommerce System Row: Custom Sale Alert */}
            <tr className="hover:bg-gray-50/60 transition-colors bg-gray-50/20">
              <td className="py-3.5 px-4 font-semibold text-gray-400">01</td>
              <td className="py-3.5 px-4">
                <div className="relative h-10 w-10 rounded border border-gray-200 overflow-hidden bg-white">
                  <Image
                    src="/assets/img/placeholder.jpg"
                    alt="Sale Alert"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-gray-800">
                  Product Title - ordered just now
                </div>
                <Link
                  href="/admin/marketing/custom-sale-alerts"
                  className="text-[11px] text-primary hover:underline font-medium inline-block mt-0.5"
                >
                  (Configure Custom sale alert)
                </Link>
              </td>
              <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">#</td>
              <td className="py-3.5 px-4 text-center">
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] font-semibold uppercase">
                  Default
                </span>
              </td>
              <td className="py-3.5 px-4 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-primary rounded-full opacity-80 cursor-not-allowed after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </td>
              <td className="py-3.5 px-4 text-right">
                <Link
                  href="/admin/marketing/custom-sale-alerts"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-red-50 rounded transition-colors"
                >
                  <Edit className="size-3.5" />
                  <span>Edit</span>
                </Link>
              </td>
            </tr>

            {/* Custom Announcement Alert Row */}
            <tr className="hover:bg-gray-50/60 transition-colors">
              <td className="py-3.5 px-4 font-semibold text-gray-400">02</td>
              <td className="py-3.5 px-4">
                <div className="relative h-10 w-10 rounded border border-gray-200 overflow-hidden bg-red-50 flex items-center justify-center text-[#d43533] font-bold text-xs">
                  📢
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-gray-900 line-clamp-1">
                  {alertText || "Custom Sticky Banner Alert"}
                </div>
                <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  Floating corner promotional badge
                </div>
              </td>
              <td className="py-3.5 px-4">
                {alertLink ? (
                  <a
                    href={alertLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-[11px]"
                  >
                    <span className="max-w-[120px] truncate">{alertLink}</span>
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="text-gray-400 text-[11px]">None</span>
                )}
              </td>
              <td className="py-3.5 px-4 text-center">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold uppercase">
                  Custom
                </span>
              </td>
              <td className="py-3.5 px-4 text-center">
                <button
                  type="button"
                  onClick={onToggleShowAlert}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showAlert ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      showAlert ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </td>
              <td className="py-3.5 px-4 text-right">
                <span className="text-xs text-gray-400 font-medium">Configured below</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
