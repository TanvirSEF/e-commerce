"use client"

import React from "react"
import { useAuth } from "@/lib/context/auth-context"
import { SellerBasicInfo } from "./seller-basic-info"
import { SellerBankSettings } from "./seller-bank-settings"
import { SellerAddressBook } from "./seller-address-book"
import { SellerChangeEmail } from "./seller-change-email"
import type { shops, customerAddresses } from "@/db/schema"
import type { AppSessionUser } from "@/lib/auth/session-helper"

type ShopRow = typeof shops.$inferSelect
type CustomerAddressRow = typeof customerAddresses.$inferSelect

interface SellerProfileViewProps {
  shop: ShopRow | null
  initialAddresses: CustomerAddressRow[]
  sessionUser: AppSessionUser | null
}

export function SellerProfileView({
  shop,
  initialAddresses,
  sessionUser,
}: SellerProfileViewProps) {
  const { user } = useAuth()
  const activeUser = user || sessionUser

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Manage Profile</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure seller identity, payout bank settings, addresses, and login credentials
        </p>
      </div>

      {/* 1. Basic Info (Name, Phone, Photo, Password) */}
      <SellerBasicInfo
        initialName={activeUser?.name || "Tanvir Ahmed"}
        initialPhone={shop?.phone || activeUser?.phone || "+880 1711 000111"}
        initialAvatar={activeUser?.avatar || ""}
      />

      {/* 2. Payment Setting (Cash & Bank Payout Details) */}
      <SellerBankSettings
        shopId={shop ? shop.id : 1}
        initialCashStatus={shop?.cashPaymentStatus ?? true}
        initialBankStatus={shop?.bankPaymentStatus ?? true}
        initialBankName={shop?.bankName || "City Bank PLC"}
        initialBankAccName={shop?.bankAccName || "Active Fashion Ltd"}
        initialBankAccNo={shop?.bankAccNo || "1102948192001"}
        initialBankRoutingNo={shop?.bankRoutingNo || "225272641"}
      />

      {/* 3. Address Book (PostgreSQL customer_addresses) */}
      <SellerAddressBook initialAddresses={initialAddresses} />

      {/* 4. Change Email */}
      <SellerChangeEmail initialEmail={activeUser?.email || "seller@active.com"} />
    </div>
  )
}
