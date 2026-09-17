import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB(): Promise<typeof mongoose | null> {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${config.mongodbUri}: ${error.message}`);
    console.warn(`[Database Warning] Operating in fallback database mode for endpoints where DB connection is optional.`);
    return null;
  }
}
