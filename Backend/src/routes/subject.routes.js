import { Router } from "express";
import { createSubject, getSubjects, getSubjectById } from "../controllers/subject.controller.js";

const router = Router();

router.route("/").post(createSubject).get(getSubjects);
router.route("/:id").get(getSubjectById);

export default router;
