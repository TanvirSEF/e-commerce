"use client"

import React, { useState } from "react"
import { Palette, Sliders, CheckCircle2, AlertCircle } from "lucide-react"
import {
  deleteColorAction,
  toggleColorFilterActivationAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { AdminColorsTable } from "./admin-colors-table"
import { AdminColorForm } from "./admin-color-form"
import type { ColorData } from "@/services/color-service"

interface ColorsViewProps {
  initialColors: ColorData[]
  initialColorFilterActive?: boolean
}

export function ColorsView({
  initialColors,
  initialColorFilterActive = true,
}: ColorsViewProps) {
  const [colorsList, setColorsList] = useState<ColorData[]>(initialColors)
  const [searchQuery, setSearchQuery] = useState("")
  const [colorFilterActive, setColorFilterActive] = useState(initialColorFilterActive)
  const [isUpdatingFilter, setIsUpdatingFilter] = useState(false)

  // Edit state
  const [editingColor, setEditingColor] = useState<ColorData | null>(null)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [colorToDelete, setColorToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback notification
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Toggle Color Filter Activation
  const handleToggleColorFilter = async () => {
    const nextState = !colorFilterActive
    setColorFilterActive(nextState)
    setIsUpdatingFilter(true)
    try {
      const res = await toggleColorFilterActivationAction(nextState)
      if (res.success) {
        showNotification(
          "success",
          `Color filter for product catalog ${nextState ? "activated" : "deactivated"}.`
        )
      } else {
        setColorFilterActive(!nextState)
        showNotification("error", "Failed to update color filter activation.")
      }
    } catch (err) {
      console.error("Error updating color filter activation:", err)
      setColorFilterActive(!nextState)
      showNotification("error", "An error occurred while updating filter setting.")
    } finally {
      setIsUpdatingFilter(false)
    }
  }

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setColorToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!colorToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteColorAction(colorToDelete)
      if (res.success) {
        setColorsList((prev) => prev.filter((c) => c.id !== colorToDelete))
        if (editingColor?.id === colorToDelete) {
          setEditingColor(null)
        }
        showNotification("success", "Color deleted successfully!")
      } else {
        showNotification("error", "Failed to delete color.")
      }
    } catch (err) {
      console.error("Error deleting color:", err)
      showNotification("error", "An error occurred while deleting color.")
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setColorToDelete(null)
    }
  }

  // Form submit success
  const handleFormSuccess = (
    color: ColorData,
    isEdit: boolean,
    message: string
  ) => {
    if (isEdit) {
      setColorsList((prev) => prev.map((c) => (c.id === color.id ? color : c)))
      setEditingColor(null)
    } else {
      setColorsList((prev) => [color, ...prev])
    }
    showNotification("success", message)
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#d43533]" />
          Colors
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage product color attributes, hex codes, and storefront variation filters (Active eCommerce 1:1)
        </p>
      </div>

      {/* Info Notice matching Laravel color_filter_activation */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              Activate Color Filter for Storefront Product Listing Pages
            </div>
            <div className="text-[11px] text-slate-500">
              Enables customer-facing color swatches filter on the product catalog and search pages
            </div>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={colorFilterActive}
          disabled={isUpdatingFilter}
          onClick={handleToggleColorFilter}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
            colorFilterActive ? "bg-[#d43533]" : "bg-slate-300"
          }`}
          title="Toggle Color Filter"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              colorFilterActive ? "translate-x-4" : "translate-x-0"
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

      {/* Main Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colors Table (Col 8) */}
        <div className="lg:col-span-8">
          <AdminColorsTable
            colorsList={colorsList}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEdit={(color) => setEditingColor(color)}
            onDelete={handleDeleteClick}
            editingColorId={editingColor?.id || null}
          />
        </div>

        {/* Add/Edit Form (Col 4) */}
        <div className="lg:col-span-4">
          <AdminColorForm
            editingColor={editingColor}
            onCancelEdit={() => setEditingColor(null)}
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
            setColorToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Color Confirmation"
        description="Are you sure you want to delete this color? Products using this color attribute will retain raw hex values."
      />
    </div>
  )
}
