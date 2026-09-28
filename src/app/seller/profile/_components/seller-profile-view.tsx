"use client"

import React from "react"
import type { SeedShop } from "@/db/seed/data"
import { useAuth } from "@/lib/context/auth-context"
import { SellerBasicInfo } from "./seller-basic-info"
import { SellerBankSettings } from "./seller-bank-settings"
import { SellerAddressBook } from "./seller-address-book"
import { SellerChangeEmail } from "./seller-change-email"

interface SellerProfileViewProps {
  shop: SeedShop | null
}

export function SellerProfileView({ shop }: SellerProfileViewProps) {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Manage Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure seller identity, payout bank settings, addresses, and login credentials
        </p>
      </div>

      {/* 1. Basic Info (Name, Phone, Photo, Password) */}
      <SellerBasicInfo
        initialName={user?.name || "Tanvir Ahmed"}
        initialPhone={shop?.phone || user?.phone || "+880 1711 000111"}
        initialAvatar={user?.avatar || ""}
      />

      {/* 2. Payment Setting (Cash & Bank Payout Details) */}
      <SellerBankSettings
        shopId={shop ? Number(shop.id) || 1 : 1}
        initialCashStatus={shop?.cashPaymentStatus ?? true}
        initialBankStatus={shop?.bankPaymentStatus ?? true}
        initialBankName={shop?.bankName || "City Bank PLC"}
        initialBankAccName={shop?.bankAccName || "Active Fashion Ltd"}
        initialBankAccNo={shop?.bankAccNo || "1102948192001"}
        initialBankRoutingNo={shop?.bankRoutingNo || "225272641"}
      />

      {/* 3. Address Book */}
      <SellerAddressBook />

      {/* 4. Change Email */}
      <SellerChangeEmail initialEmail={user?.email || "seller@active.com"} />
    </div>
  )
}
