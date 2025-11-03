import mongoose from 'mongoose'

// Get connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI

// Check if connection string exists
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local')
}

// Connection function
async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }
  
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default connectDB