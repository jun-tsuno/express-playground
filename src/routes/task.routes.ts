import { Router, type Router as RouterType } from "express";
import {
	getTasks,
	getTask,
	postTask,
	patchTask,
	deleteTask,
} from "../controllers/task.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router: RouterType = Router();

router.get("/", asyncHandler(getTasks));
router.post("/", asyncHandler(postTask));
router.get("/:id", asyncHandler(getTask));
router.patch("/:id", asyncHandler(patchTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
