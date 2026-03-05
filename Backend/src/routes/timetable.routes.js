import { Router } from "express";
import { generateTimetable, getTimetable } from "../controllers/timetable.controller.js";

const router = Router();

router.route("/generate").post(generateTimetable);
router.route("/").get(getTimetable);

export default router;
