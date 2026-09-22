import { Metadata } from "next"
import { SellerRegisterView } from "./_components/seller-register-view"

export const metadata: Metadata = {
  title: "Register Your Shop | Active eCommerce CMS",
  description: "Join as a verified merchant and sell your products on Active eCommerce CMS.",
}

export default function SellerRegisterPage() {
  return <SellerRegisterView />
}
