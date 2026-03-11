import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  userLogin,
} from "../controllers/user.controller.js";
// import { login } from "../controllers/user.controller.js";

const router = Router();

router.route("/").post(registerUser).get(getAllUsers);
router.route("/:id").get(getUserById).delete(deleteUser).patch(updateUser);
router.route("/login").post(userLogin);

export default router;
