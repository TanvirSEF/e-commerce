"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Plus, Search, Tag, CheckCircle2, AlertCircle, X, Store } from "lucide-react"
import { type CustomLabel } from "@/db/schema"
import {
  toggleCustomLabelStatusAction,
  toggleCustomLabelSellerAccessAction,
  toggleSellerCanAddCustomLabelAction,
  deleteCustomLabelAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { AdminCustomLabelsTable } from "./admin-custom-labels-table"

interface CustomLabelsListViewProps {
  labels: CustomLabel[]
  initialSellerCanAdd?: boolean
}

export function CustomLabelsListView({
  labels: initialLabels,
  initialSellerCanAdd = false,
}: CustomLabelsListViewProps) {
  const [labels, setLabels] = useState(initialLabels)
  const [filterType, setFilterType] = useState<"all" | "in_house" | "seller">("all")
  const [search, setSearch] = useState("")
  const [sellerCanAdd, setSellerCanAdd] = useState(initialSellerCanAdd)
  const [isUpdatingSellerCanAdd, setIsUpdatingSellerCanAdd] = useState(false)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [labelToDelete, setLabelToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback notification
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Toggle "Sellers Can Create Custom Label?" setting
  const handleToggleSellerCanAdd = async () => {
    const nextState = !sellerCanAdd
    setSellerCanAdd(nextState)
    setIsUpdatingSellerCanAdd(true)
    try {
      const res = await toggleSellerCanAddCustomLabelAction(nextState)
      if (res.success) {
        showNotification(
          "success",
          `Seller custom label creation ${nextState ? "enabled" : "disabled"}.`
        )
      } else {
        setSellerCanAdd(!nextState)
        showNotification("error", "Failed to update seller permission setting.")
      }
    } catch (err) {
      console.error("Error toggling seller permission:", err)
      setSellerCanAdd(!nextState)
      showNotification("error", "An error occurred while updating settings.")
    } finally {
      setIsUpdatingSellerCanAdd(false)
    }
  }

  const handleToggleStatus = async (id: number, current: boolean) => {
    const next = !current
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, status: next } : l)))
    try {
      const res = await toggleCustomLabelStatusAction(id, next)
      if (res) {
        showNotification(
          "success",
          `Label ${next ? "activated" : "deactivated"} successfully.`
        )
      } else {
        setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, status: current } : l)))
        showNotification("error", "Failed to update label status.")
      }
    } catch (err) {
      console.error("Error toggling label status:", err)
      setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, status: current } : l)))
      showNotification("error", "An error occurred while updating status.")
    }
  }

  const handleToggleSellerAccess = async (id: number, current: boolean) => {
    const next = !current
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, sellerAccess: next } : l)))
    try {
      const res = await toggleCustomLabelSellerAccessAction(id, next)
      if (res) {
        showNotification(
          "success",
          `Seller access ${next ? "granted" : "revoked"} successfully.`
        )
      } else {
        setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, sellerAccess: current } : l)))
        showNotification("error", "Failed to update seller access.")
      }
    } catch (err) {
      console.error("Error toggling seller access:", err)
      setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, sellerAccess: current } : l)))
      showNotification("error", "An error occurred while updating access.")
    }
  }

  const handleDeleteClick = (id: number) => {
    setLabelToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!labelToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteCustomLabelAction(labelToDelete)
      if (res) {
        setLabels((prev) => prev.filter((l) => l.id !== labelToDelete))
        showNotification("success", "Custom label deleted successfully!")
      } else {
        showNotification("error", "Failed to delete custom label.")
      }
    } catch (err) {
      console.error("Error deleting custom label:", err)
      showNotification("error", "An error occurred while deleting label.")
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setLabelToDelete(null)
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#d43533]" />
            <span>Custom Label</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure promotional badges, flash banners, and tags on product cards (Active eCommerce 1:1)
          </p>
        </div>
        <Link
          href="/admin/custom-labels/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Custom Label</span>
        </Link>
      </div>

      {/* Top Setting Card matching Laravel: Sellers Can Create Custom Label? */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              Sellers Can Create Custom Label?
            </div>
            <div className="text-[11px] text-slate-500">
              Allow marketplace vendors to design and assign their own custom badges to seller products
            </div>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={sellerCanAdd}
          disabled={isUpdatingSellerCanAdd}
          onClick={handleToggleSellerCanAdd}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
            sellerCanAdd ? "bg-[#d43533]" : "bg-slate-300"
          }`}
          title="Toggle Seller Permission"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              sellerCanAdd ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border shadow-2xs transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              filterType === "all"
                ? "bg-[#d43533] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({labels.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("in_house")}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              filterType === "in_house"
                ? "bg-[#d43533] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Inhouse ({labels.filter((l) => l.userType === "admin").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("seller")}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              filterType === "seller"
                ? "bg-[#d43533] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Seller ({labels.filter((l) => l.userType === "seller").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type & Enter..."
            className="w-full pl-8 pr-7 py-1.5 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d43533] transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Labels Table */}
      <AdminCustomLabelsTable
        labels={filteredLabels}
        onToggleStatus={handleToggleStatus}
        onToggleSellerAccess={handleToggleSellerAccess}
        onDeleteClick={handleDeleteClick}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setLabelToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Custom Label"
        description="Are you sure you want to delete this custom label? Products assigned with this badge will no longer display it."
      />
    </div>
  )
}
