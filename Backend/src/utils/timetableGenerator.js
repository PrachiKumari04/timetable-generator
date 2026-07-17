/**
 * Generative Timetable Scheduling Algorithm
 * Uses Constraint Satisfaction Problem (CSP) formulation with Backtracking
 */

export const generateSchedule = (allocations, rooms, timeSlots, divisions = [], curriculum = null) => {
  // Map course_id to its specialization_id (if any) from curriculum
  const courseSpecializations = {};
  if (curriculum && curriculum.subjects) {
    curriculum.subjects.forEach(sub => {
      if (sub.isSpecialization && sub.specialization_id) {
        courseSpecializations[sub.course_id] = sub.specialization_id;
      }
    });
  }

  // 1. Parse allocations into sessions
  const sessions = [];
  const specCounters = {}; // Key: division_id:specialization_id
  
  const getNextSpecIndex = (divisionId, specializationId) => {
    if (!specializationId) return null;
    const key = `${divisionId}:${specializationId}`;
    if (specCounters[key] === undefined) specCounters[key] = 0;
    return specCounters[key]++;
  };

  allocations.forEach(alloc => {
    const lectureCount = parseInt(alloc.l) || 0;
    const tutorialCount = parseInt(alloc.t) || 0;
    const practicalCount = parseInt(alloc.p) || 0;
    const specId = courseSpecializations[alloc.course_id];
    
    // Add lecture and tutorial sessions
    for (let i = 0; i < (lectureCount + tutorialCount); i++) {
      const specIndex = getNextSpecIndex(alloc.division_id, specId);
      sessions.push({
        id: `${alloc.subjectAllocation_id}-L-${i}`,
        allocation: alloc,
        course_id: alloc.course_id,
        faculty_id: alloc.faculty_id,
        division_id: alloc.division_id,
        type: "LECTURE",
        duration: 1,
        specialization_id: specId,
        spec_index: specIndex
      });
    }
    
    // Add practical/lab sessions (each lab spans 2 periods back-to-back)
    const labSessionsCount = Math.floor(practicalCount / 2);
    for (let i = 0; i < labSessionsCount; i++) {
      const specIndex = getNextSpecIndex(alloc.division_id, specId);
      sessions.push({
        id: `${alloc.subjectAllocation_id}-P-${i}`,
        allocation: alloc,
        course_id: alloc.course_id,
        faculty_id: alloc.faculty_id,
        division_id: alloc.division_id,
        type: "LAB",
        duration: 2,
        specialization_id: specId,
        spec_index: specIndex
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
    
    // Force parallel electives to be scheduled in the same slots
    if (session.specialization_id) {
      for (const assign of assignments) {
        if (
          assign.session.division_id === session.division_id &&
          assign.session.specialization_id &&
          assign.session.specialization_id !== session.specialization_id &&
          assign.session.spec_index === session.spec_index
        ) {
          const sameDay = assign.day === day;
          const sameSlots = assign.slots.length === slots.length && 
                            assign.slots.every((as, idx) => slots[idx] && slots[idx].slot_id === as.slot_id);
          if (!sameDay || !sameSlots) {
            return true; // Conflict: They must be scheduled simultaneously!
          }
        }
      }
    }

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
          if (assign.session.division_id === session.division_id) {
            // Check if both are specialization subjects of DIFFERENT specializations (Parallel Electives)
            const spec1 = assign.session.specialization_id;
            const spec2 = session.specialization_id;
            
            const isParallelElective = spec1 && spec2 && spec1 !== spec2;
            
            if (!isParallelElective) {
              return true;
            }
          }
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

    let preferredRoom = null;
    let validRooms = [];
    
    if (session.type === "LAB") {
      validRooms = rooms.filter(r => r.isLab);
    } else {
      // Map division to preferred classroom from database dynamically
      const divisionObj = divisions.find(d => d.division_id === session.division_id);
      if (divisionObj && divisionObj.preferredRoom_no) {
        // If it's a specialization session, only the division's default specialization stays in the preferred room.
        // Guest specializations leave and use fallback rooms.
        const isGuestSpecialization = session.specialization_id && 
                                      divisionObj.specialization_id && 
                                      session.specialization_id !== divisionObj.specialization_id;
        
        if (!isGuestSpecialization) {
          const prefRoomNo = divisionObj.preferredRoom_no;
          const prefBlock = divisionObj.preferredRoom_block;
          preferredRoom = rooms.find(
            r => r.room_no === prefRoomNo && (!prefBlock || r.block.toUpperCase() === prefBlock.toUpperCase())
          );
        }
      }
      validRooms = rooms.filter(r => !r.isLab);
    }

    // Shuffle candidateSlots to generate different timetables for different classes
    const shuffledCandidates = [...candidateSlots].sort(() => Math.random() - 0.5);

    for (const cand of shuffledCandidates) {
      let roomsToTry = [];
      if (session.type === "LAB") {
        roomsToTry = [...validRooms].sort(() => Math.random() - 0.5);
      } else if (preferredRoom) {
        // Try the preferred room first, then shuffle and try fallbacks
        const fallbacks = validRooms.filter(r => r.room_no !== preferredRoom.room_no || r.block !== preferredRoom.block);
        const shuffledFallbacks = fallbacks.sort(() => Math.random() - 0.5);
        roomsToTry = [preferredRoom, ...shuffledFallbacks];
      } else {
        roomsToTry = [...validRooms].sort(() => Math.random() - 0.5);
      }

      for (const room of roomsToTry) {
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
