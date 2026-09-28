import { Metadata } from "next"
import { getUserWishlistProducts } from "@/services/customer-extra-service"
import { WishlistView } from "./_components/wishlist-view"

export const metadata: Metadata = {
  title: "My Wishlist | Active eCommerce",
  description: "View and manage all items saved to your wishlist.",
}

export default async function WishlistPage() {
  const initialWishlistItems = await getUserWishlistProducts("usr_customer_demo")

  return <WishlistView initialItems={initialWishlistItems} />
}
