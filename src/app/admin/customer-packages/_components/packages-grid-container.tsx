"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"
import type { CustomerPackageItem } from "@/types/customer-package"
import { PackageCard } from "./package-card"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { deleteCustomerPackageAction } from "@/app/actions/customer-package-actions"

interface Props {
  packages: CustomerPackageItem[]
}

export function PackagesGridContainer({ packages: initialPackages }: Props) {
  const [packages, setPackages] = useState(initialPackages)
  const [deleteTarget, setDeleteTarget] = useState<CustomerPackageItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteCustomerPackageAction(deleteTarget.id)
      setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Titlebar */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">All Classifies Packages</h1>
        <a
          href="/admin/customer-packages/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1d3557] text-white text-xs font-semibold rounded hover:bg-[#16304d] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Package
        </a>
      </div>

      {/* Card Grid */}
      {packages.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No packages found.{" "}
          <a href="/admin/customer-packages/create" className="text-[#d43533] hover:underline">
            Add the first one
          </a>.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onDeleteClick={() => setDeleteTarget(pkg)} />
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Package"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />
    </div>
  )
}
