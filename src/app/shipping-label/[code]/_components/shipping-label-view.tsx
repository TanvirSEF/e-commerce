"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { Printer, ArrowLeft, Download, QrCode, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { type ShippingLabelSettings } from "@/services/settings-service"

export interface ShippingLabelData {
  orderCode: string
  trackingCode: string
  date: string
  senderName: string
  senderAddress: string
  senderPhone: string
  customerName: string
  customerPhone: string
  shippingAddress: string
  items: Array<{ name: string; quantity: number }>
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
}

interface ShippingLabelViewProps {
  labelData: ShippingLabelData
  settings: ShippingLabelSettings
  hideControls?: boolean
}

export function ShippingLabelView({
  labelData,
  settings,
  hideControls = false,
}: ShippingLabelViewProps) {
  useEffect(() => {
    // If URL has ?print=1, automatically trigger print dialog for thermal printer
    if (typeof window !== "undefined" && window.location.search.includes("print=1")) {
      const timer = setTimeout(() => {
        window.print()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const isCOD = labelData.paymentMethod.toLowerCase().includes("cash")

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
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .thermal-box {
            width: 4in !important;
            min-height: 6in !important;
            max-width: 4in !important;
            margin: 0 auto !important;
            padding: 10px !important;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Non-printing Control Toolbar */}
      {!hideControls && (
        <div className="max-w-[4in] mx-auto mb-4 px-2 flex items-center justify-between print:hidden">
          <Link
            href={`/invoice/${labelData.orderCode}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Invoice</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label (4×6)</span>
            </button>
          </div>
        </div>
      )}

      {/* Thermal 4x6 Printable Label Container (Exact 4in x 6in) */}
      <div className="thermal-box max-w-[4in] w-full mx-auto bg-white border-2 border-black rounded-sm p-4 font-mono text-xs text-black shadow-lg print:border-2 print:border-black print:shadow-none print:m-0 print:w-[4in] print:rounded-none">
        {/* Top Header: Brand & Label Type */}
        <div className="text-center pb-2.5 border-b-2 border-black">
          <div className="font-extrabold text-sm tracking-wider uppercase">
            {settings.senderName || "ACTIVE ECOMMERCE"}
          </div>
          <div className="text-[10px] font-bold text-slate-700 tracking-wide mt-0.5">
            EXPEDITE PRIORITY DISPATCH
          </div>
        </div>

        {/* Barcode Strip */}
        <div className="py-2.5 border-b-2 border-black text-center">
          <div className="flex justify-center items-end gap-[2px] h-10 py-1">
            {[4, 2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 4, 2, 8, 2, 4, 6, 2, 4, 8, 2, 6, 4, 2, 8, 4, 2, 6, 2, 4].map(
              (w, i) => (
                <div
                  key={i}
                  className="bg-black h-full"
                  style={{ width: `${w * 0.7}px` }}
                />
              )
            )}
          </div>
          <div className="text-xs font-bold tracking-widest mt-1">
            *{labelData.trackingCode}*
          </div>
        </div>

        {/* Two Columns: From & To */}
        <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
          {/* Sender Block */}
          <div className="p-2 space-y-0.5">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
              SHIP FROM:
            </span>
            <div className="font-bold text-[11px] leading-tight">{settings.senderName}</div>
            <div className="text-[10px] leading-snug">{settings.senderAddress}</div>
            <div className="text-[10px] font-semibold">TEL: {settings.senderPhone}</div>
          </div>

          {/* Receiver Block */}
          <div className="p-2 space-y-0.5 bg-yellow-50/40 print:bg-transparent">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-800">
              DELIVER TO:
            </span>
            <div className="font-bold text-xs leading-tight">{labelData.customerName}</div>
            <div className="text-[10px] leading-snug">{labelData.shippingAddress}</div>
            <div className="text-[10px] font-bold mt-1">TEL: {labelData.customerPhone}</div>
          </div>
        </div>

        {/* Package & Payment Meta Strip */}
        <div className="grid grid-cols-3 divide-x-2 divide-black border-b-2 border-black text-center py-1.5 bg-slate-50 print:bg-transparent">
          <div>
            <span className="block text-[8px] uppercase font-bold text-slate-600">ORDER NO</span>
            <span className="font-bold text-[10px]">{labelData.orderCode}</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase font-bold text-slate-600">DATE</span>
            <span className="font-bold text-[10px]">{labelData.date}</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase font-bold text-slate-600">PAYMENT</span>
            <span
              className={`font-bold text-[10px] uppercase ${
                isCOD ? "text-rose-700 font-extrabold" : "text-emerald-700"
              }`}
            >
              {isCOD ? "COD COLLECT" : "PREPAID"}
            </span>
          </div>
        </div>

        {/* COD Amount Banner */}
        {isCOD && (
          <div className="p-2 bg-black text-white text-center font-extrabold text-xs tracking-wide border-b-2 border-black flex items-center justify-between px-3">
            <span className="text-[10px] font-mono">C.O.D. AMOUNT TO COLLECT:</span>
            <span className="text-sm">{formatPrice(labelData.totalAmount)}</span>
          </div>
        )}

        {/* Packaging Items Table (if enabled) */}
        {settings.showItemTable && (
          <div className="p-2 border-b-2 border-black space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>Package Contents ({labelData.items.length} SKUs):</span>
            </div>
            <ul className="text-[10px] space-y-0.5 divide-y divide-dashed divide-slate-300">
              {labelData.items.map((it, idx) => (
                <li key={idx} className="flex justify-between items-center py-0.5">
                  <span className="truncate pr-2 font-medium">{it.name}</span>
                  <span className="font-bold shrink-0">x{it.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom QR & Instructions */}
        <div className="p-2 flex items-center justify-between">
          <div className="text-[8px] leading-tight space-y-0.5 max-w-[220px]">
            <p className="font-bold">STANDARD CARRIER ROUTING</p>
            <p>Return if undelivered within 3 business days.</p>
            <p className="text-slate-500">Automated Courier Dispatch Label v2.4</p>
          </div>
          {settings.showQrCode && (
            <div className="w-11 h-11 border border-black flex items-center justify-center p-0.5 bg-white shrink-0">
              <QrCode className="w-9 h-9 text-black" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
