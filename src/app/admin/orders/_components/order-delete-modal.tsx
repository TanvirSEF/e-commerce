"use client"

import React, { useState } from "react"
import { Trash2, Loader2, X } from "lucide-react"

interface OrderDeleteModalProps {
  isOpen: boolean
  isBulk?: boolean
  selectedCount?: number
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function OrderDeleteModal({
  isOpen,
  isBulk = false,
  selectedCount = 1,
  onClose,
  onConfirm,
}: OrderDeleteModalProps) {
  const [deleting, setDeleting] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-lg max-w-sm w-full p-6 text-center shadow-xl border border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">
          Delete Confirmation
        </h3>

        <p className="text-xs text-slate-600 mb-2 font-medium">
          {isBulk
            ? `Are you sure you want to delete the ${selectedCount} selected Orders?`
            : "Are you sure you want to delete this order?"}
        </p>

        <p className="text-[11px] text-slate-400 mb-6">
          This action cannot be undone. Once deleted, the order will be permanently removed.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
