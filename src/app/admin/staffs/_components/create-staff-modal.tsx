"use client"

import React, { useState } from "react"
import { UserCheck } from "lucide-react"
import type { RoleItem, StaffItem } from "@/services/staff-service"
import { createStaffAction } from "@/app/actions/ecommerce-actions"

interface CreateStaffModalProps {
  isOpen: boolean
  onClose: () => void
  roles: RoleItem[]
  onStaffCreated: (newStaff: StaffItem) => void
}

export function CreateStaffModal({
  isOpen,
  onClose,
  roles,
  onStaffCreated,
}: CreateStaffModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedRole, setSelectedRole] = useState(roles[0]?.name || "Staff")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    const matchedRole = roles.find((r) => r.name === selectedRole)
    setIsSubmitting(true)
    try {
      const res = await createStaffAction({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        roleName: selectedRole,
        roleId: matchedRole?.id,
      })

      const newStaff: StaffItem = {
        id: (res.item as any)?.id || Date.now(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        roleName: selectedRole,
        roleId: matchedRole?.id,
        isActive: true,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      onStaffCreated(newStaff)
      onClose()
      setName("")
      setEmail("")
      setPhone("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#d43533]" />
            Add New Staff Member
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateStaff} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Asif Mahmud"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. asif.ops@huipper.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g. +880 1712-334455"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Role <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white focus:border-[#d43533] focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
