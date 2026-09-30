"use client"

import React, { useEffect } from "react"
import { Printer, ArrowLeft } from "lucide-react"
import {
  ShippingLabelView,
  type ShippingLabelData,
} from "@/app/shipping-label/[code]/_components/shipping-label-view"
import { type ShippingLabelSettings } from "@/services/settings-service"

interface BulkShippingLabelClientProps {
  labels: ShippingLabelData[]
  settings: ShippingLabelSettings
  autoPrint?: boolean
}

export function BulkShippingLabelClient({
  labels,
  settings,
  autoPrint = false,
}: BulkShippingLabelClientProps) {
  useEffect(() => {
    if (autoPrint && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        window.print()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [autoPrint])

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-6 print:bg-white print:py-0 print:min-h-0">
      <style jsx global>{`
        @media print {
          @page {
            size: 4in 6in;
            margin: 0;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          .bulk-label-sheet {
            page-break-after: always;
            break-after: page;
            margin-bottom: 0 !important;
          }
        }
      `}</style>

      {/* Bulk Toolbar */}
      <div className="max-w-[4in] mx-auto px-2 mb-4 flex items-center justify-between print:hidden bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              window.location.href = "/admin/orders"
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {labels.length} Labels
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print All (4×6)</span>
          </button>
        </div>
      </div>

      {/* Labels List with 4x6 page-break */}
      <div className="max-w-[4in] mx-auto space-y-6 print:space-y-0 print:max-w-none">
        {labels.map((lbl) => (
          <div key={lbl.orderCode} className="bulk-label-sheet">
            <ShippingLabelView
              labelData={lbl}
              settings={settings}
              hideControls={true}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
