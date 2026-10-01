import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getStaffByIdAdmin, getAllRolesAdmin } from "@/services/staff-service"
import { StaffForm } from "../../_components/staff-form"

export const metadata: Metadata = {
  title: "Edit Staff | Admin",
  description: "Update staff member information and permissions",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditStaffPage({ params }: PageProps) {
  const { id } = await params
  const [staff, roles] = await Promise.all([
    getStaffByIdAdmin(Number(id)),
    getAllRolesAdmin(),
  ])

  if (!staff) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Edit Staff</h1>
      </div>
      <StaffForm initialData={staff} roles={roles} />
    </div>
  )
}
