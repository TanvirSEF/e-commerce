import { Metadata } from "next"
import { RoleForm } from "../_components/role-form"

export const metadata: Metadata = {
  title: "Create Staff Role | Admin",
  description: "Define a new staff role and configure permission access",
}

export default function CreateRolePage() {
  return (
    <div className="space-y-4">
      <RoleForm />
    </div>
  )
}
