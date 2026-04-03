import { Router } from "express";
import {
  addTimetables,
  deleteTimetable,
  getAllTimetables,
  getTimetableById,
  updateTimetable,
} from "../controllers/timetable.controllers.js";

const router = Router();

router.route("/").post(addTimetables).get(getAllTimetables);

router
  .route("/:id")
  .get(getTimetableById)
  .put(updateTimetable)
  .delete(deleteTimetable);

export default router;
