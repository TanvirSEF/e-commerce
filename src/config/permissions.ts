export interface PermissionItem {
  key: string
  label: string
}

export interface PermissionGroup {
  name: string
  permissions: PermissionItem[]
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: "Products & Catalog",
    permissions: [
      { key: "manage_products", label: "Manage Products" },
      { key: "manage_categories", label: "Manage Categories" },
      { key: "manage_brands", label: "Manage Brands" },
      { key: "manage_attributes", label: "Manage Attributes & Colors" },
    ],
  },
  {
    name: "Sales & Orders",
    permissions: [
      { key: "manage_orders", label: "Manage Orders" },
      { key: "manage_refunds", label: "Manage Refund Requests" },
      { key: "track_couriers", label: "Courier Tracking & Logistics" },
    ],
  },
  {
    name: "Customers",
    permissions: [
      { key: "manage_customers", label: "Manage Customer Profiles & Bans" },
      { key: "manage_wallet", label: "Offline Wallet Recharges" },
      { key: "manage_classified", label: "Classified Products & Packages" },
    ],
  },
  {
    name: "Sellers & Vendors",
    permissions: [
      { key: "manage_sellers", label: "Manage Sellers & Verification" },
      { key: "manage_payouts", label: "Seller Payout Requests" },
      { key: "manage_commissions", label: "Commissions & Packages" },
    ],
  },
  {
    name: "Marketing & Promotions",
    permissions: [
      { key: "manage_flash_deals", label: "Flash Deals" },
      { key: "manage_coupons", label: "Coupons & Discounts" },
      { key: "manage_newsletters", label: "Newsletters & Push Notifications" },
    ],
  },
  {
    name: "Support & Reviews",
    permissions: [
      { key: "manage_support_tickets", label: "Support Tickets" },
      { key: "conversations", label: "Customer Conversations" },
      { key: "reviews", label: "Product Reviews & Queries" },
    ],
  },
  {
    name: "Reports & Analytics",
    permissions: [
      { key: "manage_reports", label: "View Sales & Financial Reports" },
    ],
  },
  {
    name: "System & Administration",
    permissions: [
      { key: "manage_settings", label: "General & Payment Settings" },
      { key: "manage_staffs", label: "Manage Staffs & Role Permissions" },
    ],
  },
]
