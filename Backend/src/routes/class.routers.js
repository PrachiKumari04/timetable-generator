import { Router } from "express";
import {
  registerClass,
  deleteClass,
  getAllClasses,
  getClassByClassId,
  getClassById,
  updateClass,
} from "../controllers/class.controllers.js";

const router = Router();

router.route("/").post(registerClass).get(getAllClasses);

router
  .route("/:id")
  .get(getClassById)
  .put(updateClass)
  .delete(deleteClass);

router.route("/:class_id").get(getClassByClassId);

export default router;
