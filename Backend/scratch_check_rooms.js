import mongoose from "mongoose";
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const rooms = await mongoose.connection.db.collection("rooms").find({}).toArray();
  const labRooms = rooms.filter(r => r.isLab);
  console.log("TOTAL ROOMS:", rooms.length);
  console.log("LAB ROOMS:", JSON.stringify(labRooms, null, 2));
  await mongoose.disconnect();
};
run();
