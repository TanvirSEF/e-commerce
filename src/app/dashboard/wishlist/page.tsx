import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getUserWishlistProducts } from "@/services/customer-extra-service"
import { WishlistView } from "./_components/wishlist-view"
import { getServerSession } from "@/lib/auth/session-helper"

export const metadata: Metadata = {
  title: "My Wishlist | Active eCommerce",
  description: "View and manage all items saved to your wishlist.",
}

export default async function WishlistPage() {
  const session = await getServerSession()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const initialWishlistItems = await getUserWishlistProducts(session.user.id)

  return <WishlistView initialItems={initialWishlistItems} />
}
