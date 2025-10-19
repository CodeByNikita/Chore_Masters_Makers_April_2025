// dbConnection.ts
import mongoose from "mongoose";

let isConnected = false;

const connectToDatabase = async (customUri?: string) => {
  const mongoDbUrl = customUri || process.env.MONGODB_URL;

  if (!mongoDbUrl) {
    console.error("No MongoDB url provided.");
    throw new Error("No connection string provided");
  }

  if (isConnected) return;

  await mongoose.connect(mongoDbUrl);
  isConnected = true;

  if (process.env.NODE_ENV !== "test") {
    console.log("Successfully connected to MongoDB");
  }
};

export default connectToDatabase;
