"use client"

import React, { useState } from "react"
import Image from "next/image"
import { User, ShieldCheck, Lock, Mail, Phone, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { updateAdminProfileAction } from "@/app/actions/ecommerce-actions"
import type { AdminProfileData } from "@/services/admin-profile-service"

interface AdminProfileViewProps {
  initialProfile: AdminProfileData
}

export function AdminProfileView({ initialProfile }: AdminProfileViewProps) {
  const [profile, setProfile] = useState<AdminProfileData>(initialProfile)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("Password and Confirm Password do not match.")
      return
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.")
      return
    }

    setSaving(true)
    try {
      await updateAdminProfileAction({
        adminId: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone || undefined,
        image: profile.image || undefined,
        newPassword: newPassword || undefined,
      })
      setSuccessMsg("Admin profile updated successfully!")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setErrorMsg("An unexpected error occurred while updating profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-[#d43533]" />
          Manage Administrator Profile
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Update your administrative identity, email, avatar image, and account credentials.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 relative border-2 border-gray-200 shrink-0">
              <Image
                src={profile.image || "/assets/img/avatar-place.png"}
                alt="Admin Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900">{profile.name}</div>
              <div className="text-xs text-gray-500">{profile.email}</div>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                Super Administrator
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+880 1700-000000"
                  className="w-full text-xs border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={profile.image || ""}
                onChange={(e) => setProfile({ ...profile, image: e.target.value })}
                placeholder="/assets/img/avatar-place.png"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <Lock className="w-4 h-4 text-gray-600" />
            Security & Change Password
          </h2>
          <p className="text-[11px] text-gray-400">
            Leave blank if you do not wish to change your current password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
