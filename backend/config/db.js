import mongoose from "mongoose";

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
};

export default db;
