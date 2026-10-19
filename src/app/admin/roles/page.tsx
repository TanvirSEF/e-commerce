import { Metadata } from "next"
import { getAllRolesAdmin } from "@/services/staff-service"
import { RolesListContainer } from "./_components/roles-list-container"

export const metadata: Metadata = {
  title: "Staff Roles | Admin",
  description: "Configure staff roles and permission access matrix",
}

export default async function AdminRolesPage() {
  const roles = await getAllRolesAdmin()
  return <RolesListContainer initialRoles={roles} />
}
