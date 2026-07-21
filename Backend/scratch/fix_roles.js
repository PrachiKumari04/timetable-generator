import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const res = await db.collection("users").updateMany(
      { student_id: { $ne: null } },
      { $set: { role: "student" } }
    );

    console.log("Updated student roles count:", res.modifiedCount);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
