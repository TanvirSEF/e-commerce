"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Bell } from "lucide-react"
import type { CustomAlertSettings } from "@/services/settings-service"

interface StorefrontCustomAlertProps {
  settings?: CustomAlertSettings | null
}

export function StorefrontCustomAlert({ settings }: StorefrontCustomAlertProps) {
  const pathname = usePathname()
  const [dismissed, setDismissed] = useState(false)

  // Don't show in admin, seller, or document print views
  const isExcludedRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/seller") ||
    pathname?.startsWith("/invoice") ||
    pathname?.startsWith("/shipping-label")

  useEffect(() => {
    if (!settings || !settings.text) return
    const isSessionDismissed = sessionStorage.getItem(`huipper_alert_dismissed_${settings.text.slice(0, 20)}`)
    if (isSessionDismissed) {
      setDismissed(true)
    }
  }, [settings])

  if (isExcludedRoute || dismissed || !settings || !settings.showAlert || !settings.text?.trim()) {
    return null
  }

  const handleDismiss = () => {
    setDismissed(true)
    if (settings.text) {
      sessionStorage.setItem(`huipper_alert_dismissed_${settings.text.slice(0, 20)}`, "true")
    }
  }

  const position = settings.position || "bottom-left"

  // Position styling classes
  const positionClasses = {
    "bottom-left": "bottom-20 left-4 sm:bottom-4 sm:left-4",
    "bottom-right": "bottom-20 right-4 sm:bottom-4 sm:right-4",
    "top-left": "top-24 left-4",
    "top-right": "top-24 right-4",
    "top-center": "top-20 left-1/2 -translate-x-1/2 w-full max-w-xl px-4",
  }[position] || "bottom-20 left-4 sm:bottom-4 sm:left-4"

  const content = (
    <div
      style={{
        backgroundColor: settings.backgroundColor || "#d43533",
        color: settings.textColor || "#ffffff",
      }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium backdrop-blur-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <Bell className="w-4 h-4 shrink-0 animate-bounce" />
      <span className="flex-1 leading-snug">{settings.text}</span>
      {settings.link && (
        <span className="underline font-bold text-[11px] shrink-0 ml-1 hover:opacity-80">
          Learn More →
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleDismiss()
        }}
        className="p-1 rounded-full hover:bg-black/20 text-current transition shrink-0 ml-1 cursor-pointer"
        title="Dismiss Alert"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )

  return (
    <aside aria-label="Store announcement" className={`fixed z-40 max-w-md ${positionClasses}`}>
      {settings.link ? (
        <Link href={settings.link} className="block group">
          {content}
        </Link>
      ) : (
        content
      )}
    </aside>
  )
}
