export interface SeedCategory {
  id: string
  name: string
  slug: string
  icon: string
  banner: string
  featured: boolean
  orderLevel: number
  itemCount: number
}

export interface SeedBrand {
  id: string
  name: string
  slug: string
  logo: string
  top: boolean
  productCount: number
}

export interface SeedProduct {
  id: string
  name: string
  slug: string
  sku: string
  categorySlug: string
  brandSlug: string
  price: number
  originalPrice: number
  discountPercent: number
  rating: number
  reviewCount: number
  salesCount: number
  stock: number
  unit: string
  thumbnail: string
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  featured: boolean
  todaysDeal: boolean
  sellerName: string
  sellerSlug: string
  description: string
  specifications: { label: string; value: string }[]
  reviews: { id: string; userName: string; date: string; rating: number; comment: string }[]
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: "cat-1",
    name: "Men Clothing & Fashion",
    slug: "men-clothing-fashion",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 1,
    itemCount: 142,
  },
  {
    id: "cat-2",
    name: "Women Clothing & Fashion",
    slug: "women-clothing-fashion",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 2,
    itemCount: 198,
  },
  {
    id: "cat-3",
    name: "Computer & Accessories",
    slug: "computer-accessories",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 3,
    itemCount: 89,
  },
  {
    id: "cat-4",
    name: "Smartphone Accessories",
    slug: "smartphone-accessories",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 4,
    itemCount: 114,
  },
  {
    id: "cat-5",
    name: "Car & Motorbike Accessories",
    slug: "car-accessories",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 5,
    itemCount: 46,
  },
  {
    id: "cat-6",
    name: "Kitchen & Dining",
    slug: "kitchen-dining",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 6,
    itemCount: 75,
  },
  {
    id: "cat-7",
    name: "Household Appliances",
    slug: "household-appliances",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: false,
    orderLevel: 7,
    itemCount: 62,
  },
  {
    id: "cat-8",
    name: "Fitness & Outdoor",
    slug: "fitness-outdoor",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: false,
    orderLevel: 8,
    itemCount: 38,
  },
]

