import { Router, type Router as RouterType } from "express";
import {
	getTasks,
	getTask,
	postTask,
	patchTask,
	deleteTask,
} from "../controllers/task.controller.js";

const router: RouterType = Router();

router.get("/", getTasks);
router.post("/", postTask);
router.get("/:id", getTask);
router.patch("/:id", patchTask);
router.delete("/:id", deleteTask);

export default router;
