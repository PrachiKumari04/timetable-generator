import mongoose from "mongoose";
import dotenv from "dotenv";
import { generateSchedule } from "./src/utils/timetableGenerator.js";
import { TimeTableEntry } from "./src/models/timeTableEntry.models.js";
import { Timetable } from "./src/models/timetable.models.js";
import { SubjectAllocation } from "./src/models/subjectAllocation.models.js";
import { Room } from "./src/models/room.models.js";
import { TimeSlot } from "./src/models/timeSlot.models.js";
import { Division } from "./src/models/division.models.js";
import { Curriculum } from "./src/models/curriculum.models.js";

dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");

  const semester_id = "S002";
  const academicYear = "2025-2026";
  const generatedBy = "ADMIN";

  console.log("Fetching allocations, rooms, divisions, curriculum, and time slots...");
  const allocations = await SubjectAllocation.find({ semester_id, academicYear });
  const rooms = await Room.find();
  const timeSlots = await TimeSlot.find();
  const divisions = await Division.find();
  const curriculum = await Curriculum.findOne({ semester_id });

  console.log(`Generating schedule for ${allocations.length} allocations...`);
  const generatedEntries = generateSchedule(allocations, rooms, timeSlots, divisions, curriculum);

  if (!generatedEntries) {
    console.error("Generator failed! Constraints conflict.");
    await mongoose.disconnect();
    return;
  }

  console.log(`Successfully generated ${generatedEntries.length} entries. Saving to database...`);

  // Clear existing entries
  const existingTimetables = await Timetable.find({ semester_id, academicYear });
  const existingTimetableIds = existingTimetables.map(t => t.timetable_id);
  
  if (existingTimetableIds.length > 0) {
    const classGroups = [...new Set(allocations.map(a => a.division_id))];
    await TimeTableEntry.deleteMany({
      class_group: { $in: classGroups }
    });
    await Timetable.deleteMany({ semester_id, academicYear });
  }

  // Save new entries
  const savedEntries = await TimeTableEntry.insertMany(generatedEntries);

  // Save master document
  const timetableId = `TT-${semester_id}-${academicYear}-${Date.now()}`.toUpperCase();
  const timetable = await Timetable.create({
    timetable_id: timetableId,
    semester_id,
    academicYear,
    generatedBy,
    status: "published",
    entries: savedEntries
  });

  console.log(`SUCCESS! Timetable saved with ID: ${timetableId}`);
  await mongoose.disconnect();
};

run().catch(err => {
  console.error("Error executing script:", err);
});
