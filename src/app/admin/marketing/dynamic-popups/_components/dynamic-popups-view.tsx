"use client"

import React, { useState, useTransition, useMemo } from "react"
import Link from "next/link"
import { Plus, Search, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import {
  toggleDynamicPopupStatusAction,
  deleteDynamicPopupAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { DynamicPopupDurationCard } from "./dynamic-popup-duration-card"
import { DynamicPopupsTable, DynamicPopupItem } from "./dynamic-popups-table"

interface DynamicPopupsViewProps {
  initialPopups: DynamicPopupItem[]
  initialDuration?: string
}

export function DynamicPopupsView({
  initialPopups,
  initialDuration = "10",
}: DynamicPopupsViewProps) {
  const [popups, setPopups] = useState<DynamicPopupItem[]>(initialPopups)
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [, startTransition] = useTransition()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [popupsToDelete, setPopupsToDelete] = useState<number[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredPopups = useMemo(() => {
    return popups.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase())
    )
  }, [popups, search])

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredPopups.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPopups.map((p) => p.id))
    }
  }

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      const ok = await toggleDynamicPopupStatusAction(id, !currentStatus)
      if (ok) {
        setPopups((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: !currentStatus } : item
          )
        )
        setFeedback({ type: "success", text: "Popup status updated successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update popup status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleDeleteSingle = (id: number) => {
    setPopupsToDelete([id])
    setDeleteModalOpen(true)
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    setPopupsToDelete(selectedIds)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (popupsToDelete.length === 0) return
    setIsDeleting(true)
    try {
      for (const id of popupsToDelete) {
        await deleteDynamicPopupAction(id)
      }
      setPopups((prev) => prev.filter((p) => !popupsToDelete.includes(p.id)))
      setSelectedIds((prev) => prev.filter((id) => !popupsToDelete.includes(id)))
      setFeedback({ type: "success", text: "Selected popup(s) deleted successfully." })
    } catch {
      setFeedback({ type: "error", text: "Failed to delete popup(s)." })
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setPopupsToDelete([])
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dynamic Popups</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create high-converting dynamic popups and promotional banner modals
          </p>
        </div>
        <Link
          href="/admin/marketing/dynamic-popups/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-bold bg-[#d43533] hover:bg-[#b82a28] text-white shadow-xs transition-colors"
        >
          <Plus className="size-4" />
          <span>Create New Dynamic Popup</span>
        </Link>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
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

      <DynamicPopupDurationCard
        initialDuration={initialDuration}
        onFeedback={setFeedback}
      />

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search popups..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-primary"
            />
          </div>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>

        <DynamicPopupsTable
          popups={filteredPopups}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleStatus={handleToggleStatus}
          onDeleteClick={handleDeleteSingle}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setPopupsToDelete([])
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description={`Are you sure you want to delete ${popupsToDelete.length} selected popup(s)?`}
      />
    </div>
  )
}
