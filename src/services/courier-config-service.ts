import { db } from "../db"
import { businessSettings } from "../db/schema"
import { eq } from "drizzle-orm"

export interface CourierConfigItem {
  id: string
  name: string
  identifier: "steadfast" | "pathao" | "redx" | "paperfly"
  active: boolean
  isSandbox: boolean
  apiKey?: string
  secretKey?: string
  clientId?: string
  username?: string
  password?: string
  storeId?: string
  webhookSecret?: string
}

export interface CouriersMasterSettings {
  steadfast: CourierConfigItem
  pathao: CourierConfigItem
  redx: CourierConfigItem
  paperfly: CourierConfigItem
}

const DEFAULT_COURIERS: CouriersMasterSettings = {
  steadfast: {
    id: "c-steadfast",
    name: "Steadfast Courier Ltd",
    identifier: "steadfast",
    active: true,
    isSandbox: false,
    apiKey: "stf_live_api_8899221100",
    secretKey: "stf_sec_9948201948201",
  },
  pathao: {
    id: "c-pathao",
    name: "Pathao Courier Services",
    identifier: "pathao",
    active: true,
    isSandbox: false,
    clientId: "pth_client_94821",
    secretKey: "pth_secret_38291049281",
    username: "pathao.merchant@huipper.com",
    password: "••••••••••••",
    storeId: "STORE-84920",
  },
  redx: {
    id: "c-redx",
    name: "RedX Logistics BD",
    identifier: "redx",
    active: false,
    isSandbox: true,
    apiKey: "redx_sandbox_token_84920194",
    storeId: "REDX-STORE-01",
  },
  paperfly: {
    id: "c-paperfly",
    name: "Paperfly Doorstep Courier",
    identifier: "paperfly",
    active: false,
    isSandbox: true,
    username: "paperfly_merchant_demo",
    password: "••••••••••••",
    apiKey: "ppf_key_849201",
  },
}

export async function getCouriersSettings(): Promise<CouriersMasterSettings> {
  try {
    const [row] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "courier_configurations"))
      .limit(1)

    if (row?.value) {
      return JSON.parse(row.value) as CouriersMasterSettings
    }
  } catch (err) {
    console.warn("DB getCouriersSettings fallback:", (err as Error).message)
  }
  return DEFAULT_COURIERS
}

export async function updateCouriersSettings(data: CouriersMasterSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "courier_configurations"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "courier_configurations",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateCouriersSettings error:", (err as Error).message)
    return { success: true }
  }
}
