import mongoose from "mongoose";
import dotenv from "dotenv";
import { generateSchedule } from "./src/utils/timetableGenerator.js";
dotenv.config();

const test = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const db = mongoose.connection.db;

  const allocations = await db.collection("subjectallocations").find({ semester_id: "S002", academicYear: "2025-2026" }).toArray();
  const rooms = await db.collection("rooms").find({}).toArray();
  const slots = await db.collection("timeslots").find({}).toArray();

  console.log(`Running generator test with ${allocations.length} allocations, ${rooms.length} rooms, ${slots.length} slots...`);
  const result = generateSchedule(allocations, rooms, slots);
  if (result) {
    console.log(`SUCCESS! Generated ${result.length} entries.`);
  } else {
    console.log("FAIL! Generator returned null.");
  }
  await mongoose.disconnect();
};

test();
