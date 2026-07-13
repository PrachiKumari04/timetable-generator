import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const allocs = await mongoose.connection.db.collection("subjectallocations").find({}).toArray();
  const divisions = await mongoose.connection.db.collection("divisions").find({}).toArray();
  const specializations = await mongoose.connection.db.collection("specializations").find({}).toArray();
  const programs = await mongoose.connection.db.collection("programs").find({}).toArray();
  console.log("All subject allocations with specializations:");
  allocs.forEach(a => {
    console.log(`- ID: ${a.subjectAllocation_id}, Div: ${a.division_id}, Course: ${a.course_id}, Specialization: ${a.specialization_id}, Program: ${a.program_id}`);
  });
  await mongoose.disconnect();
};
run();
