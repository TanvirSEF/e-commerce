"use client"

import React from "react"
import { X, Loader2 } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  isDeleting?: boolean
  isBulk?: boolean
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  isDeleting = false,
  isBulk = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button matching py-15px px-15px */}
        <div className="flex justify-end p-4 pb-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="pt-2 pb-6 px-6 text-center">
          {/* Active eCommerce CMS Icon */}
          <div className="flex justify-center mb-4">
            {isBulk ? (
              <div className="w-20 h-20 rounded-full border-2 border-red-500/20 bg-red-50 flex items-center justify-center text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-red-500 flex items-center justify-center bg-white shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f1426b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            )}
          </div>

          <h5 className="text-xl font-bold uppercase text-gray-900 tracking-wide mt-2">
            {title}
          </h5>

          <p className="text-sm text-gray-600 mt-2 font-normal">
            {message ? (
              message
            ) : (
              <>
                Do you really want to <span className="font-bold text-gray-900">Delete!</span>
              </>
            )}
          </p>
        </div>

        {/* Buttons matching Active eCommerce: No (green border) vs Yes (red border) */}
        <div className="flex items-center justify-between gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-1/2 py-2.5 px-4 text-sm font-bold text-emerald-600 border-2 border-emerald-500/40 rounded-xl hover:bg-emerald-50 transition-colors text-center disabled:opacity-50"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-1/2 py-2.5 px-4 text-sm font-bold text-red-600 border-2 border-red-500/40 rounded-xl hover:bg-red-50 transition-colors text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Yes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
