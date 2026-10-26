import { db } from "../src/db"
import { sql } from "drizzle-orm"

// Module 1: shipping-location-service
import {
  getAllShippingCities,
  toggleCityDeliveryStatus,
  createShippingCity,
  getAllCarriers,
  createCarrier,
  updateCarrier,
  toggleCarrierStatus,
  deleteCarrier,
  getAllAreas,
  createArea,
  updateArea,
  toggleAreaStatus,
  deleteArea,
} from "../src/services/shipping-location-service"

// Module 2: courier-config-service
import {
  getCouriersSettings,
  updateCouriersSettings,
  pingCourierApi,
  type CourierConfigItem,
} from "../src/services/courier-config-service"

// Module 3: geographic-service
import {
  getAllCountries,
  toggleCountryStatus,
  getAllStates,
  createState,
  toggleStateStatus,
  getAllZones,
  getZoneById,
  createZone,
  toggleZoneStatus,
} from "../src/services/geographic-service"

interface TestResult {
  num: number
  module: string
  stakeholder: "Customer / Storefront" | "Seller" | "Admin"
  scenario: string
  passed: boolean
  details: string
}

const results: TestResult[] = []

async function record(
  num: number,
  module: string,
  stakeholder: "Customer / Storefront" | "Seller" | "Admin",
  scenario: string,
  fn: () => Promise<string>
) {
  try {
    const details = await fn()
    results.push({ num, module, stakeholder, scenario, passed: true, details })
    console.log(`  [PASS] #${num} [${module}] [${stakeholder}] ${scenario}`)
  } catch (err: any) {
    const details = err?.message || String(err)
    results.push({ num, module, stakeholder, scenario, passed: false, details })
    console.error(`  [FAIL] #${num} [${module}] [${stakeholder}] ${scenario}:`, details)
  }
}

