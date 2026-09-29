"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Trash2, Pencil, Tag, ChevronLeft, ChevronRight } from "lucide-react"
import type { CustomLabel } from "@/db/schema"

interface AdminCustomLabelsTableProps {
  labels: CustomLabel[]
  onToggleStatus: (id: number, current: boolean) => Promise<void>
  onToggleSellerAccess: (id: number, current: boolean) => Promise<void>
  onDeleteClick: (id: number) => void
}

const ITEMS_PER_PAGE = 10

export function AdminCustomLabelsTable({
  labels,
  onToggleStatus,
  onToggleSellerAccess,
  onDeleteClick,
}: AdminCustomLabelsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(labels.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = labels.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200 tracking-wider">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Label Preview</th>
              <th className="py-3 px-4 text-center">Added By</th>
              <th className="py-3 px-4 text-center">Seller Access</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right w-24">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="font-medium text-sm">No custom labels found</p>
                  <p className="text-xs text-slate-400 mt-1">Try refining your filter or search query</p>
                </td>
              </tr>
            ) : (
              paginated.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-400">
                    {startIndex + index + 1}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs"
                      style={{
                        backgroundColor: item.backgroundColor,
                        color: item.textColor === "dark" ? "#1f2937" : "#ffffff",
                      }}
                    >
                      {item.text}
                    </span>
                    {item.productIds && item.productIds.length > 0 && (
                      <span className="block text-[10px] text-slate-400 mt-1">
                        Applied to {item.productIds.length} product{item.productIds.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {item.addedBy}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.sellerAccess}
                      onClick={() => onToggleSellerAccess(item.id, item.sellerAccess)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.sellerAccess ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      title="Toggle seller access"
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          item.sellerAccess ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.status}
                      onClick={() => onToggleStatus(item.id, item.status)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.status ? "bg-[#d43533]" : "bg-slate-300"
                      }`}
                      title="Toggle active status"
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          item.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/custom-labels/create?edit=${item.id}`}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="Edit Custom Label"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDeleteClick(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete Label"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {labels.length > ITEMS_PER_PAGE && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(startIndex + ITEMS_PER_PAGE, labels.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{labels.length}</span> labels
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`w-7 h-7 rounded text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-[#d43533] text-white"
                      : "border border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {page}
                </button>
              )
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
