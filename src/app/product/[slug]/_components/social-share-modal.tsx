"use client"

import React, { useState } from "react"
import { X, Link as LinkIcon, Check, Copy } from "lucide-react"

interface SocialShareModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productUrl?: string
}

export function SocialShareModal({
  isOpen,
  onClose,
  productName,
  productUrl,
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const url =
    productUrl || (typeof window !== "undefined" ? window.location.href : "")

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const shareLinks = [
    {
      name: "Facebook",
      icon: (
        <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      bg: "bg-[#1877F2] hover:bg-[#166fe5]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter / X",
      icon: (
        <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      bg: "bg-black hover:bg-neutral-800",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
      ),
      bg: "bg-[#25D366] hover:bg-[#20ba5a]",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(productName + " " + url)}`,
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      bg: "bg-[#0A66C2] hover:bg-[#084e96]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#d43533] ring-8 ring-red-50/50">
          <LinkIcon className="h-7 w-7" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900">Share with Friends</h3>
          <p className="mt-1 text-xs text-gray-500">
            Trading is more effective when you share products with friends!
          </p>
        </div>

        {/* Share Link Input */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-gray-700">Share your link</label>
          <div className="mt-1.5 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <span className="flex-1 truncate text-xs text-gray-600 font-mono">
              {url}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-2 flex items-center gap-1 rounded bg-[#d43533] px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#b82d2b]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share To Social Buttons */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-gray-700">Share to</label>
          <div className="mt-2 grid grid-cols-4 gap-2.5">
            {shareLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center gap-1.5 rounded-lg py-2.5 text-white transition-transform hover:scale-105 ${item.bg}`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
