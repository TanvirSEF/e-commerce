import { Metadata } from "next"
import { getPaymentGatewaysSettings } from "@/services/settings-service"
import { getCouriersSettings } from "@/services/courier-config-service"
import { CheckoutView } from "./_components/checkout-view"

export const metadata: Metadata = {
  title: "Checkout | Active eCommerce",
  description: "Complete your order with flexible delivery and secure payment options.",
}

export default async function CheckoutPage() {
  const [paymentSettings, courierSettings] = await Promise.all([
    getPaymentGatewaysSettings().catch(() => null),
    getCouriersSettings().catch(() => null),
  ])

  return (
    <CheckoutView
      paymentSettings={paymentSettings}
      courierSettings={courierSettings}
    />
  )
}
