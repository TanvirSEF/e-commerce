"use client"

import React from "react"
import type { PaymentGatewaysSettings } from "@/services/settings-service"

interface OfflineGatewayCardsProps {
  settings: PaymentGatewaysSettings
  onChange: (updated: Partial<PaymentGatewaysSettings>) => void
}

export function OfflineGatewayCards({ settings, onChange }: OfflineGatewayCardsProps) {
  const inputCls = "w-full text-xs px-3 py-1.5 border border-slate-300 rounded"

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-4">
      {/* Cash on Delivery */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</h3>
          <p className="text-[11px] text-slate-500">Allow customers to pay in cash upon courier parcel arrival</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.cod.active}
            onChange={(e) =>
              onChange({
                cod: { ...settings.cod, active: e.target.checked },
              })
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
        </label>
      </div>

      {/* Manual / Offline Wire Instructions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Offline & Manual Wire Account Instructions</h3>
            <p className="text-[11px] text-slate-500">Display bank and personal MFS accounts on checkout</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.offline.active}
              onChange={(e) =>
                onChange({
                  offline: { ...settings.offline, active: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bank Name</label>
            <input
              type="text"
              value={settings.offline.bankName}
              onChange={(e) =>
                onChange({
                  offline: { ...settings.offline, bankName: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Account Number</label>
            <input
              type="text"
              value={settings.offline.accountNumber}
              onChange={(e) =>
                onChange({
                  offline: { ...settings.offline, accountNumber: e.target.value },
                })
              }
              className={`${inputCls} font-mono`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">bKash Personal No.</label>
            <input
              type="text"
              value={settings.offline.bkashPersonal}
              onChange={(e) =>
                onChange({
                  offline: { ...settings.offline, bkashPersonal: e.target.value },
                })
              }
              className={`${inputCls} font-mono`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
