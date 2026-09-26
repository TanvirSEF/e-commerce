"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, Check } from "lucide-react"

export function CookieAlert() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const accepted = localStorage.getItem("active_ecom_cookie_accepted")
      if (!accepted) {
        // Small delay so page loads smoothly
        const timer = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(timer)
      }
    } catch {}
  }, [])

  if (!visible) return null

  const handleAccept = () => {
    setVisible(false)
    try {
      localStorage.setItem("active_ecom_cookie_accepted", "true")
    } catch {}
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-xl animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Cookie className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-gray-900">Cookie Agreement</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-gray-600">
            We use cookies to personalize content, ads, and analyze traffic. By browsing, you consent to our{" "}
            <Link href="/privacy-policy" className="font-semibold text-[#d43533] underline hover:text-[#b82a28]">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center gap-1 rounded bg-[#d43533] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#b82a28] transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              Ok. I Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieAlert
