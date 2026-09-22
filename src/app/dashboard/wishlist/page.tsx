import { Metadata } from "next"
import { WishlistView } from "./_components/wishlist-view"

export const metadata: Metadata = {
  title: "My Wishlist | Active eCommerce",
  description: "View and manage all items saved to your wishlist.",
}

export default function WishlistPage() {
  return <WishlistView />
}
