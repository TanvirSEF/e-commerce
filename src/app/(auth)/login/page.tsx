import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { LoginView } from "./_components/login-view"

export const metadata: Metadata = {
  title: "Login | Active eCommerce",
  description: "Log in to your customer account to manage orders, wishlist, and profile.",
}

export default async function LoginPage() {
  const session = await getServerSession()
  if (session?.user) {
    if (session.user.role === "admin" || session.user.role === "staff") {
      redirect("/admin/products")
    } else if (session.user.role === "seller") {
      redirect("/seller/dashboard")
    } else {
      redirect("/dashboard")
    }
  }

  return <LoginView />
}
