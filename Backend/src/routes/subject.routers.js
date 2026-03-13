import { Router } from "express";
import {
  addSubject,
  deleteSubject,
  getSubjectById,
  getSubjectBySubjectId,
  getSubjects,
  updateSubject,
} from "../controllers/subject.controllers.js";

const router = Router();

router.route("/").post(addSubject).get(getSubjects);

router
  .route("/:id")
  .get(getSubjectById)
  .put(updateSubject)
  .delete(deleteSubject);

router.route("/subject/:subject_id").get(getSubjectBySubjectId);

export default router;
