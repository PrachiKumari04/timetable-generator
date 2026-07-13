import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const db = mongoose.connection.db;

  const count = await db.collection("rooms").countDocuments({});
  if (count === 0) {
    console.log("Adding mock lab room to bypass frontend/backend constraints...");
    await db.collection("rooms").insertOne({
      room_no: "L 705",
      block: "NORTH",
      isLab: true,
      isActive: true
    });
    console.log("Mock lab room added successfully.");
  } else {
    // Set some rooms to be labs
    console.log("Configuring existing rooms to be lab rooms...");
    await db.collection("rooms").updateMany(
      { room_no: { $in: ["705", "706", "707", "708"] } },
      { $set: { isLab: true } }
    );
    console.log("Lab rooms configured successfully!");
  }
  await mongoose.disconnect();
};

run();
