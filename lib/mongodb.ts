import mongoose from "mongoose"

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

let cached = global.mongooseCache

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI || MONGODB_URI
  if (!uri) {
    console.warn("MONGODB_URI is not configured in .env.local")
    return null
  }

  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000,
    }

    cached!.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (error) {
    cached!.promise = null
    console.warn(
      "MongoDB connection could not be established (using resilient fallback):",
      (error as Error).message
    )
    return null
  }

  return cached!.conn
}

export default connectToDatabase
