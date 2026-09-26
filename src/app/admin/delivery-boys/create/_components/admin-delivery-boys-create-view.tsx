"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Truck, User, Mail, Phone, MapPin } from "lucide-react"
import { createDeliveryBoyAction } from "@/app/actions/ecommerce-actions"

export function AdminDeliveryBoysCreateView() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zoneName: "Dhaka Metro North",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await createDeliveryBoyAction(formData)
      router.push("/admin/delivery-boys")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to register courier personnel")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/delivery-boys"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#d43533]" />
            Register Delivery Boy
          </h1>
          <p className="text-sm text-slate-500">Create login credentials and assign dispatch delivery zone</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Tariqul Islam"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Address *</label>
          <input
            type="email"
            required
            placeholder="courier@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Mobile Phone *</label>
          <input
            type="tel"
            required
            placeholder="+880 1711-000000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Assigned Operational Zone</label>
          <select
            value={formData.zoneName}
            onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
          >
            <option value="Dhaka Metro North">Dhaka Metro North</option>
            <option value="Dhaka Metro South">Dhaka Metro South</option>
            <option value="Chittagong Central">Chittagong Central</option>
            <option value="Sylhet Metropolitan">Sylhet Metropolitan</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Link
            href="/admin/delivery-boys"
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Creating..." : "Save Delivery Boy"}
          </button>
        </div>
      </form>
    </div>
  )
}
