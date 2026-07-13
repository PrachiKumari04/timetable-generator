import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const allocations = await mongoose.connection.db.collection("subjectallocations").find({
    semester_id: "S002"
  }).toArray();
  const courses = await mongoose.connection.db.collection("courses").find({}).toArray();
  const faculties = await mongoose.connection.db.collection("faculties").find({}).toArray();

  console.log("MCA Semester II (S002) Allocations:");
  allocations.forEach(a => {
    const course = courses.find(c => c.course_id === a.course_id);
    const faculty = faculties.find(f => f.faculty_id === a.faculty_id);
    console.log(`- Div: ${a.division_id}, Course: ${a.course_id} (${course?.course_name}), Faculty: ${a.faculty_id} (${faculty?.faculty_name}), Program: ${a.program_id}, L-T-P: ${a.l}-${a.t}-${a.p}`);
  });
  await mongoose.disconnect();
};
run();
