"use client"

import React from "react"
import { AlertTriangle, Trash2, X } from "lucide-react"
import type { PreorderProduct } from "@/db/schema"

interface PreorderDeleteModalProps {
  product: PreorderProduct | null
  isBulk: boolean
  bulkCount: number
  isProcessing: boolean
  onClose: () => void
  onConfirmDelete: () => Promise<void>
}

export function PreorderDeleteModal({
  product,
  isBulk,
  bulkCount,
  isProcessing,
  onClose,
  onConfirmDelete,
}: PreorderDeleteModalProps) {
  if (!product && !isBulk) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Trash2 className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-800 text-sm">
              {isBulk ? "Delete Selected Products" : "Delete Preorder Product"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 text-xs text-slate-600 space-y-3">
          {isBulk ? (
            <p>
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900">{bulkCount} selected</strong> preorder products?
            </p>
          ) : (
            <p>
              Are you sure you want to delete{" "}
              <strong className="text-slate-900">{product?.name}</strong>?
            </p>
          )}

          <div className="p-3 bg-red-50 border border-red-200/60 rounded-lg text-red-700 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>This action cannot be undone and will remove the item(s) from the catalog.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onConfirmDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {isProcessing ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  )
}
