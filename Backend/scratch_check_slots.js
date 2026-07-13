import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const slots = await mongoose.connection.db.collection("timeslots").find({}).toArray();
  console.log("Slots count:", slots.length);
  const days = [...new Set(slots.map(s => s.day_of_week))];
  days.forEach(d => {
    const daySlots = slots.filter(s => s.day_of_week === d).sort((a,b) => a.startTime.localeCompare(b.startTime));
    console.log(`- Day ${d}: ${daySlots.length} slots:`, daySlots.map(s => `${s.slot_id} (${s.startTime}-${s.endTime}, type=${s.slot_type}, isBreak=${s.isBreak})`));
  });
  await mongoose.disconnect();
};
run();
