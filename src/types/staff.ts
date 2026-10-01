export interface StaffItem {
  id: number
  name: string
  email: string
  phone: string | null
  roleName: string
  roleId: number | null
  isActive: boolean
  createdAt: string
}

export interface RoleItem {
  id: number
  name: string
  permissions: string[]
}

export interface StaffInputData {
  name: string
  email: string
  phone?: string
  password?: string
  roleId?: number
  roleName?: string
}

export interface AdminStaffsResponse {
  items: StaffItem[]
  total: number
}
