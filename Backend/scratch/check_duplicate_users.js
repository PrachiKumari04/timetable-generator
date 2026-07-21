import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const dupes = await db.collection("users").find({ user_id: "STUADT25COMM0873" }).toArray();
    console.log("Duplicate users for STUADT25COMM0873:", dupes);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
