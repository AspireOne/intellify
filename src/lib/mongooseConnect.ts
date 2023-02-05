import * as mongoose from "mongoose";


if (!process.env.MONGODB_URI) {
  throw new Error(
      'MONGODB_URI not defined in .env file. Could not create db.'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null }

async function mongooseConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
        .connect(process.env.MONGODB_URI!, {bufferCommands: false})
        .then((mongoose) => mongoose)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default mongooseConnect