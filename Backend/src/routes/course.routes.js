import { Router } from "express";
import { createCourse, getCourses, getCourseById } from "../controllers/course.controller.js";

const router = Router();

router.route("/").post(createCourse).get(getCourses);
router.route("/:id").get(getCourseById);

export default router;
