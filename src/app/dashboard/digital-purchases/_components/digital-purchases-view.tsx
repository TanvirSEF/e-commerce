"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Download, Key, Check, Copy, X, FileCode } from "lucide-react"
import type { DigitalPurchaseItem } from "@/services/customer-extra-service"

interface DigitalPurchasesViewProps {
  initialPurchases: DigitalPurchaseItem[]
}

export function DigitalPurchasesView({ initialPurchases }: DigitalPurchasesViewProps) {
  const [purchases] = useState<DigitalPurchaseItem[]>(initialPurchases)
  const [activeKeyItem, setActiveKeyItem] = useState<DigitalPurchaseItem | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (item: DigitalPurchaseItem) => {
    alert(`Starting direct download for "${item.productName}" (${item.fileSize}).`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Download className="w-5 h-5 text-[#d43533]" />
          Digital Purchases & Downloadable Products
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Access your purchased software licenses, eBooks, digital templates, and product activation codes.
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <FileCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No digital purchases found.</p>
          <p className="text-xs mt-1">When you purchase digital products, they will appear here with direct download links.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Order Code</th>
                  <th className="py-3 px-4">File Details</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchases.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-400">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200">
                          <Image src={item.thumbnailImg} alt={item.productName} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{item.productName}</div>
                          <Link href={`/product/${item.productSlug}`} className="text-[10px] text-[#3490f3] hover:underline">
                            View Product Page
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-900 font-semibold">
                      {item.orderCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{item.fileFormat}</div>
                      <div className="text-[11px] text-gray-400">{item.fileSize}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{item.purchaseDate}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {item.licenseKey && (
                          <button
                            type="button"
                            onClick={() => setActiveKeyItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] rounded-lg transition-colors"
                          >
                            <Key className="w-3.5 h-3.5" />
                            License
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white font-bold text-[11px] rounded-lg transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* License Key Modal */}
      {activeKeyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative space-y-4">
            <button
              type="button"
              onClick={() => setActiveKeyItem(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 mb-1">
                Official Activation Key
              </span>
              <h2 className="text-sm font-bold text-gray-900">{activeKeyItem.productName}</h2>
              <div className="text-[11px] text-gray-500 mt-0.5">Order #{activeKeyItem.orderCode}</div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                Product License / Serial Code:
              </span>
              <div className="flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-lg p-2.5">
                <code className="text-xs font-mono font-bold text-[#d43533] select-all">
                  {activeKeyItem.licenseKey}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(activeKeyItem.licenseKey || "")}
                  className="p-1 text-gray-500 hover:text-[#d43533] transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveKeyItem(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
