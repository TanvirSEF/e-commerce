"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Pencil, Trash2, Shield, Lock } from "lucide-react"
import type { RoleItem } from "@/types/staff"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { deleteRoleAction } from "@/app/actions/staff-actions"

interface Props {
  roles: RoleItem[]
}

export function RoleTable({ roles }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<RoleItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteRoleAction(deleteTarget.id)
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-16">#</th>
              <th className="px-4 py-3">Role Name</th>
              <th className="px-4 py-3">Permissions Access</th>
              <th className="px-4 py-3 text-right w-24">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  No roles found.
                </td>
              </tr>
            ) : (
              roles.map((role, idx) => {
                const isSuperAdmin = role.id === 1 || role.name === "Super Admin"

                return (
                  <tr key={role.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{role.name}</div>
                          {isSuperAdmin && (
                            <span className="text-[10px] text-amber-600 font-medium">
                              System Protected Role
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {role.permissions.length} modules
                        </span>
                        {role.permissions.slice(0, 4).map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-slate-50 border border-slate-200 text-slate-600"
                          >
                            {p.replace(/_/g, " ")}
                          </span>
                        ))}
                        {role.permissions.length > 4 && (
                          <span className="text-[10px] text-gray-400">
                            +{role.permissions.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/roles/${role.id}/edit`}
                          className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Role & Permissions"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        {isSuperAdmin ? (
                          <span
                            className="p-1.5 text-gray-300 cursor-not-allowed"
                            title="Cannot delete Super Admin role"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(role)}
                            className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Role"
        description={`Are you sure you want to delete role "${deleteTarget?.name}"? Staff assigned to this role will lose their custom permissions.`}
      />
    </>
  )
}
