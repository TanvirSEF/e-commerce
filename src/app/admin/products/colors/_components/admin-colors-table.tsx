"use client"

import React, { useState } from "react"
import { Search, Trash2, Pencil, ChevronLeft, ChevronRight, X } from "lucide-react"
import type { ColorData } from "@/services/color-service"

interface AdminColorsTableProps {
  colorsList: ColorData[]
  searchQuery: string
  onSearchChange: (q: string) => void
  onEdit: (color: ColorData) => void
  onDelete: (id: number) => void
  editingColorId: number | null
}

const ITEMS_PER_PAGE = 10

export function AdminColorsTable({
  colorsList,
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
  editingColorId,
}: AdminColorsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = colorsList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-sm font-bold text-slate-800">Colors List</h2>
          <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Type name / hex & Enter..."
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
              <th className="py-3 px-4 w-20">Swatch</th>
              <th className="py-3 px-4">Color Name</th>
              <th className="py-3 px-4">Hex Code</th>
              <th className="py-3 px-4 text-right w-24">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <p className="font-medium text-sm">No colors found</p>
                  <p className="text-xs text-slate-400 mt-1">Try refining your search keyword</p>
                </td>
              </tr>
            ) : (
              paginated.map((c, idx) => {
                const isSelected = editingColorId === c.id

                return (
                  <tr
                    key={c.id}
                    className={`transition-colors ${
                      isSelected ? "bg-amber-50/50" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400 font-semibold">
                      {startIndex + idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div
                        className="w-6 h-6 rounded-full border border-slate-300 shadow-2xs shrink-0"
                        style={{ backgroundColor: c.code }}
                        title={c.code}
                      />
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      {c.name}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 uppercase font-semibold">
                      {c.code}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => onEdit(c)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-amber-100 text-amber-800"
                              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          title="Edit Color"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(c.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Color"
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
            of <span className="font-semibold text-slate-700">{filtered.length}</span> colors
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
