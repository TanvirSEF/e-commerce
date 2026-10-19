import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getCustomerAddresses } from "@/services/customer-extra-service"
import { getPaymentGatewaysSettings } from "@/services/settings-service"
import { getCouriersSettings } from "@/services/courier-config-service"
import { CheckoutView } from "./_components/checkout-view"
import type { AddressData } from "./_components/shipping-step"

export const metadata: Metadata = {
  title: "Checkout | Active eCommerce",
  description: "Complete your order with flexible delivery and secure payment options.",
}

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  const session = await getServerSession()
  const userId = session?.user?.id

  const [paymentSettings, courierSettings, dbAddresses] = await Promise.all([
    getPaymentGatewaysSettings().catch(() => null),
    getCouriersSettings().catch(() => null),
    userId ? getCustomerAddresses(userId).catch(() => []) : Promise.resolve([]),
  ])

  const initialAddresses: AddressData[] = dbAddresses.map((a) => ({
    id: String(a.id),
    name: session?.user?.name || "Customer",
    email: session?.user?.email || "",
    phone: a.phone || (session?.user as any)?.phone || "",
    address: a.address,
    city: a.city || "Dhaka",
    postalCode: a.postalCode || "1200",
    country: a.country || "Bangladesh",
    isDefault: a.setDefault,
  }))

  return (
    <CheckoutView
      paymentSettings={paymentSettings}
      courierSettings={courierSettings}
      initialAddresses={initialAddresses}
      userProfile={
        session?.user
          ? {
              id: session.user.id,
              name: session.user.name || "",
              email: session.user.email || "",
            }
          : null
      }
    />
  )
}
