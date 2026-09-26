"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role?: string
  balance: number
  clubPoints: number
  totalExpenditure: number
  orderedCount: number
}

interface AuthContextType {
  user: UserProfile | null
  isLoggedIn: boolean
  login: (
    email: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string; redirectTo?: string }>
  register: (
    name: string,
    email: string,
    pass: string,
    phone?: string,
    role?: string
  ) => Promise<{ success: boolean; error?: string; redirectTo?: string }>
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const DEFAULT_USER: UserProfile = {
  id: "KwW4ouMKmddUC1gCocRkRSTIxfzomx4k",
  name: "Tanvir Ahmed",
  email: "tanvir@example.com",
  phone: "+880 1712 345678",
  avatar: "/assets/img/avatar-place.png",
  role: "customer",
  balance: 2500,
  clubPoints: 150,
  totalExpenditure: 8450,
  orderedCount: 4,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const isInitialized = React.useRef(false)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("active_ecom_user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      const storedWishlist = localStorage.getItem("active_ecom_wishlist")
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist))
      }
    } catch {
      // ignore
    }
    isInitialized.current = true
  }, [])

  useEffect(() => {
    if (isInitialized.current) {
      if (user) {
        localStorage.setItem("active_ecom_user", JSON.stringify(user))
      } else {
        localStorage.removeItem("active_ecom_user")
      }
    }
  }, [user])

  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem("active_ecom_wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist])

  const login = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    try {
      const { loginAction } = await import("@/app/actions/ecommerce-actions")
      const result = await loginAction({ email, password: pass })

      if (result.success && result.user) {
        const loggedUser: UserProfile = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone || "+880 1700 000000",
          avatar: result.user.avatar || "/assets/img/avatar-place.png",
          role: result.user.role || "customer",
          balance: result.user.balance || 0,
          clubPoints: 150,
          totalExpenditure: 8450,
          orderedCount: 4,
        }
        setUser(loggedUser)
        return { success: true, redirectTo: result.redirectTo }
      }

      return { success: false, error: result.error || "Invalid credentials." }
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed. Please try again." }
    }
  }

  const register = async (
    name: string,
    email: string,
    pass: string,
    phone?: string,
    role: string = "customer"
  ): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    try {
      const { registerAction } = await import("@/app/actions/ecommerce-actions")
      const result = await registerAction({
        name,
        email,
        password: pass,
        phone,
        role,
      })

      if (result.success && result.user) {
        const newUser: UserProfile = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone || phone || "+880 1700 000000",
          avatar: "/assets/img/avatar-place.png",
          role: result.user.role || role,
          balance: 0,
          clubPoints: 50,
          totalExpenditure: 0,
          orderedCount: 0,
        }
        setUser(newUser)
        return { success: true, redirectTo: result.redirectTo }
      }

      return { success: false, error: result.error || "Registration failed." }
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed. Please try again." }
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("active_ecom_user")
    }
  }

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null))
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const isInWishlist = (productId: string) => wishlist.includes(productId)

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        login,
        register,
        logout,
        updateProfile,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
