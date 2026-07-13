import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const courses = await mongoose.connection.db.collection("courses").find({
    course_name: /ALGORITHM/i
  }).toArray();
  console.log("Algorithm Courses:", JSON.stringify(courses, null, 2));

  const allocations = await mongoose.connection.db.collection("subjectallocations").find({
    course_id: { $in: courses.map(c => c.course_id) }
  }).toArray();
  console.log("Allocations for Algorithm:", allocations);

  await mongoose.disconnect();
};
run();
