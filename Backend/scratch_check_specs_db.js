import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const specs = await mongoose.connection.db.collection("specializations").find({}).toArray();
  console.log("SPECIALIZATIONS:", JSON.stringify(specs, null, 2));
  await mongoose.disconnect();
};
run();
