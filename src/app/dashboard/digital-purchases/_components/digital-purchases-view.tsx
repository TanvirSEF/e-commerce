"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Download, Key, Check, Copy, X } from "lucide-react"
import type { DigitalPurchaseItem } from "@/services/customer-extra-service"

interface DigitalPurchasesViewProps {
  initialPurchases?: DigitalPurchaseItem[]
}

export function DigitalPurchasesView({ initialPurchases = [] }: DigitalPurchasesViewProps) {
  const [purchases] = useState<DigitalPurchaseItem[]>(initialPurchases)
  const [activeKeyItem, setActiveKeyItem] = useState<DigitalPurchaseItem | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (item: DigitalPurchaseItem) => {
    // Trigger download from authenticated API endpoint
    window.location.href = `/api/digital-products/download/${item.productId}`
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce CMS Card Layout */}
      <div className="rounded border border-gray-200 bg-white shadow-xs overflow-hidden">
        {/* Card Header matching Laravel aiz-card-header 1:1 */}
        <div className="border-b border-gray-100 p-5 bg-white flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Download Your Products</h1>
          <span className="text-xs text-gray-500 font-medium">
            {purchases.length} {purchases.length === 1 ? "product" : "products"} available
          </span>
        </div>

        {/* Card Body */}
        {purchases.length === 0 ? (
          /* Empty State Matching Laravel 1:1 */
          <div className="p-12 text-center">
            <div className="relative mx-auto w-40 h-32 mb-4">
              <Image
                src="/assets/img/nothing.svg"
                alt="Nothing found"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h3 className="text-base font-bold text-gray-800">There isn&apos;t anything added yet</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              You haven&apos;t purchased any digital downloadable products yet.
            </p>
            <div className="mt-5">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors shadow-2xs"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          /* 2-Column Table Matching Laravel digital_purchase_history.blade.php 1:1 */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Product</th>
                  <th className="py-3.5 px-5 text-right w-1/4">Option</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {purchases.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Left Column: Product Thumbnail + Title + Metadata */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-4">
                        {/* 80x80 Image Matching Laravel size-80px 1:1 */}
                        <div className="relative h-20 w-20 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                          <Image
                            src={item.thumbnailImg || "/assets/img/placeholder.jpg"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.currentTarget
                              if (!target.src.includes("placeholder.jpg")) {
                                target.src = "/assets/img/placeholder.jpg"
                              }
                            }}
                          />
                        </div>

                        {/* Title and Order Info */}
                        <div className="space-y-1">
                          <Link
                            href={`/product/${item.productSlug}`}
                            className="font-semibold text-gray-900 hover:text-[#d43533] line-clamp-2 transition-colors block text-xs sm:text-sm"
                            title={item.productName}
                          >
                            {item.productName}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                            <span>
                              Order: <strong className="font-mono text-gray-700">{item.orderCode}</strong>
                            </span>
                            <span>•</span>
                            <span>Purchased: {item.purchaseDate}</span>
                            {item.fileFormat && (
                              <>
                                <span>•</span>
                                <span className="uppercase font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                                  {item.fileFormat}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Right Column: Option Buttons (Circular Download SVG matching Laravel) */}
                    <td className="py-4 px-5 text-right align-middle">
                      <div className="inline-flex items-center justify-end gap-2">
                        {/* License Key Button if available */}
                        {item.licenseKey && (
                          <button
                            type="button"
                            onClick={() => setActiveKeyItem(item)}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#3490f3] hover:text-[#3490f3] transition-colors shadow-2xs"
                            title="View License Key"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-500" />
                            <span className="hidden sm:inline">License</span>
                          </button>
                        )}

                        {/* Circular Soft-Info Download Button Matching Laravel 1:1 */}
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="h-9 w-9 rounded-full bg-blue-50 text-[#3490f3] hover:bg-[#3490f3] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                          title="Download Digital Asset"
                        >
                          {/* Active eCommerce Exact SVG Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 12 12.001"
                            className="fill-current"
                          >
                            <path
                              d="M13936.389,851.5l.707-.707,2.355,2.355V846h1v7.1l2.306-2.306.707.707-3.538,3.538Z"
                              transform="translate(-13936 -846)"
                            />
                            <rect
                              width="12"
                              height="1"
                              transform="translate(0 11)"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* License Key Modal */}
      {activeKeyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Key className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">License Key & Activation</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveKeyItem(null)}
                className="rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-800 line-clamp-1">{activeKeyItem.productName}</p>
              <p className="text-[11px] text-gray-400">Order: {activeKeyItem.orderCode}</p>
            </div>

            <div className="rounded bg-gray-50 border border-gray-200 p-3 flex items-center justify-between gap-2">
              <code className="text-xs font-mono font-bold text-gray-800 break-all select-all">
                {activeKeyItem.licenseKey}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(activeKeyItem.licenseKey || "")}
                className="shrink-0 p-1.5 rounded hover:bg-white text-gray-500 hover:text-[#3490f3] transition-colors border border-transparent hover:border-gray-200"
                title="Copy License Key"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveKeyItem(null)}
                className="rounded border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDownload(activeKeyItem)}
                className="inline-flex items-center gap-1.5 rounded bg-[#3490f3] hover:bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download License File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
