"use client"

import React, { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, UserPlus } from "lucide-react"
import type { AdminCustomersResponse } from "@/types/customer-admin"
import { CustomerTable } from "./customer-table"

interface Props {
  initialData: AdminCustomersResponse
  initialSearch: string
  initialStatus: string
  initialPage: number
}

const STATUS_TABS = [
  { key: "all",        label: "All" },
  { key: "banned",     label: "Banned" },
  { key: "suspicious", label: "Suspicious" },
  { key: "verified",   label: "Verified" },
  { key: "unverified", label: "Unverified" },
]

export function CustomersListContainer({ initialData, initialSearch, initialStatus, initialPage }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const pushParams = (overrides: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    startTransition(() => { router.push(`/admin/customers?${params.toString()}`) })
  }

  const handleSearch = (value: string) => {
    pushParams({ search: value, page: "1" })
  }

  const handleStatusChange = (status: string) => {
    pushParams({ status, page: "1" })
  }

  const handlePageChange = (page: number) => {
    pushParams({ page: String(page) })
  }

  const { items, total, counts } = initialData
  const totalPages = Math.ceil(total / 15)

  const getCount = (key: string) => {
    const map: Record<string, number> = {
      all: counts.all, banned: counts.banned, suspicious: counts.suspicious,
      verified: counts.verified, unverified: counts.unverified,
    }
    return map[key] ?? 0
  }

  return (
    <div className="space-y-4">
      {/* Titlebar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">All Customers</h1>
        </div>
        <a
          href="/admin/customers/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1d3557] text-white text-xs font-semibold rounded hover:bg-[#16304d] transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add New Customer
        </a>
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        {/* Card header */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h5 className="text-sm font-semibold text-gray-800">All Customers</h5>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              defaultValue={initialSearch}
              placeholder="Type &amp; Enter"
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400 w-56"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200 flex overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleStatusChange(tab.key)}
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                initialStatus === tab.key
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600">
                {getCount(tab.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <CustomerTable
          items={items}
          isLoading={isPending}
          currentPage={initialPage}
          totalPages={totalPages}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
