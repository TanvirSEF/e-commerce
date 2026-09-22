import { Metadata } from "next"
import { RegisterView } from "./_components/register-view"

export const metadata: Metadata = {
  title: "Registration | Active eCommerce",
  description: "Create an account to start shopping and enjoying customer benefits.",
}

export default function RegisterPage() {
  return <RegisterView />
}
