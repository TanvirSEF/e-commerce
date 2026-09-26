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
    ]
  },
}

export default nextConfig
