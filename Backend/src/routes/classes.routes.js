import { Router } from "express";
import { createClass, getClasses, getClassById } from "../controllers/classes.controller.js";

const router = Router();

router.route("/").post(createClass).get(getClasses);
router.route("/:id").get(getClassById);

export default router;
