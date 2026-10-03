import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getCustomerAddresses, getCustomerPaymentInfos } from "@/services/customer-extra-service"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ProfileView } from "./_components/profile-view"

export const metadata: Metadata = {
  title: "Manage Profile & Addresses | Active eCommerce",
  description: "Update your personal details, passwords, and saved shipping addresses.",
}

export default async function ProfilePage() {
  const session = await getServerSession()
  const userId = session?.user?.id

  let dbUser = session?.user || null
  let addresses: any[] = []
  let paymentInfos: any[] = []

  if (userId) {
    try {
      const [userRows, addressRows, paymentRows] = await Promise.all([
        db.select().from(users).where(eq(users.id, userId)).limit(1),
        getCustomerAddresses(userId),
        getCustomerPaymentInfos(userId),
      ])

      if (userRows.length > 0) {
        const u = userRows[0]
        dbUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          avatar: u.image || "/assets/img/avatar-place.png",
          role: u.role || "customer",
          balance: Number(u.balance || 0),
        }
      }
      addresses = addressRows
      paymentInfos = paymentRows
    } catch (err) {
      console.error("ProfilePage data fetch error:", err)
    }
  }

  return (
    <ProfileView
      serverUser={dbUser}
      initialAddresses={addresses}
      initialPaymentInfos={paymentInfos}
    />
  )
}
