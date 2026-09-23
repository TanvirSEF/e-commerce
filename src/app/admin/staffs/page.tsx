import React from "react"
import { getAllStaffs, getAllRoles } from "@/services/staff-service"
import { StaffManagementView } from "./_components/staff-management-view"

export const metadata = {
  title: "Staffs & Roles Management | Admin Panel",
}

export default async function AdminStaffsPage() {
  const [staffs, roles] = await Promise.all([
    getAllStaffs(),
    getAllRoles(),
  ])

  return <StaffManagementView initialStaffs={staffs} roles={roles} />
}
