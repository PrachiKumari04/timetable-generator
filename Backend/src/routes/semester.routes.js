import { Router } from "express";
import { createSemester, getSemesters } from "../controllers/semester.controller.js";

const router = Router();

router.route("/").post(createSemester).get(getSemesters);

export default router;
