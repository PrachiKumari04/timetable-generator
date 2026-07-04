import { generateSchedule } from "./src/utils/timetableGenerator.js";

// Mock Time Slots
const mockTimeSlots = [
  { slot_id: "MON_1", day_of_week: "Monday", startTime: "09:00 AM", slot_type: "LECTURE" },
  { slot_id: "MON_2", day_of_week: "Monday", startTime: "10:00 AM", slot_type: "LECTURE" },
  { slot_id: "MON_B1", day_of_week: "Monday", startTime: "11:00 AM", slot_type: "BREAK" },
  { slot_id: "MON_3", day_of_week: "Monday", startTime: "11:15 AM", slot_type: "LECTURE" },
  { slot_id: "MON_4", day_of_week: "Monday", startTime: "12:15 PM", slot_type: "LECTURE" },
  { slot_id: "MON_L", day_of_week: "Monday", startTime: "01:15 PM", slot_type: "LUNCH" },
  { slot_id: "MON_5", day_of_week: "Monday", startTime: "02:00 PM", slot_type: "LECTURE" },
  
  { slot_id: "TUE_1", day_of_week: "Tuesday", startTime: "09:00 AM", slot_type: "LECTURE" },
  { slot_id: "TUE_2", day_of_week: "Tuesday", startTime: "10:00 AM", slot_type: "LECTURE" },
  { slot_id: "TUE_3", day_of_week: "Tuesday", startTime: "11:15 AM", slot_type: "LECTURE" },
  { slot_id: "TUE_4", day_of_week: "Tuesday", startTime: "12:15 PM", slot_type: "LECTURE" },
  { slot_id: "TUE_5", day_of_week: "Tuesday", startTime: "02:00 PM", slot_type: "LECTURE" }
];

// Mock Rooms
const mockRooms = [
  { room_no: "101", isLab: false },
  { room_no: "102", isLab: false },
  { room_no: "LAB_A", isLab: true }
];

// Mock Allocations
const mockAllocations = [
  {
    subjectAllocation_id: "SA1",
    course_id: "CS101",
    faculty_id: "FAC_JONES",
    division_id: "DIV_A",
    l: 2, // 2 Lectures
    t: 0,
    p: 2  // 2 Lab hours (1 Lab session of 2 periods)
  },
  {
    subjectAllocation_id: "SA2",
    course_id: "CS102",
    faculty_id: "FAC_SMITH",
    division_id: "DIV_A",
    l: 2, // 2 Lectures
    t: 0,
    p: 0
  },
  {
    subjectAllocation_id: "SA3",
    course_id: "CS201",
    faculty_id: "FAC_JONES", // Same faculty, potential conflict!
    division_id: "DIV_B",
    l: 2,
    t: 0,
    p: 0
  }
];

const runTests = () => {
  console.log("--- Starting Timetable Generator Algorithm Tests ---");

  const result = generateSchedule(mockAllocations, mockRooms, mockTimeSlots);

  if (!result) {
    console.error("FAIL: Could not generate a conflict-free timetable!");
    process.exit(1);
  }

  console.log(`SUCCESS: Generated ${result.length} timetable entries.`);

  // Validation Checks
  let hasConflict = false;
  
  // Track assignments by slot
  const facultySlots = {}; // "FAC_ID@DAY_SLOT" -> true
  const roomSlots = {};    // "ROOM_NO@DAY_SLOT" -> true
  const divisionSlots = {}; // "DIV_ID@DAY_SLOT" -> true

  result.forEach(entry => {
    const slotKey = `${entry.day_of_week}_${entry.slot_id}`;
    
    // Check Room type constraint
    const room = mockRooms.find(r => r.room_no === entry.room_no);
    if (entry.isLab && (!room || !room.isLab)) {
      console.error(`FAIL: Lab session assigned to non-lab room: ${entry.room_no}`);
      hasConflict = true;
    }
    if (!entry.isLab && room && room.isLab) {
      console.error(`FAIL: Lecture session assigned to lab room: ${entry.room_no}`);
      hasConflict = true;
    }

    // Check Faculty Overlap
    const facKey = `${entry.faculty_id}@${slotKey}`;
    if (facultySlots[facKey]) {
      console.error(`FAIL: Faculty conflict for ${entry.faculty_id} at ${slotKey}`);
      hasConflict = true;
    }
    facultySlots[facKey] = true;

    // Check Room Overlap
    const rmKey = `${entry.room_no}@${slotKey}`;
    if (roomSlots[rmKey]) {
      console.error(`FAIL: Room conflict for ${entry.room_no} at ${slotKey}`);
      hasConflict = true;
    }
    roomSlots[rmKey] = true;

    // Check Division/Class Group Overlap
    const divKey = `${entry.class_group}@${slotKey}`;
    if (divisionSlots[divKey]) {
      console.error(`FAIL: Division conflict for ${entry.class_group} at ${slotKey}`);
      hasConflict = true;
    }
    divisionSlots[divKey] = true;
  });

  if (hasConflict) {
    console.error("FAIL: Validation detected conflicts in generated timetable.");
    process.exit(1);
  } else {
    console.log("PASS: No room, faculty, or division conflicts detected!");
    console.log("Sample entries generated:");
    console.log(result.slice(0, 5));
  }
};

runTests();
