// Import mongoose for MongoDB connection
import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 * This function handles the database connection with error handling
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// ✅ Changed from module.exports to export default
export default connectDB;