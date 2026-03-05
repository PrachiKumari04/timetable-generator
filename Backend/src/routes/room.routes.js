import { Router } from "express";
import { createRoom, getRooms, getRoomById } from "../controllers/room.controller.js";

const router = Router();

router.route("/").post(createRoom).get(getRooms);
router.route("/:id").get(getRoomById);

export default router;
