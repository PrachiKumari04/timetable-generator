import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const allocations = await mongoose.connection.db.collection("subjectallocations").find({}).toArray();
  const courses = await mongoose.connection.db.collection("courses").find({}).toArray();
  const programs = await mongoose.connection.db.collection("programs").find({}).toArray();
  const semesters = await mongoose.connection.db.collection("semesters").find({}).toArray();
  
  console.log("All Allocations in DB:");
  allocations.forEach(a => {
    const course = courses.find(c => c.course_id === a.course_id);
    const prog = programs.find(p => p.program_id === a.program_id);
    const sem = semesters.find(s => s.semester_id === a.semester_id);
    console.log(`- Prog: ${a.program_id} (${prog?.program_name}), Sem: ${a.semester_id} (${sem?.semester_name}), Course: ${a.course_id} (${course?.course_name})`);
  });
  await mongoose.disconnect();
};
run();
