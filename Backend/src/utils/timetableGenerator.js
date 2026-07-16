/**
 * Generative Timetable Scheduling Algorithm
 * Uses Constraint Satisfaction Problem (CSP) formulation with Backtracking
 */

export const generateSchedule = (allocations, rooms, timeSlots, divisions = []) => {
  // 1. Parse allocations into sessions
  const sessions = [];
  allocations.forEach(alloc => {
    const lectureCount = parseInt(alloc.l) || 0;
    const tutorialCount = parseInt(alloc.t) || 0;
    const practicalCount = parseInt(alloc.p) || 0;
    
    // Add lecture and tutorial sessions
    for (let i = 0; i < (lectureCount + tutorialCount); i++) {
      sessions.push({
        id: `${alloc.subjectAllocation_id}-L-${i}`,
        allocation: alloc,
        course_id: alloc.course_id,
        faculty_id: alloc.faculty_id,
        division_id: alloc.division_id,
        type: "LECTURE",
        duration: 1
      });
    }
    
    // Add practical/lab sessions (each lab spans 2 periods back-to-back)
    const labSessionsCount = Math.floor(practicalCount / 2);
    for (let i = 0; i < labSessionsCount; i++) {
      sessions.push({
        id: `${alloc.subjectAllocation_id}-P-${i}`,
        allocation: alloc,
        course_id: alloc.course_id,
        faculty_id: alloc.faculty_id,
        division_id: alloc.division_id,
        type: "LAB",
        duration: 2
      });
    }
  });

  // Sort sessions: labs first (larger duration, more constrained)
  sessions.sort((a, b) => b.duration - a.duration);

  // Group slots by day_of_week
  const slotsByDay = {};
  timeSlots.forEach(slot => {
    const day = slot.day_of_week.toLowerCase();
    if (day === "saturday") return; // Do not schedule anything on Saturday
    if (!slotsByDay[day]) slotsByDay[day] = [];
    slotsByDay[day].push(slot);
  });

  // Sort slots inside each day by start time
  const timeToMinutes = (timeStr) => {
    const cleaned = timeStr.toLowerCase().replace(/[\s\.]/g, '');
    const isPm = cleaned.includes('pm');
    const isAm = cleaned.includes('am');
    let [hoursStr, minutesStr] = cleaned.replace(/am|pm/g, '').split(':');
    if (!minutesStr && cleaned.includes('.')) {
      [hoursStr, minutesStr] = cleaned.replace(/am|pm/g, '').split('.');
    }
    let hours = parseInt(hoursStr) || 0;
    let minutes = parseInt(minutesStr) || 0;
    if (isPm && hours !== 12) hours += 12;
    if (isAm && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  for (const day in slotsByDay) {
    slotsByDay[day].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }

  // Pre-calculate valid slot combinations for each day
  const possibleSlots = { LECTURE: [], LAB: [] };
  
  for (const day in slotsByDay) {
    const daySlots = slotsByDay[day];
    for (let i = 0; i < daySlots.length; i++) {
      const slot1 = daySlots[i];
      if (slot1.isBreak || slot1.slot_type === "BREAK" || slot1.slot_type === "LUNCH") continue;

      // Lecture candidate
      possibleSlots.LECTURE.push({
        day,
        slots: [slot1]
      });

      // Lab candidate (must be consecutive and no break in between in the layout)
      if (i + 1 < daySlots.length) {
        const slot2 = daySlots[i + 1];
        if (!slot2.isBreak && slot2.slot_type !== "BREAK" && slot2.slot_type !== "LUNCH") {
          const num1 = parseInt(slot1.slot_id.replace("TS", ""));
          const num2 = parseInt(slot2.slot_id.replace("TS", ""));
          
          let isConsecutiveWithoutBreak = false;
          if (isNaN(num1) || isNaN(num2)) {
            // Fallback for mock/test data: consecutive if they are adjacent in daySlots
            isConsecutiveWithoutBreak = true;
          } else {
            const slotNum1 = (num1 - 1) % 8 + 1; // 1 to 8
            const slotNum2 = (num2 - 1) % 8 + 1; // 1 to 8
            isConsecutiveWithoutBreak = 
              (slotNum1 === 1 && slotNum2 === 2) || 
              (slotNum1 === 6 && slotNum2 === 7);
          }
          
          if (isConsecutiveWithoutBreak) {
            possibleSlots.LAB.push({
              day,
              slots: [slot1, slot2]
            });
          }
        }
      }
    }
  }

  // Backtracking state
  const assignments = []; // Array of { session, day, slots, room }
  
  // Conflict checker
  const isConflict = (session, day, slots, room) => {
    // Room type constraint (bypass if no lab rooms exist in database)
    const hasLabRooms = rooms.some(r => r.isLab);
    if (session.type === "LAB" && hasLabRooms && !room.isLab) return true;
    
    // Overlap checks
    for (const assign of assignments) {
      if (assign.day === day) {
        const hasSlotOverlap = assign.slots.some(as => slots.some(s => s.slot_id === as.slot_id));
        if (hasSlotOverlap) {
          // Conflict 1: Same Room
          if (assign.room.room_no === room.room_no && assign.room.block === room.block) return true;
          // Conflict 2: Same Faculty
          if (assign.session.faculty_id === session.faculty_id) return true;
          // Conflict 3: Same Division
          if (assign.session.division_id === session.division_id) return true;
        }

        // Conflict 4: Same Course Lecture already scheduled on this day for this division
        if (
          assign.session.division_id === session.division_id &&
          assign.session.course_id === session.course_id &&
          assign.session.type === "LECTURE" &&
          session.type === "LECTURE"
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // Backtrack recursive solver
  const solve = (sessionIdx) => {
    if (sessionIdx >= sessions.length) return true;

    const session = sessions[sessionIdx];
    const candidateSlots = session.type === "LAB" ? possibleSlots.LAB : possibleSlots.LECTURE;

    // Restrict rooms to avoid massive search space (54 rooms ^ 48 sessions)
    let validRooms = [];
    if (session.type === "LAB") {
      validRooms = rooms.filter(r => r.isLab);
    } else {
      // Map division to preferred classroom from database dynamically
      const divisionObj = divisions.find(d => d.division_id === session.division_id);
      if (divisionObj && divisionObj.preferredRoom_no) {
        const prefRoomNo = divisionObj.preferredRoom_no;
        const prefBlock = divisionObj.preferredRoom_block;
        validRooms = rooms.filter(
          r => r.room_no === prefRoomNo && (!prefBlock || r.block.toUpperCase() === prefBlock.toUpperCase())
        );
      }
      // Fallback if no preferred room is configured or matching room not found
      if (validRooms.length === 0) {
        validRooms = rooms.filter(r => !r.isLab);
      }
    }

    // Shuffle candidateSlots to generate different timetables for different classes
    const shuffledCandidates = [...candidateSlots].sort(() => Math.random() - 0.5);

    for (const cand of shuffledCandidates) {
      // Shuffle rooms as well
      const shuffledRooms = [...validRooms].sort(() => Math.random() - 0.5);
      for (const room of shuffledRooms) {
        if (!isConflict(session, cand.day, cand.slots, room)) {
          assignments.push({ session, day: cand.day, slots: cand.slots, room });

          if (solve(sessionIdx + 1)) return true;

          assignments.pop(); // Backtrack
        }
      }
    }
    return false;
  };

  const success = solve(0);
  if (!success) {
    return null; // Constraints unsatisfied
  }

  // Format assignments to TimeTableEntry schema format
  return assignments.flatMap(assign => {
    // To generate unique entry_ids, we can use a prefix
    const baseId = `ENT-${assign.session.division_id}-${assign.session.course_id}`.toUpperCase();
    return assign.slots.map((slot, idx) => ({
      entry_id: `${baseId}-${assign.day.substring(0,3).toUpperCase()}-${slot.slot_id}`,
      faculty_id: assign.session.faculty_id,
      course_id: assign.session.course_id,
      class_group: assign.session.division_id,
      day_of_week: assign.day,
      isLab: assign.session.type === "LAB",
      status: "scheduled",
      slot_id: slot.slot_id,
      room_no: assign.room.room_no,
      block: assign.room.block
    }));
  });
};
