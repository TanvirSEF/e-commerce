"use client"

import React, { useState } from "react"
import { Layers, CheckCircle2, AlertCircle } from "lucide-react"
import { deleteAttributeAction } from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { AdminAttributesTable } from "./admin-attributes-table"
import { AdminAttributeForm } from "./admin-attribute-form"
import { AdminAttributeValuesModal } from "./admin-attribute-values-modal"
import type { AttributeItem } from "@/services/attribute-service"

interface AttributesAdminViewProps {
  initialAttributes: AttributeItem[]
}

export function AttributesAdminView({
  initialAttributes,
}: AttributesAdminViewProps) {
  const [attributes, setAttributes] = useState<AttributeItem[]>(initialAttributes)
  const [searchQuery, setSearchQuery] = useState("")

  // Form edit state
  const [editingAttr, setEditingAttr] = useState<AttributeItem | null>(null)

  // Values modal state
  const [managingValuesAttr, setManagingValuesAttr] = useState<AttributeItem | null>(null)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [attrToDelete, setAttrToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback notification
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setAttrToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!attrToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteAttributeAction(attrToDelete)
      if (res.success) {
        setAttributes((prev) => prev.filter((a) => a.id !== attrToDelete))
        if (editingAttr?.id === attrToDelete) {
          setEditingAttr(null)
        }
        showNotification("success", "Attribute deleted successfully!")
      } else {
        showNotification("error", "Failed to delete attribute.")
      }
    } catch (err) {
      console.error("Error deleting attribute:", err)
      showNotification("error", "An error occurred while deleting.")
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setAttrToDelete(null)
    }
  }

  // Form submission success
  const handleFormSuccess = (
    item: AttributeItem,
    isEdit: boolean,
    message: string
  ) => {
    if (isEdit) {
      setAttributes((prev) => prev.map((a) => (a.id === item.id ? item : a)))
      setEditingAttr(null)
    } else {
      setAttributes((prev) => [item, ...prev])
    }
    showNotification("success", message)
  }

  // Values updated from modal
  const handleValuesSaved = (updatedItem: AttributeItem) => {
    setAttributes((prev) =>
      prev.map((a) => (a.id === updatedItem.id ? updatedItem : a))
    )
    if (editingAttr?.id === updatedItem.id) {
      setEditingAttr(updatedItem)
    }
    showNotification("success", `Values updated for "${updatedItem.name}".`)
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#d43533]" />
          Attributes
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure product variation attributes and option values (Active eCommerce 1:1)
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* All Attributes Table (8 Columns) */}
        <div className="lg:col-span-8">
          <AdminAttributesTable
            attributes={attributes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEdit={(item) => setEditingAttr(item)}
            onManageValues={(item) => setManagingValuesAttr(item)}
            onDelete={handleDeleteClick}
            editingAttrId={editingAttr?.id || null}
          />
        </div>

        {/* Add/Edit Form (4 Columns) */}
        <div className="lg:col-span-4">
          <AdminAttributeForm
            editingAttr={editingAttr}
            onCancelEdit={() => setEditingAttr(null)}
            onSubmitSuccess={handleFormSuccess}
            onError={(msg) => showNotification("error", msg)}
          />
        </div>
      </div>

      {/* Attribute Values Modal */}
      <AdminAttributeValuesModal
        attr={managingValuesAttr}
        isOpen={!!managingValuesAttr}
        onClose={() => setManagingValuesAttr(null)}
        onSave={handleValuesSaved}
        onError={(msg) => showNotification("error", msg)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setAttrToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Attribute Confirmation"
        description="Are you sure you want to delete this attribute and all its option values? Products configured with these variations will lose this attribute mapping."
      />
    </div>
  )
}
