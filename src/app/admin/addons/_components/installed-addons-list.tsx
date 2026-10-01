"use client"

import React, { useState, useTransition } from "react"
import type { AddonItem } from "@/types/addon"
import { toggleAddonAction } from "@/app/actions/addon-actions"

interface Props {
  initialAddons: AddonItem[]
  onFeedback: (msg: { type: "success" | "error"; text: string }) => void
}

export function InstalledAddonsList({ initialAddons, onFeedback }: Props) {
  const [addons, setAddons] = useState<AddonItem[]>(initialAddons)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (addon: AddonItem) => {
    const nextStatus = !addon.activated
    setTogglingId(addon.id)

    // Optimistic UI update
    setAddons((prev) =>
      prev.map((a) => (a.id === addon.id ? { ...a, activated: nextStatus } : a))
    )

    startTransition(async () => {
      try {
        const res = await toggleAddonAction(addon.id, nextStatus)
        if (res.success) {
          onFeedback({
            type: "success",
            text: `Status updated successfully`,
          })
        } else {
          // Revert
          setAddons((prev) =>
            prev.map((a) => (a.id === addon.id ? { ...a, activated: addon.activated } : a))
          )
          onFeedback({
            type: "error",
            text: "Something went wrong",
          })
        }
      } catch {
        setAddons((prev) =>
          prev.map((a) => (a.id === addon.id ? { ...a, activated: addon.activated } : a))
        )
        onFeedback({
          type: "error",
          text: "Something went wrong",
        })
      } finally {
        setTogglingId(null)
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {addons.length === 0 ? (
            <li className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                📦
              </div>
              <h5 className="text-sm font-semibold text-gray-700">No Addon Installed</h5>
            </li>
          ) : (
            addons.map((addon) => (
              <li key={addon.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={addon.image || "/assets/img/placeholder.jpg"}
                      alt={addon.name}
                      className="h-14 w-20 object-cover rounded border border-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">
                        {addon.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="text-gray-400">Version:</span> {addon.version}
                      </p>
                      {addon.purchaseCode && (
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                          <span className="text-gray-400 font-sans">Purchase code:</span> {addon.purchaseCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: 1:1 Active eCommerce aiz-switch */}
                  <div className="self-end sm:self-center">
                    <label
                      className={`relative inline-flex items-center cursor-pointer ${
                        isPending && togglingId === addon.id ? "opacity-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={addon.activated}
                        onChange={() => handleToggle(addon)}
                        disabled={isPending && togglingId === addon.id}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
