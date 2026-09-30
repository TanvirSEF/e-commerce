"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { PackageCheck, Plus, Edit, Trash2, CreditCard, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react"
import { toggleSellerPackageStatusAction, deleteSellerPackageAction } from "@/app/actions/ecommerce-actions"
import type { SellerPackage } from "@/db/schema"

interface SellerPackagesViewProps {
  initialPackages?: SellerPackage[]
}

export function SellerPackagesView({ initialPackages = [] }: SellerPackagesViewProps) {
  const [packages, setPackages] = useState<SellerPackage[]>(initialPackages || [])
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleSellerPackageStatusAction(id, !current)
      if (ok) {
        setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, status: !current } : p)))
        setFeedback({ type: "success", text: "Seller package status updated successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update package status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleDelete = (id: number) => {
    startTransition(async () => {
      const ok = await deleteSellerPackageAction(id)
      if (ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id))
        setFeedback({ type: "success", text: "Seller package deleted successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to delete package" })
      }
      setDeletingId(null)
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#d43533]" />
            Seller Subscription Packages
          </h1>
          <p className="text-xs text-gray-500">Configure recurring membership plans, upload quotas, and seller pricing tiers</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/seller-packages/payments"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            <CreditCard className="w-4 h-4 text-gray-500" />
            Payment History
          </Link>
          <Link
            href="/admin/seller-packages/create"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Package
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Packages Grid / Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">Available Plans</h2>
          <span className="text-xs text-gray-400 font-mono">{packages.length} Packages</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Fee / Amount</th>
                <th className="py-3 px-4">Upload Limit</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No seller packages found. Click &quot;Add New Package&quot; to create one.
                  </td>
                </tr>
              ) : (
                packages.map((pkg, idx) => (
                  <tr key={pkg.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {pkg.logo ? (
                          <img
                            src={pkg.logo}
                            alt={pkg.name}
                            className="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-200 p-0.5"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center font-bold text-xs">
                            {pkg.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-gray-900">{pkg.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {Number(pkg.amount) === 0 ? "Free" : `$${pkg.amount}`}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700">{pkg.productUploadLimit} Products</td>
                    <td className="py-3 px-4 text-gray-600">{pkg.duration} Days</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(pkg.id, pkg.status)}
                        disabled={isPending}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          pkg.status ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            pkg.status ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/seller-packages/${pkg.id}/edit`}
                          className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit Package"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingId(pkg.id)}
                          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Delete Seller Package?</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Are you sure you want to delete this subscription plan? Existing seller subscriptions may be affected.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isPending}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                disabled={isPending}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
