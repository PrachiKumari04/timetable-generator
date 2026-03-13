import express from "express";
import cors from "cors";
// import dotenv from "dotenv";

const app = express();
console.log(process.env.CORS_ORIGIN);
// dotenv.config();
// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Import other routes
import userRouter from "./routes/user.routers.js";
import studentRouter from "./routes/student.routers.js";
import facultyRouter from "./routes/faculty.routers.js";
import classRouter from "./routes/class.routers.js";
import courseRouter from "./routes/course.routers.js";
import programmeRouter from "./routes/programme.routers.js";
import roomRouter from "./routes/room.routers.js";
import sectionRouter from "./routes/section.routers.js";
import semesterRouter from "./routes/semester.routers.js";
import subjectRouter from "./routes/subject.routers.js";
import specializationRouter from "./routes/specialization.routers.js";


//route diclarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/faculties", facultyRouter);
app.use("/api/v1/classes", classRouter);
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/programmes', programmeRouter)
app.use('/api/v1/rooms',roomRouter)
app.use('/api/v1/sections',sectionRouter)
app.use('/api/v1/semesters',semesterRouter)
app.use('/api/v1/subjects',subjectRouter)
app.use('/api/v1/specializations',specializationRouter)

// http://localhost:5000/api/v1/users
export { app };
