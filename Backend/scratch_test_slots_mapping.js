import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const timeSlots = await mongoose.connection.db.collection("timeslots").find({}).toArray();
  const day = "monday";
  const daySlots = timeSlots
    .filter(s => s.day_of_week.toLowerCase() === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  console.log("Sorted Monday slots:");
  daySlots.forEach((s, idx) => {
    console.log(`Index ${idx}: slot_id: ${s.slot_id}, time: ${s.startTime}-${s.endTime}, isBreak: ${s.isBreak}`);
  });

  const ts6Index = daySlots.findIndex(s => s.slot_id === "TS006");
  const ts7Index = daySlots.findIndex(s => s.slot_id === "TS007");
  console.log("TS006 index:", ts6Index);
  console.log("TS007 index:", ts7Index);

  await mongoose.disconnect();
};
run();
