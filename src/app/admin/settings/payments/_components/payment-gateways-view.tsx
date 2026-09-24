"use client"

import React, { useState } from "react"
import {
  CreditCard,
  Save,
  CheckCircle,
  Banknote,
  DollarSign,
  ShieldCheck,
  Building,
} from "lucide-react"
import { updatePaymentGatewaysAction } from "@/app/actions/ecommerce-actions"
import type { PaymentGatewaysSettings } from "@/services/settings-service"

interface PaymentGatewaysViewProps {
  initialSettings: PaymentGatewaysSettings
}

export function PaymentGatewaysView({
  initialSettings,
}: PaymentGatewaysViewProps) {
  const [settings, setSettings] = useState<PaymentGatewaysSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updatePaymentGatewaysAction(settings)
      setSuccessMsg("Payment methods & gateway configuration saved successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#d43533]" />
          Payment Gateway Master Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Activate and configure electronic payment processors, mobile banking (bKash/Nagad), COD, and manual bank deposits
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    setSettings({
                      ...settings,
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
                    setSettings({
                      ...settings,
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
                    setSettings({
                      ...settings,
                      bkash: { ...settings.bkash, appKey: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">App Secret</label>
                <input
                  type="password"
                  value={settings.bkash.appSecret}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bkash: { ...settings.bkash, appSecret: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Merchant Username</label>
                <input
                  type="text"
                  value={settings.bkash.username}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bkash: { ...settings.bkash, username: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
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
                    setSettings({
                      ...settings,
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
                    setSettings({
                      ...settings,
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
                    setSettings({
                      ...settings,
                      nagad: { ...settings.nagad, merchantId: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Public Key</label>
                <textarea
                  rows={2}
                  value={settings.nagad.publicKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      nagad: { ...settings.nagad, publicKey: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>

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
                    setSettings({
                      ...settings,
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
                    setSettings({
                      ...settings,
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
                    setSettings({
                      ...settings,
                      sslcommerz: { ...settings.sslcommerz, storeId: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Store Password</label>
                <input
                  type="password"
                  value={settings.sslcommerz.storePassword}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sslcommerz: { ...settings.sslcommerz, storePassword: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
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
                    setSettings({
                      ...settings,
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
                    setSettings({
                      ...settings,
                      stripe: { ...settings.stripe, publishableKey: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={settings.stripe.secretKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stripe: { ...settings.stripe, secretKey: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Cash on Delivery & Manual Offline Wire */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-4">
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
                  setSettings({
                    ...settings,
                    cod: { ...settings.cod, active: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>

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
                    setSettings({
                      ...settings,
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
                    setSettings({
                      ...settings,
                      offline: { ...settings.offline, bankName: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Account Number</label>
                <input
                  type="text"
                  value={settings.offline.accountNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      offline: { ...settings.offline, accountNumber: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">bKash Personal No.</label>
                <input
                  type="text"
                  value={settings.offline.bkashPersonal}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      offline: { ...settings.offline, bkashPersonal: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving Configuration..." : "Save Payment Gateways"}
          </button>
        </div>
      </form>
    </div>
  )
}
