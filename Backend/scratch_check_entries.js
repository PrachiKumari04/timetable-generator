import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const entries = await mongoose.connection.db.collection("timetableentries").find({}).toArray();
  console.log("All generated entries:");
  entries.forEach(e => {
    console.log(`- Course: ${e.course_id}, Day: ${e.day_of_week}, Slot: ${e.slot_id}, Class: ${e.class_group}, Spec: ${e.specialization_id}, Lab: ${e.isLab}`);
  });
  await mongoose.disconnect();
};
run();
