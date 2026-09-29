"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { deleteSizeChartAction } from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import {
  SizeChartDetailModal,
  type SizeChartDetailItem,
} from "./size-chart-detail-modal"

interface SizeChartsListViewProps {
  initialCharts: SizeChartDetailItem[]
}

export function SizeChartsListView({ initialCharts }: SizeChartsListViewProps) {
  const [charts, setCharts] = useState<SizeChartDetailItem[]>(initialCharts)
  const [selectedChart, setSelectedChart] = useState<SizeChartDetailItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const success = await deleteSizeChartAction(deleteId)
      if (success) {
        setCharts((prev) => prev.filter((c) => c.id !== deleteId))
        showToast("success", "Size chart deleted successfully!")
      } else {
        showToast("error", "Failed to delete size chart.")
      }
    } catch (err) {
      console.error("Error deleting size chart:", err)
      showToast("error", "An error occurred while deleting size chart.")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Titlebar (Active eCommerce 1:1) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Size Chart</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage measurement guides and sizing matrices for clothing, footwear, and apparel
          </p>
        </div>
        <Link
          href="/admin/products/size-charts/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Size Chart</span>
        </Link>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border shadow-2xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Table Card (Active eCommerce 1:1) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-[#fafbfc] flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            All Size Chart ({charts.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Size Chart</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center w-28">Details</th>
                <th className="py-3 px-4 text-right w-24">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {charts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">No size charts found.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click &quot;Add New Size Chart&quot; to configure sizing dimensions.
                    </p>
                  </td>
                </tr>
              ) : (
                charts.map((c, index) => (
                  <tr key={c.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-semibold">{index + 1}</td>

                    {/* Chart Name */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{c.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {c.fitType} Fit
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {c.measurements.length} sizes
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {c.categoryName || "—"}
                      </span>
                    </td>

                    {/* Details Show Button (Active eCommerce 1:1) */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedChart(c)}
                        className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold rounded shadow-2xs transition-colors cursor-pointer"
                      >
                        Show
                      </button>
                    </td>

                    {/* Options: Edit & Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          href={`/admin/products/size-charts/create?edit=${c.id}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(c.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
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
      </div>

      {/* Details Modal */}
      <SizeChartDetailModal
        isOpen={selectedChart !== null}
        chart={selectedChart}
        onClose={() => setSelectedChart(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => {
          if (!isDeleting) setDeleteId(null)
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description="Are you sure you want to delete this size chart? Associated products will no longer display this measurement guide."
      />
    </div>
  )
}
