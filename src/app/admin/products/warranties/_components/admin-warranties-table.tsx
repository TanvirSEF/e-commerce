"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Search, Trash2, Pencil, ChevronLeft, ChevronRight, X, ShieldCheck } from "lucide-react"
import type { WarrantyData } from "@/services/warranty-service"

interface AdminWarrantiesTableProps {
  warranties: WarrantyData[]
  searchQuery: string
  onSearchChange: (q: string) => void
  onEdit: (warranty: WarrantyData) => void
  onDelete: (id: number) => void
  editingWarrantyId: number | null
}

const ITEMS_PER_PAGE = 10

export function AdminWarrantiesTable({
  warranties,
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
  editingWarrantyId,
}: AdminWarrantiesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = warranties.filter(
    (w) =>
      w.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.duration.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-xs">
      {/* Table Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-800">All Warranties</h2>
          <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search warranties..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-8 pr-7 py-1.5 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d43533] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange("")
                setCurrentPage(1)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200 tracking-wider">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4 w-16">Logo</th>
              <th className="py-3 px-4">Warranty Statement</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4 text-right w-24">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <p className="font-medium text-sm">No warranties found</p>
                  <p className="text-xs text-slate-400 mt-1">Try refining your search keyword</p>
                </td>
              </tr>
            ) : (
              paginated.map((w, idx) => {
                const isSelected = editingWarrantyId === w.id

                return (
                  <tr
                    key={w.id}
                    className={`transition-colors ${
                      isSelected ? "bg-amber-50/50" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400 font-semibold">
                      {startIndex + idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="w-8 h-8 rounded border border-slate-200 bg-white relative flex items-center justify-center overflow-hidden shadow-2xs">
                        {w.logo ? (
                          <Image
                            src={w.logo}
                            alt={w.text}
                            fill
                            sizes="32px"
                            className="object-contain p-0.5"
                          />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-[#d43533]" />
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{w.text}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-100">
                        {w.duration}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => onEdit(w)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-amber-100 text-amber-800"
                              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          title="Edit Warranty"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(w.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Warranty"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filtered.length > ITEMS_PER_PAGE && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{filtered.length}</span> warranties
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
