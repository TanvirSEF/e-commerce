import { Metadata } from "next"
import { getThirdPartySettings } from "@/services/settings-service"
import { RegisterView } from "./_components/register-view"

export const metadata: Metadata = {
  title: "Registration | Active eCommerce",
  description: "Create an account to start shopping and enjoying customer benefits.",
}

export default async function RegisterPage() {
  const thirdParty = await getThirdPartySettings().catch(() => null)
  return <RegisterView recaptchaSettings={thirdParty} />
}
