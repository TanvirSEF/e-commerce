import { Metadata } from "next"
import { ForgotPasswordView } from "./_components/forgot-password-view"

export const metadata: Metadata = {
  title: "Reset Password | Active eCommerce",
  description: "Recover your customer or seller account password securely.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />
}
