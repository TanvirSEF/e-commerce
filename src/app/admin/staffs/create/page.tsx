import { Metadata } from "next"
import { getAllRolesAdmin } from "@/services/staff-service"
import { StaffForm } from "../_components/staff-form"

export const metadata: Metadata = {
  title: "Add New Staff | Admin",
  description: "Create and register a new staff member account",
}

export default async function CreateStaffPage() {
  const roles = await getAllRolesAdmin()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Add New Staff</h1>
      </div>
      <StaffForm roles={roles} />
    </div>
  )
}
