"use client"

import React, { useState } from "react"
import { Plus, Percent, Trash2, Check, AlertCircle, RefreshCw } from "lucide-react"
import { type Tax } from "@/db/schema"
import {
  createTaxAction,
  toggleTaxStatusAction,
  deleteTaxAction,
} from "@/app/actions/ecommerce-actions"

interface TaxesViewProps {
  taxes: Tax[]
}

export function TaxesView({ taxes: initialTaxes }: TaxesViewProps) {
  const [taxes, setTaxes] = useState(initialTaxes)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTaxName, setNewTaxName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleToggleStatus = async (id: number, current: boolean) => {
    const next = !current
    setTaxes((prev) => prev.map((t) => (t.id === id ? { ...t, taxStatus: next } : t)))
    await toggleTaxStatusAction(id, next)
    setFeedback("Tax status updated successfully.")
    setTimeout(() => setFeedback(null), 2500)
  }

  const handleAddTax = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaxName.trim()) return

    setIsSubmitting(true)
    try {
      const created = await createTaxAction(newTaxName.trim())
      if (created) {
        setTaxes((prev) => [created, ...prev])
        setNewTaxName("")
        setShowAddModal(false)
        setFeedback("New tax created successfully.")
        setTimeout(() => setFeedback(null), 2500)
      }
    } catch {
      setFeedback("Failed to create tax.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTax = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteTaxAction(deleteId)
    setTaxes((prev) => prev.filter((t) => t.id !== deleteId))
    setDeleteId(null)
    setIsDeleting(false)
    setFeedback("Tax removed successfully.")
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">All Taxes & VAT</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Configure sales tax, VAT, AIT, and regional duties applied during checkout
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Tax</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#d43533]" />
            <span>Tax Registry ({taxes.length})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4">Tax Type</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {taxes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    No taxes configured yet.
                  </td>
                </tr>
              ) : (
                taxes.map((t, index) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-500">{index + 1}</td>
                    <td className="p-4 font-semibold text-gray-800">{t.name}</td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(t.id, t.taxStatus)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          t.taxStatus ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            t.taxStatus ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteId(t.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Tax"
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

      {/* Add Tax Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">Add New Tax</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTax} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Tax Name / Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTaxName}
                  onChange={(e) => setNewTaxName(e.target.value)}
                  placeholder="e.g. VAT (15%), NBR SD (10%)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Tax</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-800">Delete Tax?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this tax type?
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
                onClick={handleDeleteTax}
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
