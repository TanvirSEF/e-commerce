"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AlertTriangle, X } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

interface AccountDeleteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AccountDeleteModal({ isOpen, onClose }: AccountDeleteModalProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen) return null

  const handleConfirmDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      logout()
      setIsDeleting(false)
      onClose()
      router.push("/")
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header Matching Active eCommerce */}
        <div className="p-6 text-center border-b border-gray-100 bg-gray-50/50">
          <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow bg-gray-100 mb-2">
            <Image
              src={user?.avatar || "/assets/img/avatar-place.png"}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-base font-bold text-[#ff9819]">Delete Your Account</h3>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            Warning: You cannot undo this action
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-3 text-xs text-gray-600">
          <p className="font-bold text-[#d43533]">
            Note: Don&apos;t click any button or perform any action during account deletion.
          </p>
          <p className="font-bold text-gray-700">Deleting Account Means:</p>

          <div className="flex items-start gap-2.5 rounded bg-amber-50/70 border-l-4 border-amber-500 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-medium text-amber-900">
              If you created any classified products, after deleting your account, those products will no longer remain in our system.
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded bg-amber-50/70 border-l-4 border-[#d43533] p-3">
            <AlertTriangle className="h-4 w-4 text-[#d43533] shrink-0 mt-0.5" />
            <p className="font-medium text-red-900">
              After deleting your account, your remaining wallet balance and club points will be permanently cleared.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-4 bg-gray-50/30">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#b82a28] shadow-sm transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  )
}
