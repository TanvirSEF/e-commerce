"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Plus, Search, Shield } from "lucide-react"
import type { RoleItem } from "@/types/staff"
import { RoleTable } from "./role-table"

interface Props {
  initialRoles: RoleItem[]
}

export function RolesListContainer({ initialRoles }: Props) {
  const [search, setSearch] = useState("")

  const filteredRoles = initialRoles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Title & Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">All Roles</h1>
        </div>
        <Link
          href="/admin/roles/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1d3557] text-white text-xs font-semibold rounded hover:bg-[#16304d] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Role</span>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-gray-200">
        <Link
          href="/admin/staffs"
          className="px-4 py-2.5 text-xs font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors"
        >
          All Staffs
        </Link>
        <Link
          href="/admin/roles"
          className="px-4 py-2.5 text-xs font-semibold border-b-2 border-[#d43533] text-[#d43533] transition-colors"
        >
          Staff Roles
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <h5 className="text-sm font-semibold text-gray-800">Roles &amp; Permissions</h5>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search role name..."
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400 w-56"
            />
          </div>
        </div>

        <RoleTable roles={filteredRoles} />
      </div>
    </div>
  )
}
