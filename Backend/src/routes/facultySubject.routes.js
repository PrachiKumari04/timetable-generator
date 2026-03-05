import { Router } from "express";
import { createFacultySubject, getFacultySubjects } from "../controllers/facultySubject.controller.js";

const router = Router();

router.route("/").post(createFacultySubject).get(getFacultySubjects);

export default router;
