import e, { Router } from "express";

const router = Router();

router.route("/").get(getAllClasses).post(createClass);

router.route("/:id").get(getClassById).put(updateClass).delete(deleteClass);

export default router;