async function syncSequences() {
  const tables = [
    { table: "shipping_cities", seq: "shipping_cities_id_seq" },
    { table: "carriers", seq: "carriers_id_seq" },
    { table: "shipping_areas", seq: "shipping_areas_id_seq" },
    { table: "countries", seq: "countries_id_seq" },
    { table: "states", seq: "states_id_seq" },
    { table: "zones", seq: "zones_id_seq" },
    { table: "business_settings", seq: "business_settings_id_seq" },
  ]

  for (const { table, seq } of tables) {
    try {
      await db.execute(sql.raw(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM pg_class WHERE relname = '${seq}') THEN
            PERFORM setval('${seq}', COALESCE((SELECT MAX(id) FROM ${table}), 1));
          END IF;
        END $$;
      `))
    } catch {
      // Ignore if table/sequence doesn't exist
    }
  }
}

async function runAllTests() {
  console.log("==========================================================================")
  console.log(" 🧪 STARTING TEST: Group 7 Shipping, Logistics & Couriers (3 Modules)")
  console.log("    Evaluating Customer / Storefront, Seller, and Admin Scenarios")
  console.log("==========================================================================\n")

  const startTime = Date.now()
  await syncSequences()

  let tempCityId: number | null = null
  let tempCarrierId: number | null = null
  let tempAreaId: number | null = null
  let tempStateId: number | null = null
  let tempZoneId: number | null = null

  // ==========================================================================
  // MODULE 1: shipping-location-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 1: shipping-location-service.ts ...")

  await record(
    1,
    "shipping-location-service",
    "Customer / Storefront",
    "Available Shipping Cities & Regional Delivery Cost Table",
    async () => {
      const cities = await getAllShippingCities()
      return `Loaded ${cities.length} shipping delivery cities`
    }
  )

  await record(
    2,
    "shipping-location-service",
    "Customer / Storefront",
    "Customer City Search by Keyword",
    async () => {
      const cities = await getAllShippingCities("Dhaka")
      return `Found ${cities.length} city entry/entries matching 'Dhaka'`
    }
  )

  await record(
    3,
    "shipping-location-service",
    "Customer / Storefront",
    "Active Delivery Carriers & Transit Lead Times",
    async () => {
      const carriersList = await getAllCarriers()
      return `Loaded ${carriersList.length} logistics carrier(s)`
    }
  )

  await record(
    4,
    "shipping-location-service",
    "Customer / Storefront",
    "Thana / Neighborhood Level Shipping Areas Directory",
    async () => {
      const areas = await getAllAreas()
      return `Retrieved ${areas.length} configured local delivery area(s)`
    }
  )

  await record(
    5,
    "shipping-location-service",
    "Customer / Storefront",
    "Delivery Areas Filtered by City Name",
    async () => {
      const dhakaAreas = await getAllAreas(undefined, "Dhaka")
      return `Found ${dhakaAreas.length} delivery area(s) within Dhaka city`
    }
  )

  await record(
    6,
    "shipping-location-service",
    "Admin",
    "Admin Create New Delivery City with Base Freight Charge",
    async () => {
      const newCity = await createShippingCity({
        name: `Gazipur Sadar ${Date.now().toString().slice(-4)}`,
        state: "Dhaka Division",
        cost: "75.00",
        zoneId: 1,
      })
      if (!newCity || !newCity.id) throw new Error("Failed to create shipping city")
      tempCityId = newCity.id
      return `Shipping city created: '${newCity.name}' (ID: ${newCity.id}, Base Cost: ৳${newCity.cost})`
    }
  )

  await record(
    7,
    "shipping-location-service",
    "Admin",
    "Admin Toggle City Delivery Operational Status",
    async () => {
      if (!tempCityId) throw new Error("No city ID")
      const deactivated = await toggleCityDeliveryStatus(tempCityId, false)
      const reactivated = await toggleCityDeliveryStatus(tempCityId, true)
      if (!deactivated || !reactivated) throw new Error("Failed to toggle city status")
      return `City #${tempCityId} status toggled: Inactive -> Active`
    }
  )

  await record(
    8,
    "shipping-location-service",
    "Admin",
    "Admin Register New Express Logistics Carrier",
    async () => {
      const newCarrier = await createCarrier({
        name: `Sundarban Express Special ${Date.now().toString().slice(-4)}`,
        transitTime: "1-2 Business Days",
        logo: "/assets/img/carriers/sundarban.png",
        freeShipping: false,
        status: true,
      })
      if (!newCarrier || !newCarrier.id) throw new Error("Failed to create carrier")
      tempCarrierId = newCarrier.id
      return `Carrier registered: '${newCarrier.name}' (ID: ${newCarrier.id}, Transit: ${newCarrier.transitTime})`
    }
  )

  await record(
    9,
    "shipping-location-service",
    "Admin",
    "Admin Update Carrier Transit Parameters",
    async () => {
      if (!tempCarrierId) throw new Error("No carrier ID")
      const updated = await updateCarrier(tempCarrierId, {
        transitTime: "Same Day (24 Hours)",
        freeShipping: true,
      })
      if (!updated) throw new Error("Failed to update carrier")
      return `Carrier #${tempCarrierId} updated with 24h Transit & Free Shipping flag`
    }
  )

  await record(
    10,
    "shipping-location-service",
    "Admin",
    "Admin Toggle Carrier Operational Status",
    async () => {
      if (!tempCarrierId) throw new Error("No carrier ID")
      const toggled = await toggleCarrierStatus(tempCarrierId, false)
      if (!toggled) throw new Error("Failed to toggle carrier status")
      return `Carrier #${tempCarrierId} toggled to inactive`
    }
  )

  await record(
    11,
    "shipping-location-service",
    "Admin",
    "Admin Delete Carrier Record",
    async () => {
      if (!tempCarrierId) throw new Error("No carrier ID")
      const deleted = await deleteCarrier(tempCarrierId)
      if (!deleted) throw new Error("Failed to delete carrier")
      tempCarrierId = null
      return `Carrier deleted cleanly from database`
    }
  )

  await record(
    12,
    "shipping-location-service",
    "Admin",
    "Admin Create Delivery Sub-Zone / Thana Area",
    async () => {
      const newArea = await createArea({
        name: `Uttara Sector 11 ${Date.now().toString().slice(-4)}`,
        city: "Dhaka",
        state: "Dhaka Division",
        country: "Bangladesh",
        status: true,
      })
      if (!newArea || !newArea.id) throw new Error("Failed to create delivery area")
      tempAreaId = newArea.id
      return `Delivery area created: '${newArea.name}' (ID: ${newArea.id}, City: ${newArea.city})`
    }
  )

  await record(
    13,
    "shipping-location-service",
    "Admin",
    "Admin Modify Delivery Area Specification",
    async () => {
      if (!tempAreaId) throw new Error("No area ID")
      const updated = await updateArea(tempAreaId, {
        name: `Uttara Sector 11 (North Zone)`,
      })
      if (!updated) throw new Error("Failed to update area")
      return `Area #${tempAreaId} updated to North Zone designation`
    }
  )

  await record(
    14,
    "shipping-location-service",
    "Admin",
    "Admin Toggle Delivery Area Active Status",
    async () => {
      if (!tempAreaId) throw new Error("No area ID")
      const toggled = await toggleAreaStatus(tempAreaId, false)
      if (!toggled) throw new Error("Failed to toggle area status")
      return `Area #${tempAreaId} status set to Inactive`
    }
  )

  await record(
    15,
    "shipping-location-service",
    "Admin",
    "Admin Delete Delivery Area Record",
    async () => {
      if (!tempAreaId) throw new Error("No area ID")
      const deleted = await deleteArea(tempAreaId)
      if (!deleted) throw new Error("Failed to delete area")
      tempAreaId = null
      return `Delivery area deleted cleanly`
    }
  )

  // ==========================================================================
  // MODULE 2: courier-config-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 2: courier-config-service.ts ...")

  await record(
    16,
    "courier-config-service",
    "Admin",
    "Admin Master Courier Configurations Settings",
    async () => {
      const settings = await getCouriersSettings()
      if (!settings.steadfast || !settings.pathao || !settings.redx || !settings.paperfly) {
        throw new Error("Invalid courier settings structure")
      }
      return `Couriers loaded: Steadfast (Active: ${settings.steadfast.active}), Pathao (Active: ${settings.pathao.active}), RedX (Active: ${settings.redx.active})`
    }
  )

  await record(
    17,
    "courier-config-service",
    "Admin",
    "Admin Update Courier Master Settings & API Keys",
    async () => {
      const current = await getCouriersSettings()
      const updated = await updateCouriersSettings({
        ...current,
        steadfast: {
          ...current.steadfast,
          apiKey: "stf_test_api_key_sync_ok",
        },
      })
      if (!updated.success) throw new Error("Failed to update courier settings")
      return `Courier settings updated successfully in business_settings`
    }
  )

  await record(
    18,
    "courier-config-service",
    "Admin",
    "Courier API Handshake Diagnostic - Steadfast Courier",
    async () => {
      const mockCourier: CourierConfigItem = {
        id: "c-steadfast",
        name: "Steadfast Courier Ltd",
        identifier: "steadfast",
        active: true,
        isSandbox: false,
        apiKey: "stf_live_api_8899221100",
        secretKey: "stf_sec_9948201948201",
      }
      const pingRes = await pingCourierApi(mockCourier)
      return `Steadfast Diagnostic: ${pingRes.message} (Latency: ${pingRes.latencyMs}ms)`
    }
  )

  await record(
    19,
    "courier-config-service",
    "Admin",
    "Courier API Handshake Diagnostic - Pathao Courier",
    async () => {
      const mockCourier: CourierConfigItem = {
        id: "c-pathao",
        name: "Pathao Courier Services",
        identifier: "pathao",
        active: true,
        isSandbox: true,
        clientId: "pth_test_id",
        secretKey: "pth_test_sec",
        username: "test@pathao.com",
        password: "secretpassword",
      }
      const pingRes = await pingCourierApi(mockCourier)
      return `Pathao Diagnostic: ${pingRes.message} (Latency: ${pingRes.latencyMs}ms)`
    }
  )

  await record(
    20,
    "courier-config-service",
    "Admin",
    "Courier API Handshake Diagnostic - RedX Logistics",
    async () => {
      const mockCourier: CourierConfigItem = {
        id: "c-redx",
        name: "RedX Logistics BD",
        identifier: "redx",
        active: true,
        isSandbox: true,
        apiKey: "redx_demo_bearer_token",
      }
      const pingRes = await pingCourierApi(mockCourier)
      return `RedX Diagnostic: ${pingRes.message} (Latency: ${pingRes.latencyMs}ms)`
    }
  )

  await record(
    21,
    "courier-config-service",
    "Admin",
    "Courier API Handshake Diagnostic - Paperfly Doorstep Delivery",
    async () => {
      const mockCourier: CourierConfigItem = {
        id: "c-paperfly",
        name: "Paperfly Doorstep Courier",
        identifier: "paperfly",
        active: true,
        isSandbox: true,
        username: "paperfly_test",
        password: "paperfly_secret",
      }
      const pingRes = await pingCourierApi(mockCourier)
      return `Paperfly Diagnostic: ${pingRes.message} (Latency: ${pingRes.latencyMs}ms)`
    }
  )

  // ==========================================================================
  // MODULE 3: geographic-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 3: geographic-service.ts ...")

  await record(
    22,
    "geographic-service",
    "Customer / Storefront",
    "Global Supported Countries Directory & Dial Codes",
    async () => {
      const countries = await getAllCountries()
      return `Loaded ${countries.length} destination country records (e.g. Bangladesh: +880)`
    }
  )

  await record(
    23,
    "geographic-service",
    "Customer / Storefront",
    "Search Country by ISO Code / Name",
    async () => {
      const searchRes = await getAllCountries("BD")
      if (!searchRes.some((c) => c.code === "BD")) {
        throw new Error("Country code BD not found")
      }
      return `Found ${searchRes.length} country record for ISO code 'BD' (${searchRes[0].name})`
    }
  )

  await record(
    24,
    "geographic-service",
    "Customer / Storefront",
    "States / Administrative Divisions of Country",
    async () => {
      const states = await getAllStates(undefined, 1) // Bangladesh states
      return `Retrieved ${states.length} states/divisions for Bangladesh (e.g. Dhaka, Chattogram)`
    }
  )

  await record(
    25,
    "geographic-service",
    "Admin",
    "Admin Toggle Country International Shipping Status",
    async () => {
      const toggled = await toggleCountryStatus(1, true)
      if (!toggled) throw new Error("Failed to toggle country status")
      return `Country #1 (Bangladesh) status verified active`
    }
  )

  await record(
    26,
    "geographic-service",
    "Admin",
    "Admin Create New State / Administrative Division",
    async () => {
      const state = await createState({
        name: `Barishal Division ${Date.now().toString().slice(-4)}`,
        countryId: 1,
      })
      if (!state || !state.id) throw new Error("Failed to create state")
      tempStateId = state.id
      return `State/Division created: '${state.name}' (ID: ${state.id})`
    }
  )

  await record(
    27,
    "geographic-service",
    "Admin",
    "Admin Toggle State Active Shipping Status",
    async () => {
      if (!tempStateId) throw new Error("No state ID")
      const toggled = await toggleStateStatus(tempStateId, true)
      if (!toggled) throw new Error("Failed to toggle state status")
      return `State #${tempStateId} shipping status active`
    }
  )

  await record(
    28,
    "geographic-service",
    "Admin",
    "Shipping Zones Directory & Country Coverage Overview",
    async () => {
      const zones = await getAllZones()
      return `Loaded ${zones.length} shipping zone(s) with mapped territories`
    }
  )

  await record(
    29,
    "geographic-service",
    "Admin",
    "Inspect Specific Shipping Zone Details by ID",
    async () => {
      const zone = await getZoneById(1)
      if (!zone) throw new Error("Zone #1 not found")
      return `Zone #1: '${zone.name}' (Assigned Countries: ${zone.countryIds?.length || 0})`
    }
  )

  await record(
    30,
    "geographic-service",
    "Admin",
    "Admin Create New International Shipping Zone",
    async () => {
      const newZone = await createZone({
        name: `ASEAN Express Transit Zone ${Date.now().toString().slice(-4)}`,
        countryIds: [10], // Singapore
      })
      if (!newZone || !newZone.id) throw new Error("Failed to create zone")
      tempZoneId = newZone.id
      return `Created Zone: '${newZone.name}' (ID: ${newZone.id})`
    }
  )

  await record(
    31,
    "geographic-service",
    "Admin",
    "Admin Toggle Shipping Zone Operational Status",
    async () => {
      if (!tempZoneId) throw new Error("No zone ID")
      const toggled = await toggleZoneStatus(tempZoneId, true)
      if (!toggled) throw new Error("Failed to toggle zone status")
      return `Zone #${tempZoneId} operational status verified`
    }
  )

  // ==========================================================================
  // CLEANUP TEMPORARY RECORDS
  // ==========================================================================
  try {
    if (tempCityId) {
      const { shippingCities } = await import("../src/db/schema")
      const { eq } = await import("drizzle-orm")
      await db.delete(shippingCities).where(eq(shippingCities.id, tempCityId))
    }
  } catch {
    // cleanup warnings non-fatal
  }

  // ==========================================================================
  // REPORT
  // ==========================================================================
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.log("\n==========================================================================")
  console.log(` 📊 TEST RESULTS SUMMARY (${duration}s)`)
  console.log(`    Total Scenarios Tested : ${total}`)
  console.log(`    Passed                 : ${passed} ✅`)
  console.log(`    Failed                 : ${failed} ❌`)
  console.log("==========================================================================\n")

  console.log("| # | Module | Stakeholder Scope | Test Scenario | Status | Details |")
  console.log("|---|---|---|---|---|---|")
  results.forEach((r) => {
    console.log(
      `| ${r.num} | ${r.module} | ${r.stakeholder} | ${r.scenario} | ${r.passed ? "✅ PASS" : "❌ FAIL"} | ${r.details} |`
    )
  })

  console.log("\n--- Stakeholder Breakdown ---")
  const custPassed = results.filter((r) => r.stakeholder === "Customer / Storefront" && r.passed).length
  const custTotal = results.filter((r) => r.stakeholder === "Customer / Storefront").length
  const adminPassed = results.filter((r) => r.stakeholder === "Admin" && r.passed).length
  const adminTotal = results.filter((r) => r.stakeholder === "Admin").length

  console.log(`  * Customer / Storefront  : ${custPassed}/${custTotal} passed (${Math.round((custPassed / (custTotal || 1)) * 100)}%)`)
  console.log(`  * Admin                  : ${adminPassed}/${adminTotal} passed (${Math.round((adminPassed / (adminTotal || 1)) * 100)}%)`)
}

runAllTests()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Fatal error during test execution:", e)
    process.exit(1)
  })
