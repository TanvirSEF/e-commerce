"use client"

import React, { useState } from "react"
import { User, Check, ShieldCheck } from "lucide-react"

interface ProfileBasicInfoProps {
  name: string
  phone: string
  email: string
  onUpdate: (data: { name: string; phone: string; password?: string }) => void
}

export function ProfileBasicInfo({ name: initialName, phone: initialPhone, email, onUpdate }: ProfileBasicInfoProps) {
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otpEnabled, setOtpEnabled] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (password && password !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.")
      return
    }

    onUpdate({ name, phone, password: password || undefined })
    setSavedMessage(true)
    setPassword("")
    setConfirmPassword("")
    setTimeout(() => setSavedMessage(false), 3000)
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-5">
        <User className="h-5 w-5 text-[#d43533]" />
        <div>
          <h2 className="text-base font-bold text-gray-900">Basic Info</h2>
          <p className="text-xs text-gray-500">Update your account identity and credentials</p>
        </div>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 mb-4">
          <Check className="h-4 w-4" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 mb-4">
          <span className="font-bold">⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Your Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Your Email (Permanent)</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="block font-bold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              placeholder="Leave blank to keep unchanged"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* OTP Activation Toggle (Active eCommerce CMS Feature) */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="font-bold text-gray-800">OTP Order Verification</p>
              <p className="text-[11px] text-gray-500">Require SMS OTP code for Cash on Delivery and Wallet purchases</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={otpEnabled}
              onChange={(e) => setOtpEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="pt-2 text-right">
          <button
            type="submit"
            className="rounded bg-[#d43533] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  )
}
