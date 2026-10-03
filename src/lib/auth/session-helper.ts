import { headers, cookies } from "next/headers"
import { auth } from "./auth"
import { db } from "@/db"
import { sessions, users } from "@/db/schema/auth"
import { eq, and, gt } from "drizzle-orm"

export interface AppSessionUser {
  id: string
  name: string
  email: string
  role?: string
  phone?: string | null
  avatar?: string | null
  balance?: string | number
}

export interface AppServerSession {
  user: AppSessionUser
  session: {
    id: string
    token: string
    userId: string
    expiresAt: Date
  }
}

/**
 * Resolves current authenticated session with dual-layer verification:
 * 1. Better Auth auth.api.getSession() with request headers.
 * 2. Database fallback: Direct session token lookup in PostgreSQL sessions table if Better Auth signature check fails due to proxy or port headers.
 */
export async function getServerSession(): Promise<AppServerSession | null> {
  // Layer 1: Better Auth native getSession
  try {
    const h = await headers()
    const result = await auth.api.getSession({ headers: h })
    if (result?.user && result?.session) {
      return {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: (result.user as any).role || "customer",
          phone: (result.user as any).phone || null,
          avatar: result.user.image || null,
          balance: (result.user as any).balance || "0.00",
        },
        session: {
          id: result.session.id,
          token: result.session.token,
          userId: result.session.userId,
          expiresAt: result.session.expiresAt,
        },
      }
    }
  } catch {
    // proceed to DB fallback
  }

  // Layer 2: Direct Database Session Lookup from cookie
  try {
    const cookieStore = await cookies()
    const rawCookie = cookieStore.get("better-auth.session_token")?.value
    if (!rawCookie) return null

    // Cookie may be raw token or signed (token.signature)
    const token = decodeURIComponent(rawCookie).split(".")[0]
    if (!token) return null

    const rows = await db
      .select({
        session: sessions,
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
      .limit(1)

    if (rows.length > 0 && rows[0].user) {
      const u = rows[0].user
      const s = rows[0].session
      return {
        user: {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || "customer",
          phone: u.phone || null,
          avatar: u.image || null,
          balance: u.balance || "0.00",
        },
        session: {
          id: s.id,
          token: s.token,
          userId: s.userId,
          expiresAt: s.expiresAt,
        },
      }
    }
  } catch (err) {
    console.error("Database session fallback error:", err)
  }

  return null
}
