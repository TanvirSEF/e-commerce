import { Metadata } from "next"
import { CheckoutView } from "./_components/checkout-view"

export const metadata: Metadata = {
  title: "Checkout | Active eCommerce",
  description: "Complete your order with flexible delivery and secure payment options.",
}

export default function CheckoutPage() {
  return <CheckoutView />
}
