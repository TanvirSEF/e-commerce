"use client"

import React, { useState } from "react"
import { Award, CheckCircle, Save, Coins, ArrowRight, ShieldCheck } from "lucide-react"
import { updateClubPointsSettingsAction } from "@/app/actions/ecommerce-actions"
import type { ClubPointsSettings } from "@/services/settings-service"

interface ClubPointsAdminViewProps {
  initialSettings: ClubPointsSettings
}

export function ClubPointsAdminView({
  initialSettings,
}: ClubPointsAdminViewProps) {
  const [enabled, setEnabled] = useState(initialSettings.enabled)
  const [rate, setRate] = useState(initialSettings.pointsToWalletRate)
  const [perOrder, setPerOrder] = useState(initialSettings.pointsPerOrder100BDT)
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateClubPointsSettingsAction({
        enabled,
        pointsToWalletRate: Number(rate),
        pointsPerOrder100BDT: Number(perOrder),
      })
      setSuccessMsg("Club point configuration saved successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#d43533]" />
          Club Points & Reward System Setup
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure customer loyalty club points, wallet conversion redemption ratios, and order rewards
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Activation */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Club Points System Activation
              </h2>
              <p className="text-[11px] text-slate-500">
                Enable customer reward points on completed purchases and wallet conversions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>
        </div>

        {/* Card 2: Conversion Settings */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-sm font-bold text-slate-800">Point Conversion & Reward Rate</h2>
            <p className="text-[11px] text-slate-500">
              Define redemption valuation when users convert points into checkout wallet balances
            </p>
          </div>

          <div className="p-5 space-y-6">
            {/* Conversion Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Point Conversion Ratio (100 Club Points = ? ৳) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded border border-slate-200">
                    100 Points
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none font-bold text-slate-800"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Example: 100 Points = ৳10 Wallet Credit (1 Point = ৳0.10)
                </p>
              </div>

              {/* Points Awarded per 100 BDT */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Earning Rate (Points per ৳100 Spent) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded border border-slate-200">
                    Every ৳100
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={perOrder}
                      onChange={(e) => setPerOrder(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none font-bold text-slate-800"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Pts</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Customers automatically receive these points upon successful order delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Recent Point Conversion Rules Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            Active Reward Policy Summary
          </div>
          <div className="text-slate-600">
            • A customer purchasing a ৳5,000 order earns{" "}
            <strong>{((5000 / 100) * perOrder).toFixed(0)} Club Points</strong>.
          </div>
          <div className="text-slate-600">
            • Converting 500 points awards{" "}
            <strong>৳{((500 / 100) * rate).toFixed(2)}</strong> directly to customer wallet for instant checkout use.
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving Configuration..." : "Save Club Point Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
