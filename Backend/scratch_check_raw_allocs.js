import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const allocs = await mongoose.connection.db.collection("subjectallocations").find({
    semester_id: "S002",
    program_id: "P001"
  }).toArray();
  console.log("RAW ALLOCATIONS:", JSON.stringify(allocs, null, 2));
  await mongoose.disconnect();
};
run();
