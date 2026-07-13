import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
    await mongoose.connect(uri + "timetable");
    const courses = await mongoose.connection.db.collection("courses").find({}).toArray();
    console.log("Total courses in DB:", courses.length);
    courses.forEach(c => {
      console.log(`- Course ID: ${c.course_id}, Name: ${c.course_name}`);
    });
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await mongoose.disconnect();
  }
};
test();
