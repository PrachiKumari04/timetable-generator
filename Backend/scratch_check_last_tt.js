import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const timetables = await mongoose.connection.db.collection("timetables").find({}).toArray();
  const entries = await mongoose.connection.db.collection("timetableentries").find({}).toArray();
  console.log("Total entries in database:", entries.length);
  const divisions = [...new Set(entries.map(e => e.class_group))];
  divisions.forEach(d => {
    const divEntries = entries.filter(e => e.class_group === d);
    console.log(`- Division ${d}: ${divEntries.length} entries`);
  });
  if (entries.length > 0) {
    console.log("Sample entries:", entries.slice(0, 3));
  }
  await mongoose.disconnect();
};
run();
