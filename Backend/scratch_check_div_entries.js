import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const entries = await mongoose.connection.db.collection("timetableentries").find({}).toArray();
  const divisions = ["D001", "D002", "D003", "D004"];
  console.log("Total entries in database:", entries.length);
  divisions.forEach(d => {
    const divEntries = entries.filter(e => e.class_group === d);
    console.log(`- Division ${d}: ${divEntries.length} entries`);
  });
  await mongoose.disconnect();
};
run();
