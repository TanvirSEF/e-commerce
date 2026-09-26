import React from "react"
import { ShieldCheck } from "lucide-react"

export function ProductWarrantyBadges() {
  return (
    <div className="flex items-center gap-4 rounded-md border border-dashed border-gray-200 p-3 text-[11px] text-gray-500">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>7 Days Return</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-4 w-4 text-blue-600" />
        <span>100% Authentic Product</span>
      </div>
    </div>
  )
}
