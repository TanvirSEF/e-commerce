import { Metadata } from "next"
import { getShops } from "@/services/shop-service"
import { SellersView } from "./_components/sellers-view"

export const metadata: Metadata = {
  title: "All Sellers | Active eCommerce CMS",
  description: "Browse verified sellers and merchant stores on Active eCommerce CMS.",
}

export default async function SellersPage() {
  const shops = await getShops()

  return <SellersView initialShops={shops} />
}
