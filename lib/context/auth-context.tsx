"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  balance: number
  clubPoints: number
  totalExpenditure: number
  orderedCount: number
}

interface AuthContextType {
  user: UserProfile | null
  isLoggedIn: boolean
  login: (email: string, pass: string) => boolean
  register: (name: string, email: string, pass: string, phone?: string) => boolean
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const DEFAULT_USER: UserProfile = {
  id: "user-1",
  name: "Tanvir Ahmed",
  email: "tanvir@example.com",
  phone: "+880 1712 345678",
  avatar: "/assets/img/avatar-place.png",
  balance: 2500,
  clubPoints: 150,
  totalExpenditure: 8450,
  orderedCount: 4,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("active_ecom_user")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return DEFAULT_USER
        }
      }
    }
    return DEFAULT_USER
  })

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("active_ecom_wishlist")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return ["prod-1", "prod-3"]
        }
      }
    }
    return ["prod-1", "prod-3"]
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem("active_ecom_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("active_ecom_user")
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem("active_ecom_wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const login = (email: string) => {
    const loggedUser: UserProfile = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    }
    setUser(loggedUser)
    return true
  }

  const register = (name: string, email: string, _pass: string, phone?: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || "+880 1700 000000",
      avatar: "/assets/img/avatar-place.png",
      balance: 0,
      clubPoints: 50,
      totalExpenditure: 0,
      orderedCount: 0,
    }
    setUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
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
