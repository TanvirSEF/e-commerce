"use client"

import React from "react"
import { AlertTriangle, Loader2 } from "lucide-react"

interface ConfirmDiscountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function ConfirmDiscountModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmDiscountModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-amber-50 mb-4">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>
        <p className="text-sm font-bold text-slate-800 leading-relaxed mb-6">
          N.B: If you set discount here all the products of this category will be discounted. You can also set individual product discount later.
          <br />
          <span className="text-[#d43533] mt-1 inline-block">Do you want to continue?</span>
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Confirm</span>
          </button>
        </div>
      </div>
    </div>
  )
}

interface ConfirmSwitchModalProps {
  isOpen: boolean
  isEnabling: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function ConfirmSwitchModal({
  isOpen,
  isEnabling,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmSwitchModalProps) {
  if (!isOpen) return null

  const message = isEnabling
    ? "Turning on this switch will apply the same discount to all seller products in this category. Do you want to proceed?"
    : "Turning off this switch will not affect already discounted seller products of this category. Are you sure?"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-amber-50 mb-4">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>
        <p className="text-sm font-bold text-slate-800 leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Confirm</span>
          </button>
        </div>
      </div>
    </div>
  )
}
