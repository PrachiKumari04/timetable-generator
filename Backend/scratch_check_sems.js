import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const db = mongoose.connection.db;
  const sems = await db.collection("semesters").find({}).toArray();
  console.log("SEMESTERS in DB:");
  sems.forEach(s => {
    console.log(`- ID: ${s.semester_id}, Name: ${s.semester_name}`);
  });
  await mongoose.disconnect();
};
run();
