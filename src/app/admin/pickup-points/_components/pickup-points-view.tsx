"use client"

import React, { useState } from "react"
import { Plus, Search, MapPin, Phone, Trash2, Check, AlertCircle, RefreshCw } from "lucide-react"
import { type PickupPoint } from "@/db/schema"
import {
  createPickupPointAction,
  togglePickupPointStatusAction,
  deletePickupPointAction,
} from "@/app/actions/ecommerce-actions"

interface PickupPointsViewProps {
  pickupPoints: PickupPoint[]
}

export function PickupPointsView({ pickupPoints: initialList }: PickupPointsViewProps) {
  const [points, setPoints] = useState(initialList)
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    managerName: "",
    cashOnPickupStatus: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleToggleStatus = async (id: number, current: boolean) => {
    const next = !current
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, pickupStatus: next } : p)))
    await togglePickupPointStatusAction(id, next)
    setFeedback("Pickup station status updated.")
    setTimeout(() => setFeedback(null), 2500)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.address.trim() || !formData.phone.trim()) return

    setIsSubmitting(true)
    try {
      const created = await createPickupPointAction(formData)
      if (created) {
        setPoints((prev) => [created, ...prev])
        setFormData({
          name: "",
          address: "",
          phone: "",
          managerName: "",
          cashOnPickupStatus: true,
        })
        setShowAddModal(false)
        setFeedback("Pickup station added successfully.")
        setTimeout(() => setFeedback(null), 2500)
      }
    } catch {
      setFeedback("Failed to add pickup point.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deletePickupPointAction(deleteId)
    setPoints((prev) => prev.filter((p) => p.id !== deleteId))
    setDeleteId(null)
    setIsDeleting(false)
    setFeedback("Pickup station removed.")
    setTimeout(() => setFeedback(null), 2500)
  }

  const filteredPoints = points.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">All Pick-up Points</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage local pickup stations and click & collect collection hubs
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Pick-up Point</span>
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
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d43533]" />
            <span>Pick-up Points ({filteredPoints.length})</span>
          </h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search station or address..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4">Station Name</th>
                <th className="p-4">Manager</th>
                <th className="p-4">Address & Location</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPoints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No pickup points found.
                  </td>
                </tr>
              ) : (
                filteredPoints.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-500">{index + 1}</td>
                    <td className="p-4 font-bold text-gray-800">{item.name}</td>
                    <td className="p-4 font-medium text-gray-700">
                      {item.managerName || (
                        <span className="text-xs text-gray-400 italic">No Manager</span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs text-gray-600 truncate">{item.address}</td>
                    <td className="p-4 text-gray-700 font-mono">{item.phone}</td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, item.pickupStatus)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.pickupStatus
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {item.pickupStatus ? "Open" : "Closed"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Station"
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

      {/* Add Pickup Station Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">Add New Pick-up Point</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Station Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Uttara Sector 3 Collection Hub"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Full Address & Location <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Building, Area, City"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Station Phone Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1711-..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Manager Name</label>
                  <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    placeholder="Manager full name"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cashOnPickupStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, cashOnPickupStatus: e.target.checked })
                  }
                  className="w-4 h-4 text-[#d43533] rounded border-gray-300 focus:ring-[#d43533]"
                />
                <span className="text-xs font-medium text-gray-700">
                  Enable Cash on Pick-up (COP) payment at this station
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
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
                    <span>Save Station</span>
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
            <h3 className="text-base font-bold text-gray-800">Delete Pick-up Point?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this pickup station? Customers will no longer be able to select it during checkout.
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
