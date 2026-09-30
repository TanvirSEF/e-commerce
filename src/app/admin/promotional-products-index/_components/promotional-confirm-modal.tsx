"use client"

import React from "react"
import { Trash2, AlertTriangle, X } from "lucide-react"

interface PromotionalConfirmModalProps {
  isOpen: boolean
  isBulk?: boolean
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function PromotionalConfirmModal({
  isOpen,
  isBulk = false,
  isLoading = false,
  onClose,
  onConfirm,
}: PromotionalConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end p-3 pb-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-1 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Trash2 className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {isBulk ? "Delete Confirmation" : "Confirm Product Removal"}
          </h3>

          <p className="text-sm font-medium text-slate-800 mb-2">
            Are you sure you want to remove the selected product{isBulk ? "s" : ""} from the Promotional section !
          </p>

          <p className="text-xs text-slate-500 leading-relaxed mb-6 bg-slate-50 p-3 rounded border border-slate-200">
            Please note that once removed, this products will also be automatically removed from all associated promotions and offer sections. This action is non reversible.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2 text-sm font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
