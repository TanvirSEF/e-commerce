"use client"

import React, { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import type { AdminClassifiedResponse } from "@/types/customer-product"
import { ClassifiedProductsTable } from "./classified-products-table"

interface Props {
  initialData: AdminClassifiedResponse
  initialSearch: string
  initialPage: number
}

export function ClassifiedProductsContainer({ initialData, initialSearch, initialPage }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const pushParams = (overrides: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    startTransition(() => { router.push(`/admin/customer-products?${params.toString()}`) })
  }

  const { items, total } = initialData
  const totalPages = Math.ceil(total / 15)

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h5 className="text-sm font-semibold text-gray-800">Classified Products</h5>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            defaultValue={initialSearch}
            placeholder="Type &amp; Enter"
            onChange={(e) => pushParams({ search: e.target.value, page: "1" })}
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400 w-56"
          />
        </div>
      </div>

      {/* Table */}
      <ClassifiedProductsTable
        items={items}
        isLoading={isPending}
        currentPage={initialPage}
        totalPages={totalPages}
        total={total}
        onPageChange={(p) => pushParams({ page: String(p) })}
      />
    </div>
  )
}
