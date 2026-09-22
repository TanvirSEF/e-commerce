"use client"

import React, { useState } from "react"
import { Search, Mail, Phone, Wallet } from "lucide-react"

export interface AdminCustomerItem {
  id: string
  name: string
  email: string
  phone: string
  balance: number
  role: string
  createdAt: string
}

interface AdminCustomersViewProps {
  initialCustomers: AdminCustomerItem[]
}

export function AdminCustomersView({ initialCustomers }: AdminCustomersViewProps) {
  const [customers] = useState<AdminCustomerItem[]>(initialCustomers)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Customers</h1>
        <p className="text-xs text-slate-500 mt-0.5">View and manage registered user accounts</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>
          <span className="text-xs text-slate-500">
            Total Customers: <strong>{filtered.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Wallet Balance</th>
                <th className="py-3 px-4">Account Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{c.name}</td>
                  <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {c.phone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Wallet className="w-3.5 h-3.5" /> ৳{c.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-blue-50 text-blue-700">
                      {c.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No customer accounts found matching your query.
          </div>
        )}
      </div>
    </div>
  )
}
