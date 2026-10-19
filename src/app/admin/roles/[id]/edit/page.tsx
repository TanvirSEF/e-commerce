import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRoleByIdAdmin } from "@/services/staff-service"
import { RoleForm } from "../../_components/role-form"

export const metadata: Metadata = {
  title: "Edit Staff Role | Admin",
  description: "Modify role permissions and access settings",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditRolePage({ params }: PageProps) {
  const { id } = await params
  const role = await getRoleByIdAdmin(Number(id))

  if (!role) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <RoleForm initialData={role} />
    </div>
  )
}
