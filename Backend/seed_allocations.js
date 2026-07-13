import mongoose from "mongoose";
import { Curriculum } from "./src/models/curriculum.models.js";
import { Division } from "./src/models/division.models.js";
import { SubjectAllocation } from "./src/models/subjectAllocation.models.js";
import { Course } from "./src/models/course.models.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    try {
        const mongoUri = `${process.env.MONGODB_URI || "mongodb://localhost:27017/"}timetable`;
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB!");

        // Add Combined Lab Courses if they don't exist
        const combinedLabs = [
            { course_id: "C_WT_JAVA_LAB", course_name: "WT AND JAVA COMBINED LAB", credit: "2", isActive: true },
            { course_id: "C_LINUX_ADBMS_LAB", course_name: "LINUX AND ADBMS COMBINED LAB", credit: "2", isActive: true },
        ];
        for (const cl of combinedLabs) {
            await Course.updateOne({ course_id: cl.course_id }, { $set: cl }, { upsert: true });
        }

        // Get S002 P001 curriculum
        const curr = await Curriculum.findOne({ program_id: "P001", semester_id: "S002" });
        if (!curr) {
            console.log("Curriculum not found!");
            return;
        }

        // Get Divisions
        const divisions = await Division.find({});
        
        await SubjectAllocation.deleteMany({ program_id: "P001", semester_id: "S002" });

        let allocCount = 1;
        const newAllocations = [];

        // Get all faculties to distribute among subjects
        const faculties = await mongoose.connection.db.collection('faculties').find({}).toArray();
        let facultyIndex = 0;
        const getNextFaculty = () => {
            const f = faculties[facultyIndex % faculties.length];
            facultyIndex++;
            return f.faculty_id;
        };

        for (const div of divisions) {
            if (!div.classTeacher_id) continue;
            // Assign Core Subjects
            const coreSubjects = curr.subjects.filter(s => !s.isSpecialization);
            for (const sub of coreSubjects) {
                // Let the class teacher teach the first core subject, others get random
                const fId = (sub === coreSubjects[0]) ? div.classTeacher_id : getNextFaculty();
                newAllocations.push({
                    subjectAllocation_id: `SA_GEN_${allocCount++}`,
                    semester_id: "S002",
                    program_id: "P001",
                    division_id: div.division_id,
                    course_id: sub.course_id,
                    faculty_id: fId,
                    l: "3", t: "0", p: "0", isLab: false,
                    academicYear: "2025-2026"
                });
            }

            // Assign Specialization
            const specSubjects = curr.subjects.filter(s => s.isSpecialization && s.specialization_id === div.specialization_id);
            for (const sub of specSubjects) {
                newAllocations.push({
                    subjectAllocation_id: `SA_GEN_${allocCount++}`,
                    semester_id: "S002",
                    program_id: "P001",
                    division_id: div.division_id,
                    course_id: sub.course_id,
                    faculty_id: getNextFaculty(),
                    l: "3", t: "0", p: "0", isLab: false,
                    academicYear: "2025-2026"
                });
            }

            // Assign Labs (p=2)
            newAllocations.push({
                subjectAllocation_id: `SA_GEN_${allocCount++}`,
                semester_id: "S002",
                program_id: "P001",
                division_id: div.division_id,
                course_id: "C_WT_JAVA_LAB",
                faculty_id: getNextFaculty(),
                l: "0", t: "0", p: "2", isLab: true,
                academicYear: "2025-2026"
            });
            newAllocations.push({
                subjectAllocation_id: `SA_GEN_${allocCount++}`,
                semester_id: "S002",
                program_id: "P001",
                division_id: div.division_id,
                course_id: "C_LINUX_ADBMS_LAB",
                faculty_id: getNextFaculty(),
                l: "0", t: "0", p: "2", isLab: true,
                academicYear: "2025-2026"
            });
            newAllocations.push({
                subjectAllocation_id: `SA_GEN_${allocCount++}`,
                semester_id: "S002",
                program_id: "P001",
                division_id: div.division_id,
                course_id: "C_AFM_LAB",
                faculty_id: getNextFaculty(),
                l: "0", t: "0", p: "2", isLab: true,
                academicYear: "2025-2026"
            });
        }

        await SubjectAllocation.insertMany(newAllocations);
        console.log(`Inserted ${newAllocations.length} allocations for S002 P001!`);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
