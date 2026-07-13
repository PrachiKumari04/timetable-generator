import mongoose from "mongoose";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isLabSession = (subject) => {
  if (!subject) return false;
  const labKeywords = ['lab', 'practical', 'workshop', 'session'];
  return labKeywords.some(keyword => subject.toLowerCase().includes(keyword));
};

const processTimetableData = (timetableData, timeSlots) => {
  const processed = {};
  
  DAYS.forEach(day => {
    const dayKey = day.toLowerCase();
    const dayData = timetableData[dayKey] || [];
    processed[dayKey] = [];
    
    let skipNext = false;
    dayData.forEach((cell, index) => {
      if (skipNext) {
        skipNext = false;
        processed[dayKey].push({ isContinued: true, parentIndex: index - 1 });
        return;
      }
      
      if (timeSlots[index]?.isBreak) {
        processed[dayKey].push(cell);
        return;
      }
      
      if (cell && (cell.isLab || isLabSession(cell.subject))) {
        processed[dayKey].push({ ...cell, isLab: true, spansTwoPeriods: true });
        skipNext = true;
      } else {
        processed[dayKey].push(cell);
      }
    });
  });
  
  return processed;
};

const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/timetable");
  const entries = await mongoose.connection.db.collection("timetableentries").find({}).toArray();
  const timeSlots = await mongoose.connection.db.collection("timeslots").find({}).toArray();
  const courses = await mongoose.connection.db.collection("courses").find({}).toArray();
  const faculties = await mongoose.connection.db.collection("faculties").find({}).toArray();

  const mondaySlots = timeSlots
    .filter(s => s.day_of_week.toLowerCase() === "monday")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const activeTimeSlots = mondaySlots.map((s, idx) => {
    const lecturesBefore = mondaySlots.slice(0, idx).filter(x => !x.isBreak);
    const label = s.isBreak ? "BREAK" : String(lecturesBefore.length + 1);
    return {
      label,
      time: `${s.startTime} - ${s.endTime}`,
      isBreak: s.isBreak
    };
  });

  const slotCount = activeTimeSlots.length;
  
  // Create empty timetable
  const formattedData = {};
  DAYS.forEach(day => {
    formattedData[day.toLowerCase()] = Array(slotCount).fill(null);
  });

  const filtered = entries.filter(e => e.class_group === "D001");

  filtered.forEach(entry => {
    const day = entry.day_of_week.toLowerCase();
    const daySlots = timeSlots
      .filter(s => s.day_of_week.toLowerCase() === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    const slotIndex = daySlots.findIndex(s => s.slot_id === entry.slot_id);

    if (slotIndex !== -1 && formattedData[day] && slotIndex < slotCount) {
      const courseObj = courses.find(c => c.course_id === entry.course_id);
      const courseDisplay = courseObj ? courseObj.course_name : entry.course_id;

      const facultyObj = faculties.find(f => f.faculty_id === entry.faculty_id);
      const facultyDisplay = facultyObj ? facultyObj.faculty_name : entry.faculty_id;

      formattedData[day][slotIndex] = {
        subject: courseDisplay,
        faculty: facultyDisplay,
        room: entry.room_no,
        isLab: entry.isLab,
        rawEntry: entry
      };
    }
  });

  console.log("FORMATTED MONDAY DATA:");
  formattedData.monday.forEach((cell, idx) => {
    console.log(`Slot ${idx}:`, cell ? { subject: cell.subject, isLab: cell.isLab } : null);
  });

  const processed = processTimetableData(formattedData, activeTimeSlots);
  console.log("\nPROCESSED MONDAY DATA:");
  processed.monday.forEach((cell, idx) => {
    console.log(`Slot ${idx}:`, cell ? { subject: cell.subject, isLab: cell.isLab, spansTwoPeriods: cell.spansTwoPeriods, isContinued: cell.isContinued } : null);
  });

  await mongoose.disconnect();
};
run();
