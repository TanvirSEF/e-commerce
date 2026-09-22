import { Metadata } from "next"
import { SellerLoginView } from "./_components/seller-login-view"

export const metadata: Metadata = {
  title: "Seller Login | Active eCommerce CMS",
  description: "Merchant login to Active eCommerce CMS seller panel.",
}

export default function SellerLoginPage() {
  return <SellerLoginView />
}