export const SEED_BRANDS: SeedBrand[] = [
  { id: "brand-1", name: "Apple", slug: "apple", logo: "/assets/img/placeholder.jpg", top: true, productCount: 34 },
  { id: "brand-2", name: "Nike", slug: "nike", logo: "/assets/img/placeholder.jpg", top: true, productCount: 52 },
  { id: "brand-3", name: "Adidas", slug: "adidas", logo: "/assets/img/placeholder.jpg", top: true, productCount: 41 },
  { id: "brand-4", name: "Xiaomi", slug: "xiaomi", logo: "/assets/img/placeholder.jpg", top: true, productCount: 29 },
  { id: "brand-5", name: "Samsung", slug: "samsung", logo: "/assets/img/placeholder.jpg", top: true, productCount: 47 },
  { id: "brand-6", name: "Sony", slug: "sony", logo: "/assets/img/placeholder.jpg", top: true, productCount: 23 },
  { id: "brand-7", name: "Philips", slug: "philips", logo: "/assets/img/placeholder.jpg", top: true, productCount: 18 },
  { id: "brand-8", name: "Dell", slug: "dell", logo: "/assets/img/placeholder.jpg", top: true, productCount: 16 },
  { id: "brand-9", name: "Denim", slug: "denim", logo: "/assets/img/placeholder.jpg", top: true, productCount: 31 },
]

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: "prod-1",
    name: "Classic Men's Casual Shirt - Slim Fit 100% Pure Cotton",
    slug: "classic-mens-casual-shirt",
    sku: "SHIRT-CTN-001",
    categorySlug: "men-clothing-fashion",
    brandSlug: "nike",
    price: 1250,
    originalPrice: 1650,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 35,
    salesCount: 120,
    stock: 25,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg", "/assets/img/placeholder-rect.jpg"],
    colors: [
      { name: "Navy Blue", hex: "#1e3a8a" },
      { name: "Pure White", hex: "#ffffff" },
      { name: "Crimson Red", hex: "#dc2626" },
      { name: "Charcoal Black", hex: "#1f2937" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    featured: true,
    todaysDeal: false,
    sellerName: "Active Fashion Outlet",
    sellerSlug: "active-fashion-outlet",
    description: "Crafted from 100% premium combed long-staple cotton, this slim-fit casual shirt offers breathable comfort throughout the day.",
    specifications: [
      { label: "Material", value: "100% Combed Cotton" },
      { label: "Fit Type", value: "Slim Fit" },
      { label: "Collar", value: "Spread Collar" },
      { label: "Care Instructions", value: "Machine Wash Warm" },
    ],
    reviews: [
      { id: "rev-1", userName: "Tanvir Ahmed", date: "2 days ago", rating: 5, comment: "Excellent fabric quality and perfect fitting." },
    ],
  },
  {
    id: "prod-2",
    name: "T800 Ultra Smartwatch with Bluetooth Calling & Heart Rate",
    slug: "t800-ultra-smartwatch",
    sku: "WATCH-T800-01",
    categorySlug: "smartphone-accessories",
    brandSlug: "apple",
    price: 999,
    originalPrice: 1999,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 48,
    salesCount: 310,
    stock: 45,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [
      { name: "Orange", hex: "#ea580c" },
      { name: "Black", hex: "#111827" },
      { name: "Silver", hex: "#94a3b8" },
    ],
    sizes: ["49mm"],
    featured: true,
    todaysDeal: true,
    sellerName: "Gadget Hub BD",
    sellerSlug: "gadget-hub-bd",
    description: "Full touchscreen smart fitness watch with IP68 waterproof rating, heart rate, sleep monitor, and wireless magnetic charger.",
    specifications: [
      { label: "Display", value: "1.99 inch HD IPS Display" },
      { label: "Battery Life", value: "Up to 5 Days" },
      { label: "Water Resistance", value: "IP68" },
    ],
    reviews: [
      { id: "rev-2", userName: "Rashidul Islam", date: "1 week ago", rating: 5, comment: "Best value for money smartwatch!" },
    ],
  },
  {
    id: "prod-3",
    name: "M10 Wireless TWS Bluetooth Earbuds with Digital LED Display",
    slug: "m10-wireless-earbuds",
    sku: "AUDIO-M10-TWS",
    categorySlug: "smartphone-accessories",
    brandSlug: "xiaomi",
    price: 450,
    originalPrice: 900,
    discountPercent: 50,
    rating: 4.7,
    reviewCount: 82,
    salesCount: 450,
    stock: 80,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["Standard"],
    featured: true,
    todaysDeal: true,
    sellerName: "Gadget Hub BD",
    sellerSlug: "gadget-hub-bd",
    description: "Bluetooth 5.1 true wireless earbuds with 2000mAh emergency powerbank charging case and clear stereo bass sound.",
    specifications: [
      { label: "Bluetooth", value: "5.1 Dual Mode" },
      { label: "Case Battery", value: "2000mAh Power Bank" },
      { label: "Playtime", value: "4-5 Hours per charge" },
    ],
    reviews: [],
  },
  {
    id: "prod-4",
    name: "Foldable Laptop Stand Aluminum Adjustable Height Cooling Holder",
    slug: "foldable-laptop-stand-aluminum",
    sku: "ACC-STAND-04",
    categorySlug: "computer-accessories",
    brandSlug: "samsung",
    price: 650,
    originalPrice: 1100,
    discountPercent: 41,
    rating: 4.9,
    reviewCount: 29,
    salesCount: 95,
    stock: 30,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "Silver", hex: "#94a3b8" }, { name: "Space Gray", hex: "#4b5563" }],
    sizes: ["Universal (10-17 inch)"],
    featured: false,
    todaysDeal: false,
    sellerName: "Inhouse Products",
    sellerSlug: "inhouse-products",
    description: "Sturdy aluminum alloy construction with anti-slip silicone pads and 6 height adjustment angles for ergonomic typing.",
    specifications: [
      { label: "Material", value: "Sandblasted Aluminum Alloy" },
      { label: "Angles", value: "6 Ergonomic Levels" },
    ],
    reviews: [],
  },
  {
    id: "prod-5",
    name: "Multi-Pocket Travel Backpack with USB Charging Port Waterproof",
    slug: "travel-backpack-usb-charging",
    sku: "BAG-TRV-05",
    categorySlug: "men-clothing-fashion",
    brandSlug: "nike",
    price: 1350,
    originalPrice: 2200,
    discountPercent: 39,
    rating: 4.6,
    reviewCount: 19,
    salesCount: 65,
    stock: 18,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "Black", hex: "#111827" }, { name: "Grey", hex: "#6b7280" }],
    sizes: ["35L Large"],
    featured: false,
    todaysDeal: false,
    sellerName: "Active Fashion Outlet",
    sellerSlug: "active-fashion-outlet",
    description: "Water-resistant Oxford fabric travel laptop bag with hidden anti-theft back pocket and external USB charge interface.",
    specifications: [
      { label: "Capacity", value: "35 Liters" },
      { label: "Laptop Sleeve", value: "Fits up to 15.6 inch" },
    ],
    reviews: [],
  },
  {
    id: "prod-6",
    name: "Mechanical Gaming Keyboard RGB Backlit with Blue Switches",
    slug: "mechanical-gaming-keyboard-rgb",
    sku: "KB-MECH-RGB-06",
    categorySlug: "computer-accessories",
    brandSlug: "sony",
    price: 2200,
    originalPrice: 2800,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 37,
    salesCount: 140,
    stock: 22,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "Black", hex: "#111827" }, { name: "White", hex: "#ffffff" }],
    sizes: ["104 Keys Full Layout"],
    featured: true,
    todaysDeal: false,
    sellerName: "Inhouse Products",
    sellerSlug: "inhouse-products",
    description: "Tactile clicky blue switches with customizable per-key RGB backlighting effects and braided gold-plated USB cable.",
    specifications: [
      { label: "Switch Type", value: "Outemu Blue Mechanical" },
      { label: "Keycaps", value: "Double-Shot Injection ABS" },
    ],
    reviews: [],
  },
  {
    id: "prod-7",
    name: "Philips Rice Cooker 0.6L Compact Non-Stick Inner Pot",
    slug: "philips-rice-cooker-06l",
    sku: "APP-RC-PHILIPS-07",
    categorySlug: "kitchen-dining",
    brandSlug: "philips",
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 42,
    salesCount: 180,
    stock: 15,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "White", hex: "#ffffff" }],
    sizes: ["0.6L"],
    featured: true,
    todaysDeal: true,
    sellerName: "Home Essentials",
    sellerSlug: "home-essentials",
    description: "Automatic keep-warm function with durable 5-layer non-stick pot for fluffy rice and energy saving cooking.",
    specifications: [
      { label: "Power", value: "300W" },
      { label: "Capacity", value: "0.6 Liters (up to 3 persons)" },
    ],
    reviews: [],
  },
  {
    id: "prod-8",
    name: "Philips Mixer Grinder HL7555/00 600W with 3 Stainless Steel Jars",
    slug: "philips-mixer-grinder-hl755500",
    sku: "APP-MG-PHILIPS-08",
    categorySlug: "kitchen-dining",
    brandSlug: "philips",
    price: 4950,
    originalPrice: 5900,
    discountPercent: 16,
    rating: 4.7,
    reviewCount: 28,
    salesCount: 90,
    stock: 12,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "White/Lavender", hex: "#e0e7ff" }],
    sizes: ["3 Jars Set"],
    featured: false,
    todaysDeal: false,
    sellerName: "Home Essentials",
    sellerSlug: "home-essentials",
    description: "Powerful 600W copper motor with specialized blades for quick batter grinding, wet paste, and dry spices.",
    specifications: [
      { label: "Motor", value: "600 Watt Heavy Duty" },
      { label: "Jars", value: "1.5L Wet, 1L Multipurpose, 0.4L Chutney" },
    ],
    reviews: [],
  },
  {
    id: "prod-9",
    name: "AirPods Max Wireless Over-Ear Active Noise Cancelling Headphones",
    slug: "apple-airpods-max",
    sku: "AUDIO-APMAX-09",
    categorySlug: "smartphone-accessories",
    brandSlug: "apple",
    price: 68500,
    originalPrice: 75000,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 65,
    salesCount: 30,
    stock: 8,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [
      { name: "Space Gray", hex: "#374151" },
      { name: "Silver", hex: "#e5e7eb" },
      { name: "Sky Blue", hex: "#38bdf8" },
    ],
    sizes: ["One Size"],
    featured: true,
    todaysDeal: false,
    sellerName: "Gadget Hub BD",
    sellerSlug: "gadget-hub-bd",
    description: "Apple-designed dynamic driver delivers high-fidelity audio with industry-leading Active Noise Cancellation and Transparency mode.",
    specifications: [
      { label: "Audio Technology", value: "Active Noise Cancellation + Spatial Audio" },
      { label: "Battery", value: "Up to 20 hours" },
    ],
    reviews: [],
  },
]

export const SEED_FLASH_DEALS = [
  {
    id: "fd-1",
    title: "Flash Sale 2026",
    slug: "flash-sale-2026",
    startDate: Date.now() - 86400000,
    endDate: Date.now() + 172800000, // 2 days in future
    status: true,
    featured: true,
    banner: "/assets/img/placeholder-rect.jpg",
  },
]
