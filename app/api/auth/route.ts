import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import UserModel from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, name, phone } = body

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "Email and password are required." },
          { status: 400 }
        )
      }

      // Check DB if available
      try {
        const conn = await connectToDatabase()
        if (conn) {
          const user = await UserModel.findOne({ email: email.toLowerCase() })
          if (user) {
            return NextResponse.json({
              success: true,
              message: "Login successful",
              user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone || "+880 1700 000000",
                avatar: user.avatar || "/assets/img/avatar-place.png",
                balance: user.balance || 0,
                clubPoints: 150,
                totalExpenditure: 8450,
                orderedCount: 4,
              },
            })
          }
        }
      } catch (err) {
        console.warn("DB login error, falling back to simulated auth:", (err as Error).message)
      }

      // Default mock login fallback
      return NextResponse.json({
        success: true,
        message: "Login successful (local session)",
        user: {
          id: "user-1",
          name: email.split("@")[0].toUpperCase() || "Tanvir Ahmed",
          email: email.toLowerCase(),
          phone: "+880 1712 345678",
          avatar: "/assets/img/avatar-place.png",
          balance: 2500,
          clubPoints: 150,
          totalExpenditure: 8450,
          orderedCount: 4,
        },
      })
    }

    if (action === "register") {
      if (!name || !email) {
        return NextResponse.json(
          { success: false, error: "Name and email are required." },
          { status: 400 }
        )
      }

      try {
        const conn = await connectToDatabase()
        if (conn) {
          const existing = await UserModel.findOne({ email: email.toLowerCase() })
          if (existing) {
            return NextResponse.json(
              { success: false, error: "An account with this email already exists." },
              { status: 409 }
            )
          }

          const newUser = await UserModel.create({
            name,
            email: email.toLowerCase(),
            phone: phone || "+880 1700 000000",
            password: password || "secured_hash",
            user_type: "customer",
            avatar: "/assets/img/avatar-place.png",
            balance: 0,
          })

          return NextResponse.json({
            success: true,
            message: "Registration successful!",
            user: {
              id: newUser._id.toString(),
              name: newUser.name,
              email: newUser.email,
              phone: newUser.phone,
              avatar: newUser.avatar,
              balance: 0,
              clubPoints: 0,
              totalExpenditure: 0,
              orderedCount: 0,
            },
          })
        }
      } catch (err) {
        console.warn("DB register error, using simulated registration:", (err as Error).message)
      }

      return NextResponse.json({
        success: true,
        message: "Registration successful!",
        user: {
          id: `user-${Date.now()}`,
          name,
          email: email.toLowerCase(),
          phone: phone || "+880 1700 000000",
          avatar: "/assets/img/avatar-place.png",
          balance: 0,
          clubPoints: 0,
          totalExpenditure: 0,
          orderedCount: 0,
        },
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
