"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Users, DollarSign, Copy, Check, Share2, History, ArrowUpRight, CheckCircle2 } from "lucide-react"
import type { AffiliateUser, AffiliateLog } from "@/db/schema/affiliate"

interface CustomerAffiliatePortalViewProps {
  affiliateUser: AffiliateUser
  logs: AffiliateLog[]
}

export function CustomerAffiliatePortalView({ affiliateUser, logs }: CustomerAffiliatePortalViewProps) {
  const [copied, setCopied] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const referralLink = `https://huipper.com/?ref=${affiliateUser.referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setWithdrawSuccess(true)
      setWithdrawAmount("")
    }, 600)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#d43533]" />
            Affiliate Partner Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your referral link clicks, commission earnings, and request payout disbursements
          </p>
        </div>
        <Link
          href="/dashboard/affiliate/payment-history"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <History className="w-3.5 h-3.5" /> Payout History
        </Link>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Available Payout Balance</span>
          <div className="text-2xl font-black text-emerald-600">${affiliateUser.balance}</div>
          <span className="text-[11px] text-slate-400 block">Min withdrawal: $50.00</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Referral Code</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{affiliateUser.referralCode}</div>
          <span className="text-[11px] text-emerald-600 font-medium block">Active & Tracking</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Credited Events</span>
          <div className="text-2xl font-black text-slate-900">{logs.length}</div>
          <span className="text-[11px] text-slate-400 block">Product sales & Signups</span>
        </div>
      </div>

      {/* Share Link Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#d43533]" /> Your Unique Referral Link
        </h2>
        <p className="text-xs text-slate-500">
          Share this link across social media, blogs, YouTube descriptions, or messages. When customers buy, you earn automatic commissions.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-700 select-all"
          />
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-[#d43533] text-white text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Payout Request & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Payout Request Box */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Request Payout
          </h3>
          <p className="text-xs text-slate-500">
            Submit a withdrawal request to transfer your earned commissions to your payout method.
          </p>

          {withdrawSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Withdrawal request submitted! Admin review in progress.
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Amount ($)</label>
              <input
                type="number"
                min="50"
                step="0.01"
                required
                placeholder="50.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#d43533]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-lg transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
            </button>
          </form>
        </div>

        {/* Recent Activity Table */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between">
            <span>Recent Commission Activity</span>
            <span className="text-xs text-slate-400 font-normal">{logs.length} Entries</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Referred User</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Earned</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400">
                      No referral commissions credited yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-2.5 font-medium text-slate-800">{l.referredUserName}</td>
                      <td className="px-3 py-2.5 text-slate-500">{l.affiliateType}</td>
                      <td className="px-3 py-2.5 font-bold text-emerald-600">+${l.amount}</td>
                      <td className="px-3 py-2.5 text-slate-400">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
