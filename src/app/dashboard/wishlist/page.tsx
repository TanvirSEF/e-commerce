import { Metadata } from "next"
import { headers } from "next/headers"
import { getUserWishlistProducts } from "@/services/customer-extra-service"
import { WishlistView } from "./_components/wishlist-view"
import { auth } from "@/lib/auth/auth"

export const metadata: Metadata = {
  title: "My Wishlist | Active eCommerce",
  description: "View and manage all items saved to your wishlist.",
}

export default async function WishlistPage() {
  let currentUserId = "usr_customer_default_01"
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      currentUserId = session.user.id
    }
  } catch {
    // fallback
  }

  const initialWishlistItems = await getUserWishlistProducts(currentUserId)

  return <WishlistView initialItems={initialWishlistItems} />
}
