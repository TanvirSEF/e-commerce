"use client"

import React from "react"
import Image from "next/image"
import { Pencil, Trash2, Package } from "lucide-react"
import type { CustomerPackageItem } from "@/types/customer-package"

interface Props {
  pkg: CustomerPackageItem
  onDeleteClick: () => void
}

export function PackageCard({ pkg, onDeleteClick }: Props) {
  const isFree = pkg.amount === 0

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
      <div className="p-5 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="w-24 h-20 relative mb-4">
          {pkg.logo ? (
            <Image
              src={pkg.logo}
              alt={`${pkg.name} logo`}
              fill
              className="object-contain"
              onError={(e) => { e.currentTarget.style.display = "none" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-semibold text-gray-800 mb-1">{pkg.name}</p>

        {/* Price */}
        <p className="text-xl font-bold text-[#d43533] mb-2">
          {isFree ? "Free" : `৳${pkg.amount.toLocaleString()}`}
        </p>

        {/* Upload limit */}
        <p className="text-xs text-gray-500 mb-4">
          Product Upload:{" "}
          <span className="font-semibold text-gray-700">{pkg.productUpload}</span>
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full">
          <a
            href={`/admin/customer-packages/${pkg.id}/edit`}
            className="flex-1 py-1.5 text-center text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Pencil className="w-3 h-3 inline mr-1" />
            Edit
          </a>
          <button
            onClick={onDeleteClick}
            className="flex-1 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-3 h-3 inline mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
