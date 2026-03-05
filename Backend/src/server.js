import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
console.log(process.env.CORS_ORIGIN);
// dotenv.config();
// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
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
import userRouter from "./routes/user.routers.js"; // Note: file is user.routers.js currently
import facultyRouter from "./routes/faculty.routes.js";
import studentRouter from "./routes/student.routes.js";
import roomRouter from "./routes/room.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import classesRouter from "./routes/classes.routes.js";
import courseRouter from "./routes/course.routes.js";
import programRouter from "./routes/program.routes.js";
import sectionRouter from "./routes/section.routes.js";
import specializationRouter from "./routes/specialization.routes.js";
import semesterRouter from "./routes/semester.routes.js";
import classSubjectRouter from "./routes/classSubject.routes.js";
import facultySubjectRouter from "./routes/facultySubject.routes.js";
import timetableRouter from "./routes/timetable.routes.js";

//route diclarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/classes", classesRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/sections", sectionRouter);
app.use("/api/v1/specializations", specializationRouter);
app.use("/api/v1/semesters", semesterRouter);
app.use("/api/v1/class-subjects", classSubjectRouter);
app.use("/api/v1/faculty-subjects", facultySubjectRouter);
app.use("/api/v1/timetable", timetableRouter);

// http://localhost:5000/api/v1/users
export { app };
