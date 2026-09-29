"use client"

import React, { useState } from "react"
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react"
import { deleteWarrantyAction } from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { AdminWarrantiesTable } from "./admin-warranties-table"
import { AdminWarrantyForm } from "./admin-warranty-form"
import type { WarrantyData } from "@/services/warranty-service"

interface WarrantiesViewProps {
  initialWarranties: WarrantyData[]
}

export function WarrantiesView({ initialWarranties }: WarrantiesViewProps) {
  const [warranties, setWarranties] = useState<WarrantyData[]>(initialWarranties)
  const [searchQuery, setSearchQuery] = useState("")

  // Edit state
  const [editingWarranty, setEditingWarranty] = useState<WarrantyData | null>(null)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [warrantyToDelete, setWarrantyToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback notification
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setWarrantyToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!warrantyToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteWarrantyAction(warrantyToDelete)
      if (res.success) {
        setWarranties((prev) => prev.filter((w) => w.id !== warrantyToDelete))
        if (editingWarranty?.id === warrantyToDelete) {
          setEditingWarranty(null)
        }
        showNotification("success", "Warranty policy deleted successfully!")
      } else {
        showNotification("error", "Failed to delete warranty policy.")
      }
    } catch (err) {
      console.error("Error deleting warranty:", err)
      showNotification("error", "An error occurred while deleting warranty.")
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setWarrantyToDelete(null)
    }
  }

  // Form submit success
  const handleFormSuccess = (
    warranty: WarrantyData,
    isEdit: boolean,
    message: string
  ) => {
    if (isEdit) {
      setWarranties((prev) =>
        prev.map((w) => (w.id === warranty.id ? warranty : w))
      )
      setEditingWarranty(null)
    } else {
      setWarranties((prev) => [warranty, ...prev])
    }
    showNotification("success", message)
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#d43533]" />
          Warranties
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure product warranties, duration periods, and seller guarantee policies (Active eCommerce 1:1)
        </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Warranties Table (Col 8) */}
        <div className="lg:col-span-8">
          <AdminWarrantiesTable
            warranties={warranties}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEdit={(w) => setEditingWarranty(w)}
            onDelete={handleDeleteClick}
            editingWarrantyId={editingWarranty?.id || null}
          />
        </div>

        {/* Add/Edit Form (Col 4) */}
        <div className="lg:col-span-4">
          <AdminWarrantyForm
            editingWarranty={editingWarranty}
            onCancelEdit={() => setEditingWarranty(null)}
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
            setWarrantyToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Warranty Policy"
        description="Are you sure you want to delete this warranty policy? Products configured with this warranty will lose this policy association."
      />
    </div>
  )
}
