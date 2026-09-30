import { db } from "../src/db"
import { sql } from "drizzle-orm"

async function run() {
  console.log("Checking and syncing preorder_orders table in database...")

  // Recreate table if empty or adjust columns
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS preorder_orders (
      id SERIAL PRIMARY KEY,
      order_code VARCHAR(50) NOT NULL UNIQUE,
      customer_name VARCHAR(150) NOT NULL,
      customer_email VARCHAR(150) NOT NULL,
      customer_phone VARCHAR(50),
      product_id INTEGER NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_thumbnail VARCHAR(500),
      quantity INTEGER NOT NULL DEFAULT 1,
      total_price NUMERIC(10, 2) NOT NULL,
      prepayment_paid NUMERIC(10, 2) NOT NULL,
      remaining_due NUMERIC(10, 2) NOT NULL,
      seller_name VARCHAR(150) NOT NULL DEFAULT 'Inhouse',
      is_refundable BOOLEAN NOT NULL DEFAULT true,
      is_viewed BOOLEAN NOT NULL DEFAULT false,
      preorder_status VARCHAR(50) NOT NULL DEFAULT 'requested',
      shipping_address VARCHAR(500),
      payment_method VARCHAR(100) DEFAULT 'bKash',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)

  // Check columns in existing table and add any missing ones
  const columnsRes = await db.execute(sql`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'preorder_orders'
  `)
  const cols = new Set(columnsRes.rows.map((r: any) => r.column_name))

  if (!cols.has("customer_name") && cols.has("150")) {
    await db.execute(sql`DROP TABLE preorder_orders CASCADE;`)
    await db.execute(sql`
      CREATE TABLE preorder_orders (
        id SERIAL PRIMARY KEY,
        order_code VARCHAR(50) NOT NULL UNIQUE,
        customer_name VARCHAR(150) NOT NULL,
        customer_email VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(50),
        product_id INTEGER NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_thumbnail VARCHAR(500),
        quantity INTEGER NOT NULL DEFAULT 1,
        total_price NUMERIC(10, 2) NOT NULL,
        prepayment_paid NUMERIC(10, 2) NOT NULL,
        remaining_due NUMERIC(10, 2) NOT NULL,
        seller_name VARCHAR(150) NOT NULL DEFAULT 'Inhouse',
        is_refundable BOOLEAN NOT NULL DEFAULT true,
        is_viewed BOOLEAN NOT NULL DEFAULT false,
        preorder_status VARCHAR(50) NOT NULL DEFAULT 'requested',
        shipping_address VARCHAR(500),
        payment_method VARCHAR(100) DEFAULT 'bKash',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    console.log("Table preorder_orders recreated cleanly.")
  }

  // Count existing orders
  const countRes = await db.execute(sql`SELECT count(*) FROM preorder_orders`)
  const count = Number(countRes.rows[0].count)
  console.log(`Current preorder_orders count: ${count}`)

  if (count === 0) {
    console.log("Seeding canonical preorder orders with varied statuses...")
    const sampleOrders = [
      {
        order_code: "PO-202610-001",
        customer_name: "Tanvir Ahmed",
        customer_email: "tanvir.client@gmail.com",
        customer_phone: "+880 1711-223344",
        product_id: 1,
        product_name: "PlayStation 5 Pro 2TB Edition",
        product_thumbnail: "/assets/img/placeholder.jpg",
        quantity: 1,
        total_price: "799.00",
        prepayment_paid: "159.80",
        remaining_due: "639.20",
        seller_name: "Inhouse",
        is_refundable: true,
        is_viewed: false,
        preorder_status: "requested",
        shipping_address: "House 24, Road 8, Dhanmondi, Dhaka",
        payment_method: "bKash",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        order_code: "PO-202610-002",
        customer_name: "Shahrier Kabir",
        customer_email: "shahrier.k@yahoo.com",
        customer_phone: "+880 1819-556677",
        product_id: 2,
        product_name: "Apple Vision Pro (2nd Generation)",
        product_thumbnail: "/assets/img/placeholder-rect.jpg",
        quantity: 1,
        total_price: "3499.00",
        prepayment_paid: "700.00",
        remaining_due: "2799.00",
        seller_name: "Gadget Hub",
        is_refundable: true,
        is_viewed: true,
        preorder_status: "accepted_requests",
        shipping_address: "Apartment 4B, Banani DOHS, Dhaka",
        payment_method: "Nagad",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        order_code: "PO-202610-003",
        customer_name: "Nabila Farooq",
        customer_email: "nabila.f@hotmail.com",
        customer_phone: "+880 1912-998811",
        product_id: 3,
        product_name: "Sony Alpha A9 III Global Shutter Camera",
        product_thumbnail: "/assets/img/placeholder.jpg",
        quantity: 2,
        total_price: "11998.00",
        prepayment_paid: "2400.00",
        remaining_due: "9598.00",
        seller_name: "Inhouse",
        is_refundable: true,
        is_viewed: true,
        preorder_status: "prepayment_requests",
        shipping_address: "Plot 12, Sector 3, Uttara, Dhaka",
        payment_method: "Bank Transfer",
        created_at: new Date(Date.now() - 36 * 60 * 60 * 1000),
      },
      {
        order_code: "PO-202610-004",
        customer_name: "Kamrul Hassan",
        customer_email: "kamrul.hasan@outlook.com",
        customer_phone: "+880 1610-443322",
        product_id: 5,
        product_name: "Steam Deck OLED 1TB White Limited Edition",
        product_thumbnail: "/assets/img/placeholder.jpg",
        quantity: 1,
        total_price: "649.00",
        prepayment_paid: "130.00",
        remaining_due: "519.00",
        seller_name: "Inhouse",
        is_refundable: true,
        is_viewed: true,
        preorder_status: "confirmed_prepayments",
        shipping_address: "House 5, Road 2, Mirpur DOHS, Dhaka",
        payment_method: "bKash",
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
      {
        order_code: "PO-202610-005",
        customer_name: "Mehedi Hasan",
        customer_email: "mehedi.h@gmail.com",
        customer_phone: "+880 1715-889900",
        product_id: 1,
        product_name: "PlayStation 5 Pro 2TB Edition",
        product_thumbnail: "/assets/img/placeholder.jpg",
        quantity: 1,
        total_price: "799.00",
        prepayment_paid: "799.00",
        remaining_due: "0.00",
        seller_name: "Inhouse",
        is_refundable: true,
        is_viewed: true,
        preorder_status: "final_preorders",
        shipping_address: "Khulshi Hills R/A, Chattogram",
        payment_method: "SSLCommerz",
        created_at: new Date(Date.now() - 72 * 60 * 60 * 1000),
      },
      {
        order_code: "PO-202610-006",
        customer_name: "Farhan Chowdhury",
        customer_email: "farhan.c@live.com",
        customer_phone: "+880 1817-221100",
        product_id: 4,
        product_name: "DJI Mavic 4 Pro Cinema Drone 8K",
        product_thumbnail: "/assets/img/placeholder.jpg",
        quantity: 1,
        total_price: "2499.00",
        prepayment_paid: "500.00",
        remaining_due: "1999.00",
        seller_name: "AeroTech Studio",
        is_refundable: false,
        is_viewed: true,
        preorder_status: "in_shipping",
        shipping_address: "Zindabazar, Sylhet 3100",
        payment_method: "Credit Card",
        created_at: new Date(Date.now() - 96 * 60 * 60 * 1000),
      },
      {
        order_code: "PO-202610-007",
        customer_name: "Rifat Jahan",
        customer_email: "rifat.j@gmail.com",
        customer_phone: "+880 1914-776655",
        product_id: 5,
        product_name: "Steam Deck OLED 1TB White Limited Edition",
        product_thumbnail: "/assets/img/placeholder.jpg",
        quantity: 1,
        total_price: "649.00",
        prepayment_paid: "649.00",
        remaining_due: "0.00",
        seller_name: "Inhouse",
        is_refundable: true,
        is_viewed: true,
        preorder_status: "delivered",
        shipping_address: "Shonir Akhra, Dhaka",
        payment_method: "bKash",
        created_at: new Date(Date.now() - 120 * 60 * 60 * 1000),
      },
      {
        order_code: "PO-202610-008",
        customer_name: "Arifur Rahman",
        customer_email: "arif.r@gmail.com",
        customer_phone: "+880 1713-334455",
        product_id: 2,
        product_name: "Apple Vision Pro (2nd Generation)",
        product_thumbnail: "/assets/img/placeholder-rect.jpg",
        quantity: 1,
        total_price: "3499.00",
        prepayment_paid: "700.00",
        remaining_due: "2799.00",
        seller_name: "Gadget Hub",
        is_refundable: true,
        is_viewed: true,
        preorder_status: "refund",
        shipping_address: "Gulshan-2, Dhaka",
        payment_method: "Bank Transfer",
        created_at: new Date(Date.now() - 144 * 60 * 60 * 1000),
      }
    ]

    for (const order of sampleOrders) {
      await db.execute(sql`
        INSERT INTO preorder_orders (
          order_code, customer_name, customer_email, customer_phone,
          product_id, product_name, product_thumbnail, quantity,
          total_price, prepayment_paid, remaining_due, seller_name,
          is_refundable, is_viewed, preorder_status, shipping_address,
          payment_method, created_at
        ) VALUES (
          ${order.order_code}, ${order.customer_name}, ${order.customer_email}, ${order.customer_phone},
          ${order.product_id}, ${order.product_name}, ${order.product_thumbnail}, ${order.quantity},
          ${order.total_price}, ${order.prepayment_paid}, ${order.remaining_due}, ${order.seller_name},
          ${order.is_refundable}, ${order.is_viewed}, ${order.preorder_status}, ${order.shipping_address},
          ${order.payment_method}, ${order.created_at}
        );
      `)
    }
    console.log("Canonical preorder orders successfully seeded!")
  }

  // Seed default business_settings for preorder
  const defaultSettings = [
    { type: "seller_preorder_product", value: "1" },
    { type: "preorder_seller_commission", value: "10" },
    { type: "image_for_faq_advertisement", value: "" },
    { type: "preorder_flat_rate_shipping", value: "50" },
    { type: "preorder_request_instruction", value: "Please note that pre-orders reserve your unit with priority allocation once manufacturing finishes. Full payment is settled upon delivery." },
    { type: "image_for_payment_qrcode", value: "" },
    { type: "pre_payment_instruction", value: "Please make the deposit prepayment via bKash / Nagad / Bank transfer using your Preorder Code as reference." }
  ]

  for (const s of defaultSettings) {
    const existing = await db.execute(sql`
      SELECT id FROM business_settings WHERE type = ${s.type}
    `)
    if (existing.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO business_settings (type, value, updated_at)
        VALUES (${s.type}, ${s.value}, NOW())
      `)
      console.log(`Default setting seeded: ${s.type}`)
    }
  }

  console.log("Preorder DB sync completed successfully!")
}

run().then(() => process.exit(0)).catch((err) => {
  console.error("Error in sync-preorder-db:", err)
  process.exit(1)
})
