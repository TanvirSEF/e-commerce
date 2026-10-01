"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { ClassifiedProductItem } from "@/types/customer-product"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { deleteClassifiedProductAction } from "@/app/actions/customer-product-actions"
import { ClassifiedPublishSwitch } from "./classified-publish-switch"

interface Props {
  items: ClassifiedProductItem[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  total: number
  onPageChange: (p: number) => void
}

export function ClassifiedProductsTable({ items, isLoading, currentPage, totalPages, total, onPageChange }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<ClassifiedProductItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteClassifiedProductAction(deleteTarget.id)
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  const offset = (currentPage - 1) * 15

  return (
    <>
      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#d43533] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Uploaded By</th>
              <th className="px-4 py-3">Customer Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right w-20">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No classified products found.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400 font-medium">{offset + idx + 1}</td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <a
                      href={`/customer-products/${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-800 hover:text-[#d43533] font-medium line-clamp-2"
                    >
                      {item.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 relative rounded border border-gray-200 overflow-hidden bg-gray-50">
                      <Image
                        src={item.thumbnailImg}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => { e.currentTarget.src = "/assets/img/placeholder.jpg" }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.customerName}</td>
                  <td className="px-4 py-3">
                    {item.status === "approved" ? (
                      <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded bg-green-100 text-green-700">
                        PUBLISHED
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded bg-red-100 text-red-700">
                        UNPUBLISHED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ClassifiedPublishSwitch id={item.id} published={item.published} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/customer-products/${item.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded text-blue-600 hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50"
                        title="Delete"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{total} total listings</span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Classified Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />
    </>
  )
}
