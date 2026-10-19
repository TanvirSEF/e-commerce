"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, CheckSquare, Square } from "lucide-react"
import type { RoleItem } from "@/types/staff"
import { PERMISSION_GROUPS } from "@/config/permissions"
import { createRoleAction, updateRoleAction } from "@/app/actions/staff-actions"

interface Props {
  initialData?: RoleItem
}

export function RoleForm({ initialData }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEdit = !!initialData

  const [name, setName] = useState(initialData?.name || "")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initialData?.permissions || []
  )
  const [error, setError] = useState("")

  const allPermissionKeys = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key))
  const isAllSelected = allPermissionKeys.length > 0 && selectedPermissions.length === allPermissionKeys.length

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedPermissions([])
    } else {
      setSelectedPermissions([...allPermissionKeys])
    }
  }

  const handleToggleGroup = (keys: string[]) => {
    const allInGroupSelected = keys.every((k) => selectedPermissions.includes(k))
    if (allInGroupSelected) {
      setSelectedPermissions((prev) => prev.filter((k) => !keys.includes(k)))
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...keys])))
    }
  }

  const handleToggleSingle = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Role name is required.")
      return
    }

    startTransition(async () => {
      try {
        if (isEdit && initialData) {
          await updateRoleAction(initialData.id, {
            name: name.trim(),
            permissions: selectedPermissions,
          })
        } else {
          await createRoleAction({
            name: name.trim(),
            permissions: selectedPermissions,
          })
        }
        router.push("/admin/roles")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to save role"
        setError(msg)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/roles"
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-lg font-bold text-gray-800">
              {isEdit ? "Edit Staff Role" : "Create New Staff Role"}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleToggleAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            {isAllSelected ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-gray-400" />
                <span>Select All ({allPermissionKeys.length})</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Warehouse & Inventory Officer"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-800">Permissions Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERMISSION_GROUPS.map((group) => {
            const groupKeys = group.permissions.map((p) => p.key)
            const isGroupAllSelected = groupKeys.every((k) => selectedPermissions.includes(k))

            return (
              <div
                key={group.name}
                className="bg-white border border-gray-200 rounded shadow-sm p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800">{group.name}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleGroup(groupKeys)}
                    className="text-[11px] font-medium text-blue-600 hover:underline"
                  >
                    {isGroupAllSelected ? "Deselect" : "Select All"}
                  </button>
                </div>
                <div className="space-y-2">
                  {group.permissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key)
                    return (
                      <label
                        key={perm.key}
                        className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 hover:text-gray-900"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSingle(perm.key)}
                          className="rounded border-gray-300 text-[#d43533] focus:ring-0 cursor-pointer h-3.5 w-3.5"
                        />
                        <span>{perm.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Save */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex items-center justify-end gap-3">
        <Link
          href="/admin/roles"
          className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#1d3557] text-white text-xs font-semibold rounded hover:bg-[#16304d] disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Role...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{isEdit ? "Update Role" : "Save Role"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
