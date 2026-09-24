"use client"

import React from "react"
import Link from "next/link"
import { Printer, ChevronLeft, QrCode, Package } from "lucide-react"
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
}

export function ShippingLabelView({ labelData, settings }: ShippingLabelViewProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const isCOD = labelData.paymentMethod.toLowerCase().includes("cash")

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-8 print:bg-white print:py-0">
      {/* Non-printing Control Toolbar */}
      <div className="max-w-[420px] mx-auto mb-4 px-4 flex items-center justify-between print:hidden">
        <Link
          href={`/invoice/${labelData.orderCode}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>View Invoice</span>
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print Thermal Label</span>
        </button>
      </div>

      {/* Thermal 4x6 / 4x4 Printable Container */}
      <div className="max-w-[420px] mx-auto bg-white border-2 border-black rounded-lg p-5 font-mono text-xs text-black shadow-lg print:border-2 print:border-black print:shadow-none print:m-0 print:w-full print:rounded-none">
        {/* Top Header: Brand & Label Type */}
        <div className="text-center pb-3 border-b-2 border-black">
          <div className="font-extrabold text-base tracking-wider uppercase">
            {settings.senderName}
          </div>
          <div className="text-[11px] font-bold text-gray-700 tracking-wide mt-0.5">
            EXPEDITE PRIORITY DISPATCH
          </div>
        </div>

        {/* Barcode Strip */}
        <div className="py-3 border-b-2 border-black text-center">
          {/* Stylized high-contrast barcode SVG */}
          <div className="flex justify-center items-end gap-[2px] h-12 py-1">
            {[4, 2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 4, 2, 8, 2, 4, 6, 2, 4, 8, 2, 6, 4, 2, 8, 4, 2, 6, 2, 4].map(
              (w, i) => (
                <div
                  key={i}
                  className="bg-black h-full"
                  style={{ width: `${w * 0.75}px` }}
                />
              )
            )}
          </div>
          <div className="text-sm font-bold tracking-widest mt-1">
            *{labelData.trackingCode}*
          </div>
        </div>

        {/* Two Columns: From & To */}
        <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
          {/* Sender Block */}
          <div className="p-2.5 space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">
              SHIP FROM:
            </span>
            <div className="font-bold text-[11px] leading-tight">{settings.senderName}</div>
            <div className="text-[10px] leading-snug">{settings.senderAddress}</div>
            <div className="text-[10px] font-semibold">TEL: {settings.senderPhone}</div>
          </div>

          {/* Receiver Block */}
          <div className="p-2.5 space-y-1 bg-yellow-50/50 print:bg-transparent">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-800">
              DELIVER TO:
            </span>
            <div className="font-bold text-xs leading-tight">{labelData.customerName}</div>
            <div className="text-[10px] leading-snug">{labelData.shippingAddress}</div>
            <div className="text-[10px] font-bold mt-1">TEL: {labelData.customerPhone}</div>
          </div>
        </div>

        {/* Package & Payment Meta Strip */}
        <div className="grid grid-cols-3 divide-x-2 divide-black border-b-2 border-black text-center py-2 bg-gray-50 print:bg-transparent">
          <div>
            <span className="block text-[9px] uppercase font-bold text-gray-600">ORDER NO</span>
            <span className="font-bold text-[11px]">{labelData.orderCode}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-gray-600">DATE</span>
            <span className="font-bold text-[11px]">{labelData.date}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-gray-600">PAYMENT</span>
            <span
              className={`font-bold text-[10px] uppercase ${
                isCOD ? "text-red-700 font-extrabold" : "text-green-700"
              }`}
            >
              {isCOD ? "COD COLLECT" : "PREPAID"}
            </span>
          </div>
        </div>

        {/* COD Amount Banner */}
        {isCOD && (
          <div className="p-2 bg-black text-white text-center font-extrabold text-sm tracking-wide border-b-2 border-black flex items-center justify-between px-4">
            <span className="text-xs font-mono">C.O.D. AMOUNT TO COLLECT:</span>
            <span className="text-base">{formatPrice(labelData.totalAmount)}</span>
          </div>
        )}

        {/* Packaging Items Table (if enabled) */}
        {settings.showItemTable && (
          <div className="p-2.5 border-b-2 border-black space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>Package Contents ({labelData.items.length} SKUs):</span>
            </div>
            <ul className="text-[10px] space-y-0.5 divide-y divide-dashed divide-gray-300">
              {labelData.items.map((it, idx) => (
                <li key={idx} className="flex justify-between items-center py-1">
                  <span className="truncate pr-2 font-medium">{it.name}</span>
                  <span className="font-bold shrink-0">x{it.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom QR & Instructions */}
        <div className="p-2.5 flex items-center justify-between">
          <div className="text-[9px] leading-tight space-y-0.5 max-w-[240px]">
            <p className="font-bold">STANDARD CARRIER ROUTING</p>
            <p>Return if undelivered within 3 business days.</p>
            <p className="text-gray-600">Automated Courier Dispatch Label v2.4</p>
          </div>
          {settings.showQrCode && (
            <div className="w-12 h-12 border border-black flex items-center justify-center p-1 bg-white shrink-0">
              <QrCode className="w-10 h-10 text-black" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
