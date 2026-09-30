"use client"

import React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

export function PreorderProductsHeader() {
  return (
    <div className="aiz-titlebar text-left mt-2 mb-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            All Preorder Products
          </h1>
        </div>
        <div>
          <Link
            href="/admin/preorder/products/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
