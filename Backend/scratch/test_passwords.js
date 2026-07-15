import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.models.js";

dotenv.config();

const run = async () => {
  try {
    const mongoUri = `${process.env.MONGODB_URI || "mongodb://localhost:27017/"}timetable`;
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");

    const admin = await User.findOne({ user_id: "admin" });
    if (admin) {
      const isMatch = await admin.comparePassword("admin123");
      console.log(`admin password match: ${isMatch}, hash: ${admin.password}`);
    } else {
      console.log("admin user not found");
    }

    const student = await User.findOne({ user_id: "STUADT25COMM0873" });
    if (student) {
      const isMatch = await student.comparePassword("student123");
      console.log(`student password match: ${isMatch}, hash: ${student.password}`);
    } else {
      console.log("student user not found");
    }

    const faculty = await User.findOne({ user_id: "FACF001" });
    if (faculty) {
      const isMatch = await faculty.comparePassword("faculty123");
      console.log(`faculty password match: ${isMatch}, hash: ${faculty.password}`);
    } else {
      console.log("faculty user not found");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
