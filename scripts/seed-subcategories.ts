import { Client } from "pg"

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://nextcom:za4D5vtRw68NDGL7AnvS@2.25.150.87:5432/nextcom"

interface SubCatDef {
  name: string
  slug: string
  icon?: string
  children: { name: string; slug: string }[]
}

const SUBCATEGORIES_DATA: Record<number, SubCatDef[]> = {
  // 1: Men Clothing & Fashion
  1: [
    {
      name: "Topwear",
      slug: "men-topwear",
      children: [
        { name: "T-Shirts", slug: "men-t-shirts" },
        { name: "Casual Shirts", slug: "men-casual-shirts" },
        { name: "Formal Shirts", slug: "men-formal-shirts" },
        { name: "Polo Shirts", slug: "men-polo-shirts" },
        { name: "Jackets & Coats", slug: "men-jackets-coats" },
        { name: "Sweaters & Hoodies", slug: "men-sweaters-hoodies" },
      ],
    },
    {
      name: "Bottomwear",
      slug: "men-bottomwear",
      children: [
        { name: "Jeans", slug: "men-jeans" },
        { name: "Chinos & Trousers", slug: "men-chinos-trousers" },
        { name: "Joggers & Trackpants", slug: "men-joggers-trackpants" },
        { name: "Cargo Pants", slug: "men-cargo-pants" },
        { name: "Shorts", slug: "men-shorts" },
      ],
    },
    {
      name: "Footwear",
      slug: "men-footwear",
      children: [
        { name: "Sneakers", slug: "men-sneakers" },
        { name: "Formal Shoes", slug: "men-formal-shoes" },
        { name: "Loafers & Slip-ons", slug: "men-loafers-slip-ons" },
        { name: "Sandals & Slides", slug: "men-sandals-slides" },
        { name: "Boots", slug: "men-boots" },
      ],
    },
    {
      name: "Accessories",
      slug: "men-accessories",
      children: [
        { name: "Watches", slug: "men-watches" },
        { name: "Belts & Wallets", slug: "men-belts-wallets" },
        { name: "Caps & Hats", slug: "men-caps-hats" },
        { name: "Sunglasses", slug: "men-sunglasses" },
        { name: "Ties & Cufflinks", slug: "men-ties-cufflinks" },
        { name: "Backpacks", slug: "men-backpacks" },
      ],
    },
  ],

  // 2: Women Clothing & Fashion
  2: [
    {
      name: "Ethnic & Traditional Wear",
      slug: "women-ethnic-wear",
      children: [
        { name: "Sarees", slug: "women-sarees" },
        { name: "Salwar Kameez", slug: "women-salwar-kameez" },
        { name: "Kurtis & Tunics", slug: "women-kurtis-tunics" },
        { name: "Lehenga Choli", slug: "women-lehenga-choli" },
        { name: "Abayas & Hijabs", slug: "women-abayas-hijabs" },
        { name: "Dupattas & Shawls", slug: "women-dupattas-shawls" },
      ],
    },
    {
      name: "Western Wear",
      slug: "women-western-wear",
      children: [
        { name: "Dresses & Gowns", slug: "women-dresses-gowns" },
        { name: "Tops & Blouses", slug: "women-tops-blouses" },
        { name: "T-Shirts", slug: "women-t-shirts" },
        { name: "Jeans & Jeggings", slug: "women-jeans-jeggings" },
        { name: "Skirts & Shorts", slug: "women-skirts-shorts" },
      ],
    },
    {
      name: "Footwear",
      slug: "women-footwear",
      children: [
        { name: "Heels & Pumps", slug: "women-heels-pumps" },
        { name: "Flats & Sandals", slug: "women-flats-sandals" },
        { name: "Sneakers", slug: "women-sneakers" },
        { name: "Wedges", slug: "women-wedges" },
        { name: "Boots", slug: "women-boots" },
      ],
    },
    {
      name: "Bags & Jewelry",
      slug: "women-bags-jewelry",
      children: [
        { name: "Handbags & Totes", slug: "women-handbags" },
        { name: "Clutches & Wallets", slug: "women-clutches" },
        { name: "Necklaces & Pendants", slug: "women-necklaces" },
        { name: "Earrings", slug: "women-earrings" },
        { name: "Bracelets & Bangles", slug: "women-bracelets" },
      ],
    },
  ],

  // 3: Computer & Accessories
  3: [
    {
      name: "Laptops & Desktops",
      slug: "laptops-desktops",
      children: [
        { name: "Gaming Laptops", slug: "gaming-laptops" },
        { name: "Ultrabooks", slug: "ultrabooks" },
        { name: "All-in-One PCs", slug: "all-in-one-pcs" },
        { name: "Custom Desktop PCs", slug: "desktop-pcs" },
        { name: "MacBooks", slug: "macbooks" },
      ],
    },
    {
      name: "PC Components",
      slug: "pc-components",
      children: [
        { name: "Processors (CPU)", slug: "processors-cpu" },
        { name: "Graphics Cards (GPU)", slug: "graphics-cards-gpu" },
        { name: "Motherboards", slug: "motherboards" },
        { name: "RAM & Storage (SSD)", slug: "ram-ssd-storage" },
        { name: "Power Supplies (PSU)", slug: "power-supplies-psu" },
        { name: "Casing & Coolers", slug: "casing-coolers" },
      ],
    },
    {
      name: "Peripherals & Accessories",
      slug: "pc-peripherals",
      children: [
        { name: "Mechanical Keyboards", slug: "mechanical-keyboards" },
        { name: "Gaming Mice", slug: "gaming-mice" },
        { name: "Monitors & Displays", slug: "monitors-displays" },
        { name: "Headsets & Speakers", slug: "pc-headsets-speakers" },
        { name: "Webcams & Microphones", slug: "webcams-microphones" },
      ],
    },
    {
      name: "Networking Devices",
      slug: "networking-devices",
      children: [
        { name: "Wi-Fi 6 Routers", slug: "wifi-routers" },
        { name: "Network Switches", slug: "network-switches" },
        { name: "Range Extenders", slug: "range-extenders" },
        { name: "Ethernet Cables", slug: "ethernet-cables" },
      ],
    },
  ],

  // 4: Smartphone Accessories
  4: [
    {
      name: "Cases & Protection",
      slug: "phone-cases-protection",
      children: [
        { name: "Silicone & Shockproof Cases", slug: "silicone-cases" },
        { name: "Tempered Glass Protectors", slug: "tempered-glass" },
        { name: "Camera Lens Protectors", slug: "lens-protectors" },
        { name: "Leather Wallet Cases", slug: "wallet-cases" },
      ],
    },
    {
      name: "Charging & Power",
      slug: "phone-charging-power",
      children: [
        { name: "Fast Chargers & Adapters", slug: "fast-chargers" },
        { name: "Power Banks (10,000–30,000 mAh)", slug: "power-banks" },
        { name: "Wireless Chargers & Magsafe", slug: "wireless-chargers" },
        { name: "Type-C & Lightning Cables", slug: "charging-cables" },
        { name: "Car Chargers", slug: "car-chargers" },
      ],
    },
    {
      name: "Audio & Wearables",
      slug: "phone-audio-wearables",
      children: [
        { name: "True Wireless Earbuds (TWS)", slug: "tws-earbuds" },
        { name: "Bluetooth Neckbands", slug: "bluetooth-neckbands" },
        { name: "Smart Watches", slug: "smart-watches" },
        { name: "Fitness Bands", slug: "fitness-bands" },
        { name: "Smart Watch Straps", slug: "smart-watch-straps" },
      ],
    },
    {
      name: "Mounts & Photography",
      slug: "phone-mounts-photography",
      children: [
        { name: "Car Phone Mounts", slug: "car-phone-mounts" },
        { name: "Desktop Stands", slug: "desktop-phone-stands" },
        { name: "Tripods & Ring Lights", slug: "tripods-ring-lights" },
        { name: "Gimbals & Stabilizers", slug: "gimbals-stabilizers" },
      ],
    },
  ],

  // 5: Car & Motorbike Accessories
  5: [
    {
      name: "Motorbike Gear & Safety",
      slug: "motorbike-gear-safety",
      children: [
        { name: "Full Face Helmets", slug: "helmets-full-face" },
        { name: "Riding Jackets & Armor", slug: "riding-jackets" },
        { name: "Riding Gloves", slug: "riding-gloves" },
        { name: "Raincoats & Shoe Covers", slug: "bike-raincoats" },
        { name: "Security Disc Locks", slug: "security-disc-locks" },
      ],
    },
    {
      name: "Car Electronics & Gadgets",
      slug: "car-electronics",
      children: [
        { name: "Dash Cams (Front & Rear)", slug: "dash-cams" },
        { name: "Android Auto & Apple CarPlay Screens", slug: "car-multimedia" },
        { name: "Bluetooth FM Transmitters", slug: "fm-transmitters" },
        { name: "Tire Pressure Monitors (TPMS)", slug: "tpms-monitors" },
        { name: "GPS Trackers", slug: "car-gps-trackers" },
      ],
    },
    {
      name: "Interior & Exterior Care",
      slug: "car-care-accessories",
      children: [
        { name: "Custom Seat Covers", slug: "car-seat-covers" },
        { name: "7D Floor Mats", slug: "car-floor-mats" },
        { name: "Car Vacuum Cleaners", slug: "car-vacuum-cleaners" },
        { name: "Car Polish & Shampoos", slug: "car-polish-cleaning" },
        { name: "Sun Shades & Windshield Covers", slug: "car-sun-shades" },
      ],
    },
  ],

  // 6: Kitchen & Dining
  6: [
    {
      name: "Cookware Sets & Pots",
      slug: "cookware-pots",
      children: [
        { name: "Non-Stick Frying Pans", slug: "non-stick-pans" },
        { name: "Pressure Cookers", slug: "pressure-cookers" },
        { name: "Granite Cookware Sets", slug: "granite-cookware-sets" },
        { name: "Cast Iron Skillets", slug: "cast-iron-skillets" },
        { name: "Stainless Steel Pots", slug: "steel-pots" },
      ],
    },
    {
      name: "Small Kitchen Appliances",
      slug: "small-kitchen-appliances",
      children: [
        { name: "Blenders & Grinders", slug: "blenders-grinders" },
        { name: "Air Fryers", slug: "air-fryers" },
        { name: "Electric Kettles", slug: "electric-kettles" },
        { name: "Rice Cookers", slug: "rice-cookers" },
        { name: "Microwave & Toaster Ovens", slug: "microwave-toasters" },
      ],
    },
    {
      name: "Tableware & Food Storage",
      slug: "tableware-food-storage",
      children: [
        { name: "Opal Glass & Ceramic Dinner Sets", slug: "dinner-sets" },
        { name: "Cutlery Sets", slug: "cutlery-sets" },
        { name: "Airtight Glass Jars", slug: "airtight-storage-jars" },
        { name: "Water Bottles & Thermos", slug: "thermos-flasks" },
      ],
    },
  ],

  // 7: Household Appliances
  7: [
    {
      name: "Cooling & Air Conditioning",
      slug: "cooling-air-appliances",
      children: [
        { name: "Inverter Air Conditioners", slug: "inverter-air-conditioners" },
        { name: "Ceiling & Exhaust Fans", slug: "ceiling-fans" },
        { name: "Stand & Table Fans", slug: "stand-table-fans" },
        { name: "Air Purifiers", slug: "air-purifiers" },
      ],
    },
    {
      name: "Laundry & Cleaning",
      slug: "laundry-cleaning-appliances",
      children: [
        { name: "Front Load Washing Machines", slug: "front-load-washers" },
        { name: "Top Load Washing Machines", slug: "top-load-washers" },
        { name: "Steam Irons & Garment Steamers", slug: "steam-irons" },
        { name: "Robotic Vacuum Cleaners", slug: "robotic-vacuums" },
      ],
    },
    {
      name: "Refrigeration",
      slug: "refrigeration-appliances",
      children: [
        { name: "Double Door Refrigerators", slug: "double-door-fridges" },
        { name: "Side-by-Side Refrigerators", slug: "side-by-side-fridges" },
        { name: "Deep Freezers", slug: "deep-freezers" },
      ],
    },
  ],

  // 8: Fitness & Outdoor
  8: [
    {
      name: "Cardio Fitness Machines",
      slug: "cardio-machines",
      children: [
        { name: "Motorized Treadmills", slug: "motorized-treadmills" },
        { name: "Spin & Exercise Bikes", slug: "exercise-bikes" },
        { name: "Elliptical Cross Trainers", slug: "elliptical-trainers" },
        { name: "Rowing Machines", slug: "rowing-machines" },
      ],
    },
    {
      name: "Strength & Gym Equipment",
      slug: "strength-gym-equipment",
      children: [
        { name: "Rubber Hex Dumbbells", slug: "rubber-hex-dumbbells" },
        { name: "Adjustable Weight Benches", slug: "weight-benches" },
        { name: "Resistance Bands & Tubes", slug: "resistance-bands" },
        { name: "Pull-Up Bars & Ab Rollers", slug: "pullup-bars-ab-rollers" },
      ],
    },
    {
      name: "Outdoor, Camping & Hiking",
      slug: "outdoor-camping-hiking",
      children: [
        { name: "Waterproof Camping Tents", slug: "camping-tents" },
        { name: "Trekking Backpacks (40L–80L)", slug: "trekking-backpacks" },
        { name: "Sleeping Bags & Air Mattresses", slug: "sleeping-bags" },
        { name: "Hiking Boots & Trekking Poles", slug: "hiking-poles-boots" },
      ],
    },
  ],
}

