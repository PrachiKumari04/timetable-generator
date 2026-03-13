import { Router } from "express";
import {
  addSection,
  deleteSection,
  getAllSections,
  getSectionById,
  updateSection,
} from "../controllers/section.controllers.js";

const router = Router();

router.route("/").post(addSection).get(getAllSections);

router
  .route("/:id")
  .get(getSectionById)
  .put(updateSection)
  .delete(deleteSection);

export default router;
