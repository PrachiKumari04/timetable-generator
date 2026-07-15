import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../src/models/user.models.js";

dotenv.config();

const run = async () => {
  try {
    const mongoUri = `${process.env.MONGODB_URI || "mongodb://localhost:27017/"}timetable`;
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    
    // Hash passwords
    const studentPassword = await bcrypt.hash("student123", saltRounds);
    const facultyPassword = await bcrypt.hash("faculty123", saltRounds);

    // Create student user
    await User.updateOne(
      { student_id: "ADT25COMM0873" },
      {
        $set: {
          user_id: "STUADT25COMM0873",
          password: studentPassword,
          role: "student",
          isActive: true,
        }
      },
      { upsert: true }
    );
    console.log("Seeded student user (Username: STUADT25COMM0873, Password: student123)");

    // Create faculty user
    await User.updateOne(
      { faculty_id: "F001" },
      {
        $set: {
          user_id: "FACF001",
          password: facultyPassword,
          role: "faculty",
          isActive: true,
        }
      },
      { upsert: true }
    );
    console.log("Seeded faculty user (Username: FACF001, Password: faculty123)");

  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
