"use client"

import React, { useState } from "react"
import {
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  CheckCircle,
} from "lucide-react"
import {
  updateStaffStatusAction,
  deleteStaffAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { CreateStaffModal } from "./create-staff-modal"
import type { StaffItem, RoleItem } from "@/services/staff-service"

interface StaffManagementViewProps {
  initialStaffs: StaffItem[]
  roles: RoleItem[]
}

export function StaffManagementView({
  initialStaffs,
  roles,
}: StaffManagementViewProps) {
  const [staffs, setStaffs] = useState<StaffItem[]>(initialStaffs)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"staffs" | "roles">("staffs")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredStaffs = staffs.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone && s.phone.includes(search)) ||
      s.roleName.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleStatus = async (staff: StaffItem) => {
    const nextStatus = !staff.isActive
    await updateStaffStatusAction(staff.id, nextStatus)
    setStaffs((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, isActive: nextStatus } : s))
    )
  }

  const handleDeleteClick = (id: number) => {
    setStaffToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return
    setIsDeleting(true)
    try {
      await deleteStaffAction(staffToDelete)
      setStaffs((prev) => prev.filter((s) => s.id !== staffToDelete))
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setStaffToDelete(null)
    }
  }

  const handleStaffCreated = (newStaff: StaffItem) => {
    setStaffs((prev) => [newStaff, ...prev])
  }

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Order & Logistics Manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Customer Support Specialist":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Product & Catalog Editor":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d43533]" />
            Staffs & Permission Roles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage admin users, assign administrative role permissions, and control team access
          </p>
        </div>

        {activeTab === "staffs" && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] text-white text-xs font-bold rounded shadow-sm hover:bg-[#b82a28] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Staff
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("staffs")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "staffs"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          All Staff Members ({staffs.length})
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "roles"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Shield className="w-4 h-4" />
          Roles & Permissions ({roles.length})
        </button>
      </div>

      {activeTab === "staffs" ? (
        /* Staffs Table Card */
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900">Registered Staffs</h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email & Contact</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Join Date</th>
                  <th className="px-5 py-3 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaffs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-xs text-slate-400">
                      No staff members found.
                    </td>
                  </tr>
                ) : (
                  filteredStaffs.map((staff, idx) => (
                    <tr key={staff.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {staff.name}
                      </td>
                      <td className="px-5 py-3.5 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{staff.email}</span>
                        </div>
                        {staff.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{staff.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(
                            staff.roleName
                          )}`}
                        >
                          {staff.roleName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(staff)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            staff.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {staff.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {staff.createdAt}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(staff.id)}
                          disabled={isDeleting && staffToDelete === staff.id}
                          className="p-1.5 rounded text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                          title="Delete Staff"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Roles & Permissions View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#d43533]" />
                  {r.name}
                </h3>
                <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {r.permissions.length} Permissions
                </span>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1.5">
                  Granted Privileges
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.permissions.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      {p.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roles={roles}
        onStaffCreated={handleStaffCreated}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setStaffToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Staff Member"
        description="Are you sure you want to delete this staff member? This will immediately revoke their administrative access."
      />
    </div>
  )
}
