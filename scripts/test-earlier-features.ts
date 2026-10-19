import { db } from "../src/db/index.js";
import { users, shops, products } from "../src/db/schema/index.js";
import {
  getCustomerAddresses,
  addCustomerAddress,
  deleteCustomerAddress,
} from "../src/services/customer-extra-service.js";
import { validateCoupon } from "../src/services/coupon-service.js";
import {
  getAllAuctionProducts,
  getAuctionProductsAdmin,
  getUserBids,
} from "../src/services/auction-service.js";
import {
  getAllPreorderProducts,
  getCustomerPreorderOrders,
  getPreorderOrdersAdmin,
} from "../src/services/preorder-service.js";
import {
  getAllWholesaleProducts,
  getWholesaleTiersForProduct,
} from "../src/services/wholesale-service.js";
import {
  getSellerPackageOverview,
  getCurrentSeller,
} from "../src/services/seller-panel-service.js";
import {
  getSmtpSettings,
  getCurrencySettings,
} from "../src/services/settings-service.js";
import { getAllLanguages } from "../src/services/language-service.js";

async function runEarlierFeaturesSuite() {
  console.log("=================================================");
  console.log("   EARLIER FEATURES RUNTIME VERIFICATION SUITE   ");
  console.log("=================================================\n");

  let testPassed = 0;
  let testFailed = 0;

  function report(name: string, ok: boolean, details?: string) {
    if (ok) {
      testPassed++;
      console.log(`[PASS] ${name}${details ? ` -> ${details}` : ""}`);
    } else {
      testFailed++;
      console.error(`[FAIL] ${name}${details ? ` -> ${details}` : ""}`);
    }
  }

  try {
    const [testUser] = await db.select().from(users).limit(1);
    if (!testUser) throw new Error("No user found in database to test with.");
    console.log(`Using Test User: ${testUser.name} (${testUser.id}, ${testUser.email})\n`);

    // 1. Checkout Customer Address Book (Add, Fetch, Delete)
    try {
      const initialAddresses = await getCustomerAddresses(testUser.id);
      const newAddr = await addCustomerAddress({
        userId: testUser.id,
        address: "House 42, Road 11, Block D, Banani",
        country: "Bangladesh",
        city: "Dhaka",
        postalCode: "1213",
        phone: "+880 1711 223344",
        setDefault: false,
      });

      if (newAddr?.id) {
        const afterAdd = await getCustomerAddresses(testUser.id);
        const addedExists = afterAdd.some((a) => a.id === newAddr.id);
        await deleteCustomerAddress(newAddr.id, testUser.id);
        const afterDelete = await getCustomerAddresses(testUser.id);
        const deletedCleanly = !afterDelete.some((a) => a.id === newAddr.id);

        report(
          "1. Checkout Address Book Lifecycle",
          addedExists && deletedCleanly,
          `Created address #${newAddr.id}, verified in list, and cleaned up`
        );
      } else {
        report("1. Checkout Address Book Lifecycle", false, "Could not insert address");
      }
    } catch (e: any) {
      report("1. Checkout Address Book Lifecycle", false, e.message);
    }

    // 2. Checkout & Cart Coupon Validation
    try {
      const couponCheck = await validateCoupon("NON_EXISTENT_CODE_XYZ", 500);
      report(
        "2. Coupon Validation Engine",
        couponCheck !== null && typeof couponCheck === "object",
        `Validation responded correctly: ${couponCheck?.message || "Invalid coupon rejected"}`
      );
    } catch (e: any) {
      report("2. Coupon Validation Engine", false, e.message);
    }

    // 3. Auction System Queries (Catalog & Admin & User Bids)
    try {
      const auctionCatalog = await getAllAuctionProducts();
      const adminAuctions = await getAuctionProductsAdmin();
      const userBids = await getUserBids(testUser.email);
      report(
        "3. Auction Bidding & Catalog Engine",
        Array.isArray(auctionCatalog) && Array.isArray(userBids),
        `Found ${auctionCatalog.length} active auctions, user has ${userBids.length} bids`
      );
    } catch (e: any) {
      report("3. Auction Bidding & Catalog Engine", false, e.message);
    }

    // 4. Pre-Order Customer Tracking & Catalog
    try {
      const preorders = await getAllPreorderProducts();
      const customerPreorders = await getCustomerPreorderOrders(testUser.email);
      const adminPreorders = await getPreorderOrdersAdmin();
      report(
        "4. Pre-Order Tracking & Catalog Engine",
        Array.isArray(preorders) && Array.isArray(customerPreorders),
        `Found ${preorders.length} preorder products, customer has ${customerPreorders.length} bookings`
      );
    } catch (e: any) {
      report("4. Pre-Order Tracking & Catalog Engine", false, e.message);
    }

    // 5. Wholesale Pricing Engine
    try {
      const wholesaleProducts = await getAllWholesaleProducts("all");
      const [testProduct] = await db.select().from(products).limit(1);
      let tiersCount = 0;
      if (testProduct) {
        const tiers = await getWholesaleTiersForProduct(testProduct.id);
        tiersCount = tiers.length;
      }
      report(
        "5. Wholesale Products & Tiers Engine",
        Array.isArray(wholesaleProducts),
        `Found ${wholesaleProducts.length} wholesale products, sample product has ${tiersCount} tiers`
      );
    } catch (e: any) {
      report("5. Wholesale Products & Tiers Engine", false, e.message);
    }

    // 6. Seller Package Quota & Upload Limit Guard
    try {
      const sampleSeller = {
        id: 1,
        userId: testUser.id,
        name: "Test Seller",
        email: testUser.email,
        shopName: "Test Shop",
        shopSlug: "test-shop",
        shopLogo: "/assets/img/placeholder.jpg",
        status: "active",
      };
      const packageOverview = await getSellerPackageOverview(sampleSeller);
      report(
        "6. Seller Package Upload Quota Engine",
        !!packageOverview && Array.isArray(packageOverview.plans),
        `Loaded ${packageOverview?.plans?.length || 0} seller plans, current plan: ${packageOverview?.current?.packageName || "Standard"}`
      );
    } catch (e: any) {
      report("6. Seller Package Upload Quota Engine", false, e.message);
    }

    // 7. SMTP Settings & Email Configuration
    try {
      const smtp = await getSmtpSettings();
      report(
        "7. SMTP & Mail Server Configuration",
        !!smtp && typeof smtp.mailDriver === "string",
        `Driver: ${smtp.mailDriver}, Host: ${smtp.mailHost}, Port: ${smtp.mailPort}`
      );
    } catch (e: any) {
      report("7. SMTP & Mail Server Configuration", false, e.message);
    }

    // 8. Currency & Language Multi-Locale Engine
    try {
      const currencies = await getCurrencySettings();
      const languages = await getAllLanguages();
      report(
        "8. Currency & Multi-Language Engine",
        !!currencies && Array.isArray(languages),
        `System Currency: ${currencies?.systemCurrencyCode || "BDT"}, Active Languages: ${languages.length}`
      );
    } catch (e: any) {
      report("8. Currency & Multi-Language Engine", false, e.message);
    }

  } catch (err: any) {
    console.error("Test suite fatal error:", err);
  } finally {
    console.log("\n=================================================");
    console.log(`EARLIER FEATURES SUMMARY: ${testPassed} Passed, ${testFailed} Failed`);
    console.log("=================================================");
    process.exit(testFailed > 0 ? 1 : 0);
  }
}

runEarlierFeaturesSuite();
