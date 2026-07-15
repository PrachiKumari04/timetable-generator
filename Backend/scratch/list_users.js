import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/timetable";
    await mongoose.connect(uri);
    console.log("Connected!");
    
    const db = mongoose.connection.db;
    
    const usersCount = await db.collection("users").countDocuments();
    const studentsCount = await db.collection("students").countDocuments();
    const facultiesCount = await db.collection("faculties").countDocuments();
    
    console.log(`Counts -> Users: ${usersCount}, Students: ${studentsCount}, Faculties: ${facultiesCount}`);
    
    if (studentsCount > 0) {
      const studentSample = await db.collection("students").findOne({});
      console.log("Student sample:", studentSample);
    }
    
    if (facultiesCount > 0) {
      const facultySample = await db.collection("faculties").findOne({});
      console.log("Faculty sample:", facultySample);
    }
    
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
