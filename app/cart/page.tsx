import { Metadata } from "next"
import { CartView } from "./_components/cart-view"

export const metadata: Metadata = {
  title: "Shopping Cart | Active eCommerce",
  description: "View and manage items in your shopping cart before checkout.",
}

export default function CartPage() {
  return <CartView />
}
