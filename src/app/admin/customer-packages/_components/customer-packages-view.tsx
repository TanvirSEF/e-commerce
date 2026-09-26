"use client"

import React, { useState, useTransition } from "react"
import { Package, Plus, CheckCircle2, AlertCircle } from "lucide-react"
import {
  createCustomerPackageAction,
  toggleCustomerPackageStatusAction,
} from "@/app/actions/ecommerce-actions"
import type { CustomerPackage } from "@/db/schema"

interface CustomerPackagesViewProps {
  initialPackages: CustomerPackage[]
}

export function CustomerPackagesView({ initialPackages }: CustomerPackagesViewProps) {
  const [packages, setPackages] = useState<CustomerPackage[]>(initialPackages)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("0")
  const [productUpload, setProductUpload] = useState(10)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleCustomerPackageStatusAction(id, !current)
      if (ok) {
        setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, status: !current } : p)))
        setFeedback({ type: "success", text: "Customer package status updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      try {
        const created = await createCustomerPackageAction({
          name: name.trim(),
          amount: String(amount),
          productUpload: Number(productUpload),
        })
        setPackages((prev) => [...prev, created])
        setName("")
        setAmount("0")
        setFeedback({ type: "success", text: "Customer classified package created" })
      } catch (err) {
        setFeedback({ type: "error", text: "Failed to create package" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#d43533]" />
          Customer Classified Packages
        </h1>
        <p className="text-xs text-gray-500">Configure upload packages for customer classified ads and used product listings</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Packages Table (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">All Packages</span>
              <span className="text-xs font-mono text-gray-400">{packages.length} plans</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 w-12">#</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Listing Limit</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packages.map((pkg, idx) => (
                    <tr key={pkg.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{pkg.name}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {Number(pkg.amount) === 0 ? "Free" : `$${pkg.amount}`}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">{pkg.productUpload} Ads</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Add Form (5 cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleCreate}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4"
          >
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900">Add Customer Package</h2>
              <p className="text-xs text-gray-500">Enable customers to post classified products</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Standard 10 Ads"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Amount ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ad Upload Limit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={productUpload}
                  onChange={(e) => setProductUpload(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isPending ? "Creating..." : "Save Customer Package"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
