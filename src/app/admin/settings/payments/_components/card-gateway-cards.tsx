"use client"

import React from "react"
import type { PaymentGatewaysSettings } from "@/services/settings-service"

interface CardGatewayCardsProps {
  settings: PaymentGatewaysSettings
  onChange: (updated: Partial<PaymentGatewaysSettings>) => void
}

export function CardGatewayCards({ settings, onChange }: CardGatewayCardsProps) {
  const inputCls = "w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"

  return (
    <>
      {/* 3. SSLCommerz */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-blue-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1e40af] text-white font-black text-xs flex items-center justify-center">
              SSL
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">SSLCommerz Hosted</h3>
              <p className="text-[10px] text-slate-400">All local credit/debit cards & internet banking</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sslcommerz.active}
              onChange={(e) =>
                onChange({
                  sslcommerz: { ...settings.sslcommerz, active: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e40af]"></div>
          </label>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span className="font-semibold text-slate-700">Sandbox Mode</span>
            <input
              type="checkbox"
              checked={settings.sslcommerz.sandbox}
              onChange={(e) =>
                onChange({
                  sslcommerz: { ...settings.sslcommerz, sandbox: e.target.checked },
                })
              }
              className="rounded text-[#1e40af]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Store ID</label>
            <input
              type="text"
              value={settings.sslcommerz.storeId}
              onChange={(e) =>
                onChange({
                  sslcommerz: { ...settings.sslcommerz, storeId: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Store Password</label>
            <input
              type="password"
              value={settings.sslcommerz.storePassword}
              onChange={(e) =>
                onChange({
                  sslcommerz: { ...settings.sslcommerz, storePassword: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* 4. Stripe */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-indigo-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#6366f1] text-white font-black text-xs flex items-center justify-center">
              ST
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Stripe International</h3>
              <p className="text-[10px] text-slate-400">Global Visa, Mastercard, Amex</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.stripe.active}
              onChange={(e) =>
                onChange({
                  stripe: { ...settings.stripe, active: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
          </label>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Publishable Key</label>
            <input
              type="text"
              value={settings.stripe.publishableKey}
              onChange={(e) =>
                onChange({
                  stripe: { ...settings.stripe, publishableKey: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Secret Key</label>
            <input
              type="password"
              value={settings.stripe.secretKey}
              onChange={(e) =>
                onChange({
                  stripe: { ...settings.stripe, secretKey: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </>
  )
}
