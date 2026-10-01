"use client"

import React from "react"
import { X, ShieldCheck, FileText } from "lucide-react"
import type { AffiliateUser } from "@/db/schema/affiliate"

interface AffiliateVerificationModalProps {
  user: AffiliateUser | null
  onClose: () => void
}

export function AffiliateVerificationModal({ user, onClose }: AffiliateVerificationModalProps) {
  if (!user) return null

  let infoObj: Record<string, any> = {}
  try {
    if (user.verificationInfo) {
      infoObj = JSON.parse(user.verificationInfo)
    }
  } catch {
    infoObj = { info: user.verificationInfo }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Affiliate Verification Details</h3>
              <p className="text-xs text-slate-500">{user.userName} ({user.userEmail})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">Phone</span>
              <span className="font-semibold text-slate-800">{user.phone || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Referral Code</span>
              <span className="font-mono font-bold text-slate-800">{user.referralCode}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-slate-400" />
              Application Form Responses
            </h4>

            {Object.keys(infoObj).length === 0 ? (
              <p className="text-slate-400 italic py-2">No verification data submitted by this user.</p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(infoObj).map(([key, val]) => (
                  <div key={key} className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-600 capitalize block mb-0.5">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-800 font-medium whitespace-pre-wrap break-words">
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
