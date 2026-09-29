"use client"

import React, { useState } from "react"
import Link from "next/link"
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react"
import {
  deleteBrandAction,
  toggleBrandTopAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { AdminBrandsTable } from "./admin-brands-table"
import { AdminBrandForm } from "./admin-brand-form"

export interface AdminBrandItem {
  id: string
  name: string
  slug: string
  logo: string
  top: boolean
  productCount: number
}

interface AdminBrandsViewProps {
  initialBrands: AdminBrandItem[]
}

export function AdminBrandsView({ initialBrands }: AdminBrandsViewProps) {
  const [brands, setBrands] = useState<AdminBrandItem[]>(initialBrands)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingBrand, setEditingBrand] = useState<AdminBrandItem | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Toggle Top Brand Switch
  const toggleTop = async (id: string, currentTop: boolean) => {
    const nextTop = !currentTop
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, top: nextTop } : b))
    )
    try {
      const res = await toggleBrandTopAction(id, nextTop)
      if (res.success) {
        showNotification(
          "success",
          `Brand ${nextTop ? "marked as Top Brand" : "removed from Top Brands"}.`
        )
      } else {
        // Rollback
        setBrands((prev) =>
          prev.map((b) => (b.id === id ? { ...b, top: currentTop } : b))
        )
        showNotification("error", "Failed to update top brand status.")
      }
    } catch (err) {
      console.error("Error toggling brand top status:", err)
      setBrands((prev) =>
        prev.map((b) => (b.id === id ? { ...b, top: currentTop } : b))
      )
      showNotification("error", "An error occurred while updating status.")
    }
  }

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setBrandToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteBrandAction(brandToDelete)
      if (res.success) {
        setBrands((prev) => prev.filter((b) => b.id !== brandToDelete))
        if (editingBrand?.id === brandToDelete) {
          setEditingBrand(null)
        }
        showNotification("success", "Brand deleted successfully!")
      } else {
        showNotification("error", "Failed to delete brand.")
      }
    } catch (err) {
      console.error("Error deleting brand:", err)
      showNotification("error", "An error occurred while deleting brand.")
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setBrandToDelete(null)
    }
  }

  // Form success handler
  const handleFormSuccess = (
    brand: AdminBrandItem,
    isEdit: boolean,
    message: string
  ) => {
    if (isEdit) {
      setBrands((prev) => prev.map((b) => (b.id === brand.id ? brand : b)))
      setEditingBrand(null)
    } else {
      setBrands((prev) => [brand, ...prev])
    }
    showNotification("success", message)
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Brands</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product manufacturers, logos and brand affiliations
          </p>
        </div>

        <Link
          href="/admin/brands/bulk-upload"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded shadow-2xs transition-colors cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5 text-[#d43533]" />
          <span>Bulk Upload</span>
        </Link>
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

      {/* Main Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* All Brands Table Pane */}
        <div className="lg:col-span-8">
          <AdminBrandsTable
            brands={brands}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleTop={toggleTop}
            onEdit={(b) => setEditingBrand(b)}
            onDelete={handleDeleteClick}
            editingBrandId={editingBrand?.id || null}
          />
        </div>

        {/* Add/Edit Brand Form Pane */}
        <div className="lg:col-span-4">
          <AdminBrandForm
            editingBrand={editingBrand}
            onCancelEdit={() => setEditingBrand(null)}
            onSubmitSuccess={handleFormSuccess}
            onError={(msg) => showNotification("error", msg)}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setBrandToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description="Are you sure you want to delete this brand? Products linked to this brand will have their brand association unlinked."
      />
    </div>
  )
}
