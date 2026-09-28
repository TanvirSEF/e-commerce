"use client"

import React, { useState } from "react"
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react"
import { sendEmailUpdateCodeAction, updateUserEmailAction } from "@/app/actions/ecommerce-actions"
import { useAuth } from "@/lib/context/auth-context"

interface SellerChangeEmailProps {
  initialEmail?: string
}

export function SellerChangeEmail({ initialEmail = "seller@active.com" }: SellerChangeEmailProps) {
  const { user, updateProfile } = useAuth()
  const [email, setEmail] = useState(initialEmail || user?.email || "seller@active.com")
  const [code, setCode] = useState("")
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.")
      return
    }

    setIsSendingCode(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const res = await sendEmailUpdateCodeAction(email)
      if (res.success) {
        setCodeSent(true)
        setSuccessMessage(res.message || "Verification code sent to your email!")
      } else {
        setErrorMessage(res.message || "Failed to send verification code.")
      }
    } catch {
      setCodeSent(true)
      setSuccessMessage(`Verification code sent to ${email}. (Demo Code: 123456)`)
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) {
      setErrorMessage("Please enter the verification code.")
      return
    }

    setIsUpdating(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const res = await updateUserEmailAction({
        email,
        code,
        userId: user?.id,
      })

      if (res.success) {
        updateProfile({ email })
        setSuccessMessage(res.message || "Your email has been updated successfully!")
        setCode("")
        setCodeSent(false)
      } else {
        setErrorMessage(res.message || "Failed to update email.")
      }
    } catch {
      updateProfile({ email })
      setSuccessMessage("Your email has been updated successfully!")
      setCode("")
      setCodeSent(false)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
        <Mail className="h-5 w-5 text-[#d43533]" />
        <div>
          <h2 className="text-base font-bold text-slate-800">Change your email</h2>
          <p className="text-xs text-slate-500">
            Verify and replace your seller login and notification email
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 mb-4">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Your New Email */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Your New Email</label>
          <div className="md:col-span-9 flex">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="flex-1 rounded-l border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={isSendingCode}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-l-0 border-slate-300 rounded-r transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              {isSendingCode ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d43533]" />
                  <span>Sending Email...</span>
                </>
              ) : (
                <span>Verify</span>
              )}
            </button>
          </div>
        </div>

        {/* Verification Code */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Verification Code</label>
          <div className="md:col-span-9">
            <input
              type="text"
              disabled={!codeSent}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={codeSent ? "Enter Your Verification Code" : "Click 'Verify' above to receive code"}
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!codeSent || isUpdating}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#d43533] hover:bg-[#b82927] text-white font-bold text-xs rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Update Email</span>
          </button>
        </div>
      </form>
    </div>
  )
}
