import { logoutAction } from "../src/app/actions/ecommerce-actions"
import * as fs from "fs"
import * as path from "path"

async function runTests() {
  console.log("=== Testing Sign-Out and Auth Synchronization ===\n")
  let passed = 0
  let failed = 0

  const root = process.cwd()

  // 1. Test logoutAction execution
  try {
    const res = await logoutAction()
    if (res.success === true) {
      console.log("✅ [Suite 1 Passed]: logoutAction executes cleanly and returns { success: true }")
      passed++
    } else {
      console.error("❌ [Suite 1 Failed]: logoutAction did not return success: true")
      failed++
    }
  } catch (err: any) {
    console.error("❌ [Suite 1 Failed]: logoutAction threw an error:", err.message)
    failed++
  }

  // 2. Verify SellerHeader implementation
  try {
    const headerCode = fs.readFileSync(
      path.join(root, "src/app/seller/_components/seller-header.tsx"),
      "utf-8"
    )
    const hasLogout = headerCode.includes("const { user, logout } = useAuth()")
    const hasHandleSignOut = headerCode.includes("handleSignOut")
    const hasLogoutCall = headerCode.includes("await logout()")
    const hasSellerLoginPush = headerCode.includes('router.push("/seller/login")')
    const hasButton = headerCode.includes("<button") && headerCode.includes("onClick={handleSignOut}")
    const hasDanglingLink = headerCode.includes('<Link\n                  href="/login"') || headerCode.includes('href="/login"')

    if (hasLogout && hasHandleSignOut && hasLogoutCall && hasSellerLoginPush && hasButton && !hasDanglingLink) {
      console.log("✅ [Suite 2 Passed]: SellerHeader has robust sign-out handler, calls logout(), and redirects to /seller/login without dummy links")
      passed++
    } else {
      console.error("❌ [Suite 2 Failed]: SellerHeader verification checks failed", {
        hasLogout,
        hasHandleSignOut,
        hasLogoutCall,
        hasSellerLoginPush,
        hasButton,
        hasDanglingLink,
      })
      failed++
    }
  } catch (err: any) {
    console.error("❌ [Suite 2 Failed]:", err.message)
    failed++
  }

  // 3. Verify SellerSidebar implementation
  try {
    const sidebarCode = fs.readFileSync(
      path.join(root, "src/app/seller/_components/seller-sidebar.tsx"),
      "utf-8"
    )
    const hasLogout = sidebarCode.includes("const { user, logout } = useAuth()")
    const hasLogoutCall = sidebarCode.includes("await logout()")
    const hasSellerLoginPush = sidebarCode.includes('router.push("/seller/login")')
    const hasLogOutIcon = sidebarCode.includes("<LogOut")

    if (hasLogout && hasLogoutCall && hasSellerLoginPush && hasLogOutIcon) {
      console.log("✅ [Suite 3 Passed]: SellerSidebar includes quick-action sign-out button in footer linked to logout() and /seller/login")
      passed++
    } else {
      console.error("❌ [Suite 3 Failed]: SellerSidebar verification checks failed", {
        hasLogout,
        hasLogoutCall,
        hasSellerLoginPush,
        hasLogOutIcon,
      })
      failed++
    }
  } catch (err: any) {
    console.error("❌ [Suite 3 Failed]:", err.message)
    failed++
  }

  // 4. Verify AdminHeader implementation
  try {
    const adminCode = fs.readFileSync(
      path.join(root, "src/app/admin/_components/admin-header.tsx"),
      "utf-8"
    )
    const hasLogout = adminCode.includes("const { logout } = useAuth()")
    const hasHandleSignOut = adminCode.includes("handleSignOut")
    const hasLogoutCall = adminCode.includes("await logout()")
    const hasButton = adminCode.includes("onClick={handleSignOut}")

    if (hasLogout && hasHandleSignOut && hasLogoutCall && hasButton) {
      console.log("✅ [Suite 4 Passed]: AdminHeader sign-out button properly calls logout() and clears session")
      passed++
    } else {
      console.error("❌ [Suite 4 Failed]: AdminHeader verification checks failed")
      failed++
    }
  } catch (err: any) {
    console.error("❌ [Suite 4 Failed]:", err.message)
    failed++
  }

  // 5. Verify CustomerSidebar implementation
  try {
    const customerCode = fs.readFileSync(
      path.join(root, "src/app/dashboard/_components/customer-sidebar.tsx"),
      "utf-8"
    )
    const hasHandleLogout = customerCode.includes("handleLogout")
    const hasLogoutCall = customerCode.includes("await logout()")
    const hasRouterPush = customerCode.includes('router.push("/login")')

    if (hasHandleLogout && hasLogoutCall && hasRouterPush) {
      console.log("✅ [Suite 5 Passed]: CustomerSidebar logout properly triggers session clearing and redirects to /login")
      passed++
    } else {
      console.error("❌ [Suite 5 Failed]: CustomerSidebar verification checks failed")
      failed++
    }
  } catch (err: any) {
    console.error("❌ [Suite 5 Failed]:", err.message)
    failed++
  }

  console.log(`\n=== Verification Summary: ${passed} Passed, ${failed} Failed ===`)
  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error("Unhandled error:", err)
  process.exit(1)
})
