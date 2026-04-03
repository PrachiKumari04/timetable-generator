import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
console.log(process.env.CORS_ORIGIN);

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import other routes
import userRouter from "./routes/user.routers.js";
import studentRouter from "./routes/student.routers.js";
import facultyRouter from "./routes/faculty.routers.js";
import divisionRouter from "./routes/division.routers.js";
import courseRouter from "./routes/course.routers.js";
import programmeRouter from "./routes/program.routers.js";
import roomRouter from "./routes/room.router.js";
import semesterRouter from "./routes/semester.routers.js";
import specializationRouter from "./routes/specialization.routers.js";
import qualificationTypeRouter from "./routes/qualification_type.routers.js";
import subjectAllocationRouter from "./routes/subjectAllocation.routers.js";
import timetableRouter from "./routes/timetable.routers.js";
import timeSlotRouter from "./routes/timeSlot.routers.js";
import timeTableEntryRouter from "./routes/timeTableEntry.routers.js";


//route diclarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/faculties", facultyRouter);
app.use("/api/v1/divisions", divisionRouter);
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/programmes', programmeRouter)
app.use('/api/v1/rooms',roomRouter)
app.use('/api/v1/semesters',semesterRouter)
app.use('/api/v1/specializations',specializationRouter)
app.use('/api/v1/qualification-types',qualificationTypeRouter)
app.use('/api/v1/subject-allocations',subjectAllocationRouter)
app.use('/api/v1/timetables',timetableRouter)
app.use('/api/v1/time-slots',timeSlotRouter)
app.use('/api/v1/timetable-entries',timeTableEntryRouter)

// http://localhost:5000/api/v1/users
export { app };
