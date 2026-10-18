"use client"

import React from "react"
import type { PaymentGatewaysSettings } from "@/services/settings-service"

interface MfsGatewayCardsProps {
  settings: PaymentGatewaysSettings
  onChange: (updated: Partial<PaymentGatewaysSettings>) => void
}

export function MfsGatewayCards({ settings, onChange }: MfsGatewayCardsProps) {
  const inputCls = "w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"

  return (
    <>
      {/* 1. bKash Gateway */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-pink-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#e2136e] text-white font-black text-xs flex items-center justify-center">
              bK
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">bKash Payment Gateway</h3>
              <p className="text-[10px] text-slate-400">Direct PGW checkout token API</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.bkash.active}
              onChange={(e) =>
                onChange({
                  bkash: { ...settings.bkash, active: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e2136e]"></div>
          </label>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span className="font-semibold text-slate-700">Sandbox Mode</span>
            <input
              type="checkbox"
              checked={settings.bkash.sandbox}
              onChange={(e) =>
                onChange({
                  bkash: { ...settings.bkash, sandbox: e.target.checked },
                })
              }
              className="rounded text-[#e2136e]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">App Key</label>
            <input
              type="text"
              value={settings.bkash.appKey}
              onChange={(e) =>
                onChange({
                  bkash: { ...settings.bkash, appKey: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">App Secret</label>
            <input
              type="password"
              value={settings.bkash.appSecret}
              onChange={(e) =>
                onChange({
                  bkash: { ...settings.bkash, appSecret: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Merchant Username</label>
            <input
              type="text"
              value={settings.bkash.username}
              onChange={(e) =>
                onChange({
                  bkash: { ...settings.bkash, username: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* 2. Nagad Gateway */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-orange-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#f7931e] text-white font-black text-xs flex items-center justify-center">
              NG
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Nagad Direct</h3>
              <p className="text-[10px] text-slate-400">Post Office Digital Financial Services</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.nagad.active}
              onChange={(e) =>
                onChange({
                  nagad: { ...settings.nagad, active: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f7931e]"></div>
          </label>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span className="font-semibold text-slate-700">Sandbox Mode</span>
            <input
              type="checkbox"
              checked={settings.nagad.sandbox}
              onChange={(e) =>
                onChange({
                  nagad: { ...settings.nagad, sandbox: e.target.checked },
                })
              }
              className="rounded text-[#f7931e]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Merchant ID</label>
            <input
              type="text"
              value={settings.nagad.merchantId}
              onChange={(e) =>
                onChange({
                  nagad: { ...settings.nagad, merchantId: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Public Key</label>
            <textarea
              rows={2}
              value={settings.nagad.publicKey}
              onChange={(e) =>
                onChange({
                  nagad: { ...settings.nagad, publicKey: e.target.value },
                })
              }
              className="w-full text-xs p-2 border border-slate-300 rounded font-mono"
            />
          </div>
        </div>
      </div>
    </>
  )
}
