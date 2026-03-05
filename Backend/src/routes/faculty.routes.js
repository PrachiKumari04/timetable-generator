import { Router } from "express";
import { createFaculty, getFaculties, getFacultyById } from "../controllers/faculty.controller.js";

const router = Router();

router.route("/").post(createFaculty).get(getFaculties);
router.route("/:id").get(getFacultyById);

export default router;
