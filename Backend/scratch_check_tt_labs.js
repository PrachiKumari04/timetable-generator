import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const entries = await mongoose.connection.db.collection("timetableentries").find({}).toArray();
  const labEntries = entries.filter(e => e.isLab);
  console.log("Total entries in last generated TT:", entries.length);
  console.log("Lab entries in last generated TT:", labEntries.length);
  labEntries.forEach(e => {
    console.log(`- Course: ${e.course_id}, Day: ${e.day_of_week}, Slot: ${e.slot_id}`);
  });
  await mongoose.disconnect();
};
run();
