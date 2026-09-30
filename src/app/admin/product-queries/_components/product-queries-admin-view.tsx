"use client"

import React, { useState } from "react"
import type { ProductQueriesResponse } from "@/services/product-query-service"
import { ProductQueriesTable } from "./product-queries-table"

interface ProductQueriesAdminViewProps {
  initialData: ProductQueriesResponse
}

export function ProductQueriesAdminView({
  initialData,
}: ProductQueriesAdminViewProps) {
  const [data, setData] = useState<ProductQueriesResponse>(initialData)

  const handlePageChange = async (page: number) => {
    try {
      const res = await fetch(`/api/admin/product-queries?page=${page}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error("Error changing page:", err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-white">
          <h5 className="text-sm font-bold text-slate-800 tracking-tight">
            Product Queries
          </h5>
        </div>

        {/* Table */}
        <ProductQueriesTable
          queries={data.queries}
          totalCount={data.totalCount}
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          perPage={data.perPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
