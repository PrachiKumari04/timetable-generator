import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri.endsWith("/timetable")) uri += "/timetable";
    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    const slots = await db.collection("timeslots").find({}).toArray();
    console.log("Total time slots in DB:", slots.length);
    console.log(slots.map(s => ({ id: s.slot_id, day: s.day_of_week, start: s.startTime, end: s.endTime, isBreak: s.isBreak })));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
