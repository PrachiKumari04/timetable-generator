import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const faculties = await mongoose.connection.db.collection("faculties").find({}).toArray();
  console.log("Faculties count:", faculties.length);
  faculties.forEach(f => {
    console.log(`- ID: ${f.faculty_id}, Name: ${f.faculty_name}`);
  });
  await mongoose.disconnect();
};
run();
