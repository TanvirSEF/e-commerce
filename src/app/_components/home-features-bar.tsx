import React from "react"
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react"

const FEATURES = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "For all orders over ৳2,000",
  },
  {
    icon: RotateCcw,
    title: "7 Days Return",
    desc: "Hassle-free return policy",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    desc: "Genuine verified products",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Dedicated customer service",
  },
]

export function HomeFeaturesBar() {
  return (
    <div className="border-b border-gray-100 bg-white py-5">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg border border-gray-50 bg-gray-50/50 p-3.5 transition-colors hover:border-red-100 hover:bg-red-50/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#d43533] shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                  <p className="text-[11px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HomeFeaturesBar
