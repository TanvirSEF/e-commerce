import { Metadata } from "next"
import { DeliveryBoyLoginView } from "./_components/delivery-boy-login-view"

export const metadata: Metadata = {
  title: "Delivery Boy Login | Active eCommerce",
  description: "Portal for delivery personnel to access assigned orders and delivery status.",
}

export default function DeliveryBoyLoginPage() {
  return <DeliveryBoyLoginView />
}
