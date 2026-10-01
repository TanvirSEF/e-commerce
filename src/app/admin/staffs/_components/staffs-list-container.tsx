"use client"

import React, { useTransition } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Plus } from "lucide-react"
import type { AdminStaffsResponse } from "@/types/staff"
import { StaffTable } from "./staff-table"

interface Props {
  initialData: AdminStaffsResponse
  initialSearch: string
  initialPage: number
}

export function StaffsListContainer({
  initialData,
  initialSearch,
  initialPage,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const pushParams = (overrides: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    startTransition(() => {
      router.push(`/admin/staffs?${params.toString()}`)
    })
  }

  const { items, total } = initialData
  const totalPages = Math.ceil(total / 15)

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Titlebar */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">All Staffs</h1>
        <Link
          href="/admin/staffs/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1d3557] text-white text-xs font-semibold rounded hover:bg-[#16304d] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Staffs</span>
        </Link>
      </div>

      {/* Card container matching backend/staff/staffs/index.blade.php */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h5 className="text-sm font-semibold text-gray-800">Staffs</h5>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              defaultValue={initialSearch}
              placeholder="Type &amp; Enter"
              onChange={(e) =>
                pushParams({ search: e.target.value, page: "1" })
              }
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400 w-56"
            />
          </div>
        </div>

        {/* Staff Table */}
        <StaffTable
          items={items}
          isLoading={isPending}
          currentPage={initialPage}
          totalPages={totalPages}
          total={total}
          onPageChange={(p) => pushParams({ page: String(p) })}
        />
      </div>
    </div>
  )
}
