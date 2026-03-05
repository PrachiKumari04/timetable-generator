import { Router } from "express";
import { createProgram, getPrograms, getProgramById } from "../controllers/program.controller.js";

const router = Router();

router.route("/").post(createProgram).get(getPrograms);
router.route("/:id").get(getProgramById);

export default router;
