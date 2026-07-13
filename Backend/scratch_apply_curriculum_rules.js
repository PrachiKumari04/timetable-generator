import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  await mongoose.connect(uri + "timetable");
  const db = mongoose.connection.db;

  // Let's first clean existing MCA Sem II (S002) subject allocations to replace them cleanly
  await db.collection("subjectallocations").deleteMany({
    semester_id: "S002",
    division_id: { $in: ["D001", "D002", "D003", "D004"] }
  });

  // Course IDs we will map:
  // Core Subjects:
  // ADBMS -> C157 (DATABASE MANAGEMENT SYSTEM) or we can look up matching names, let's map course IDs
  // DAA -> C164 (DESIGN AND ANALYSIS OF ALGORITHMS)
  // OS -> C006 (OPERATING SYSTEM)
  // Logical Aptitude -> C031 (or similar)
  // Core Java -> C197 (CORE JAVA PROGRAMMING)
  // WT -> C207 (WEB TECHNOLOGY - I)
  // AFM -> C033 (ACCOUNTING &FINANCIAL MANAGEMENT WITH ADV. EXCEL)
  // Specializations:
  // Cloud Computing (Div A) -> C166 (CLOUD COMPUTING INTERGATED WITH AI)
  // Data Science (Div B & C) -> C027 (DATA ANALYTIC AND VISUALISZATION)
  // Cybersecurity (Div D) -> C007 (ETHICAL HACKING & PENETRATING TESTING & ENGINEERING)

  // Teacher allocations by course:
  // ADBMS: Prof. Vinod Charawande (F003) for Div A, Dr. Rahul Satyakam (F004) for Div B, Dr. Pradnya Mulye (F007) for Div C, Prof. Harshit Kumar (F008) for Div D
  // DAA: Dr. Rahul Satyakam (F004) for Div A, Dr. Pradnya Mulye (F007) for Div B, Prof. Harshit Kumar (F008) for Div C, Prof. Vinod Charawande (F003) for Div D
  // OS: Dr. Pradnya Mulye (F007) for Div A, Prof. Harshit Kumar (F008) for Div B, Prof. Vinod Charawande (F003) for Div C, Dr. Rahul Satyakam (F004) for Div D
  // Logical Aptitude: Prof. Kemachndra (F034) for all divisions
  // Core Java: Prof. Harshit Kumar (F008) for Div A, Prof. Vinod Charawande (F003) for Div B, Dr. Rahul Satyakam (F004) for Div C, Dr. Pradnya Mulye (F007) for Div D
  // WT: Prof. Dharmendra Singh (F005) for all divisions
  // AFM: Prof. Laveena Bhatia (F011) for all divisions

  const getFacultyForCourse = (courseId, divId) => {
    if (courseId === "C157" || courseId === "C158") { // ADBMS / ADBMS Lab
      if (divId === "D001") return "F003"; // Vinod
      if (divId === "D002") return "F004"; // Rahul S
      if (divId === "D003") return "F007"; // Pradnya
      return "F008"; // Harshit
    }
    if (courseId === "C164") { // DAA
      if (divId === "D001") return "F004"; // Rahul S
      if (divId === "D002") return "F007"; // Pradnya
      if (divId === "D003") return "F008"; // Harshit
      return "F003"; // Vinod
    }
    if (courseId === "C006") { // OS / Linux OS Lab
      if (divId === "D001") return "F007"; // Pradnya
      if (divId === "D002") return "F008"; // Harshit
      if (divId === "D003") return "F003"; // Vinod
      return "F004"; // Rahul S
    }
    if (courseId === "C031" && courseId !== "C033") { // Logical Aptitude
      return "F034"; // Prof. Kemachndra
    }
    if (courseId === "C197" || courseId === "C198") { // Core Java / Java Lab
      if (divId === "D001") return "F008"; // Harshit
      if (divId === "D002") return "F003"; // Vinod
      if (divId === "D003") return "F004"; // Rahul S
      return "F007"; // Pradnya
    }
    if (courseId === "C207" || courseId === "C208") { // WT / WT Lab
      return "F005"; // Dharmendra Singh
    }
    if (courseId === "C033") { // AFM
      return "F011"; // Laveena Bhatia
    }
    return "F003";
  };

  const mcaCoreCourses = [
    { name: "ADBMS", course_id: "C157", l: "3", t: "0", p: "0" },
    { name: "ADBMS Lab", course_id: "C158", l: "0", t: "0", p: "2" },
    { name: "DAA", course_id: "C164", l: "3", t: "0", p: "0" },
    { name: "OS", course_id: "C006", l: "3", t: "0", p: "0" },
    { name: "Logical Aptitude", course_id: "C031", l: "2", t: "0", p: "0" },
    { name: "Core Java", course_id: "C197", l: "3", t: "0", p: "0" },
    { name: "Core Java Lab", course_id: "C198", l: "0", t: "0", p: "2" },
    { name: "WT", course_id: "C207", l: "3", t: "0", p: "0" },
    { name: "WT Lab", course_id: "C208", l: "0", t: "0", p: "2" },
    { name: "AFM", course_id: "C033", l: "2", t: "0", p: "0" },
    { name: "AFM Lab", course_id: "C031", l: "0", t: "0", p: "2" }
  ];

  const specs = {
    "D001": { program_id: "P002", name: "Cloud Computing", course_id: "C166", faculty_id: "F009" }, // Pratibha Tiwari
    "D002": { program_id: "P003", name: "Data Science", course_id: "C027", faculty_id: "F010" }, // Rahul Sharma
    "D003": { program_id: "P003", name: "Data Science", course_id: "C027", faculty_id: "F010" }, // Rahul Sharma
    "D004": { program_id: "P004", name: "Cybersecurity", course_id: "C007", faculty_id: "F003" }  // Vinod
  };

  const divisions = [
    { id: "D001" }, // Div A
    { id: "D002" }, // Div B
    { id: "D003" }, // Div C
    { id: "D004" }  // Div D
  ];

  let idCounter = 100;
  const newAllocations = [];

  divisions.forEach(div => {
    // Add Core Courses
    mcaCoreCourses.forEach(c => {
      newAllocations.push({
        semester_id: "S002",
        program_id: "P001",
        division_id: div.id,
        subjectAllocation_id: `SA_NEW_${idCounter++}`,
        l: c.l,
        t: c.t,
        p: c.p,
        isLab: c.p !== "0",
        academicYear: "2025-2026",
        faculty_id: getFacultyForCourse(c.course_id, div.id),
        course_id: c.course_id
      });
    });

    // Add Specialization Course
    const spec = specs[div.id];
    newAllocations.push({
      semester_id: "S002",
      program_id: spec.program_id,
      division_id: div.id,
      subjectAllocation_id: `SA_NEW_${idCounter++}`,
      l: "3",
      t: "0",
      p: "0",
      isLab: false,
      academicYear: "2025-2026",
      faculty_id: spec.faculty_id,
      course_id: spec.course_id
    });
  });

  await db.collection("subjectallocations").insertMany(newAllocations);
  console.log("Successfully applied curriculum rules database configurations!");
  await mongoose.disconnect();
};

run().catch(err => {
  console.error("Error running script:", err);
});
