"use client"

import React, { useEffect, useState } from "react"
import { Eye } from "lucide-react"

interface ProductVisitorsBadgeProps {
  show?: boolean
  min?: number
  max?: number
}

export function ProductVisitorsBadge({
  show = true,
  min = 5,
  max = 25,
}: ProductVisitorsBadgeProps) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null)

  useEffect(() => {
    if (!show) return
    const minVal = Math.max(1, min)
    const maxVal = Math.max(minVal, max)
    const initial = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
    setVisitorCount(initial)

    // Periodic gentle fluctuation (Active eCommerce live feeling)
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        if (!prev) return initial
        const delta = Math.random() > 0.5 ? 1 : -1
        const next = prev + delta
        return next >= minVal && next <= maxVal ? next : prev
      })
    }, 12000)

    return () => clearInterval(interval)
  }, [show, min, max])

  if (!show || visitorCount === null) return null

  return (
    <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-red-50/80 border border-red-100 text-xs text-slate-700 animate-in fade-in duration-300">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d43533]"></span>
      </span>
      <div className="flex items-center gap-1.5 font-medium">
        <Eye className="w-3.5 h-3.5 text-[#d43533]" />
        <span>
          <strong className="font-bold text-slate-900">{visitorCount}</strong> people are viewing right now
        </span>
      </div>
    </div>
  )
}
