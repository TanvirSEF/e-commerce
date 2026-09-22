import { Metadata } from "next"
import { LoginView } from "./_components/login-view"

export const metadata: Metadata = {
  title: "Login | Active eCommerce",
  description: "Log in to your customer account to manage orders, wishlist, and profile.",
}

export default function LoginPage() {
  return <LoginView />
}
