"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Search, Trash2, Pencil, ChevronLeft, ChevronRight, X } from "lucide-react"
import { AdminBrandItem } from "./admin-brands-view"

interface AdminBrandsTableProps {
  brands: AdminBrandItem[]
  searchQuery: string
  onSearchChange: (q: string) => void
  onToggleTop: (id: string, currentTop: boolean) => Promise<void>
  onEdit: (brand: AdminBrandItem) => void
  onDelete: (id: string) => void
  editingBrandId: string | null
}

const ITEMS_PER_PAGE = 10

export function AdminBrandsTable({
  brands,
  searchQuery,
  onSearchChange,
  onToggleTop,
  onEdit,
  onDelete,
  editingBrandId,
}: AdminBrandsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-sm font-bold text-slate-800">All Brands</h2>
          <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Type name & Enter..."
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
              <th className="py-3 px-4">Brand Name</th>
              <th className="py-3 px-4">Logo</th>
              <th className="py-3 px-4 text-center">Qty Products</th>
              <th className="py-3 px-4 text-center">Top Brand</th>
              <th className="py-3 px-4 text-right w-24">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <p className="font-medium text-sm">No brands found</p>
                  <p className="text-xs text-slate-400 mt-1">Try refining your search keyword</p>
                </td>
              </tr>
            ) : (
              paginated.map((brand, idx) => {
                const isSelected = editingBrandId === brand.id
                return (
                  <tr
                    key={brand.id}
                    className={`transition-colors ${
                      isSelected ? "bg-amber-50/50" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400 font-semibold">
                      {startIndex + idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{brand.name}</div>
                      <div className="text-[11px] text-slate-400">slug: {brand.slug}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="w-12 h-9 relative border border-slate-200 rounded bg-white overflow-hidden shadow-2xs">
                        <Image
                          src={brand.logo || "/assets/img/placeholder.jpg"}
                          alt={brand.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px]">
                        {brand.productCount ?? 0}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={brand.top}
                        onClick={() => onToggleTop(brand.id, brand.top)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          brand.top ? "bg-[#d43533]" : "bg-slate-300"
                        }`}
                        title="Toggle Top Brand"
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            brand.top ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => onEdit(brand)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-amber-100 text-amber-800"
                              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          title="Edit Brand"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(brand.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Brand"
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
            of <span className="font-semibold text-slate-700">{filtered.length}</span> brands
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
