import { Router } from "express";
import {
  deleteFaculty,
  getAllFaculties,
  getFacultyById,
  registerFaculty,
  updateFaculty,
} from "../controllers/faculty.conteoller.js";

const router = Router();

router.route("/").post(registerFaculty);
router
  .route("/:id")
  .get(getFacultyById)
  .delete(deleteFaculty)
  .patch(updateFaculty);

export default router;
