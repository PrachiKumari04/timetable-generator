import { Router } from "express";
import { createStudent, getStudents, getStudentById } from "../controllers/student.controller.js";

const router = Router();

router.route("/").post(createStudent).get(getStudents);
router.route("/:id").get(getStudentById);

export default router;
