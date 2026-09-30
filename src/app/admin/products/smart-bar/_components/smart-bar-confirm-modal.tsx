"use client"

import React from "react"
import { X } from "lucide-react"

interface SmartBarConfirmModalProps {
  isOpen: boolean
  targetStatus: boolean
  onConfirm: () => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function SmartBarConfirmModal({
  isOpen,
  targetStatus,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: SmartBarConfirmModalProps) {
  if (!isOpen) return null

  const confirmText = targetStatus
    ? "Are you sure you want to set this smart bar in product detail page?"
    : "Are you sure you want to disable this smart bar in product detail page?"

  const detailText = targetStatus
    ? "Customers will see a smart bar in product detail page."
    : "Customers will no longer see smart bar in product detail page."

  const btnText = targetStatus ? "Allow" : "Disable"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] p-8 text-center relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Active eCommerce Warning SVG Icon 1:1 */}
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="72"
            height="64"
            viewBox="0 0 72 64"
          >
            <g id="Octicons" transform="translate(-0.14 -1.02)">
              <g id="alert" transform="translate(0.14 1.02)">
                <path
                  id="Shape"
                  d="M40.159,3.309a4.623,4.623,0,0,0-7.981,0L.759,58.153a4.54,4.54,0,0,0,0,4.578A4.718,4.718,0,0,0,4.75,65.02H67.587a4.476,4.476,0,0,0,3.945-2.289,4.773,4.773,0,0,0,.046-4.578Zm.6,52.555H31.582V46.708h9.173Zm0-13.734H31.582V23.818h9.173Z"
                  transform="translate(-0.14 -1.02)"
                  fill="#ffc700"
                  fillRule="evenodd"
                />
              </g>
            </g>
          </svg>
        </div>

        <p className="mt-2 mb-2 text-base font-bold text-slate-800 leading-snug">
          {confirmText}
        </p>
        <p className="text-xs text-slate-500 mb-6">{detailText}</p>

        <div className="flex justify-center">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="w-[250px] py-2.5 px-4 bg-[#ffc700] hover:bg-[#e6b400] active:bg-[#cca000] text-slate-900 font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : btnText}
          </button>
        </div>
      </div>
    </div>
  )
}
