"use client"

import React, { useState } from "react"
import { User, Phone, MapPin, Search, ChevronDown, Check } from "lucide-react"
import type { PosCustomerItem } from "@/services/pos-service"

interface PosCustomerSelectorProps {
  customers: PosCustomerItem[]
  selectedCustomer: PosCustomerItem | null
  onSelectCustomer: (customer: PosCustomerItem | null) => void
  walkInName: string
  setWalkInName: (name: string) => void
  walkInPhone: string
  setWalkInPhone: (phone: string) => void
}

export function PosCustomerSelector({
  customers,
  selectedCustomer,
  onSelectCustomer,
  walkInName,
  setWalkInName,
  walkInPhone,
  setWalkInPhone,
}: PosCustomerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectWalkIn = () => {
    onSelectCustomer(null)
    setIsOpen(false)
  }

  const handleSelectCustomer = (customer: PosCustomerItem) => {
    onSelectCustomer(customer)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2 border-b border-gray-100 pb-3">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#d43533]" />
          Customer Information
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#d43533] hover:underline"
        >
          {selectedCustomer ? "Change Customer" : "Select Registered Customer"}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Customer dropdown menu */}
      {isOpen && (
        <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 text-xs rounded border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
              autoFocus
            />
          </div>

          <div className="max-h-40 overflow-y-auto divide-y divide-gray-100 text-xs">
            <div
              onClick={handleSelectWalkIn}
              className={`p-2 cursor-pointer flex items-center justify-between rounded hover:bg-gray-50 transition ${
                !selectedCustomer ? "bg-red-50 text-[#d43533] font-bold" : "text-gray-700"
              }`}
            >
              <div>
                <div className="font-semibold">Walk-in Customer</div>
                <div className="text-[10px] text-gray-400">Default Counter Customer</div>
              </div>
              {!selectedCustomer && <Check className="w-3.5 h-3.5 text-[#d43533]" />}
            </div>

            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => handleSelectCustomer(cust)}
                className={`p-2 cursor-pointer flex items-center justify-between rounded hover:bg-gray-50 transition ${
                  selectedCustomer?.id === cust.id
                    ? "bg-red-50 text-[#d43533] font-bold"
                    : "text-gray-700"
                }`}
              >
                <div>
                  <div className="font-semibold">{cust.name}</div>
                  <div className="text-[10px] text-gray-400">
                    {cust.phone} &bull; {cust.email}
                  </div>
                  {cust.address && (
                    <div className="text-[10px] text-gray-500 truncate max-w-[200px]">
                      {cust.address}, {cust.city}
                    </div>
                  )}
                </div>
                {selectedCustomer?.id === cust.id && (
                  <Check className="w-3.5 h-3.5 text-[#d43533]" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Customer / Walk-in Inputs */}
      {selectedCustomer ? (
        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">{selectedCustomer.name}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
              Registered
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <Phone className="w-3 h-3 text-gray-400" />
            <span>{selectedCustomer.phone}</span>
          </div>
          {selectedCustomer.address && (
            <div className="flex items-center gap-2 text-[11px] text-gray-600">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="truncate">
                {selectedCustomer.address}, {selectedCustomer.city}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={walkInName}
            onChange={(e) => setWalkInName(e.target.value)}
            placeholder="Walk-in Customer Name"
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#d43533]"
          />
          <input
            type="text"
            value={walkInPhone}
            onChange={(e) => setWalkInPhone(e.target.value)}
            placeholder="Customer Phone (optional)"
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>
      )}
    </div>
  )
}
