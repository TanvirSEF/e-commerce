"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { StaffItem, RoleItem } from "@/types/staff"
import {
  createStaffAction,
  updateStaffAction,
} from "@/app/actions/staff-actions"

interface Props {
  initialData?: StaffItem
  roles: RoleItem[]
}

export function StaffForm({ initialData, roles }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const isEdit = !!initialData

  const [name, setName] = useState(initialData?.name || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [phone, setPhone] = useState(initialData?.phone || "")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState<number>(
    initialData?.roleId || (roles[0]?.id ?? 2)
  )
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Name is required.")
      return
    }
    if (!email.trim()) {
      setError("Email is required.")
      return
    }
    if (!phone.trim()) {
      setError("Phone is required.")
      return
    }
    if (!isEdit && !password) {
      setError("Password is required.")
      return
    }
    if (!roleId) {
      setError("Please select a role.")
      return
    }

    startTransition(async () => {
      try {
        if (isEdit && initialData) {
          await updateStaffAction(initialData.id, {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password || undefined,
            roleId,
          })
        } else {
          await createStaffAction({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            roleId,
          })
        }
        router.push("/admin/staffs")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to save staff"
        setError(msg)
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        {/* 1:1 Active eCommerce Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h5 className="text-sm font-semibold text-gray-800">
            Staff Information
          </h5>
          <Link
            href="/admin/staffs"
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            Back to list
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
              <label className="text-xs font-medium text-gray-700 sm:col-span-1">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
              <label className="text-xs font-medium text-gray-700 sm:col-span-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
              <label className="text-xs font-medium text-gray-700 sm:col-span-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
              <label className="text-xs font-medium text-gray-700 sm:col-span-1">
                Password {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <div className="sm:col-span-3">
                <input
                  type="password"
                  placeholder={isEdit ? "Leave blank to keep unchanged" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  required={!isEdit}
                />
              </div>
            </div>

            {/* Role */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
              <label className="text-xs font-medium text-gray-700 sm:col-span-1">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  required
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
            <Link
              href="/admin/staffs"
              className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-xs font-semibold bg-[#1d3557] hover:bg-[#16304d] text-white rounded disabled:opacity-60 transition-colors"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
