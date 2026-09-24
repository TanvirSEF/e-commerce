"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Plus, Search, Trash2, Tag, Check, AlertCircle } from "lucide-react"
import { type CustomLabel } from "@/db/schema"
import {
  toggleCustomLabelStatusAction,
  toggleCustomLabelSellerAccessAction,
  deleteCustomLabelAction,
} from "@/app/actions/ecommerce-actions"

interface CustomLabelsListViewProps {
  labels: CustomLabel[]
}

export function CustomLabelsListView({ labels: initialLabels }: CustomLabelsListViewProps) {
  const [labels, setLabels] = useState(initialLabels)
  const [filterType, setFilterType] = useState<"all" | "in_house" | "seller">("all")
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleToggleStatus = async (id: number, current: boolean) => {
    const next = !current
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, status: next } : l)))
    await toggleCustomLabelStatusAction(id, next)
    setFeedback("Label visibility updated successfully.")
    setTimeout(() => setFeedback(null), 2500)
  }

  const handleToggleSellerAccess = async (id: number, current: boolean) => {
    const next = !current
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, sellerAccess: next } : l)))
    await toggleCustomLabelSellerAccessAction(id, next)
    setFeedback("Seller access permission updated.")
    setTimeout(() => setFeedback(null), 2500)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteCustomLabelAction(deleteId)
    setLabels((prev) => prev.filter((l) => l.id !== deleteId))
    setDeleteId(null)
    setIsDeleting(false)
    setFeedback("Custom label deleted successfully.")
    setTimeout(() => setFeedback(null), 2500)
  }

  const filteredLabels = labels.filter((item) => {
    const matchType =
      filterType === "all"
        ? true
        : filterType === "in_house"
        ? item.userType === "admin"
        : item.userType === "seller"
    const matchSearch = item.text.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Custom Product Labels</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create and organize promotional badges and tags for products
          </p>
        </div>
        <Link
          href="/admin/custom-labels/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Custom Label</span>
        </Link>
      </div>

      {feedback && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filterType === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType("in_house")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filterType === "in_house"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Inhouse
          </button>
          <button
            type="button"
            onClick={() => setFilterType("seller")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filterType === "seller"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Seller
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search label text..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Labels Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4">Label Preview</th>
                <th className="p-4 text-center">Added By</th>
                <th className="p-4 text-center">Seller Can Access?</th>
                <th className="p-4 text-center">Active Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLabels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No custom labels found.</p>
                  </td>
                </tr>
              ) : (
                filteredLabels.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-500">{index + 1}</td>
                    <td className="p-4">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
                        style={{
                          backgroundColor: item.backgroundColor,
                          color: item.textColor === "dark" ? "#1f2937" : "#ffffff",
                        }}
                      >
                        {item.text}
                      </span>
                    </td>
                    <td className="p-4 text-center font-medium text-gray-700">
                      {item.addedBy}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSellerAccess(item.id, item.sellerAccess)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          item.sellerAccess ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            item.sellerAccess ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          item.status ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            item.status ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Label"
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
            <h3 className="text-base font-bold text-gray-800">Delete Custom Label?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this custom label? Products assigned with this badge will no longer display it.
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
