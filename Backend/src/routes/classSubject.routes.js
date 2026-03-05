import { Router } from "express";
import { createClassSubject, getClassSubjects } from "../controllers/classSubject.controller.js";

const router = Router();

router.route("/").post(createClassSubject).get(getClassSubjects);

export default router;
