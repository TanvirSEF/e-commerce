"use client"

import React, { useState } from "react"
import { Mail, Save, Send, CheckCircle, Server } from "lucide-react"
import {
  updateSmtpSettingsAction,
  sendTestEmailAction,
} from "@/app/actions/ecommerce-actions"
import type { SmtpSettings } from "@/services/settings-service"

interface SmtpSettingsViewProps {
  initialSettings: SmtpSettings
}

export function SmtpSettingsView({ initialSettings }: SmtpSettingsViewProps) {
  const [settings, setSettings] = useState<SmtpSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // Test Email
  const [testEmail, setTestEmail] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testMsg, setTestMsg] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateSmtpSettingsAction(settings)
      setSuccessMsg("SMTP mail server credentials saved successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testEmail.trim()) return

    setIsSendingTest(true)
    try {
      const res = await sendTestEmailAction(testEmail.trim())
      setTestMsg(res.message || "Test email sent successfully!")
      setTimeout(() => setTestMsg(""), 5000)
    } finally {
      setIsSendingTest(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#d43533]" />
          SMTP Server & Email Dispatch Gateway
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure outgoing email transport for customer invoices, verification codes, and order notifications
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form (2 Cols) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-600" />
                Mail Driver & Credentials
              </h2>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mail Driver</label>
                <select
                  value={settings.mailDriver}
                  onChange={(e) =>
                    setSettings({ ...settings, mailDriver: e.target.value as any })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white"
                >
                  <option value="smtp">SMTP (Recommended for Production)</option>
                  <option value="sendmail">Sendmail</option>
                  <option value="mailgun">Mailgun API</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mail Host <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. smtp.gmail.com"
                    value={settings.mailHost}
                    onChange={(e) => setSettings({ ...settings, mailHost: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mail Port <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="587 or 465"
                    value={settings.mailPort}
                    onChange={(e) =>
                      setSettings({ ...settings, mailPort: Number(e.target.value) })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username / Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. info@yourshop.com"
                    value={settings.mailUsername}
                    onChange={(e) =>
                      setSettings({ ...settings, mailUsername: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password / App Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={settings.mailPassword || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, mailPassword: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Encryption</label>
                  <select
                    value={settings.mailEncryption}
                    onChange={(e) =>
                      setSettings({ ...settings, mailEncryption: e.target.value as any })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white font-mono"
                  >
                    <option value="tls">TLS (Port 587)</option>
                    <option value="ssl">SSL (Port 465)</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">From Name</label>
                  <input
                    type="text"
                    value={settings.mailFromName}
                    onChange={(e) =>
                      setSettings({ ...settings, mailFromName: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">From Email Address</label>
                <input
                  type="email"
                  value={settings.mailFromAddress}
                  onChange={(e) =>
                    setSettings({ ...settings, mailFromAddress: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save SMTP Settings"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Send Test Email Card (1 Col) */}
        <div>
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-4 sticky top-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#d43533]" />
                Test Email Dispatcher
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Verify SMTP connection by sending a diagnostic test message
              </p>
            </div>

            {testMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendTest} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@yourdomain.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingTest}
                className="w-full py-2.5 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {isSendingTest ? "Dispatching Test..." : "Send Test Email"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
