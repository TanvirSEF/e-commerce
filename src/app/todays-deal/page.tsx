import { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { TodaysDealView } from "./_components/todays-deal-view"

export const metadata: Metadata = {
  title: "Today's Deal | Active eCommerce CMS",
  description: "Limited-time 24-hour deals on top trending products.",
}

export default async function TodaysDealPage() {
  const { data: allProducts } = await getProducts({ limit: 40 })
  const deals = allProducts.filter((p) => p.todaysDeal)
  const displayProducts = deals.length > 0 ? deals : allProducts.slice(0, 10)

  return <TodaysDealView products={displayProducts} />
}
