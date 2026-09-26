"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Truck, Plus, Search, CheckCircle, Ban, Phone, Mail, MapPin } from "lucide-react"
import { toggleDeliveryBoyBanAction } from "@/app/actions/ecommerce-actions"
import type { DeliveryBoy } from "@/db/schema/delivery-boy"

interface AdminDeliveryBoysViewProps {
  deliveryBoys: DeliveryBoy[]
}

export function AdminDeliveryBoysView({ deliveryBoys: initialBoys }: AdminDeliveryBoysViewProps) {
  const [boys, setBoys] = useState(initialBoys)
  const [search, setSearch] = useState("")

  const filtered = boys.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search)
  )

  const handleToggleBan = async (id: number) => {
    try {
      await toggleDeliveryBoyBanAction(id)
      setBoys((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: !b.status } : b))
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Truck className="w-7 h-7 text-[#d43533]" />
            Delivery Boys & Couriers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage dispatch delivery personnel, assigned zones, and cash collections
          </p>
        </div>
        <Link
          href="/admin/delivery-boys/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Delivery Boy
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver by name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Active Drivers: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Courier Name</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">Assigned Zone</th>
                <th className="px-4 py-3.5">Total Earnings</th>
                <th className="px-4 py-3.5">Cash Collected</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No delivery personnel found.
                  </td>
                </tr>
              ) : (
                filtered.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
                          {b.avatar ? (
                            <Image src={b.avatar} alt={b.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-600">
                              {b.name[0]}
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-slate-800">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {b.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {b.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                        <MapPin className="w-3 h-3 text-[#d43533]" /> {b.zoneName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">
                      ${b.totalEarnings}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 text-base">
                      ${b.totalCollection}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {b.status ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <Ban className="w-3 h-3" /> Banned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleToggleBan(b.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          b.status
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {b.status ? "Ban Driver" : "Unban Driver"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
