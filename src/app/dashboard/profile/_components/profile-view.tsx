"use client"

import React from "react"
import { useAuth } from "@/lib/context/auth-context"
import { ProfileBasicInfo } from "./profile-basic-info"
import { ProfileAddressBook } from "./profile-address-book"
import { ProfilePaymentInfo } from "./profile-payment-info"
import { ProfileChangeEmail } from "./profile-change-email"
import type { CustomerAddressItem, CustomerPaymentInfoItem } from "@/services/customer-extra-service"

interface ProfileViewProps {
  serverUser?: {
    id: string
    name: string
    email: string
    phone?: string | null
    avatar?: string | null
  } | null
  initialAddresses?: CustomerAddressItem[]
  initialPaymentInfos?: CustomerPaymentInfoItem[]
}

export function ProfileView({
  serverUser,
  initialAddresses = [],
  initialPaymentInfos = [],
}: ProfileViewProps) {
  const { user, updateProfile } = useAuth()

  const currentName = user?.name || serverUser?.name || "Customer"
  const currentPhone = user?.phone || serverUser?.phone || ""
  const currentEmail = user?.email || serverUser?.email || ""
  const currentAvatar = user?.avatar || serverUser?.avatar || ""

  return (
    <div className="space-y-6">
      {/* 1. Basic Information & Password */}
      <ProfileBasicInfo
        name={currentName}
        phone={currentPhone}
        email={currentEmail}
        avatar={currentAvatar}
        onUpdate={async ({ name, phone, avatar, password }) => {
          updateProfile({ name, phone, avatar })
          try {
            const { updateCustomerProfileAction } = await import("@/app/actions/ecommerce-actions")
            await updateCustomerProfileAction({
              userId: user?.id || serverUser?.id,
              name,
              phone,
              avatar,
              password,
            })
          } catch {
            // Context update succeeds regardless
          }
        }}
      />

      {/* 2. Address Book (Shipping & Billing) */}
      <ProfileAddressBook initialAddresses={initialAddresses} />

      {/* 3. Payment & Payout Information (For Refunds) */}
      <ProfilePaymentInfo initialPaymentInfos={initialPaymentInfos} />

      {/* 4. Change Your Email (Verification Flow) */}
      <ProfileChangeEmail currentEmail={currentEmail} />
    </div>
  )
}
