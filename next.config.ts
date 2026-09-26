import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/track-your-order", destination: "/track-order" },
      { source: "/users/login", destination: "/login" },
      { source: "/users/registration", destination: "/register" },
      { source: "/password/reset", destination: "/forgot-password" },
      { source: "/deliveryboy/login", destination: "/delivery-boy/login" },
      { source: "/all-flash-deals", destination: "/flash-deals" },
      { source: "/inhouse-products", destination: "/inhouse" },
      { source: "/wallet_recharge_success", destination: "/wallet-recharge-success" },
      { source: "/re-order/:id", destination: "/dashboard/purchase-history" },
      { source: "/admin/all_orders", destination: "/admin/orders" },
      { source: "/admin/inhouse-orders", destination: "/admin/orders" },
      { source: "/admin/seller_orders", destination: "/admin/orders" },
      { source: "/admin/general-setting", destination: "/admin/settings" },
      { source: "/admin/payment-method", destination: "/admin/settings/payments" },
      { source: "/admin/social-login", destination: "/admin/settings/social-login" },
      { source: "/admin/smtp-settings", destination: "/admin/settings/smtp" },
      { source: "/admin/brand", destination: "/admin/brands" },
      { source: "/admin/category", destination: "/admin/categories" },
      { source: "/admin/roles", destination: "/admin/staffs" },
      { source: "/admin/all-file", destination: "/admin/uploaded-files" },
      { source: "/admin/support_ticket", destination: "/admin/support-tickets" },
      { source: "/seller/money-withdraw-requests", destination: "/seller/payouts" },
      { source: "/seller/support_ticket", destination: "/seller/support" },
      { source: "/seller/shop/apply-for-verification", destination: "/seller/verify" },
      { source: "/seller/categories-wise-product-discount", destination: "/seller/category-discount" },
      { source: "/seller/category-wise-commission", destination: "/seller/category-commission" },
      { source: "/seller/note/index", destination: "/seller/notes" },
      { source: "/seller/note/create", destination: "/seller/notes" },
      { source: "/seller/uploads", destination: "/seller/uploaded-files" },
    ]
  },
}

export default nextConfig
