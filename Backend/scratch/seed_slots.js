import mongoose from "mongoose";
import { TimeSlot } from "../src/models/timeSlot.models.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    const mongoUri = `${process.env.MONGODB_URI || "mongodb://localhost:27017/"}timetable`;
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");

    // Delete existing time slots
    await TimeSlot.deleteMany({});
    console.log("Cleared existing time slots.");

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const dailySlots = [
      { num: 1, start: "09:00 AM", end: "10:00 AM", type: "LECTURE", isBreak: false },
      { num: 2, start: "10:00 AM", end: "11:00 AM", type: "LECTURE", isBreak: false },
      { num: 3, start: "11:00 AM", end: "12:00 PM", type: "LECTURE", isBreak: false },
      { num: 4, start: "12:00 PM", end: "01:00 PM", type: "LECTURE", isBreak: false }, // Period 4
      { num: 5, start: "01:00 PM", end: "01:30 PM", type: "LUNCH", isBreak: true },   // Lunch break
      { num: 6, start: "01:30 PM", end: "02:30 PM", type: "LECTURE", isBreak: false }, // Period 5
      { num: 7, start: "02:30 PM", end: "03:30 PM", type: "LECTURE", isBreak: false }, // Period 6
      { num: 8, start: "03:30 PM", end: "04:30 PM", type: "LECTURE", isBreak: false }  // Period 7
    ];

    const slots = [];
    let idCounter = 1;

    days.forEach(day => {
      dailySlots.forEach(ds => {
        const idStr = String(idCounter++).padStart(3, "0");
        slots.push({
          slot_id: `TS${idStr}`,
          day_of_week: day,
          startTime: ds.start,
          endTime: ds.end,
          slot_type: ds.type,
          isBreak: ds.isBreak
        });
      });
    });

    // Seed Saturday
    const satSlots = [
      { num: 1, start: "09:00 AM", end: "10:00 AM", type: "LECTURE", isBreak: false },
      { num: 2, start: "10:00 AM", end: "11:00 AM", type: "LECTURE", isBreak: false },
      { num: 3, start: "11:00 AM", end: "12:00 PM", type: "LECTURE", isBreak: false }
    ];
    satSlots.forEach(ss => {
      const idStr = String(idCounter++).padStart(3, "0");
      slots.push({
        slot_id: `TS${idStr}`,
        day_of_week: "saturday",
        startTime: ss.start,
        endTime: ss.end,
        slot_type: ss.type,
        isBreak: ss.isBreak
      });
    });

    await TimeSlot.insertMany(slots);
    console.log(`Successfully seeded ${slots.length} time slots into the database!`);
  } catch (err) {
    console.error("Error seeding time slots:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
