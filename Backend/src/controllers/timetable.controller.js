import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Timetable } from "../models/timetable.models.js";
import { ClassSubject } from "../models/classSubject.models.js";
import { FacultySubject } from "../models/facultySubject.models.js";
import { Section } from "../models/section.models.js";
import { Room } from "../models/room.models.js";
import { v4 as uuidv4 } from "uuid";

// Hardcoded logic for now - a real algorithm is very complex and recursive.
// This is a basic greedy approach that tries to assign slots based on requirements.
const generateTimetable = asyncHandler(async (req, res) => {
    const { semester_id } = req.body;
    if (!semester_id) throw new ApiError(400, "semester_id is required");

    // Clear existing timetable for this semester before generating a new one
    await Timetable.deleteMany({ semester_id: semester_id });

    // Fetch requirements: Which class needs which subjects, and for how many lectures?
    const classSubjects = await ClassSubject.find();
    // Fetch teachers: Which teacher teaches what?
    const facultySubjects = await FacultySubject.find();
    // Fetch available rooms and sections
    const rooms = await Room.find();
    const sections = await Section.find();

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "13:00-14:00", "14:00-15:00"];

    let newTimetable = [];

    // A mapping to track if a faculty or a room is busy at a specific day/time
    let facultyBusy = {}; // key: "faculty_id_day_time", val: true
    let roomBusy = {}; // key: "room_id_day_time", val: true
    let sectionBusy = {}; // key: "section_id_day_time", val: true

    // Iterate through everything a class needs (e.g. Class 1 needs Math 4 times)
    for (const requirement of classSubjects) {
        let lecturesAssigned = 0;
        const requiredLectures = requirement.lectures_per_week;
        const subjectId = requirement.subject_id;
        const classId = requirement.class_id;

        // Find eligible faculties for this subject
        const eligibleFacultyList = facultySubjects.filter(fs => fs.subject_id.toString() === subjectId.toString());
        if (eligibleFacultyList.length === 0) continue; // Skip if no teacher for this subject

        // Find sections belonging to this class
        const validSections = sections.filter(sec => sec.class_id.toString() === classId.toString());

        for (const section of validSections) {
            let sectionLecturesAssigned = 0;

            // Try to place the lecture in the grid
            for (let d = 0; d < days.length && sectionLecturesAssigned < requiredLectures; d++) {
                for (let t = 0; t < timeSlots.length && sectionLecturesAssigned < requiredLectures; t++) {
                    const day = days[d];
                    const time = timeSlots[t];
                    const sectionSlotKey = `${section._id}_${day}_${time}`;

                    if (sectionBusy[sectionSlotKey]) continue; // Section has another class

                    // Find a free faculty member
                    let assignedFaculty = null;
                    for (const ef of eligibleFacultyList) {
                        const facultySlotKey = `${ef.faculty_id}_${day}_${time}`;
                        if (!facultyBusy[facultySlotKey]) {
                            assignedFaculty = ef.faculty_id;
                            break;
                        }
                    }

                    if (!assignedFaculty) continue; // No free teacher right now

                    // Find a free room
                    let assignedRoom = null;
                    for (const room of rooms) {
                        const roomSlotKey = `${room._id}_${day}_${time}`;
                        if (!roomBusy[roomSlotKey]) {
                            assignedRoom = room._id;
                            break;
                        }
                    }

                    if (!assignedRoom) continue; // No free room right now

                    // WE FOUND A VALID SLOT! Book it.
                    facultyBusy[`${assignedFaculty}_${day}_${time}`] = true;
                    roomBusy[`${assignedRoom}_${day}_${time}`] = true;
                    sectionBusy[`${section._id}_${day}_${time}`] = true;

                    newTimetable.push({
                        timetable_id: uuidv4(),
                        semester_id: semester_id,
                        class_id: classId,
                        section_id: section._id,
                        subject_id: subjectId,
                        faculty_id: assignedFaculty,
                        room_id: assignedRoom,
                        day_of_week: day,
                        time_slot: time
                    });

                    sectionLecturesAssigned++;
                }
            }
        }
    }

    if (newTimetable.length > 0) {
        await Timetable.insertMany(newTimetable);
    }

    return res.status(200).json(new ApiResponse(200, newTimetable, "Timetable generated successfully."));
});

const getTimetable = asyncHandler(async (req, res) => {
    // You can filter by class_id, faculty_id, or section_id here using req.query
    const filter = {};
    if (req.query.class_id) filter.class_id = req.query.class_id;
    if (req.query.faculty_id) filter.faculty_id = req.query.faculty_id;
    if (req.query.section_id) filter.section_id = req.query.section_id;

    const timetable = await Timetable.find(filter)
        .populate("class_id subject_id faculty_id room_id section_id");

    return res.status(200).json(new ApiResponse(200, timetable, "Timetable retrieved successfully"));
});

export { generateTimetable, getTimetable };
