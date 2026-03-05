import { Router } from "express";
import { createSection, getSections } from "../controllers/section.controller.js";

const router = Router();

router.route("/").post(createSection).get(getSections);

export default router;
