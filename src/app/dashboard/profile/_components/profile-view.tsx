"use client"

import React from "react"
import { useAuth } from "@/lib/context/auth-context"
import { ProfileBasicInfo } from "./profile-basic-info"
import { ProfileAddressBook, type UserAddress } from "./profile-address-book"
import { ProfilePaymentInfo } from "./profile-payment-info"
import { ProfileChangeEmail } from "./profile-change-email"

const INITIAL_ADDRESSES: UserAddress[] = [
  {
    id: "addr-1",
    title: "Home",
    address: "House #12, Road #4, Block #C, Banani",
    city: "Dhaka",
    postalCode: "1213",
    country: "Bangladesh",
    phone: "+880 1712 345678",
    isDefault: true,
    isBilling: true,
  },
  {
    id: "addr-2",
    title: "Office",
    address: "Level 8, Concord Tower, Gulshan-2",
    city: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh",
    phone: "+880 1912 987654",
    isDefault: false,
    isBilling: false,
  },
]

export function ProfileView() {
  const { user, updateProfile } = useAuth()

  return (
    <div className="space-y-6">
      {/* 1. Basic Information & Password */}
      <ProfileBasicInfo
        name={user?.name || "Tanvir Ahmed"}
        phone={user?.phone || "+880 1712 345678"}
        email={user?.email || "tanvir@example.com"}
        avatar={user?.avatar || ""}
        onUpdate={async ({ name, phone, avatar, password }) => {
          updateProfile({ name, phone, avatar })
          try {
            const { updateCustomerProfileAction } = await import("@/app/actions/ecommerce-actions")
            await updateCustomerProfileAction({
              userId: user?.id,
              name,
              phone,
              avatar,
              password,
            })
          } catch {
            // Context and localStorage update succeed regardless
          }
        }}
      />

      {/* 2. Address Book (Shipping & Billing) */}
      <ProfileAddressBook initialAddresses={INITIAL_ADDRESSES} />

      {/* 3. Payment & Payout Information (For Refunds) */}
      <ProfilePaymentInfo />

      {/* 4. Change Your Email (Verification Flow) */}
      <ProfileChangeEmail currentEmail={user?.email || "tanvir@example.com"} />
    </div>
  )
}
