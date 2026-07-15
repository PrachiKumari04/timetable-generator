import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.models.js";

dotenv.config();

const run = async () => {
  try {
    const mongoUri = `${process.env.MONGODB_URI || "mongodb://localhost:27017/"}timetable`;
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");

    const db = mongoose.connection.db;

    // Get all students
    const students = await db.collection("students").find({}).toArray();
    console.log(`Found ${students.length} students in DB.`);

    // Get all faculties
    const faculties = await db.collection("faculties").find({}).toArray();
    console.log(`Found ${faculties.length} faculties in DB.`);

    // Get all existing users
    const existingUsers = await User.find({});
    const existingStudentIds = new Set(existingUsers.filter(u => u.student_id).map(u => u.student_id));
    const existingFacultyIds = new Set(existingUsers.filter(u => u.faculty_id).map(u => u.faculty_id));

    let createdCount = 0;

    // Create users for students
    for (const student of students) {
      if (!existingStudentIds.has(student.student_id)) {
        await User.create({
          user_id: `STU${student.student_id}`,
          password: "password123", // Let mongoose hook hash this plain password
          role: "student",
          student_id: student.student_id,
          isActive: true
        });
        createdCount++;
      }
    }

    // Create users for faculties
    for (const faculty of faculties) {
      if (!existingFacultyIds.has(faculty.faculty_id)) {
        await User.create({
          user_id: `FAC${faculty.faculty_id}`,
          password: "password123", // Let mongoose hook hash this plain password
          role: "faculty",
          faculty_id: faculty.faculty_id,
          isActive: true
        });
        createdCount++;
      }
    }

    console.log(`Successfully created ${createdCount} new user accounts.`);
  } catch (err) {
    console.error("Failed to seed users:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
