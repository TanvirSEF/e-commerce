import { db } from "../src/db"
import { sql } from "drizzle-orm"

async function run() {
  console.log("Checking and syncing auction tables in database...")

  // Check auction_bids count
  const bidsCountRes = await db.execute(sql`SELECT count(*) FROM auction_bids`)
  const bidsCount = Number(bidsCountRes.rows[0].count)
  console.log(`Current auction_bids count: ${bidsCount}`)

  if (bidsCount === 0) {
    console.log("Seeding canonical auction bids...")
    const sampleBids = [
      {
        product_id: 1,
        user_name: "Alexander Vance",
        user_email: "alex.vance@example.com",
        amount: "9200.00",
        is_highest: true,
        created_at: new Date(Date.now() - 3600000 * 2),
      },
      {
        product_id: 1,
        user_name: "David Kim",
        user_email: "d.kim@example.com",
        amount: "9000.00",
        is_highest: false,
        created_at: new Date(Date.now() - 3600000 * 6),
      },
      {
        product_id: 1,
        user_name: "Sarah Jenkins",
        user_email: "sarah.j@example.com",
        amount: "8700.00",
        is_highest: false,
        created_at: new Date(Date.now() - 3600000 * 12),
      },
      {
        product_id: 2,
        user_name: "Marcus Brody",
        user_email: "brody@example.com",
        amount: "1650.00",
        is_highest: true,
        created_at: new Date(Date.now() - 3600000 * 1),
      },
      {
        product_id: 2,
        user_name: "Tanvir Hasan",
        user_email: "tanvir.client@gmail.com",
        amount: "1550.00",
        is_highest: false,
        created_at: new Date(Date.now() - 3600000 * 5),
      },
      {
        product_id: 3,
        user_name: "Elena Rostova",
        user_email: "elena@example.com",
        amount: "4100.00",
        is_highest: true,
        created_at: new Date(Date.now() - 3600000 * 3),
      },
      {
        product_id: 4,
        user_name: "Robert Sterling",
        user_email: "r.sterling@example.com",
        amount: "3850.00",
        is_highest: true,
        created_at: new Date(Date.now() - 3600000 * 4),
      },
    ]

    for (const b of sampleBids) {
      await db.execute(sql`
        INSERT INTO auction_bids (product_id, user_name, user_email, amount, is_highest, created_at)
        VALUES (${b.product_id}, ${b.user_name}, ${b.user_email}, ${b.amount}, ${b.is_highest}, ${b.created_at})
      `)
    }
    console.log("Canonical auction bids successfully seeded!")
  }

  // Check auction_orders count
  const ordersCountRes = await db.execute(sql`SELECT count(*) FROM auction_orders`)
  const ordersCount = Number(ordersCountRes.rows[0].count)
  console.log(`Current auction_orders count: ${ordersCount}`)

  if (ordersCount === 0) {
    console.log("Seeding canonical auction orders...")
    const sampleOrders = [
      {
        order_code: "AUC-202609-0081",
        product_id: 1,
        product_name: "Vintage Leica M3 Double Stroke Rangefinder",
        customer_name: "Robert Sterling",
        customer_email: "r.sterling@example.com",
        winning_bid: "4800.00",
        payment_status: "paid",
        delivery_status: "delivered",
        created_at: new Date("2026-09-20T14:30:00Z"),
      },
      {
        order_code: "AUC-202609-0092",
        product_id: 2,
        product_name: "Signed Michael Jordan 1998 Finals Commemorative Jersey",
        customer_name: "Elena Rostova",
        customer_email: "elena@example.com",
        winning_bid: "12500.00",
        payment_status: "paid",
        delivery_status: "on_delivery",
        created_at: new Date("2026-09-22T09:15:00Z"),
      },
      {
        order_code: "AUC-202609-0105",
        product_id: 3,
        product_name: "Original 1977 Apple II Computer with Color Monitor",
        customer_name: "Alexander Vance",
        customer_email: "alex.vance@example.com",
        winning_bid: "6200.00",
        payment_status: "paid",
        delivery_status: "confirmed",
        created_at: new Date("2026-09-24T11:20:00Z"),
      },
      {
        order_code: "AUC-202609-0118",
        product_id: 4,
        product_name: "Patek Philippe Nautilus 5711/1A-010 Stainless Steel",
        customer_name: "Shahrier Kabir",
        customer_email: "shahrier.k@yahoo.com",
        winning_bid: "34500.00",
        payment_status: "unpaid",
        delivery_status: "pending",
        created_at: new Date("2026-09-26T16:45:00Z"),
      },
    ]

    for (const o of sampleOrders) {
      await db.execute(sql`
        INSERT INTO auction_orders (order_code, product_id, product_name, customer_name, customer_email, winning_bid, payment_status, delivery_status, created_at)
        VALUES (${o.order_code}, ${o.product_id}, ${o.product_name}, ${o.customer_name}, ${o.customer_email}, ${o.winning_bid}, ${o.payment_status}, ${o.delivery_status}, ${o.created_at})
      `)
    }
    console.log("Canonical auction orders successfully seeded!")
  }

  console.log("Auction DB sync completed successfully!")
}

run().then(() => process.exit(0)).catch((err) => {
  console.error("Error in sync-auction-db:", err)
  process.exit(1)
})
