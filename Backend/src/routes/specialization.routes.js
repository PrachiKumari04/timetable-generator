import { Router } from "express";
import { createSpecialization, getSpecializations } from "../controllers/specialization.controller.js";

const router = Router();

router.route("/").post(createSpecialization).get(getSpecializations);

export default router;
