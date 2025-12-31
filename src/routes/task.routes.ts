import { Router, type Router as RouterType } from "express";
import {
	getTasks,
	getTask,
	postTask,
	patchTask,
	deleteTask,
} from "@/controllers/task.controller.js";
import { asyncHandler } from "@/utils/async-handler.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
	createTaskValidator,
	updateTaskValidator,
	taskIdValidator,
} from "@/validators/task.validator.js";

const router: RouterType = Router();

router.get("/", asyncHandler(getTasks));
router.post("/", createTaskValidator, validate, asyncHandler(postTask));
router.get("/:id", taskIdValidator, validate, asyncHandler(getTask));
router.patch("/:id", updateTaskValidator, validate, asyncHandler(patchTask));
router.delete("/:id", taskIdValidator, validate, asyncHandler(deleteTask));

export default router;
