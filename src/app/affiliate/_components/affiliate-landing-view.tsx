"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Users, DollarSign, Share2, Award, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react"
import { applyForAffiliateAction } from "@/app/actions/ecommerce-actions"

export function AffiliateLandingView() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [paypal, setPaypal] = useState("")
  const [bankInfo, setBankInfo] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [registeredCode, setRegisteredCode] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    setSubmitting(true)
    try {
      const res = await applyForAffiliateAction({
        userName: name,
        userEmail: email,
        paypalEmail: paypal,
        bankInfo,
      })
      if (res.success && res.user) {
        setRegisteredCode(res.user.referralCode)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold uppercase tracking-wider">
            Official Partner &amp; Affiliate Network
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Earn Generous Commissions by <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">
              Sharing Quality Products You Love
            </span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Join thousands of content creators, influencers, and community curators. Earn recurring payouts on product sales and referral signups with instant 30-day attribution tracking.
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d43533] flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1. Share Any Product</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate tracked custom affiliate links for any catalog item with a single click.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">2. Refer New Buyers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive automatic bonus commissions whenever visitors register via your personal referral badge.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3. Reliable Monthly Payouts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct disbursements to PayPal, Bank Wire, or store wallet with low withdrawal minimums.
            </p>
          </div>
        </div>
      </div>

      {/* Application Form & Success state */}
      <div className="max-w-2xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          {registeredCode ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome to the Affiliate Program!</h2>
              <p className="text-sm text-slate-600">
                Your affiliate partner account has been created. Your unique referral link is ready:
              </p>
              <div className="p-3 bg-slate-100 rounded-xl font-mono text-sm font-bold text-slate-800 select-all border border-slate-200">
                https://huipper.com/?ref={registeredCode}
              </div>
              <div className="pt-2">
                <Link
                  href="/dashboard/affiliate"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  Go to Affiliate Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Apply to Become an Affiliate</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details to immediately generate your partner tracking link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">PayPal Payout Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="paypal@example.com"
                    value={paypal}
                    onChange={(e) => setPaypal(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Bank Wire / Account Info (Optional)</label>
                  <input
                    type="text"
                    placeholder="Bank Name, Routing, and Account Number"
                    value={bankInfo}
                    onChange={(e) => setBankInfo(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  {submitting ? "Processing Application..." : "Submit Affiliate Application"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