async function run() {
  const client = new Client({ connectionString })
  await client.connect()
  console.log("Connected to PostgreSQL DB.")

  // 1. Seed Subcategories
  for (const [parentIdStr, subList] of Object.entries(SUBCATEGORIES_DATA)) {
    const parentId = parseInt(parentIdStr, 10)

    for (let i = 0; i < subList.length; i++) {
      const sub = subList[i]
      // Check or insert Level 1 subcategory
      let subRow = await client.query(
        "SELECT id FROM categories WHERE slug = $1",
        [sub.slug]
      )

      let subId: number
      if (subRow.rows.length === 0) {
        const inserted = await client.query(
          `INSERT INTO categories (name, slug, parent_id, order_level, featured, icon, banner, created_at, updated_at)
           VALUES ($1, $2, $3, $4, false, '/assets/img/placeholder.jpg', '/assets/img/placeholder-rect.jpg', NOW(), NOW())
           RETURNING id`,
          [sub.name, sub.slug, parentId, i + 1]
        )
        subId = inserted.rows[0].id
        console.log(`Inserted Level 1 subcategory: ${sub.name} (id: ${subId}, parent_id: ${parentId})`)
      } else {
        subId = subRow.rows[0].id
        await client.query("UPDATE categories SET parent_id = $1 WHERE id = $2", [parentId, subId])
      }

      // Check or insert Level 2 grand-children
      for (let j = 0; j < sub.children.length; j++) {
        const child = sub.children[j]
        const childRow = await client.query(
          "SELECT id FROM categories WHERE slug = $1",
          [child.slug]
        )

        if (childRow.rows.length === 0) {
          await client.query(
            `INSERT INTO categories (name, slug, parent_id, order_level, featured, icon, banner, created_at, updated_at)
             VALUES ($1, $2, $3, $4, false, '/assets/img/placeholder.jpg', '/assets/img/placeholder-rect.jpg', NOW(), NOW())`,
            [child.name, child.slug, subId, j + 1]
          )
          console.log(`  -> Inserted Level 2: ${child.name} (parent_id: ${subId})`)
        } else {
          await client.query("UPDATE categories SET parent_id = $1 WHERE id = $2", [subId, childRow.rows[0].id])
        }
      }
    }
  }

  // 2. Update contact page in pages table (id: 6) with canonical JSON content
  const contactJson = JSON.stringify({
    description: "Have questions regarding orders, courier deliveries, seller onboarding, or product specifications? Reach out through any channel below.",
    address: "House 42, Road 11, Block D, Banani, Dhaka 1213, Bangladesh",
    phone: "+880 1700-112233",
    email: "support@huipper.com",
  })

  await client.query(
    `UPDATE pages 
     SET content = $1, 
         meta_title = 'Contact Us | Active eCommerce',
         meta_description = 'Get in touch with customer support and sales team for order inquiries, partnerships, and assistance.'
     WHERE type = 'contact_us_page' OR slug = 'contact'`,
    [contactJson]
  )
  console.log("Updated contact page JSON in pages table.")

  await client.end()
  console.log("Subcategories seed & pages update completed successfully.")
}

run().catch((err) => {
  console.error("Error running script:", err)
  process.exit(1)
})
