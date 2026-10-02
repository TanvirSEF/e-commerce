"use server"

import { revalidatePath } from "next/cache"
import { addCustomerAddress } from "@/services/customer-extra-service"
import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function createCustomerAddressAction(data: {
  address: string
  country?: string
  city?: string
  state?: string
  postalCode?: string
  phone?: string
  setDefault?: boolean
}) {
  let userId = "usr_customer_default_01"
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      userId = session.user.id
    }
  } catch {
    // fallback
  }

  const result = await addCustomerAddress({
    userId,
    ...data,
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/profile")
  revalidatePath("/checkout")

  return { success: !!result, address: result }
}
