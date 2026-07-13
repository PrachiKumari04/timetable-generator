import mongoose from "mongoose";
import { generateSchedule } from "./src/utils/timetableGenerator.js";
import { SubjectAllocation } from "./src/models/subjectAllocation.models.js";
import { Room } from "./src/models/room.models.js";
import { TimeSlot } from "./src/models/timeSlot.models.js";

const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const allocations = await SubjectAllocation.find({ semester_id: "S002", program_id: "P001" });
  const rooms = await Room.find();
  const timeSlots = await TimeSlot.find();

  console.log("Allocations count:", allocations.length);
  
  // Let's run a trace
  const hasLabRoom = rooms.some(r => r.isLab);
  const hasLectureRoom = rooms.some(r => !r.isLab);
  console.log("hasLabRoom:", hasLabRoom, "hasLectureRoom:", hasLectureRoom);

  const sessions = [];
  allocations.forEach(alloc => {
    const lectureCount = parseInt(alloc.l) || 0;
    const tutorialCount = parseInt(alloc.t) || 0;
    const practicalCount = parseInt(alloc.p) || 0;
    
    for (let i = 0; i < (lectureCount + tutorialCount); i++) {
      sessions.push({
        id: `${alloc.subjectAllocation_id}-L-${i}`,
        course_id: alloc.course_id,
        type: "LECTURE",
        duration: 1
      });
    }
    
    // Lab count
    const labSessionsCount = practicalCount; // Using the fix we applied
    for (let i = 0; i < labSessionsCount; i++) {
      sessions.push({
        id: `${alloc.subjectAllocation_id}-P-${i}`,
        course_id: alloc.course_id,
        type: "LAB",
        duration: 2
      });
    }
  });

  console.log("Total Sessions parsed:", sessions.length);
  console.log("Sessions:", sessions);

  await mongoose.disconnect();
};
run();
