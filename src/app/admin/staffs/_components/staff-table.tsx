"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { StaffItem } from "@/types/staff"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { deleteStaffAction } from "@/app/actions/staff-actions"

interface Props {
  items: StaffItem[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  total: number
  onPageChange: (p: number) => void
}

export function StaffTable({
  items,
  isLoading,
  currentPage,
  totalPages,
  total,
  onPageChange,
}: Props) {
  const [deleteTarget, setDeleteTarget] = useState<StaffItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteStaffAction(deleteTarget.id)
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  const offset = (currentPage - 1) * 15

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Order & Logistics Manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Customer Support Specialist":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Product & Catalog Editor":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

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
              <th className="px-4 py-3 w-16">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right w-24">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No staffs found.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400 font-medium">
                    {offset + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded border ${getRoleBadgeStyle(
                        item.roleName
                      )}`}
                    >
                      {item.roleName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/staffs/${item.id}/edit`}
                        className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
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
          <span>{total} total staffs</span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Staff"
        description={`Are you sure you want to delete staff member "${deleteTarget?.name}"?`}
      />
    </>
  )
}
