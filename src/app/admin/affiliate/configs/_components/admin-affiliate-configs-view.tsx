"use client"

import React, { useState } from "react"
import { Settings, Save, CheckCircle2, DollarSign, Calendar, FileText } from "lucide-react"
import { updateAffiliateConfigsAction } from "@/app/actions/ecommerce-actions"

interface AdminAffiliateConfigsViewProps {
  configs: Record<string, string>
}

export function AdminAffiliateConfigsView({ configs: initialConfigs }: AdminAffiliateConfigsViewProps) {
  const [configs, setConfigs] = useState(initialConfigs)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateAffiliateConfigsAction(configs)
      setSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#d43533]" />
          Affiliate Program Rules & Policies
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Define minimum payout thresholds, cookie duration, and legal agreement terms
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Affiliate rules and payout limits have been updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Minimum Withdrawal Amount ($)
              </label>
              <input
                type="number"
                step="1"
                required
                value={configs.minimum_withdraw_amount || "50"}
                onChange={(e) =>
                  setConfigs({ ...configs, minimum_withdraw_amount: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
              <p className="text-[11px] text-slate-400">Affiliates cannot request payout until balance reaches this amount</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Cookie Duration (Days)
              </label>
              <input
                type="number"
                step="1"
                required
                value={configs.cookie_duration_days || "30"}
                onChange={(e) =>
                  setConfigs({ ...configs, cookie_duration_days: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
              <p className="text-[11px] text-slate-400">Referral cookie tracking period after clicking a referral link</p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                Affiliate Agreement & Terms & Conditions
              </label>
              <textarea
                rows={5}
                value={configs.affiliate_terms || ""}
                onChange={(e) => setConfigs({ ...configs, affiliate_terms: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Affiliate Rules"}
          </button>
        </div>
      </form>
    </div>
  )
}
