import { Metadata } from "next"
import { ProfileView } from "./_components/profile-view"

export const metadata: Metadata = {
  title: "Manage Profile & Addresses | Active eCommerce",
  description: "Update your personal details, passwords, and saved shipping addresses.",
}

export default function ProfilePage() {
  return <ProfileView />
}
