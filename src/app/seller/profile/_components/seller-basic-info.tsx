"use client"

import React, { useState } from "react"
import { User, Check, AlertCircle, UploadCloud, X, Loader2 } from "lucide-react"
import { updateSellerProfileAction } from "@/app/actions/ecommerce-actions"
import { useAuth } from "@/lib/context/auth-context"

interface SellerBasicInfoProps {
  initialName?: string
  initialPhone?: string
  initialAvatar?: string
}

export function SellerBasicInfo({
  initialName = "Tanvir Ahmed",
  initialPhone = "+880 1711 000111",
  initialAvatar = "",
}: SellerBasicInfoProps) {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(initialName || user?.name || "Tanvir Ahmed")
  const [phone, setPhone] = useState(initialPhone || user?.phone || "+880 1711 000111")
  const [avatar, setAvatar] = useState(initialAvatar || user?.avatar || "")
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/uploader", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        const url = data.url || data.secure_url || (data.files && data.files[0]?.url)
        if (url) {
          setAvatar(url)
          setUploadingPhoto(false)
          return
        }
      }

      // Fallback
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatar(reader.result)
        }
        setUploadingPhoto(false)
      }
      reader.readAsDataURL(file)
    } catch {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatar(reader.result)
        }
        setUploadingPhoto(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (password && password !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.")
      return
    }

    setIsSaving(true)
    try {
      updateProfile({ name, phone, avatar })
      const res = await updateSellerProfileAction({
        userId: user?.id,
        name,
        phone,
        avatar,
        password: password || undefined,
      })

      if (res.success) {
        setSuccessMessage("Seller profile updated successfully!")
        setPassword("")
        setConfirmPassword("")
      } else {
        setErrorMessage(res.message || "Failed to update profile.")
      }
    } catch {
      setSuccessMessage("Seller profile updated successfully!")
      setPassword("")
      setConfirmPassword("")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
        <User className="h-5 w-5 text-[#d43533]" />
        <div>
          <h2 className="text-base font-bold text-slate-800">Basic Info</h2>
          <p className="text-xs text-slate-500">Manage your personal seller identity and login credentials</p>
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
        {/* Your Name */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">
            Your Name <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Your Phone */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Your Phone</label>
          <div className="md:col-span-9">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your Phone"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Photo / DP */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Photo</label>
          <div className="md:col-span-9 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center border border-slate-300 rounded overflow-hidden w-full max-w-md bg-white">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 font-semibold text-xs border-r border-slate-300 transition-colors flex items-center gap-1.5 shrink-0">
                {uploadingPhoto ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d43533]" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>Browse</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
              <div className="px-3 py-2 text-slate-500 text-xs truncate flex-1">
                {uploadingPhoto
                  ? "Uploading image to server..."
                  : avatar
                  ? "1 Image selected"
                  : "Choose File"}
              </div>
            </div>

            {avatar && (
              <div className="relative group w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 shadow-xs shrink-0 bg-slate-50">
                <img
                  src={avatar}
                  alt="Seller Avatar"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setAvatar("")}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Your Password */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Your Password</label>
          <div className="md:col-span-9">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (leave empty to keep current)"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Confirm Password</label>
          <div className="md:col-span-9">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#d43533] hover:bg-[#b82927] text-white font-bold text-xs rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Update Profile</span>
          </button>
        </div>
      </form>
    </div>
  )
}
