"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Plus, Ruler, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { type SizeChart } from "@/db/schema"
import { deleteSizeChartAction } from "@/app/actions/ecommerce-actions"

interface SizeChartsListViewProps {
  initialCharts: SizeChart[]
}

export function SizeChartsListView({ initialCharts }: SizeChartsListViewProps) {
  const [charts, setCharts] = useState(initialCharts)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteSizeChartAction(deleteId)
    setCharts((prev) => prev.filter((c) => c.id !== deleteId))
    setDeleteId(null)
    setIsDeleting(false)
    setFeedback("Size chart deleted successfully.")
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Product Size Charts</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage measurement guides and sizing matrices for clothing, footwear, and apparel
          </p>
        </div>
        <Link
          href="/admin/products/size-charts/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Size Chart</span>
        </Link>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#d43533]" />
            <span>Size Charts ({charts.length})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4">Chart Name</th>
                <th className="p-4">Fit Type</th>
                <th className="p-4 text-center">Unit</th>
                <th className="p-4">Available Sizes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {charts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No size charts created yet.
                  </td>
                </tr>
              ) : (
                charts.map((c, index) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-500">{index + 1}</td>
                    <td className="p-4 font-bold text-gray-800">{c.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {c.fitType} Fit
                      </span>
                    </td>
                    <td className="p-4 text-center uppercase font-mono font-bold text-gray-700">
                      {c.unit}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {c.measurements.map((m, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[11px] font-bold"
                          >
                            {m.size}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteId(c.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Size Chart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-800">Delete Size Chart?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this size chart? Associated products will no longer display a size guide.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
