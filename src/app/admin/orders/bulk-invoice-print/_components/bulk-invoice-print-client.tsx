"use client"

import React, { useEffect } from "react"
import { Printer, ArrowLeft } from "lucide-react"
import { InvoiceView, type InvoiceData } from "@/app/invoice/[code]/_components/invoice-view"

interface BulkInvoicePrintClientProps {
  invoices: InvoiceData[]
  autoPrint?: boolean
}

export function BulkInvoicePrintClient({
  invoices,
  autoPrint = false,
}: BulkInvoicePrintClientProps) {
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
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          .bulk-invoice-sheet {
            page-break-after: always;
            break-after: page;
            margin-bottom: 0 !important;
          }
        }
      `}</style>

      {/* Bulk Print Toolbar */}
      <div className="max-w-[210mm] mx-auto px-4 mb-4 flex items-center justify-between print:hidden bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
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

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            {invoices.length} Invoices ready
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print All Invoices</span>
          </button>
        </div>
      </div>

      {/* Multiple Invoices Stack with clean page-break */}
      <div className="max-w-[210mm] mx-auto space-y-6 print:space-y-0 print:max-w-none">
        {invoices.map((inv) => (
          <div key={inv.code} className="bulk-invoice-sheet">
            <InvoiceView invoice={inv} hideControls={true} />
          </div>
        ))}
      </div>
    </div>
  )
}
