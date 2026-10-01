import pg from "pg"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const { Client } = pg

async function seedTickets() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    const existingTickets = await client.query("SELECT code FROM tickets;")
    const existingCodes = new Set(existingTickets.rows.map((r: { code: string }) => r.code))

    // Ticket 1: 100234
    let t1Id: number
    if (!existingCodes.has("100234")) {
      const t1 = await client.query(
        `INSERT INTO tickets (code, user_id, subject, details, files, status, viewed, client_viewed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day')
         RETURNING id;`,
        [
          "100234",
          "usr_customer_default_01",
          "Delivery delay for Order #20260920-101122",
          "I placed an order 3 days ago and the delivery status has not updated yet. Please assist with courier tracking.",
          JSON.stringify(["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800"]),
          "open",
          false,
          true,
        ]
      )
      t1Id = t1.rows[0].id
    } else {
      const t1Row = await client.query("SELECT id FROM tickets WHERE code = '100234';")
      t1Id = t1Row.rows[0].id
    }

    // Check reply for t1
    const t1Replies = await client.query("SELECT id FROM ticket_replies WHERE ticket_id = $1;", [t1Id])
    if (t1Replies.rows.length === 0) {
      await client.query(
        `INSERT INTO ticket_replies (ticket_id, user_id, reply, files, created_at)
         VALUES ($1, $2, $3, $4, NOW() - INTERVAL '1 day');`,
        [
          t1Id,
          "usr_admin_default_01",
          "Hello Tanvir! We apologize for the delay. The logistics rider picked up your parcel today and it is currently out for delivery.",
          JSON.stringify([]),
        ]
      )
    }

    // Ticket 2: 100189
    let t2Id: number
    if (!existingCodes.has("100189")) {
      const t2 = await client.query(
        `INSERT INTO tickets (code, user_id, subject, details, files, status, viewed, client_viewed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days')
         RETURNING id;`,
        [
          "100189",
          "usr_customer_default_01",
          "Inquiry regarding return policy on electronics",
          "Can I replace an earphone if the left earbud stops working within 7 days of purchase?",
          JSON.stringify([]),
          "solved",
          true,
          true,
        ]
      )
      t2Id = t2.rows[0].id

      await client.query(
        `INSERT INTO ticket_replies (ticket_id, user_id, reply, files, created_at)
         VALUES ($1, $2, $3, $4, NOW() - INTERVAL '5 days' + INTERVAL '2 hours');`,
        [
          t2Id,
          "usr_admin_default_01",
          "Yes! All electronic accessories have a 7-day hassle-free replacement warranty. Please keep the original packaging and invoice intact.",
          JSON.stringify(["/docs/warranty_terms.pdf"]),
        ]
      )
    }

    // Ticket 3: 100412
    if (!existingCodes.has("100412")) {
      await client.query(
        `INSERT INTO tickets (code, user_id, subject, details, files, status, viewed, client_viewed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');`,
        [
          "100412",
          "usr_seller_default_01",
          "Seller commission withdrawal inquiry",
          "My monthly withdrawal request of ৳45,000 has been submitted. When will the bank transfer be processed by the accounts team?",
          JSON.stringify([]),
          "pending",
          true,
          true,
        ]
      )
    }

    // Ticket 4: 100508
    if (!existingCodes.has("100508")) {
      await client.query(
        `INSERT INTO tickets (code, user_id, subject, details, files, status, viewed, client_viewed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours');`,
        [
          "100508",
          "usr_customer_default_01",
          "Wrong color received for Wireless Bluetooth Headphones",
          "I ordered the Matte Black version but received the Silver edition. Here is the invoice and photo of the received box.",
          JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"]),
          "open",
          false,
          true,
        ]
      )
    }

    console.log("✅ Seeded canonical support tickets & replies successfully!")
  } finally {
    await client.end()
  }
}

seedTickets().catch((err) => {
  console.error("Error seeding tickets:", err)
  process.exit(1)
})
